import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { computeNetBalances, getMemberName } from '../utils/debtNetting'
import { MEMBERS } from '../utils/constants'

function ArrowUp() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 5 5 12"/></svg>
}

function ArrowDown() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 19 19 12"/></svg>
}

function DollarIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
}

function WalletIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
}

function ClockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}

export default function BalanceDashboard() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [splits, setSplits] = useState([])
  const [settlements, setSettlements] = useState([])
  const [showSettle, setShowSettle] = useState(false)
  const [settleFrom, setSettleFrom] = useState('')
  const [settleTo, setSettleTo] = useState('')
  const [settleAmount, setSettleAmount] = useState('')

  const loadData = async () => {
    const [expRes, splitRes, setRes] = await Promise.all([
      supabase.from('expenses').select('*').order('date', { ascending: false }),
      supabase.from('expense_splits').select('*'),
      supabase.from('settlements').select('*').order('date', { ascending: false }),
    ])
    if (expRes.data) setExpenses(expRes.data)
    if (splitRes.data) setSplits(splitRes.data)
    if (setRes.data) setSettlements(setRes.data)
  }

  useEffect(() => { loadData() }, [])

  const net = computeNetBalances(expenses, splits, settlements)

  const handleSettlement = async () => {
    if (!settleFrom || !settleTo || !settleAmount) return
    await supabase.from('settlements').insert({
      from_member: Number(settleFrom),
      to_member: Number(settleTo),
      amount: Number(settleAmount),
    })
    setShowSettle(false)
    setSettleFrom('')
    setSettleTo('')
    setSettleAmount('')
    loadData()
  }

  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0)

  return (
    <div className="page-container">
      <div className="flex items-center gap-2 mb-6">
        <WalletIcon />
        <span className="text-[13px] font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Dashboard</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-5" style={{ background: 'var(--primary)', border: 'none', padding: 24 }}>
        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Spent</p>
        <p className="text-[40px] font-extrabold text-white mt-1" style={{ letterSpacing: '-1px' }}>৳{totalExpense.toFixed(0)}</p>
        <div className="flex gap-4 mt-2">
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{expenses.length} transactions</p>
        </div>
      </motion.div>

      <div className="flex items-center gap-2 mb-3">
        <DollarIcon />
        <span className="text-[13px] font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Balances</span>
      </div>
      <div className="space-y-2.5 mb-6">
        {MEMBERS.map((m, i) => {
          const balance = net[m.id] || 0
          const isMe = m.id === user?.id
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}
            >
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: isMe ? 'var(--primary)' : 'var(--green-bg)',
                  color: isMe ? 'white' : 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 800,
                }}>
                  {m.name[0]}
                </div>
                <div>
                  <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                    {m.name} {isMe && <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: 12 }}>(You)</span>}
                  </span>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)', marginTop: 1 }}>
                    {balance >= 0 ? 'Will receive' : 'Owes'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {balance >= 0 ? <ArrowUp /> : <ArrowDown />}
                <span className="text-base font-extrabold" style={{ color: balance >= 0 ? 'var(--success)' : 'var(--danger)', letterSpacing: '-0.3px' }}>
                  ৳{Math.abs(balance).toFixed(0)}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {!showSettle ? (
          <motion.button key="settle-btn" exit={{ opacity: 0, y: -10 }} whileTap={{ scale: 0.97 }} onClick={() => setShowSettle(true)} className="btn-primary mb-6">
            Record Settlement
          </motion.button>
        ) : (
          <motion.div key="settle-form" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="card mb-6" style={{ border: '1.5px solid var(--primary)' }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Record Payment</h3>
            <select value={settleFrom} onChange={e => setSettleFrom(e.target.value)} className="input-field mb-2">
              <option value="">From...</option>
              {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select value={settleTo} onChange={e => setSettleTo(e.target.value)} className="input-field mb-2">
              <option value="">To...</option>
              {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <input type="number" inputMode="decimal" value={settleAmount} onChange={e => setSettleAmount(e.target.value)} className="input-field mb-3 text-lg font-bold" placeholder="Amount ৳" />
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowSettle(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSettlement} className="btn-primary">Confirm</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mb-3">
        <ClockIcon />
        <span className="text-[13px] font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Recent</span>
      </div>
      <div className="space-y-2">
        {expenses.slice(0, 8).map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <DollarIcon />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{getMemberName(e.paid_by)}</span>
                <span className="text-sm ml-1.5" style={{ color: 'var(--text)' }}>পেড ৳{Number(e.amount).toFixed(0)}</span>
                {e.item_name && <span className="text-xs ml-1.5" style={{ color: 'var(--text-muted)' }}>for {e.item_name}</span>}
              </div>
            </div>
            <span className="text-[11px] font-medium whitespace-nowrap ml-2" style={{ color: 'var(--text-muted)' }}>{e.date}</span>
          </motion.div>
        ))}
        {expenses.length === 0 && (
          <div className="card text-center py-10">
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <WalletIcon />
            </div>
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>No expenses yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add one from the Add tab</p>
          </div>
        )}
      </div>
    </div>
  )
}
