import { YearProvider } from './contexts/YearContext'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import YearSelector from './components/YearSelector'
import IndustryOverview from './components/IndustryOverview'
import CompanyCards from './components/CompanyCards'
import FinancialTable from './components/FinancialTable'
import ComparisonCharts from './components/ComparisonCharts'
import Outlook from './components/Outlook'
import InvestmentThemes from './components/InvestmentThemes'
import Footer from './components/Footer'

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return <div className="scroll-fade">{children}</div>
}

function AppContent() {
  useScrollAnimation()

  return (
    <div className="min-h-screen bg-navy-900 text-slate-300">
      <Navbar />
      <main>
        <Hero />
        <SectionWrapper><YearSelector /></SectionWrapper>
        <SectionWrapper><IndustryOverview /></SectionWrapper>
        <SectionWrapper><CompanyCards /></SectionWrapper>
        <SectionWrapper><FinancialTable /></SectionWrapper>
        <SectionWrapper><ComparisonCharts /></SectionWrapper>
        <SectionWrapper><Outlook /></SectionWrapper>
        <SectionWrapper><InvestmentThemes /></SectionWrapper>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <YearProvider>
      <AppContent />
    </YearProvider>
  )
}
