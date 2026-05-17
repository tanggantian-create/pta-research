export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gold-400 font-bold text-lg mb-4">PTA Research 2026</p>
        <div className="text-xs text-slate-500 space-y-1 mb-6">
          <p>
            数据来源：开源证券、信达证券、申万宏源、华泰证券、西部证券、天风证券、东方证券等机构研报（2026年4-5月）
          </p>
          <p>行业数据：ChemAnalyst、6Wresearch、各公司2025年年报</p>
        </div>
        <div className="text-xs text-slate-600">
          <p>免责声明：本网站内容仅供研究参考，不构成任何投资建议。投资有风险，入市需谨慎。</p>
          <p className="mt-1">数据更新至 2026年5月16日 · 估值基于报告发布时股价，实际随市价波动</p>
        </div>
      </div>
    </footer>
  )
}
