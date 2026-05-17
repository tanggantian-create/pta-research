import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import financialsData from '../data/financials.json'

const AVAILABLE_YEARS = [...new Set((financialsData as { year: number }[]).map((d) => d.year))].sort(
  (a, b) => b - a
)

interface YearContextValue {
  year: number
  setYear: (year: number) => void
  availableYears: number[]
}

const YearContext = createContext<YearContextValue>({
  year: AVAILABLE_YEARS[0] ?? 2025,
  setYear: () => {},
  availableYears: AVAILABLE_YEARS,
})

export function YearProvider({ children }: { children: ReactNode }) {
  const [year, setYear] = useState(AVAILABLE_YEARS[0] ?? 2025)
  const value = useMemo(() => ({ year, setYear, availableYears: AVAILABLE_YEARS }), [year])
  return <YearContext.Provider value={value}>{children}</YearContext.Provider>
}

export function useYear() {
  return useContext(YearContext)
}
