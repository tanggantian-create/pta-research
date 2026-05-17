import { useYear } from '../contexts/YearContext'
import { elasticityData } from '../data/financials'
import financialsData from '../data/financials.json'
import estimationsData from '../data/estimations.json'
import type { CompanyData, EstimationData } from '../data/financials'

const capacityTimeline = [
  { year: '2019-2023', label: '高速扩产期', desc: '年均新增产能800-1000万吨', type: 'expansion' },
  { year: '2024', label: '扩产尾声', desc: '新增产能放缓至400万吨', type: 'slow' },
  { year: '2025', label: '拐点出现', desc: '工信部反内卷·联合减产超1000万吨', type: 'inflection' },
  { year: '2026E', label: '零新增', desc: '2019年以来首次全年无新增产能', type: 'peak' },
  { year: '2027-2028E', label: '低速增长', desc: '年化新增仅200-600万吨，CAGR 2.8%', type: 'slow' },
]

export default function Outlook() {
  const { year } = useYear()
  const financials = financialsData as CompanyData[]
  const yearData = financials.filter((d) => d.year === year)
  const estimates = (estimationsData as EstimationData[]).filter((e) => e.year === year)

  return (
    <section id="outlook" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-teal-400 text-sm tracking-widest uppercase mb-3">Outlook & Forecast</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">发展预期</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          2026年供减需稳格局下，PTA行业从过剩走向紧平衡，盈利从13年底部修复
        </p>
      </div>

      {/* Capacity Timeline */}
      <div className="glass-card p-8 mb-12">
        <h3 className="text-xl font-semibold text-white mb-8 text-center">产能周期演变</h3>
        <div className="flex flex-wrap justify-between relative">
          {capacityTimeline.map((phase, i) => (
            <div key={phase.year} className="flex flex-col items-center flex-1 min-w-[120px] mb-6 relative">
              {i < capacityTimeline.length - 1 && (
                <div className="absolute top-4 left-1/2 right-0 h-0.5 bg-gradient-to-r from-teal-500/50 to-slate-700" />
              )}
              <div
                className={`w-4 h-4 rounded-full mb-3 relative z-10 ${
                  phase.type === 'peak'
                    ? 'bg-gold-400 shadow-lg shadow-gold-500/40'
                    : phase.type === 'inflection'
                    ? 'bg-teal-400 shadow-lg shadow-teal-500/40'
                    : 'bg-slate-600'
                }`}
              />
              <div className="text-xs text-gold-400 font-semibold mb-1">{phase.year}</div>
              <div className="text-sm text-white font-medium">{phase.label}</div>
              <div className="text-xs text-slate-500 mt-1 text-center max-w-[120px]">{phase.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings Forecast Table */}
      <div className="glass-card overflow-x-auto mb-12">
        <h3 className="text-xl font-semibold text-white p-6 pb-0">{year}E 盈利预测</h3>
        {estimates.length > 0 ? (
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-slate-400 font-medium">公司</th>
                <th className="p-4 text-slate-400 font-medium">代码</th>
                <th className="p-4 text-slate-400 font-medium text-right">{year}净利润(亿)</th>
                <th className="p-4 text-slate-400 font-medium text-right">{year}E PE</th>
                <th className="p-4 text-slate-400 font-medium text-right">{year + 1}E PE</th>
                <th className="p-4 text-slate-400 font-medium text-center">评级</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((e) => {
                const actual = yearData.find((f) => f.company_id === e.company_id)
                return (
                  <tr key={e.code} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium">{e.company}</td>
                    <td className="p-4 text-slate-500">{e.code}</td>
                    <td className="p-4 text-teal-400 text-right font-semibold">
                      {actual ? actual.netProfit.toFixed(2) + '→' : ''}{e.netProfit.toFixed(0)}
                    </td>
                    <td className={`p-4 text-right font-semibold ${e.pe < 12 ? 'text-gold-400' : 'text-slate-300'}`}>
                      {e.pe}x
                    </td>
                    <td className="p-4 text-right text-slate-400">{e.peNext}x</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-teal-500/20 text-teal-400">{e.rating}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <p className="p-8 text-center text-slate-500">暂无{year}年度盈利预测数据</p>
        )}
        <p className="p-4 text-xs text-slate-600">
          数据来源：开源证券、信达证券、申万宏源、东方证券等机构研报（2026年4-5月），PE基于报告发布时股价
        </p>
      </div>

      {/* Elasticity Table */}
      <div className="glass-card overflow-x-auto">
        <h3 className="text-xl font-semibold text-white p-6 pb-0">
          利润弹性测算
          <span className="text-sm font-normal text-slate-500 ml-2">假设 PTA/长丝毛利各+100/+200 元/吨</span>
        </h3>
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-slate-400 font-medium">公司</th>
              <th className="p-4 text-slate-400 font-medium text-right">利润增量(亿元)</th>
              <th className="p-4 text-slate-400 font-medium text-right">利润弹性</th>
              <th className="p-4 text-slate-400 font-medium">弹性特征</th>
            </tr>
          </thead>
          <tbody>
            {elasticityData.map((d) => (
              <tr key={d.company} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{d.company}</td>
                <td className="p-4 text-teal-400 text-right font-semibold">+{d.profitIncrement.toFixed(1)}</td>
                <td className={`p-4 text-right font-bold ${d.elasticity > 100 ? 'text-gold-400' : 'text-slate-300'}`}>
                  {d.elasticity}%
                </td>
                <td className="p-4 text-slate-400 text-xs">
                  {d.elasticity > 200 ? '极高弹性，对毛利变动最敏感' : d.elasticity > 100 ? '高弹性，长丝链核心受益' : '稳健型，一体化程度高'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="p-4 text-xs text-slate-600">数据来源：西部证券研报</p>
      </div>
    </section>
  )
}
