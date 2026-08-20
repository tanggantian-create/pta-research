import { useState } from 'react'
import { useYear } from '../contexts/YearContext'
import { internationalCompanies } from '../data/financials'
import financialsData from '../data/financials.json'
import companiesMeta from '../data/companies.json'
import type { CompanyData, CompanyInfo } from '../data/financials'

type MergedCompany = CompanyInfo & CompanyData

type TableMode = 'domestic' | 'international' | 'comparison'

function formatCurrency(yi: number): string {
  return yi.toFixed(2) + '亿'
}

/** 空值容错:返回数字或 null */
function num(v: unknown): number | null {
  if (v === '' || v === undefined || v === null) return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

export default function FinancialTable() {
  const [mode, setMode] = useState<TableMode>('domestic')
  const { year } = useYear()
  const financials = financialsData as CompanyData[]
  const yearData = financials.filter((d) => d.year === year)
  const cnData = companiesMeta
    .map((meta) => {
      const fin = yearData.find((d) => d.company_id === meta.id)
      if (!fin) return null
      return { ...meta, ...fin } as MergedCompany
    })
    .filter((c): c is MergedCompany => c !== null)
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))

  const hasData = cnData.length > 0

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">{year}年核心财务指标对比</h3>

      <div className="flex justify-center gap-3 mb-8">
        {[
          { key: 'domestic' as const, label: '国内企业' },
          { key: 'international' as const, label: '国际企业' },
          { key: 'comparison' as const, label: '关键指标对比' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMode(tab.key)}
            className={`px-5 py-2 rounded-full text-sm transition-all ${
              mode === tab.key
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-x-auto">
        {mode === 'domestic' && (
          hasData ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-slate-400 font-medium">公司</th>
                  <th className="p-4 text-slate-400 font-medium">代码</th>
                  <th className="p-4 text-slate-400 font-medium text-right">营收(亿)</th>
                  <th className="p-4 text-slate-400 font-medium text-right">营收YoY</th>
                  <th className="p-4 text-slate-400 font-medium text-right">净利润(亿)</th>
                  <th className="p-4 text-slate-400 font-medium text-right">毛利率</th>
                  <th className="p-4 text-slate-400 font-medium text-right">净利率</th>
                  <th className="p-4 text-slate-400 font-medium text-right">ROE</th>
                  <th className="p-4 text-slate-400 font-medium text-right">资产负债率</th>
                  <th className="p-4 text-slate-400 font-medium text-right">经营现金流(亿)</th>
                </tr>
              </thead>
              <tbody>
                {cnData.map((c) => {
                  const rev = num(c.revenue)
                  const revYoY = num(c.revenueYoY)
                  const np = num(c.netProfit)
                  const gm = num(c.grossMargin)
                  const nm = num(c.netMargin)
                  const roe = num(c.roe)
                  const debt = num(c.debtRatio)
                  const ocf = num(c.operatingCF)
                  return (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium">{c.nameCn}</td>
                    <td className="p-4 text-slate-500">{c.code}</td>
                    <td className="p-4 text-white text-right">{rev === null ? '—' : formatCurrency(rev)}</td>
                    <td className={`p-4 text-right ${revYoY === null ? '' : revYoY < 0 ? 'text-red-400' : 'text-teal-400'}`}>
                      {revYoY === null ? '—' : (revYoY > 0 ? '+' : '') + revYoY + '%'}
                    </td>
                    <td className="p-4 text-right">
                      {np === null ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <>
                          <span className={np > 10 ? 'text-teal-400 font-semibold' : 'text-slate-300'}>
                            {formatCurrency(np)}
                          </span>
                          <div className="text-xs text-slate-500">{c.netProfitYoY}</div>
                        </>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {gm === null ? <span className="text-slate-400">—</span> : (
                        <span className={gm > 10 ? 'text-teal-400' : 'text-slate-300'}>
                          {gm}%
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right text-slate-300">{nm === null ? '—' : nm + '%'}</td>
                    <td className={`p-4 text-right font-semibold ${roe === null ? '' : roe > 5 ? 'text-teal-400' : roe > 1 ? 'text-slate-300' : 'text-red-400'}`}>
                      {roe === null ? '—' : roe + '%'}
                    </td>
                    <td className={`p-4 text-right ${debt === null ? '' : debt > 75 ? 'text-red-400' : 'text-slate-300'}`}>
                      {debt === null ? '—' : debt + '%'}
                    </td>
                    <td className="p-4 text-right text-slate-300">{ocf === null ? '—' : formatCurrency(ocf)}</td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="p-8 text-center text-slate-500">暂无{year}年度国内企业财务数据</p>
          )
        )}

        {mode === 'international' && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-slate-400 font-medium">公司</th>
                <th className="p-4 text-slate-400 font-medium">国家</th>
                <th className="p-4 text-slate-400 font-medium text-right">PTA产能(万吨)</th>
                <th className="p-4 text-slate-400 font-medium text-right">营收(十亿美元)</th>
                <th className="p-4 text-slate-400 font-medium text-right">营收YoY</th>
                <th className="p-4 text-slate-400 font-medium text-right">净利润(十亿美元)</th>
                <th className="p-4 text-slate-400 font-medium text-right">EBITDA利润率</th>
                <th className="p-4 text-slate-400 font-medium text-right">ROE</th>
              </tr>
            </thead>
            <tbody>
              {internationalCompanies.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{c.name}</td>
                  <td className="p-4 text-slate-400">{c.country}</td>
                  <td className="p-4 text-gold-400 text-right">{c.ptaCapacity}</td>
                  <td className="p-4 text-white text-right">{c.revenueB.toFixed(1)}</td>
                  <td className={`p-4 text-right ${c.revenueYoY < 0 ? 'text-red-400' : 'text-teal-400'}`}>
                    {c.revenueYoY}%
                  </td>
                  <td className={`p-4 text-right font-semibold ${c.netProfitB >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                    {c.netProfitB >= 0 ? '+' : ''}{c.netProfitB.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-slate-300">{c.ebitdaMargin}%</td>
                  <td className={`p-4 text-right ${c.roe > 0 ? 'text-teal-400' : 'text-red-400'}`}>
                    {c.roe}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {mode === 'comparison' && (
          hasData ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-slate-400 font-medium">公司</th>
                  <th className="p-4 text-slate-400 font-medium text-right">净利润(亿美元)</th>
                  <th className="p-4 text-slate-400 font-medium text-right">毛利率</th>
                  <th className="p-4 text-slate-400 font-medium text-right">净利率</th>
                  <th className="p-4 text-slate-400 font-medium text-right">ROE</th>
                  <th className="p-4 text-slate-400 font-medium text-right">PTA产能(万吨)</th>
                  <th className="p-4 text-slate-400 font-medium">竞争优势</th>
                </tr>
              </thead>
              <tbody>
                {cnData.map((c) => {
                  const np = num(c.netProfit)
                  const usdProfit = np === null ? null : np / 7.2
                  const gm = num(c.grossMargin)
                  const nm = num(c.netMargin)
                  const roe = num(c.roe)
                  const advantages: Record<string, string> = {
                    hengli: 'PX自给95%·成本最低·唯一两位数ROE',
                    tongkun: '长丝龙头·反内卷弹性最大',
                    xinfengming: '纯聚酯链·成长性好',
                    rongsheng: 'PX100%自给·浙石化炼化一体',
                    hengyi: '文莱炼化项目·海外布局先驱',
                    shenghong: '大炼化转型·产能扩张中',
                  }
                  return (
                    <tr key={c.id} className={`border-b border-white/5 ${roe !== null && roe > 5 ? 'bg-teal-500/5' : ''}`}>
                      <td className={`p-4 font-medium ${roe !== null && roe > 5 ? 'text-teal-400' : 'text-white'}`}>{c.nameCn}</td>
                      <td className={`p-4 text-right font-bold ${usdProfit === null ? '' : usdProfit > 0 ? 'text-teal-400' : 'text-red-400'}`}>
                        {usdProfit === null ? '—' : (usdProfit > 0 ? '+' : '') + usdProfit.toFixed(2)}
                      </td>
                      <td className="p-4 text-slate-300 text-right">{gm === null ? '—' : gm + '%'}</td>
                      <td className="p-4 text-slate-300 text-right">{nm === null ? '—' : nm + '%'}</td>
                      <td className="p-4 text-slate-300 text-right font-semibold">{roe === null ? '—' : roe + '%'}</td>
                      <td className="p-4 text-gold-400 text-right">{c.ptaCapacity}</td>
                      <td className="p-4 text-slate-400 text-xs">{advantages[c.id] ?? ''}</td>
                    </tr>
                  )
                })}
                {internationalCompanies
                  .filter((intl) => intl.netProfitB < 0)
                  .map((intl) => (
                    <tr key={intl.id} className="border-b border-white/5 bg-red-500/5">
                      <td className="p-4 text-red-400 font-medium">{intl.name}</td>
                      <td className="p-4 text-red-400 text-right">{intl.netProfitB.toFixed(2)}</td>
                      <td className="p-4 text-slate-400 text-right">—</td>
                      <td className="p-4 text-red-400 text-right">{(intl.netProfitB / intl.revenueB * 100).toFixed(2)}%</td>
                      <td className="p-4 text-red-400 text-right">{intl.roe}%</td>
                      <td className="p-4 text-gold-400 text-right">{intl.ptaCapacity}</td>
                      <td className="p-4 text-slate-400 text-xs">{intl.note}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="p-8 text-center text-slate-500">暂无{year}年度对比数据</p>
          )
        )}
      </div>
    </section>
  )
}
