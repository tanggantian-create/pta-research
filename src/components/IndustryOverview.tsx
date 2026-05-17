import { useYear } from '../contexts/YearContext'
import financialsData from '../data/financials.json'
import marketSizeData from '../data/marketSize.json'
import type { CompanyData } from '../data/financials'

const chainSteps = [
  { label: '原油', desc: 'Crude Oil' },
  { label: '石脑油', desc: 'Naphtha' },
  { label: 'PX', desc: '对二甲苯' },
  { label: 'PTA', desc: '精对苯二甲酸', highlight: true },
  { label: '聚酯', desc: '涤纶长丝/短纤' },
  { label: '终端', desc: '纺织服装/包装瓶' },
]

export default function IndustryOverview() {
  const { year } = useYear()
  const financials = financialsData as CompanyData[]
  const yearData = financials.filter((d) => d.year === year)
  const totalChinaCapacity = yearData.reduce((sum, d) => sum + (d.ptaCapacity || 0), 0)

  const marketYear = (marketSizeData as { year: number; value: number }[]).find((d) => d.year === year)
  const marketValue = marketYear ? marketYear.value : 580

  const sortedCap = [...yearData].sort((a, b) => (b.ptaCapacity || 0) - (a.ptaCapacity || 0))
  const top5Cap = sortedCap.slice(0, 5).reduce((sum, d) => sum + (d.ptaCapacity || 0), 0)
  const cr5 = totalChinaCapacity > 0 ? Math.round((top5Cap / totalChinaCapacity) * 100) : 70

  const marketCards = [
    { value: `${marketValue}`, unit: '亿美元', label: `全球PTA市场规模(${year})` },
    { value: totalChinaCapacity > 0 ? totalChinaCapacity.toLocaleString() : '9,472', unit: '万吨', label: `中国有效产能(${year})` },
    { value: `~${cr5}%`, unit: '', label: '行业CR5集中度' },
    { value: '+24.1%', unit: '', label: '中国PTA出口增速' },
  ]

  return (
    <section id="overview" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-teal-400 text-sm tracking-widest uppercase mb-3">Industry Overview</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">行业整体发展</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          PTA是聚酯产业链中游核心原料，中国产能占全球68%，2025年行业迎来供需格局历史性拐点
        </p>
      </div>

      {/* Value Chain */}
      <div className="glass-card p-8 mb-12">
        <h3 className="text-xl font-semibold text-white mb-8 text-center">产业链结构</h3>
        <div className="flex flex-wrap items-center justify-center gap-0">
          {chainSteps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div
                className={`px-5 py-4 rounded-xl text-center min-w-[100px] transition-all ${
                  step.highlight
                    ? 'bg-gold-500/20 border border-gold-500/50 ring-1 ring-gold-500/30'
                    : 'bg-navy-700/50 border border-white/10'
                }`}
              >
                <div className={`text-sm font-bold ${step.highlight ? 'text-gold-400' : 'text-white'}`}>
                  {step.label}
                </div>
                <div className="text-xs text-slate-500 mt-1">{step.desc}</div>
              </div>
              {i < chainSteps.length - 1 && (
                <div className="text-slate-600 text-2xl mx-1 md:mx-3">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Market Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {marketCards.map((card) => (
          <div key={card.label} className="glass-card p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold text-white mb-2">
              {card.value}
              <span className="text-gold-400 text-lg ml-1">{card.unit}</span>
            </div>
            <p className="text-slate-400 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Supply-Demand Inflection */}
      <div className="glass-card p-8 border-l-4 border-l-teal-500">
        <h3 className="text-xl font-semibold text-white mb-4">供需拐点：扩产周期终结</h3>
        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div>
            <p className="text-slate-400 leading-relaxed">
              自2019年以来连续七年高速扩产周期<strong className="text-white">正式结束</strong>。2026年将是2019年以来
              <strong className="text-teal-400">首次全年无新增PTA产能投放</strong>。头部企业达成联合减产共识，计划通过检修、降负、淘汰老旧装置实现减产超1,000万吨。
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-slate-400">2025.10 工信部反内卷座谈会</span>
              <span className="text-teal-400 text-xs px-2 py-0.5 bg-teal-500/10 rounded">政策支持</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-slate-400">社会库存去化</span>
              <span className="text-teal-400">~190万吨</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-slate-400">PTA加工费低点→修复</span>
              <span className="text-teal-400">73→362 元/吨</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">2026-2028新增产能CAGR</span>
              <span className="text-teal-400">仅2.8%</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="italic">— 华泰证券："扩产周期结束，PTA行业拐点渐显"</span>
          <span className="italic">— 天风证券："政策与周期共振，石化行业迎来结构性机遇"</span>
        </div>
      </div>
    </section>
  )
}
