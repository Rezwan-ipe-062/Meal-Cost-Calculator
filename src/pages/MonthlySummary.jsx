import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { computeMonthlySummary } from '../utils/debtNetting'
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
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const avgDaily = summary.transactionCount > 0 ? (summary.totalExpense / daysInMonth).toFixed(2) : '0.00'

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const prevMonth = () => { if (month > 0) setMonth(month - 1); else { setMonth(11); setYear(year - 1) } }
  const nextMonth = () => { if (month < 11) setMonth(month + 1); else { setMonth(0); setYear(year + 1) } }

  return (
    <div className="page-container">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
        Monthly Summary
      </motion.h1>

      <div className="flex justify-center items-center gap-3 mb-5">
        <motion.button whileTap={{ scale: 0.9 }} onClick={prevMonth} className="btn-ghost" style={{ fontSize: 18, padding: '8px 14px', minWidth: 44, minHeight: 44 }}>
          ◀
        </motion.button>
        <div className="px-5 py-3 rounded-xl font-bold text-base min-w-[130px] text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
          {months[month]} {year}
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={nextMonth} className="btn-ghost" style={{ fontSize: 18, padding: '8px 14px', minWidth: 44, minHeight: 44 }}>
          ▶
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-4">
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Expense</p>
        <p className="text-3xl font-bold mt-1" style={{ color: 'var(--primary)' }}>৳{summary.totalExpense.toFixed(2)}</p>
        <div className="flex gap-4 mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <p>Transactions: {summary.transactionCount}</p>
          <p>Avg Daily: ৳{avgDaily}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Amount Paid</h3>
        {MEMBERS.map((m, i) => (
          <div key={m.id} className="flex justify-between items-center py-2.5" style={{ borderBottom: i < MEMBERS.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
            <span style={{ color: 'var(--text)' }}>{m.name}</span>
            <span className="text-base font-semibold" style={{ color: 'var(--primary)' }}>৳{(summary.paidBy[m.id] || 0).toFixed(2)}</span>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Consumption Share</h3>
        {MEMBERS.map((m, i) => (
          <div key={m.id} className="flex justify-between items-center py-2.5" style={{ borderBottom: i < MEMBERS.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
            <span style={{ color: 'var(--text)' }}>{m.name}</span>
            <span className="text-base font-semibold" style={{ color: 'var(--primary)' }}>৳{(summary.consumedBy[m.id] || 0).toFixed(2)}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
