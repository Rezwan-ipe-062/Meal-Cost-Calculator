import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { SHARED_PASSWORD } from '../utils/constants'

export default function Settings() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const [confirmPw, setConfirmPw] = useState('')
  const [showClear, setShowClear] = useState(false)
  const [cleared, setCleared] = useState(false)

  const handleClearAll = async () => {
    if (confirmPw !== SHARED_PASSWORD) return
    await Promise.all([
      supabase.from('expense_splits').delete().neq('id', 0),
      supabase.from('expenses').delete().neq('id', 0),
      supabase.from('settlements').delete().neq('id', 0),
      supabase.from('egg_consumption').delete().neq('id', 0),
      supabase.from('egg_stock').delete().neq('id', 0),
    ])
    setCleared(true)
    setShowClear(false)
    setConfirmPw('')
    setTimeout(() => setCleared(false), 3000)
  }

  return (
    <div className="page-container">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-bold mb-5" style={{ color: 'var(--text)' }}>
        Settings
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-4">
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          Logged in as: <strong style={{ color: 'var(--text)' }}>{user?.name}</strong>
        </p>
        <button onClick={logout} className="btn-secondary">Logout</button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Appearance</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--text)' }}>Dark Mode</span>
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{dark ? '🌙' : '☀️'}</span>
            <div className={`theme-switch ${!dark ? 'on' : ''}`} onClick={toggle} role="button" aria-label="Toggle theme" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card" style={{ borderColor: 'var(--danger)' }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--danger)' }}>Danger Zone</h3>
        {!showClear ? (
          <button onClick={() => setShowClear(true)} className="btn-danger">Clear All Data</button>
        ) : (
          <div>
            <p className="text-sm mb-3" style={{ color: 'var(--danger)' }}>
              Type the mess password to confirm clearing ALL data.
            </p>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="input-field mb-3 text-lg" placeholder="Enter password" autoFocus />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setShowClear(false); setConfirmPw('') }} className="btn-secondary">Cancel</button>
              <button onClick={handleClearAll} disabled={confirmPw !== SHARED_PASSWORD} className="btn-danger" style={{ opacity: confirmPw !== SHARED_PASSWORD ? 0.5 : 1 }}>Delete All</button>
            </div>
          </div>
        )}
        {cleared && <p className="text-sm mt-3 text-center font-bold" style={{ color: 'var(--success)' }}>✓ All data cleared!</p>}
      </motion.div>
    </div>
  )
}
