import { useState, useEffect } from 'react'

const navItems = [
  { id: 'overview', label: '行业概览' },
  { id: 'companies', label: '头部企业' },
  { id: 'outlook', label: '发展预期' },
  { id: 'investment', label: '投资建议' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const sections = navItems.map((n) => document.getElementById(n.id))
      const scrollPos = window.scrollY + 120
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i]
        if (s && s.offsetTop <= scrollPos) {
          setActive(navItems[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/95 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-gold-400 font-bold text-lg tracking-wide">
          PTA Research
        </span>
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-sm tracking-wide transition-colors duration-200 ${
                active === item.id
                  ? 'text-gold-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
