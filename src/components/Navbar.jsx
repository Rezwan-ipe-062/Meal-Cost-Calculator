import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const tabs = [
  { path: '/expense', label: '+', icon: '💰' },
  { path: '/', label: 'Balance', icon: '📊' },
  { path: '/eggs', label: 'Eggs', icon: '🥚' },
  { path: '/summary', label: 'Month', icon: '📋' },
  { path: '/settings', label: 'Set', icon: '⚙️' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 pixel-border z-50 pb-safe" style={{ background: 'var(--mc-dirt)', borderTop: '4px solid var(--mc-stone)' }}>
      <div className="flex justify-around max-w-lg mx-auto">
        {tabs.map(tab => (
          <motion.button
            key={tab.path}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center py-3 px-3 text-xs min-w-0 flex-1"
            style={{
              color: location.pathname === tab.path ? 'var(--mc-gold)' : 'var(--mc-white)',
              background: location.pathname === tab.path ? 'rgba(255,170,0,0.15)' : 'transparent',
            }}
          >
            <span className="text-xl mb-0.5">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  )
}