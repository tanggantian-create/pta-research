#!/usr/bin/env node
/**
 * generate-insights.mjs
 * 生成行业叙事内容(投资主题/风险提示/行业概述/产能时间线/股票推荐)
 *
 * 流程:
 *   1. 抓取 PTA 行业新闻标题(东方财富公开接口, 失败则跳过)
 *   2. 读取最新财务数据 src/data/financials.json
 *   3. 调用 DeepSeek API 生成结构化内容
 *   4. 写入 src/data/insights.json (失败时保留上一版)
 *
 * 用法: DEEPSEEK_API_KEY=xxx node scripts/generate-insights.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../src/data')
const INSIGHTS_FILE = resolve(DATA_DIR, 'insights.json')
const FINANCIALS_FILE = resolve(DATA_DIR, 'financials.json')

const API_KEY = process.env.DEEPSEEK_API_KEY
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat'

// ---------- 1. 抓取 PTA 行业新闻 ----------
async function fetchNews(keyword = 'PTA', pageSize = 8) {
  const param = encodeURIComponent(
    JSON.stringify({
      uid: '',
      keyword,
      type: ['cmsArticleWebOld'],
      client: 'web',
      clientType: 'web',
      clientVersion: 'curr',
      param: {
        cmsArticleWebOld: {
          searchScope: 'default',
          sort: 'default',
          pageIndex: 1,
          pageSize,
          preTag: '',
          postTag: '',
        },
      },
    })
  )
  const url = `https://search-api-web.eastmoney.com/search/jsonp?cb=cb&param=${param}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const raw = await res.text()
  const m = raw.match(/cb\((.*)\)\s*$/)
  if (!m) throw new Error('无法解析新闻响应')
  const data = JSON.parse(m[1])
  const arts = data?.result?.cmsArticleWebOld ?? []
  return arts.map((a) => ({ date: a.date ?? '', title: a.title ?? '' }))
}

// ---------- 2. 读取财务数据(精简版) ----------
function summarizeFinancials() {
  if (!existsSync(FINANCIALS_FILE)) return null
  const data = JSON.parse(readFileSync(FINANCIALS_FILE, 'utf-8'))
  // 按公司分组, 取最近年份
  const byCompany = {}
  for (const row of data) {
    const id = row.company_id
    if (!byCompany[id]) byCompany[id] = []
    byCompany[id].push(row)
  }
  const summary = Object.entries(byCompany).map(([id, rows]) => {
    rows.sort((a, b) => String(b.year).localeCompare(String(a.year)))
    const latest = rows[0]
    return {
      company: id,
      latestPeriod: latest.year,
      revenue: latest.revenue || null,
      revenueYoY: latest.revenueYoY || null,
      netProfit: latest.netProfit || null,
      netProfitYoY: latest.netProfitYoY || null,
      grossMargin: latest.grossMargin || null,
      roe: latest.roe || null,
      debtRatio: latest.debtRatio || null,
      ptaCapacity: latest.ptaCapacity || null,
    }
  })
  return summary
}

// ---------- 3. 调用 DeepSeek 生成内容 ----------
async function generateInsights(financialsSummary, newsList) {
  const newsText = newsList.length
    ? newsList.map((n) => `- [${n.date}] ${n.title}`).join('\n')
    : '(新闻抓取失败, 请仅基于财务数据推理)'

  const financialsText = financialsSummary
    ? JSON.stringify(financialsSummary, null, 1)
    : '(财务数据缺失)'

  const systemPrompt = `你是一名资深的化工行业分析师, 专精于中国PTA(精对苯二甲酸)聚酯产业链。
请基于提供的财务数据和行业新闻, 生成专业的行业研究叙事内容。
要求:
1. 观点必须基于提供的数据和新闻, 不要编造具体数字
2. 使用简体中文, 专业、克制、有洞察力
3. 输出必须是合法的 JSON, 不要包含任何 markdown 代码块标记或额外文字`

  const userPrompt = `请根据以下最新信息, 生成 PTA 行业研究网站的叙事内容。

【最新财务数据(最近报告期)】
${financialsText}

【最新行业新闻】
${newsText}

请生成以下 JSON 结构(字段必须完整):
{
  "generatedAt": "生成日期(今天)",
  "industrySummary": "一段150字以内的行业整体概述(现状+趋势+拐点判断)",
  "investmentThemes": [
    { "title": "主题标题(15字内)", "stars": 3到5的整数, "summary": "一句话摘要(30字内)", "detail": "详细论证(80-120字, 引用数据支撑)" }
  ] 共4条,
  "risks": ["风险提示1", "风险提示2", "风险提示3", "风险提示4", "风险提示5"] 共5条, 每条30字内,
  "capacityTimeline": [
    { "year": "年份或区间", "label": "阶段名称", "desc": "描述(30字内)", "type": "expansion|slow|inflection|peak 之一" }
  ] 共5条, 覆盖2019年到未来展望,
  "stockPicks": [
    { "name": "公司名", "code": "股票代码", "pe": "估值描述如 9.5x", "logic": "推荐逻辑(25字内)", "type": "进攻型|稳健型|成长型 之一" }
  ] 共4只, 从恒力石化(600346)/荣盛石化(002493)/桐昆股份(601233)/新凤鸣(603225)/恒逸石化(000703)/东方盛虹(000301)中选择, 代码必须准确
}`

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`DeepSeek API ${res.status}: ${errText.slice(0, 200)}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new Error('DeepSeek 返回为空')

  // 解析 JSON(去除可能的围栏)
  let parsed
  try {
    parsed = JSON.parse(content.replace(/^```json\s*|\s*```$/g, ''))
  } catch (e) {
    throw new Error(`JSON 解析失败: ${e.message}`)
  }
  return parsed
}

// ---------- 4. 主流程 ----------
async function main() {
  console.log('PTA Research — 生成行业叙事内容\n')

  if (!API_KEY) {
    console.error('错误: 请设置环境变量 DEEPSEEK_API_KEY')
    process.exit(1)
  }

  // 抓新闻(失败不中断)
  let newsList = []
  try {
    console.log('  抓取 PTA 行业新闻...')
    newsList = await fetchNews('PTA')
    console.log(`  ✓ 获取 ${newsList.length} 条新闻`)
  } catch (err) {
    console.warn(`  ⚠ 新闻抓取失败: ${err.message}, 将仅用财务数据生成`)
  }

  // 读财务数据
  const financialsSummary = summarizeFinancials()
  console.log(`  ✓ 读取财务数据 (${financialsSummary ? financialsSummary.length : 0} 家公司)`)

  // 生成
  console.log('  调用 DeepSeek 生成内容...')
  let insights
  try {
    insights = await generateInsights(financialsSummary, newsList)
    console.log('  ✓ AI 生成成功')
  } catch (err) {
    if (existsSync(INSIGHTS_FILE)) {
      console.error(`  ✗ AI 生成失败 (${err.message}), 保留上一版内容`)
      process.exit(0)
    }
    console.error(`  ✗ AI 生成失败: ${err.message}`)
    process.exit(1)
  }

  // 补全 generatedAt
  insights.generatedAt = new Date().toISOString().slice(0, 10)

  // 弹性数据是专业测算值, 不交给 AI 编造, 使用固定真实数据
  insights.elasticity = [
    { company: '桐昆股份', profitIncrement: 29.7, elasticity: 107 },
    { company: '恒逸石化', profitIncrement: 18.2, elasticity: 224 },
    { company: '新凤鸣', profitIncrement: 22.1, elasticity: 123 },
    { company: '荣盛石化', profitIncrement: 10.6, elasticity: 15 },
    { company: '恒力石化', profitIncrement: 17.1, elasticity: 6 },
    { company: '东方盛虹', profitIncrement: 11.2, elasticity: 301 },
  ]

  // 字段完整性校验: 缺失则保留上一版
  const required = ['industrySummary', 'investmentThemes', 'risks', 'capacityTimeline', 'stockPicks']
  const missing = required.filter((k) => !insights[k] || (Array.isArray(insights[k]) && insights[k].length === 0))
  if (missing.length) {
    if (existsSync(INSIGHTS_FILE)) {
      console.error(`  ✗ 生成内容缺少字段 [${missing.join(', ')}], 保留上一版`)
      process.exit(0)
    }
    console.error(`  ✗ 生成内容缺少字段 [${missing.join(', ')}]`)
    process.exit(1)
  }

  // 写入
  writeFileSync(INSIGHTS_FILE, JSON.stringify(insights, null, 2), 'utf-8')
  console.log(`  ✓ 已写入 ${INSIGHTS_FILE}`)
  console.log('\n完成!')
}

main().catch((err) => {
  console.error('发生错误:', err)
  process.exit(1)
})
