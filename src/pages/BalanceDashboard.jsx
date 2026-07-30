import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
    <div className="p-4 pb-28 min-h-screen" style={{ background: 'var(--mc-black)' }}>
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl mb-6 text-center" style={{ color: 'var(--mc-gold)' }}>
        Balance Dashboard
      </motion.h1>

      <div className="space-y-3 mb-6">
        {MEMBERS.map((m, i) => {
          const balance = net[m.id] || 0
          return (
            <motion.div key={m.id} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="pixel-border p-4" style={{ background: 'var(--mc-brown)' }}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{m.name}</h3>
                {balance >= 0 ? (
                  <p className="text-lg font-bold" style={{ color: 'var(--mc-green)' }}>
                    +৳{balance.toFixed(2)}
                  </p>
                ) : (
                  <p className="text-lg font-bold" style={{ color: 'var(--mc-red)' }}>
                    -৳{Math.abs(balance).toFixed(2)}
                  </p>
                )}
              </div>
              <p className="text-xs mt-1 opacity-70">
                {balance >= 0 ? 'Will receive' : 'Owes'}
              </p>
            </motion.div>
          )
        })}
      </div>

      {!showSettle ? (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowSettle(true)} className="pixel-btn w-full py-4 text-lg font-bold mb-4" style={{ background: 'var(--mc-gold)', color: 'var(--mc-black)' }}>
          Record Settlement
        </motion.button>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-brown)' }}>
          <h3 className="text-base font-bold mb-3">Record Payment</h3>
          <select value={settleFrom} onChange={e => setSettleFrom(e.target.value)} className="pixel-input w-full p-4 mb-2 text-base">
            <option value="">From...</option>
            {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={settleTo} onChange={e => setSettleTo(e.target.value)} className="pixel-input w-full p-4 mb-2 text-base">
            <option value="">To...</option>
            {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input type="number" inputMode="decimal" value={settleAmount} onChange={e => setSettleAmount(e.target.value)} className="pixel-input w-full p-4 mb-3 text-lg" placeholder="Amount ৳" />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setShowSettle(false)} className="pixel-btn py-4 text-sm" style={{ background: 'var(--mc-stone)', color: 'white' }}>Cancel</button>
            <button onClick={handleSettlement} className="pixel-btn py-4 text-sm font-bold" style={{ background: 'var(--mc-grass)', color: 'white' }}>Confirm</button>
          </div>
        </motion.div>
      )}

      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg mb-3" style={{ color: 'var(--mc-gold)' }}>Recent Transactions</motion.h2>
      <div className="space-y-2">
        {expenses.slice(0, 10).map(e => (
          <div key={e.id} className="pixel-border-sm p-3 text-sm" style={{ background: '#2a2a2a' }}>
            <span style={{ color: 'var(--mc-gold)' }}>{getMemberName(e.paid_by)}</span> paid ৳{Number(e.amount).toFixed(2)}
            {e.item_name && <span> for {e.item_name}</span>}
            <span className="text-gray-500 ml-2">{e.date}</span>
          </div>
        ))}
        {expenses.length === 0 && <p className="text-gray-500 text-center py-4">No expenses yet</p>}
      </div>
    </div>
  )
}