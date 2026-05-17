import { useYear } from '../contexts/YearContext'
import financialsData from '../data/financials.json'
import companiesMeta from '../data/companies.json'
import type { CompanyData, CompanyInfo } from '../data/financials'

type MergedCompany = CompanyInfo & CompanyData

function formatCurrency(yi: number): string {
  return yi >= 1000 ? `${(yi / 1000).toFixed(2)}千亿` : `${yi.toFixed(2)}亿`
}

export default function CompanyCards() {
  const { year } = useYear()
  const financials = financialsData as CompanyData[]
  const yearData = financials.filter((d) => d.year === year)
  const merged = companiesMeta
    .map((meta) => {
      const fin = yearData.find((d) => d.company_id === meta.id)
      if (!fin) return null
      return { ...meta, ...fin } as MergedCompany
    })
    .filter((c): c is MergedCompany => c !== null)

  if (merged.length === 0) {
    return (
      <section id="companies" className="py-24 px-6 max-w-7xl mx-auto text-center">
        <p className="text-slate-500">暂无{year}年度财务数据</p>
      </section>
    )
  }

  return (
    <section id="companies" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-teal-400 text-sm tracking-widest uppercase mb-3">Leading Players</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">头部企业经营状况</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          中国民营大炼化"五大"主导全球PTA成本曲线，恒力/荣盛凭借PX自给+规模效应构筑深厚护城河
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {merged.map((c) => (
          <div
            key={c.id}
            className="glass-card p-6 hover:border-gold-500/30 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-gold-500/20 flex items-center justify-center text-gold-400 font-bold text-sm mb-3 group-hover:scale-110 transition-transform">
                  {c.nameCn[0]}
                </div>
                <h3 className="text-white font-semibold text-lg">{c.nameCn}</h3>
                <p className="text-slate-500 text-xs">{c.code}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">PTA产能</div>
                <div className="text-gold-400 font-bold text-lg">{c.ptaCapacity}</div>
                <div className="text-xs text-slate-600">万吨/年</div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">营收</span>
                <span className="text-white">{formatCurrency(c.revenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">净利润</span>
                <span className={c.netProfit > 10 ? 'text-teal-400' : 'text-slate-300'}>
                  {formatCurrency(c.netProfit)}
                  <span className="text-xs text-slate-500 ml-1">{c.netProfitYoY}</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">毛利率</span>
                <span className="text-white">{c.grossMargin}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ROE</span>
                <span className={c.roe > 5 ? 'text-teal-400' : 'text-slate-300'}>{c.roe}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">资产负债率</span>
                <span className={c.debtRatio > 75 ? 'text-red-400' : 'text-slate-300'}>{c.debtRatio}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
