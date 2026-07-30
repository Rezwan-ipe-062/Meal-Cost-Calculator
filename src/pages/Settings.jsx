import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { SHARED_PASSWORD } from '../utils/constants'

function GearIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function LogoutIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function SunIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> }
function MoonIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> }
function AlertIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }

export default function Settings() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const [confirmPw, setConfirmPw] = useState('')
  const [showClear, setShowClear] = useState(false)
  const [cleared, setCleared] = useState(false)
  const [clearError, setClearError] = useState('')

  const handleClearAll = async () => {
    if (confirmPw !== SHARED_PASSWORD) { setClearError('Wrong password'); return }
    const results = await Promise.allSettled([
      supabase.from('expense_splits').delete().neq('id', 0),
      supabase.from('expenses').delete().neq('id', 0),
      supabase.from('settlements').delete().neq('id', 0),
      supabase.from('egg_consumption').delete().neq('id', 0),
      supabase.from('egg_stock').delete().neq('id', 0),
    ])
    if (results.some(r => r.status === 'rejected')) return
    setCleared(true)
    setShowClear(false)
    setConfirmPw('')
    setClearError('')
    setTimeout(() => setCleared(false), 3000)
  }

  return (
    <div className="page-container">
      <div className="flex items-center gap-2 mb-5">
        <GearIcon />
        <span className="text-[13px] font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Settings</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-3">
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <span className="text-base font-extrabold">{user?.name?.[0]}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{user?.name}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Signed in</p>
          </div>
          <button onClick={logout} style={{
            padding: '10px 16px', fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
            border: '1.5px solid var(--border)', borderRadius: 10, background: 'var(--card)', color: 'var(--text-secondary)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <LogoutIcon />
            Logout
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="card mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              {dark ? <SunIcon /> : <MoonIcon />}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Dark Mode</p>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{dark ? 'On' : 'Off'}</p>
            </div>
          </div>
          <div className={`theme-toggle ${!dark ? 'on' : ''}`} onClick={toggle} role="button" aria-label="Toggle theme" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ border: '1.5px solid #FECACA' }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertIcon />
          <p className="text-xs font-bold uppercase" style={{ color: '#DC2626', letterSpacing: '0.3px' }}>Danger Zone</p>
        </div>
        {!showClear ? (
          <button onClick={() => setShowClear(true)} className="btn-danger">Clear All Data</button>
        ) : (
          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: '#DC2626' }}>Type the mess password to confirm</p>
            <input type="password" value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setClearError('') }} className="input-field mb-3 text-center font-bold" style={{ letterSpacing: '4px' }} placeholder="Password" autoFocus />
            {clearError && <p className="text-xs font-semibold mb-3 text-center" style={{ color: '#DC2626' }}>{clearError}</p>}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setShowClear(false); setConfirmPw(''); setClearError('') }} className="btn-secondary">Cancel</button>
              <button onClick={handleClearAll} disabled={confirmPw !== SHARED_PASSWORD} className="btn-danger" style={{ opacity: confirmPw !== SHARED_PASSWORD ? 0.4 : 1 }}>Delete All</button>
            </div>
          </div>
        )}
        {cleared && <p className="text-xs font-bold mt-3 text-center" style={{ color: 'var(--success)' }}>All data cleared!</p>}
      </motion.div>
    </div>
  )
}
