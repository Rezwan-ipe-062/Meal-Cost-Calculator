import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabaseClient'
import { MEMBERS } from '../utils/constants'

function PlusIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function CheckIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }

export default function ExpenseEntry() {
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const [itemName, setItemName] = useState('')
  const [paidBy, setPaidBy] = useState(user?.id || null)
  const [splitBetween, setSplitBetween] = useState({})
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const toggleSplit = (id) => {
    setSplitBetween(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const selectedCount = Object.values(splitBetween).filter(Boolean).length
  const sharePerPerson = selectedCount > 0 && amount ? (Number(amount) / selectedCount).toFixed(2) : '0.00'

  const handleSubmit = async () => {
    if (!amount || !paidBy || selectedCount === 0) return
    setSaving(true)
    const { data: expense, error } = await supabase.from('expenses').insert({
      amount: Number(amount),
      item_name: itemName || null,
      paid_by: paidBy,
      date,
      notes: notes || null,
    }).select().single()

    if (error) { setSaving(false); return }

    const splits = MEMBERS.filter(m => splitBetween[m.id]).map(m => ({
      expense_id: expense.id,
      member_id: m.id,
      share: Number(sharePerPerson),
    }))
    await supabase.from('expense_splits').insert(splits)

    setSaving(false)
    setDone(true)
    setTimeout(() => {
      setAmount('')
      setItemName('')
      setNotes('')
      setSplitBetween({})
      setDate(new Date().toISOString().split('T')[0])
      setDone(false)
    }, 2000)
  }

  return (
    <div className="page-container">
      <div className="flex items-center gap-2 mb-6">
        <PlusIcon />
        <span className="text-[13px] font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>New Expense</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-4">
        <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Amount</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, fontWeight: 800, color: 'var(--text-muted)' }}>৳</span>
          <input type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} className="input-field text-2xl font-extrabold" style={{ paddingLeft: 40, letterSpacing: '-0.5px' }} placeholder="0" autoFocus />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="card mb-4">
        <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Item (optional)</label>
        <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} className="input-field" placeholder="e.g. Rice, Oil" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card mb-4">
        <label className="block text-xs font-bold mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Paid By</label>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {MEMBERS.map(m => (
            <button key={m.id} onClick={() => setPaidBy(m.id)}
              className="text-sm font-bold rounded-xl min-h-[52px]"
              style={{
                background: paidBy === m.id ? 'var(--primary)' : 'var(--bg)',
                color: paidBy === m.id ? 'white' : 'var(--text)',
                border: `1.5px solid ${paidBy === m.id ? 'var(--primary)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {paidBy === m.id ? '✓ ' : ''}{m.name}
            </button>
          ))}
        </div>

        <label className="block text-xs font-bold mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Split Between</label>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {MEMBERS.map(m => (
            <button key={m.id} onClick={() => toggleSplit(m.id)}
              className="text-sm font-bold rounded-xl min-h-[52px]"
              style={{
                background: splitBetween[m.id] ? 'var(--primary)' : 'var(--bg)',
                color: splitBetween[m.id] ? 'white' : 'var(--text)',
                border: `1.5px solid ${splitBetween[m.id] ? 'var(--primary)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {splitBetween[m.id] ? '✓ ' : ''}{m.name}
            </button>
          ))}
        </div>

        {selectedCount > 0 && Number(amount) > 0 && (
          <div className="text-center py-3.5 rounded-xl font-bold text-sm" style={{ background: 'var(--green-bg)', color: 'var(--primary)' }}>
            Each share: ৳{sharePerPerson}
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="card mb-5">
        <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field mb-3" />
        <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Notes (optional)</label>
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="input-field" placeholder="Any notes..." />
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={saving || !amount || !paidBy || selectedCount === 0}
        className="btn-primary"
        style={{ opacity: saving ? 0.7 : done ? undefined : 1, background: done ? 'var(--success)' : undefined }}
      >
        {saving ? 'Saving...' : done ? 'Saved!' : 'Add Expense'}
      </motion.button>
    </div>
  )
}
