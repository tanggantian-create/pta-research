import { useYear } from '../contexts/YearContext'

export default function YearSelector() {
  const { year, setYear, availableYears } = useYear()

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <span className="text-slate-500 text-sm mr-2">选择年份：</span>
      {availableYears.map((y) => (
        <button
          key={y}
          onClick={() => setYear(y)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            y === year
              ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30 shadow-lg shadow-gold-500/10'
              : 'text-slate-400 hover:text-white border border-transparent hover:border-slate-700'
          }`}
        >
          {y}
        </button>
      ))}
    </div>
  )
}
