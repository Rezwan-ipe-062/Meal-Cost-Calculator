import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const tabs = [
  { path: '/expense', label: 'Add', icon: 'plus' },
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/eggs', label: 'Eggs', icon: 'egg' },
  { path: '/summary', label: 'Stats', icon: 'chart' },
  { path: '/settings', label: 'Settings', icon: 'gear' },
]

function SvgIcon({ name, size = 22 }) {
  const s = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'plus': return <svg {...s}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    case 'home': return <svg {...s}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
    case 'egg': return <svg {...s}><path d="M12 22c-4 0-8-4.5-8-10S8 2 12 2s8 4.5 8 10-4 10-8 10z"/></svg>
    case 'chart': return <svg {...s}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    case 'gear': return <svg {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    case 'sun': return <svg {...s}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    case 'moon': return <svg {...s}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    default: return null
  }
}

export default function Navbar({ dark, toggle }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className="flex items-center gap-2.5">
            <div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--primary)' }} />
            <span className="text-[17px] font-extrabold" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>Mess Cost</span>
          </div>
          <button onClick={toggle} style={{ width: 40, height: 40, borderRadius: 12, border: 'none', background: 'var(--bg)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Toggle theme">
            {dark ? <SvgIcon name="sun" size={18} /> : <SvgIcon name="moon" size={18} />}
          </button>
        </div>
      </div>

      <nav style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div className="flex justify-around pb-safe" style={{ maxWidth: 480, margin: '0 auto', paddingTop: 6 }}>
          {tabs.map(tab => {
            const active = location.pathname === tab.path
            return (
              <motion.button
                key={tab.path}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center"
                style={{ padding: '6px 0', minWidth: 52, flex: 1, border: 'none', background: 'none', cursor: 'pointer', gap: 3 }}
              >
                <div style={{
                  width: 40,
                  height: 32,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: active ? 'var(--primary)' : 'transparent',
                  color: active ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}>
                  <SvgIcon name={tab.icon} size={18} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: active ? 'var(--primary)' : 'var(--text-muted)', letterSpacing: '-0.2px' }}>{tab.label}</span>
              </motion.button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
