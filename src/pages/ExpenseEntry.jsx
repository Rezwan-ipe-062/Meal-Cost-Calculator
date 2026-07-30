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
    <div className="p-4 pb-28 min-h-screen" style={{ background: 'var(--mc-black)' }}>
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl mb-6 text-center" style={{ color: 'var(--mc-gold)' }}>
        New Expense
      </motion.h1>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-brown)' }}>
        <label className="block text-sm mb-2">Amount (৳)</label>
        <input type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} className="pixel-input w-full p-4 mb-3 text-lg" placeholder="0" autoFocus />

        <label className="block text-sm mb-2">Item (optional)</label>
        <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} className="pixel-input w-full p-4 mb-3" placeholder="e.g. Rice, Oil" />
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-brown)' }}>
        <label className="block text-sm mb-3">Paid By</label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {MEMBERS.map(m => (
            <button key={m.id} onClick={() => setPaidBy(m.id)} className="pixel-btn py-4 text-sm font-bold min-h-[52px]" style={{ background: paidBy === m.id ? 'var(--mc-grass)' : 'var(--mc-stone)', color: 'white' }}>
              {m.name}
            </button>
          ))}
        </div>

        <label className="block text-sm mb-3">Split Between</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {MEMBERS.map(m => (
            <button key={m.id} onClick={() => toggleSplit(m.id)} className="pixel-btn py-4 text-sm font-bold min-h-[52px]" style={{ background: splitBetween[m.id] ? 'var(--mc-grass)' : 'var(--mc-stone)', color: 'white' }}>
              {splitBetween[m.id] ? '✓ ' : ''}{m.name}
            </button>
          ))}
        </div>

        {selectedCount > 0 && Number(amount) > 0 && (
          <div className="text-center text-lg py-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
            Each share: ৳{sharePerPerson}
          </div>
        )}
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-brown)' }}>
        <label className="block text-sm mb-2">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="pixel-input w-full p-4 mb-3" />

        <label className="block text-sm mb-2">Notes (optional)</label>
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="pixel-input w-full p-4" placeholder="Any notes..." />
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={saving || !amount || !paidBy || selectedCount === 0}
        className="pixel-btn w-full py-5 text-lg font-bold"
        style={{ background: done ? 'var(--mc-green)' : 'var(--mc-grass)', color: 'white', opacity: saving ? 0.7 : 1 }}
      >
        {saving ? 'Saving...' : done ? '✓ Saved!' : 'Add Expense'}
      </motion.button>
    </div>
  )
}