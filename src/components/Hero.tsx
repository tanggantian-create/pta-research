import { useEffect, useRef, useState } from 'react'
import marketSizeData from '../data/marketSize.json'

const marketYears = marketSizeData as { year: number; value: number }[]
const latestMarket = marketYears[marketYears.length - 1]
const firstMarket = marketYears[0]
const cagr = firstMarket
  ? (((latestMarket.value / firstMarket.value) ** (1 / (latestMarket.year - firstMarket.year)) - 1) * 100)
  : 5.9

const stats = [
  { value: latestMarket.value, unit: '亿美元', label: `全球PTA市场规模(${latestMarket.year})`, prefix: '$' },
  { value: 68, unit: '%', label: '中国占全球PTA产能', prefix: '' },
  { value: Math.round(cagr * 10) / 10, unit: '%', label: `${firstMarket.year}-${latestMarket.year}年化复合增速`, prefix: '' },
]

function CountUp({ target, prefix }: { target: number; prefix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || started.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          started.current = true
          const duration = 1500
          const start = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(target * eased))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {prefix}
      {count}
    </span>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-700" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-sm tracking-widest text-gold-400 uppercase mb-4">
          Purified Terephthalic Acid · Industry Deep Dive
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          PTA 行业深度研究
          <br />
          <span className="gradient-text">2026 拐点之年</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-16">
          七年扩产周期终结 · 反内卷政策推进 · 盈利从历史极低点修复 · 全球成本曲线重塑
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-8 text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                <CountUp target={stat.value} prefix={stat.prefix} />
                <span className="text-gold-400">{stat.unit}</span>
              </div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <a
            href="#overview"
            className="inline-block text-slate-500 hover:text-gold-400 transition-colors"
          >
            <svg className="w-8 h-8 animate-bounce mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
