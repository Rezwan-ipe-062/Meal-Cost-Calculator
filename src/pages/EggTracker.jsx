import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { MEMBERS } from '../utils/constants'

export default function EggTracker() {
  const { user } = useAuth()
  const [stock, setStock] = useState([])
  const [consumption, setConsumption] = useState([])
  const [addQty, setAddQty] = useState('')
  const [eatQty, setEatQty] = useState('1')
  const [eatMember, setEatMember] = useState(user?.id || '')
  const [eatMeal, setEatMeal] = useState('breakfast')

  const loadEggs = async () => {
    const [sRes, cRes] = await Promise.all([
      supabase.from('egg_stock').select('*').order('date', { ascending: false }),
      supabase.from('egg_consumption').select('*').order('date', { ascending: false }),
    ])
    if (sRes.data) setStock(sRes.data)
    if (cRes.data) setConsumption(cRes.data)
  }

  useEffect(() => { loadEggs() }, [])

  const totalAdded = stock.reduce((sum, s) => sum + s.quantity, 0)
  const totalEaten = consumption.reduce((sum, c) => sum + c.quantity, 0)
  const remaining = totalAdded - totalEaten

  const perPerson = {}
  MEMBERS.forEach(m => { perPerson[m.id] = 0 })
  consumption.forEach(c => { perPerson[c.member_id] = (perPerson[c.member_id] || 0) + c.quantity })

  const handleAddStock = async () => {
    if (!addQty) return
    await supabase.from('egg_stock').insert({ quantity: Number(addQty) })
    setAddQty('')
    loadEggs()
  }

  const handleEat = async () => {
    if (!eatMember || !eatQty) return
    await supabase.from('egg_consumption').insert({
      member_id: Number(eatMember),
      quantity: Number(eatQty),
      meal_type: eatMeal,
    })
    loadEggs()
  }

  const lowStock = remaining > 0 && remaining <= 2
  const noStock = remaining <= 0

  return (
    <div className="page-container">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-bold mb-5" style={{ color: 'var(--text)' }}>
        Egg Tracker
      </motion.h1>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card mb-4 text-center" style={{ padding: '24px 16px', borderColor: lowStock || noStock ? 'var(--danger)' : 'var(--border)' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Stock Remaining</p>
        <p className="text-5xl font-bold my-2" style={{ color: noStock ? 'var(--danger)' : lowStock ? 'var(--warning)' : 'var(--success)' }}>{remaining}</p>
        {lowStock && <p className="text-sm font-medium" style={{ color: 'var(--warning)' }}>⚠️ Low stock — buy more!</p>}
        {noStock && <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>❌ No eggs left!</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Add Eggs (purchased)</h3>
        <div className="flex gap-2">
          <input type="number" inputMode="numeric" value={addQty} onChange={e => setAddQty(e.target.value)} className="input-field flex-1 text-lg" placeholder="Qty" />
          <button onClick={handleAddStock} className="btn-primary" style={{ width: 'auto', padding: '14px 24px' }}>Add</button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Who ate eggs?</h3>
        <div className="flex flex-col gap-2 mb-3">
          <select value={eatMember} onChange={e => setEatMember(e.target.value)} className="input-field">
            <option value="">Who?</option>
            {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select value={eatQty} onChange={e => setEatQty(e.target.value)} className="input-field">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} egg{n > 1 ? 's' : ''}</option>)}
            </select>
            <select value={eatMeal} onChange={e => setEatMeal(e.target.value)} className="input-field">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
        </div>
        <button onClick={handleEat} className="btn-primary" style={{ background: 'var(--text)', color: 'var(--card)' }}>Log Eggs Eaten</button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Per-person consumption</h3>
        {MEMBERS.map((m, i) => (
          <div key={m.id} className="flex justify-between items-center py-2.5" style={{ borderBottom: i < MEMBERS.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
            <span style={{ color: 'var(--text)' }}>{m.name}</span>
            <span className="text-base font-bold" style={{ color: 'var(--primary)' }}>{perPerson[m.id] || 0} eggs</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
