import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { SHARED_PASSWORD } from '../utils/constants'

export default function Settings() {
  const { user, logout } = useAuth()
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
    <div className="p-4 pb-24 min-h-screen" style={{ background: 'var(--mc-black)' }}>
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl mb-6 text-center" style={{ color: 'var(--mc-gold)' }}>
        Settings
      </motion.h1>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-brown)' }}>
        <p className="mb-1">Logged in as: <strong>{user?.name}</strong></p>
        <button onClick={logout} className="pixel-btn w-full py-3 mt-2 font-bold" style={{ background: 'var(--mc-stone)', color: 'white' }}>
          Logout
        </button>
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="pixel-border p-4" style={{ background: 'var(--mc-brown)' }}>
        <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--mc-red)' }}>Danger Zone</h3>
        {!showClear ? (
          <button onClick={() => setShowClear(true)} className="pixel-btn w-full py-3 font-bold" style={{ background: 'var(--mc-red)', color: 'white' }}>
            Clear All Data
          </button>
        ) : (
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--mc-red)' }}>
              Type the mess password to confirm clearing ALL data.
            </p>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="pixel-input w-full p-3 mb-2" placeholder="Enter password" />
            <div className="flex gap-2">
              <button onClick={() => { setShowClear(false); setConfirmPw('') }} className="pixel-btn flex-1 py-3" style={{ background: 'var(--mc-stone)', color: 'white' }}>Cancel</button>
              <button onClick={handleClearAll} disabled={confirmPw !== SHARED_PASSWORD} className="pixel-btn flex-1 py-3 font-bold" style={{ background: confirmPw === SHARED_PASSWORD ? 'var(--mc-red)' : 'var(--mc-stone)', color: 'white' }}>Delete All</button>
            </div>
          </div>
        )}
        {cleared && <p className="text-green-400 text-center mt-3">✓ All data cleared!</p>}
      </motion.div>
    </div>
  )
}
