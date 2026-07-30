import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { computeMonthlySummary, getMemberName } from '../utils/debtNetting'
import { MEMBERS } from '../utils/constants'

export default function MonthlySummary() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [expenses, setExpenses] = useState([])
  const [splits, setSplits] = useState([])

  useEffect(() => {
    supabase.from('expenses').select('*').then(r => { if (r.data) setExpenses(r.data) })
    supabase.from('expense_splits').select('*').then(r => { if (r.data) setSplits(r.data) })
  }, [])

  const summary = computeMonthlySummary(expenses, splits, month, year)
  const avgDaily = summary.transactionCount > 0 ? (summary.totalExpense / new Date(year, month + 1, 0).getDate()).toFixed(2) : '0.00'

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  return (
    <div className="p-4 pb-24 min-h-screen" style={{ background: 'var(--mc-black)' }}>
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl mb-4 text-center" style={{ color: 'var(--mc-gold)' }}>
        Monthly Summary
      </motion.h1>

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => { if (month > 0) setMonth(month - 1); else { setMonth(11); setYear(year - 1) } }} className="pixel-btn px-3 py-2" style={{ background: 'var(--mc-stone)', color: 'white' }}>◀</button>
        <div className="pixel-border-sm px-4 py-2 text-lg font-bold" style={{ background: 'var(--mc-brown)' }}>
          {months[month]} {year}
        </div>
        <button onClick={() => { if (month < 11) setMonth(month + 1); else { setMonth(0); setYear(year + 1) } }} className="pixel-btn px-3 py-2" style={{ background: 'var(--mc-stone)', color: 'white' }}>▶</button>
      </div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-brown)' }}>
        <p className="text-sm">Total Expense</p>
        <p className="text-3xl font-bold" style={{ color: 'var(--mc-gold)' }}>৳{summary.totalExpense.toFixed(2)}</p>
        <p className="text-sm mt-2">Transactions: {summary.transactionCount}</p>
        <p className="text-sm">Avg Daily: ৳{avgDaily}</p>
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-brown)' }}>
        <h3 className="text-sm font-bold mb-2">Amount Paid</h3>
        {MEMBERS.map(m => (
          <div key={m.id} className="flex justify-between py-1">
            <span>{m.name}</span>
            <span style={{ color: 'var(--mc-gold)' }}>৳{(summary.paidBy[m.id] || 0).toFixed(2)}</span>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="pixel-border p-4" style={{ background: 'var(--mc-brown)' }}>
        <h3 className="text-sm font-bold mb-2">Consumption Share</h3>
        {MEMBERS.map(m => (
          <div key={m.id} className="flex justify-between py-1">
            <span>{m.name}</span>
            <span style={{ color: 'var(--mc-gold)' }}>৳{(summary.consumedBy[m.id] || 0).toFixed(2)}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
