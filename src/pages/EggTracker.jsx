import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { getMemberName } from '../utils/debtNetting'
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

  return (
    <div className="p-4 pb-24 min-h-screen" style={{ background: 'var(--mc-black)' }}>
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl mb-6 text-center" style={{ color: 'var(--mc-gold)' }}>
        🥚 Egg Tracker
      </motion.h1>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pixel-border p-4 mb-4 text-center" style={{ background: remaining <= 2 ? '#3a1a1a' : 'var(--mc-brown)' }}>
        <p className="text-sm">Stock Remaining</p>
        <p className="text-4xl font-bold my-2" style={{ color: remaining <= 2 ? 'var(--mc-red)' : 'var(--mc-green)' }}>{remaining}</p>
        {remaining <= 2 && remaining > 0 && <p className="text-red-400 text-sm">⚠️ Low stock — buy more!</p>}
        {remaining <= 0 && <p className="text-red-400 text-sm">❌ No eggs left!</p>}
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-brown)' }}>
        <h3 className="text-sm font-bold mb-2">Add Eggs (purchased)</h3>
        <div className="flex gap-2">
          <input type="number" value={addQty} onChange={e => setAddQty(e.target.value)} className="pixel-input flex-1 p-3" placeholder="Qty" />
          <button onClick={handleAddStock} className="pixel-btn px-4 font-bold" style={{ background: 'var(--mc-grass)', color: 'white' }}>Add</button>
        </div>
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-brown)' }}>
        <h3 className="text-sm font-bold mb-2">Who ate eggs?</h3>
        <div className="flex gap-2 mb-2">
          <select value={eatMember} onChange={e => setEatMember(e.target.value)} className="pixel-input flex-1 p-3">
            <option value="">Who?</option>
            {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={eatQty} onChange={e => setEatQty(e.target.value)} className="pixel-input w-20 p-3">
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <select value={eatMeal} onChange={e => setEatMeal(e.target.value)} className="pixel-input w-28 p-3 text-sm">
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
        <button onClick={handleEat} className="pixel-btn w-full py-3 font-bold" style={{ background: 'var(--mc-gold)', color: 'var(--mc-black)' }}>Log Eggs Eaten</button>
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="pixel-border p-4" style={{ background: 'var(--mc-brown)' }}>
        <h3 className="text-sm font-bold mb-2">Per-person consumption</h3>
        {MEMBERS.map(m => (
          <div key={m.id} className="flex justify-between py-1">
            <span>{m.name}</span>
            <span style={{ color: 'var(--mc-gold)' }}>{perPerson[m.id] || 0} eggs</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
