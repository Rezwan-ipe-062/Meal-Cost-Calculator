import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { computeMonthlySummary } from '../utils/debtNetting'
import { MEMBERS } from '../utils/constants'

function ChartIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function ArrowL() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> }
function ArrowR() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg> }

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
      <div className="flex items-center gap-2 mb-5">
        <ChartIcon />
        <span className="text-[13px] font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Monthly Stats</span>
      </div>

      <div className="flex items-center justify-center gap-3 mb-5">
        <motion.button whileTap={{ scale: 0.9 }} onClick={prevMonth}
          style={{ width: 44, height: 44, borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--card)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowL />
        </motion.button>
        <div className="text-base font-extrabold px-6 py-3 rounded-xl min-w-[140px] text-center" style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
          {months[month]} {year}
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={nextMonth}
          style={{ width: 44, height: 44, borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--card)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowR />
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-4" style={{ background: 'var(--primary)', border: 'none', padding: 24 }}>
        <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Expense</p>
        <p className="text-4xl font-extrabold text-white mt-1" style={{ letterSpacing: '-1px' }}>৳{summary.totalExpense.toFixed(0)}</p>
        <div className="flex gap-5 mt-2">
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>{summary.transactionCount} transactions</p>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>~৳{avgDaily}/day</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="card mb-4">
        <p className="text-xs font-bold uppercase mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.3px' }}>Amount Paid</p>
        {MEMBERS.map((m, i) => (
          <div key={m.id} className="flex justify-between items-center py-3" style={{ borderBottom: i < MEMBERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{m.name}</span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--primary)' }}>৳{(summary.paidBy[m.id] || 0).toFixed(0)}</span>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <p className="text-xs font-bold uppercase mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.3px' }}>Consumption Share</p>
        {MEMBERS.map((m, i) => (
          <div key={m.id} className="flex justify-between items-center py-3" style={{ borderBottom: i < MEMBERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{m.name}</span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--primary)' }}>৳{(summary.consumedBy[m.id] || 0).toFixed(0)}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
