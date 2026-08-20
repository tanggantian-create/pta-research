import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import financialsData from '../data/financials.json'

type YearKey = number | string

/** 把年份转成可排序的数值:2026H1 → 2026.5, 2026H2 → 2026.75, 纯数字 → 原值 */
function yearRank(y: YearKey): number {
  const s = String(y)
  if (s.includes('H1')) return Number(s.replace('H1', '')) + 0.5
  if (s.includes('H2')) return Number(s.replace('H2', '')) + 0.75
  const n = Number(s)
  return isNaN(n) ? 0 : n
}

const AVAILABLE_YEARS = [...new Set((financialsData as { year: YearKey }[]).map((d) => d.year))].sort(
  (a, b) => yearRank(b) - yearRank(a)
)

interface YearContextValue {
  year: YearKey
  setYear: (year: YearKey) => void
  availableYears: YearKey[]
}

const YearContext = createContext<YearContextValue>({
  year: AVAILABLE_YEARS[0] ?? 2025,
  setYear: () => {},
  availableYears: AVAILABLE_YEARS,
})

export function YearProvider({ children }: { children: ReactNode }) {
  const [year, setYear] = useState<YearKey>(AVAILABLE_YEARS[0] ?? 2025)
  const value = useMemo(() => ({ year, setYear, availableYears: AVAILABLE_YEARS }), [year])
  return <YearContext.Provider value={value}>{children}</YearContext.Provider>
}

export function useYear() {
  return useContext(YearContext)
}
