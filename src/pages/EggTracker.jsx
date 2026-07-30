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

  return (
    <div className="p-4 pt-14 pb-28 min-h-screen" style={{ background: 'var(--mc-bg)' }}>
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl mb-6 text-center" style={{ color: 'var(--mc-gold)' }}>
        Egg Tracker
      </motion.h1>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pixel-border p-6 mb-4 text-center" style={{ background: remaining <= 2 ? '#3a1a1a' : 'var(--mc-card)' }}>
        <p className="text-sm" style={{ color: 'var(--mc-text-secondary)' }}>Stock Remaining</p>
        <p className="text-5xl font-bold my-2" style={{ color: remaining <= 2 ? 'var(--mc-red)' : 'var(--mc-green)' }}>{remaining}</p>
        {remaining <= 2 && remaining > 0 && <p className="text-red-400 text-sm">⚠️ Low stock — buy more!</p>}
        {remaining <= 0 && <p className="text-red-400 text-sm">❌ No eggs left!</p>}
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-card)' }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--mc-text)' }}>Add Eggs (purchased)</h3>
        <div className="flex gap-2">
          <input type="number" inputMode="numeric" value={addQty} onChange={e => setAddQty(e.target.value)} className="pixel-input flex-1 p-4 text-lg" placeholder="Qty" />
          <button onClick={handleAddStock} className="pixel-btn px-6 font-bold text-base" style={{ background: 'var(--mc-grass)', color: 'white' }}>Add</button>
        </div>
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="pixel-border p-4 mb-4" style={{ background: 'var(--mc-card)' }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--mc-text)' }}>Who ate eggs?</h3>
        <div className="flex flex-col gap-2 mb-3">
          <select value={eatMember} onChange={e => setEatMember(e.target.value)} className="pixel-input w-full p-4 text-base">
            <option value="">Who?</option>
            {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select value={eatQty} onChange={e => setEatQty(e.target.value)} className="pixel-input p-4 text-base">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} egg{n > 1 ? 's' : ''}</option>)}
            </select>
            <select value={eatMeal} onChange={e => setEatMeal(e.target.value)} className="pixel-input p-4 text-base">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
        </div>
        <button onClick={handleEat} className="pixel-btn w-full py-4 font-bold text-base" style={{ background: 'var(--mc-gold)', color: 'var(--mc-black)' }}>Log Eggs Eaten</button>
      </motion.div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="pixel-border p-4" style={{ background: 'var(--mc-card)' }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--mc-text)' }}>Per-person consumption</h3>
        {MEMBERS.map(m => (
          <div key={m.id} className="flex justify-between items-center py-2">
            <span style={{ color: 'var(--mc-text)' }}>{m.name}</span>
            <span className="text-lg font-bold" style={{ color: 'var(--mc-gold)' }}>{perPerson[m.id] || 0} eggs</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}