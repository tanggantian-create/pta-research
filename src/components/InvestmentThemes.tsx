import { investmentThemes } from '../data/financials'

export default function InvestmentThemes() {
  return (
    <section id="investment" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-teal-400 text-sm tracking-widest uppercase mb-3">Investment Recommendations</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">投资建议</h2>
      </div>

      {/* Theme Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {investmentThemes.map((theme, i) => (
          <div
            key={i}
            className="glass-card p-6 hover:border-gold-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gold-400">
                {'★'.repeat(theme.stars)}{'☆'.repeat(5 - theme.stars)}
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">{theme.title}</h3>
            <p className="text-teal-400 text-sm mb-3">{theme.summary}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{theme.detail}</p>
          </div>
        ))}
      </div>

      {/* Stock Picks */}
      <div className="glass-card p-8 mb-12">
        <h3 className="text-xl font-semibold text-white mb-6">核心标的推荐</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: '桐昆股份', code: '601233', pe: '9.5x', logic: '估值最低+弹性最大', type: '进攻型' },
            { name: '恒力石化', code: '600346', pe: '12-16x', logic: '一体化龙头+现金流最强', type: '稳健型' },
            { name: '荣盛石化', code: '002493', pe: '15-19x', logic: '底部反转弹性+Q1已确认拐点', type: '进攻型' },
            { name: '新凤鸣', code: '603225', pe: '12-14x', logic: '利润弹性123%+成长性好', type: '小市值高弹性' },
          ].map((stock) => (
            <div key={stock.code} className="bg-navy-700/50 rounded-xl p-5 text-center border border-white/5 hover:border-gold-500/30 transition-all">
              <div className="text-xs text-gold-400 mb-1">{stock.type}</div>
              <div className="text-white font-bold text-lg mb-1">{stock.name}</div>
              <div className="text-slate-500 text-xs mb-2">{stock.code}</div>
              <div className="text-teal-400 text-2xl font-bold mb-2">{stock.pe}</div>
              <div className="text-slate-400 text-xs">{stock.logic}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Warnings */}
      <div className="glass-card p-8 border-l-4 border-l-red-500/50">
        <h3 className="text-xl font-semibold text-white mb-4">风险提示</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            '反内卷执行不及预期：行业协同减产能否持续兑现',
            '需求增长不及预期：全球经济弱复苏，纺服终端疲软',
            '油价大幅波动：地缘冲突带来不确定性',
            '新增产能超预期：规划产能若如期投产将压制修复空间',
            '出口贸易摩擦：中美关税壁垒与全球贸易争端风险',
          ].map((risk, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-400">
              <span className="text-red-400 mt-1">⚠</span>
              <span>{risk}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
