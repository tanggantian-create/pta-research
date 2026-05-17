import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../src/data')

const SHEET_ID = process.env.GOOGLE_SHEET_ID
if (!SHEET_ID) {
  console.error('错误：请设置环境变量 GOOGLE_SHEET_ID')
  console.error('用法：GOOGLE_SHEET_ID=xxx node scripts/fetch-data.mjs')
  process.exit(1)
}

const BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=`

const SHEETS = [
  { name: '财务数据', file: 'financials.json', key: 'financials' },
  { name: '公司信息', file: 'companies.json', key: 'companies' },
  { name: '市场规模', file: 'marketSize.json', key: 'marketSize' },
  { name: '成本曲线', file: 'costCurve.json', key: 'costCurve' },
  { name: '估值预测', file: 'estimations.json', key: 'estimations' },
]

function parseCSV(csv) {
  const lines = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i]
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < csv.length && csv[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      current += String.fromCodePoint(0x1f) // use unit separator as placeholder
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && i + 1 < csv.length && csv[i + 1] === '\n') i++
      if (current.trim()) {
        lines.push(current)
      }
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) lines.push(current)

  const sep = String.fromCodePoint(0x1f)
  return lines.map((line) => line.split(sep).map((v) => v.trim()))
}

function rowsToObjects(rows) {
  if (rows.length < 2) return []
  const headers = rows[0].map((h) => h.trim())
  return rows.slice(1).map((row) => {
    const obj = {}
    headers.forEach((h, i) => {
      let val = row[i] ?? ''
      // Convert numeric strings
      if (val !== '' && !isNaN(val) && val.trim() !== '') {
        const num = Number(val)
        // Only convert if it's a clean number (not a code like "600346" or ID like "hengli")
        if (typeof num === 'number' && !isNaN(num)) {
          // Check if it looks like a pure number (possibly with decimal and negative)
          if (/^-?\d+(\.\d+)?$/.test(val.trim())) {
            // Don't convert year-like values if they're clearly IDs or codes
            // Years: 2020-2030, other numbers are fine
            if (h === 'code' || h === 'id' || h === 'company_id' || h === 'market') {
              obj[h] = val.trim()
            } else {
              obj[h] = num
            }
            return
          }
        }
      }
      obj[h] = val.trim()
    })
    return obj
  })
}

async function fetchSheet(name) {
  const url = BASE + encodeURIComponent(name)
  console.log(`  拉取中: ${name}`)
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`拉取失败 ${name}: HTTP ${res.status}`)
  }
  const csv = await res.text()
  const rows = parseCSV(csv)
  return rowsToObjects(rows)
}

async function main() {
  console.log('PTA Research — 从 Google Sheets 拉取数据\n')

  mkdirSync(DATA_DIR, { recursive: true })

  for (const sheet of SHEETS) {
    try {
      const data = await fetchSheet(sheet.name)
      const filePath = resolve(DATA_DIR, sheet.file)
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
      console.log(`  ✓ ${sheet.name} → ${sheet.file} (${data.length} 行)`)
    } catch (err) {
      console.error(`  ✗ ${sheet.name}: ${err.message}`)
      process.exitCode = 1
    }
  }

  console.log('\n完成！数据已写入 src/data/')
}

main()
