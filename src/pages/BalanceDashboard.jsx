import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { computeNetBalances, getMemberName } from '../utils/debtNetting'
import { MEMBERS } from '../utils/constants'

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

  return (
    <div className="page-container">
      <h1 className="text-xl font-bold mb-5" style={{ color: 'var(--text)' }}>Balance Dashboard</h1>

      <div className="space-y-3 mb-6">
        {MEMBERS.map((m, i) => {
          const balance = net[m.id] || 0
          const isMe = m.id === user?.id
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card"
              style={{
                borderLeft: `4px solid ${isMe ? 'var(--primary)' : balance >= 0 ? 'var(--success)' : 'var(--danger)'}`,
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
                    {m.name} {isMe && <span style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 600 }}>(You)</span>}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {balance >= 0 ? 'Will receive' : 'Owes'}
                  </p>
                </div>
                <span className="text-lg font-bold" style={{ color: balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {balance >= 0 ? '+' : ''}৳{balance.toFixed(2)}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {!showSettle ? (
          <motion.button key="settle-btn" exit={{ opacity: 0, y: -10 }} whileTap={{ scale: 0.98 }} onClick={() => setShowSettle(true)} className="btn-primary mb-5">
            Record Settlement
          </motion.button>
        ) : (
          <motion.div key="settle-form" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="card mb-5">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Record Payment</h3>
            <select value={settleFrom} onChange={e => setSettleFrom(e.target.value)} className="input-field mb-2">
              <option value="">From...</option>
              {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select value={settleTo} onChange={e => setSettleTo(e.target.value)} className="input-field mb-2">
              <option value="">To...</option>
              {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <input type="number" inputMode="decimal" value={settleAmount} onChange={e => setSettleAmount(e.target.value)} className="input-field mb-3 text-lg" placeholder="Amount ৳" />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setShowSettle(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSettlement} className="btn-primary">Confirm</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Recent Transactions</h2>
      <div className="space-y-2">
        {expenses.slice(0, 10).map(e => (
          <div key={e.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-sm whitespace-nowrap" style={{ color: 'var(--primary)' }}>{getMemberName(e.paid_by)}</span>
              <span className="text-sm truncate" style={{ color: 'var(--text)' }}>
                paid ৳{Number(e.amount).toFixed(2)}{e.item_name ? ` for ${e.item_name}` : ''}
              </span>
            </div>
            <span className="text-xs whitespace-nowrap ml-2" style={{ color: 'var(--text-muted)' }}>{e.date}</span>
          </div>
        ))}
        {expenses.length === 0 && (
          <div className="card text-center py-8">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No expenses yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add one from the + tab</p>
          </div>
        )}
      </div>
    </div>
  )
}
