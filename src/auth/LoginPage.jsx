import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { MEMBERS, SHARED_PASSWORD } from '../utils/constants'

export default function LoginPage() {
  const { login } = useAuth()
  const [step, setStep] = useState('password')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handlePasswordSubmit = () => {
    if (password === SHARED_PASSWORD) {
      setError('')
      setStep('pick-member')
    } else {
      setError('Wrong password! Try 2468')
    }
  }

  const handleSelectMember = (member) => {
    login(member)
  }

  if (step === 'password') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pixel-border p-6 w-full max-w-sm" style={{ background: 'var(--mc-dirt)' }}>
          <h1 className="text-2xl text-center mb-2" style={{ color: 'var(--mc-gold)' }}>Mess Cost</h1>
          <h1 className="text-2xl text-center mb-6" style={{ color: 'var(--mc-gold)' }}>Calculator</h1>
          <div className="text-5xl text-center mb-6">🏔️</div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
            className="pixel-input w-full p-4 mb-3 text-center text-lg"
            autoFocus
          />
          {error && <p className="text-red-400 text-center mb-3">{error}</p>}
          <button onClick={handlePasswordSubmit} className="pixel-btn w-full py-4 text-lg font-bold" style={{ background: 'var(--mc-grass)', color: 'white' }}>
            Enter
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pixel-border p-6 w-full max-w-sm" style={{ background: 'var(--mc-dirt)' }}>
        <h2 className="text-xl text-center mb-6" style={{ color: 'var(--mc-gold)' }}>Who are you?</h2>
        <div className="flex flex-col gap-3">
          {MEMBERS.map(m => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectMember(m)}
              className="pixel-btn w-full py-5 text-lg font-bold flex items-center justify-center gap-3"
              style={{ background: 'var(--mc-stone)', color: 'white', minHeight: '56px' }}
            >
              {m.name}
            </motion.button>
          ))}
        </div>
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </motion.div>
    </div>
  )
}