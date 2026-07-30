import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

const tabs = [
  { path: '/expense', label: 'Add', icon: 'plus' },
  { path: '/', label: 'Balance', icon: 'wallet' },
  { path: '/eggs', label: 'Eggs', icon: 'egg' },
  { path: '/summary', label: 'Month', icon: 'chart' },
  { path: '/settings', label: 'Settings', icon: 'gear' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { dark, toggle } = useTheme()

  const SvgIcon = ({ name }) => {
    const props = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
    switch (name) {
      case 'plus': return <svg {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      case 'wallet': return <svg {...props}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      case 'egg': return <svg {...props}><path d="M12 22C8 22 4 17.5 4 12S7 2 12 2s8 4.5 8 10-4 10-8 10z"/></svg>
      case 'chart': return <svg {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      case 'gear': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      default: return null
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
            <span className="text-base font-bold" style={{ color: 'var(--text)' }}>Mess Cost</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1 }}>{dark ? '🌙' : '☀️'}</span>
            <div className={`theme-switch ${!dark ? 'on' : ''}`} onClick={toggle} role="button" aria-label="Toggle theme" />
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe" style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', boxShadow: '0 -2px 8px rgba(0,0,0,0.05)' }}>
        <div className="flex justify-around" style={{ maxWidth: 480, margin: '0 auto' }}>
          {tabs.map(tab => {
            const active = location.pathname === tab.path
            return (
              <motion.button
                key={tab.path}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center"
                style={{ padding: '8px 0', minWidth: 48, flex: 1, position: 'relative', border: 'none', background: 'none', cursor: 'pointer', color: active ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                <SvgIcon name={tab.icon} />
                <span style={{ fontSize: 11, fontWeight: 500, marginTop: 2, lineHeight: 1.2 }}>{tab.label}</span>
                {active && (
                  <motion.div layoutId="nav-indicator" style={{ position: 'absolute', bottom: -1, left: '20%', right: '20%', height: 3, background: 'var(--primary)', borderRadius: 2 }} />
                )}
              </motion.button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
