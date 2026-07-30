import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { MEMBERS, SHARED_PASSWORD } from '../utils/constants'

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
      setError('Wrong password!')
    }
  }

  const handleSelectMember = (member) => {
    login(member)
  }

  if (step === 'password') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #00843D 0%, #005A2B 100%)' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
              🍳
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">Mess Cost</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>Meal expense tracker</p>
          </div>
          <div className="card" style={{ background: 'white' }}>
            <div className="flex justify-end mb-2">
              <div className="flex items-center gap-2">
                <span style={{ color: '#9CA3AF', fontSize: 14 }}>{dark ? '🌙' : '☀️'}</span>
                <div className={`theme-switch ${!dark ? 'on' : ''}`} onClick={toggle} role="button" aria-label="Toggle theme" />
              </div>
            </div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              className="input-field mb-3 text-center text-lg"
              autoFocus
            />
            {error && <p className="text-sm mb-3 text-center" style={{ color: '#DC2626' }}>{error}</p>}
            <button onClick={handlePasswordSubmit} className="btn-primary text-base">
              Enter
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #00843D 0%, #005A2B 100%)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
            👤
          </div>
          <h2 className="text-xl font-bold text-white">Who are you?</h2>
        </div>
        <div className="card" style={{ background: 'white' }}>
          <div className="flex flex-col gap-3">
            {MEMBERS.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectMember(m)}
                className="w-full py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2"
                style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
              >
                {m.name}
              </motion.button>
            ))}
          </div>
          {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
        </div>
      </motion.div>
    </div>
  )
}
