import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { MEMBERS, SHARED_PASSWORD } from '../utils/constants'

function SvgIcon({ name, size = 22 }) {
  const s = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'lock': return <svg {...s}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
    case 'user': return <svg {...s}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    case 'sun': return <svg {...s}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    case 'moon': return <svg {...s}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    default: return null
  }
}

export default function LoginPage() {
  const { login } = useAuth()
  const { dark, toggle } = useTheme()
  const [step, setStep] = useState('password')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handlePasswordSubmit = () => {
    if (password === SHARED_PASSWORD) {
      setError('')
      setStep('pick-member')
    } else {
      setError('Wrong password')
    }
  }

  const handleSelectMember = (member) => {
    login(member)
  }

  const shared = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: '#059669', padding: '0 24px 48px' }
  if (step === 'password') {
    return (
      <div style={shared}>
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c-4 0-8-4.5-8-10S8 2 12 2s8 4.5 8 10-4 10-8 10z"/></svg>
          </div>
        </motion.div>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-white text-[28px] font-extrabold mt-5 mb-1" style={{ letterSpacing: '-0.5px' }}>Mess Cost</motion.h1>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Meal expense tracker</motion.p>

        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="w-full mt-10" style={{ maxWidth: 320 }}>
          <div className="card" style={{ padding: 24, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
            <div className="flex justify-end mb-2">
              <button onClick={toggle} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'var(--bg)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Toggle theme">
                {dark ? <SvgIcon name="sun" size={16} /> : <SvgIcon name="moon" size={16} />}
              </button>
            </div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              className="input-field mb-3 text-center text-lg font-bold"
              style={{ letterSpacing: '4px' }}
              autoFocus
            />
            {error && <p className="text-xs font-semibold mb-3 text-center" style={{ color: '#DC2626' }}>{error}</p>}
            <button onClick={handlePasswordSubmit} className="btn-primary text-base">Enter</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={shared}>
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      </motion.div>
      <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-white text-xl font-extrabold mt-5 mb-1">Who's cooking?</motion.h2>
      <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Pick your name to continue</motion.p>

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="w-full mt-8" style={{ maxWidth: 320 }}>
        <div className="card" style={{ padding: 24, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <div className="flex flex-col gap-3">
            {MEMBERS.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectMember(m)}
                style={{
                  width: '100%', padding: '14px 20px', border: '1.5px solid var(--border)', borderRadius: 14,
                  background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {m.name}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
