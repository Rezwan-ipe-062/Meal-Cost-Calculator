import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabaseClient'
import { MEMBERS } from '../utils/constants'

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
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-bold mb-5" style={{ color: 'var(--text)' }}>
        New Expense
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Amount (৳)</label>
        <input type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} className="input-field mb-3 text-lg" placeholder="0" autoFocus />

        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Item (optional)</label>
        <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} className="input-field" placeholder="e.g. Rice, Oil" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card mb-4">
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Paid By</label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {MEMBERS.map(m => (
            <button key={m.id} onClick={() => setPaidBy(m.id)}
              className="py-3 text-sm font-semibold rounded-xl min-h-[48px]"
              style={{
                background: paidBy === m.id ? 'var(--primary)' : 'var(--bg)',
                color: paidBy === m.id ? 'white' : 'var(--text)',
                border: `1px solid ${paidBy === m.id ? 'var(--primary)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Split Between</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {MEMBERS.map(m => (
            <button key={m.id} onClick={() => toggleSplit(m.id)}
              className="py-3 text-sm font-semibold rounded-xl min-h-[48px]"
              style={{
                background: splitBetween[m.id] ? 'var(--primary)' : 'var(--bg)',
                color: splitBetween[m.id] ? 'white' : 'var(--text)',
                border: `1px solid ${splitBetween[m.id] ? 'var(--primary)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {splitBetween[m.id] ? '✓ ' : ''}{m.name}
            </button>
          ))}
        </div>

        {selectedCount > 0 && Number(amount) > 0 && (
          <div className="text-center py-3 rounded-lg" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <span className="font-semibold">Each share: ৳{sharePerPerson}</span>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field mb-3" />

        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Notes (optional)</label>
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="input-field" placeholder="Any notes..." />
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={saving || !amount || !paidBy || selectedCount === 0}
        className="btn-primary text-base font-semibold"
        style={{ opacity: saving ? 0.7 : done ? undefined : 1, background: done ? 'var(--success)' : undefined }}
      >
        {saving ? 'Saving...' : done ? '✓ Saved!' : 'Add Expense'}
      </motion.button>
    </div>
  )
}
