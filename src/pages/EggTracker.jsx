import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { MEMBERS } from '../utils/constants'

function EggIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c-4 0-8-4.5-8-10S8 2 12 2s8 4.5 8 10-4 10-8 10z"/></svg> }
function PlusIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function CheckIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function UsersIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> }

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
    const { error } = await supabase.from('egg_stock').insert({ quantity: Number(addQty) })
    if (error) return
    setAddQty('')
    loadEggs()
  }

  const handleEat = async () => {
    if (!eatMember || !eatQty || Number(eatQty) > remaining) return
    const { error } = await supabase.from('egg_consumption').insert({
      member_id: Number(eatMember),
      quantity: Number(eatQty),
      meal_type: eatMeal,
    })
    if (error) return
    setEatQty('1')
    loadEggs()
  }

  const lowStock = remaining > 0 && remaining <= 2
  const noStock = remaining <= 0

  return (
    <div className="page-container">
      <div className="flex items-center gap-2 mb-5">
        <EggIcon />
        <span className="text-[13px] font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Egg Tracker</span>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card mb-5 text-center" style={{
        padding: '28px 20px',
        background: noStock ? '#FEF2F2' : lowStock ? '#FFFBEB' : '#059669',
        border: 'none',
      }}>
        <p className="text-sm font-bold uppercase tracking-wider" style={{ color: noStock || lowStock ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)' }}>
          Stock Remaining
        </p>
        <p className="text-6xl font-extrabold my-2" style={{ color: noStock ? '#DC2626' : lowStock ? '#D97706' : 'white', letterSpacing: '-2px' }}>
          {remaining}
        </p>
        <p className="text-sm font-semibold" style={{ color: noStock ? '#DC2626' : lowStock ? '#D97706' : 'rgba(255,255,255,0.7)' }}>
          {noStock ? 'No eggs left!' : lowStock ? 'Low stock - buy more!' : 'eggs available'}
        </p>
      </motion.div>

      <div className="card mb-4">
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="number" inputMode="numeric" value={addQty} onChange={e => setAddQty(e.target.value)} className="input-field flex-1 text-center text-xl font-bold" placeholder="Qty" />
          <button onClick={handleAddStock} style={{
            width: 52, height: 52, borderRadius: 12, border: 'none', background: 'var(--primary)',
            color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <PlusIcon />
          </button>
        </div>
        <p className="text-[11px] font-semibold mt-2 text-center" style={{ color: 'var(--text-muted)' }}>Add purchased eggs</p>
      </div>

      <div className="card mb-4">
        <p className="text-xs font-bold uppercase mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.3px' }}>Log eggs eaten</p>
        <div className="flex flex-col gap-2.5 mb-3">
          <div className="grid grid-cols-2 gap-3">
            <select value={eatMember} onChange={e => setEatMember(e.target.value)} className="input-field text-sm font-semibold">
              <option value="">Who?</option>
              {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select value={eatQty} onChange={e => setEatQty(e.target.value)} className="input-field text-sm font-semibold">
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} egg{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <select value={eatMeal} onChange={e => setEatMeal(e.target.value)} className="input-field text-sm font-semibold">
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
        <button onClick={handleEat} className="btn-primary" style={{ background: 'var(--text)', color: 'var(--card)' }}>Log Eggs</button>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <UsersIcon />
          <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.3px' }}>Per person</p>
        </div>
        {MEMBERS.map((m, i) => (
          <div key={m.id} className="flex justify-between items-center py-3" style={{ borderBottom: i < MEMBERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{m.name}</span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--primary)' }}>{perPerson[m.id] || 0} eggs</span>
          </div>
        ))}
      </div>
    </div>
  )
}
