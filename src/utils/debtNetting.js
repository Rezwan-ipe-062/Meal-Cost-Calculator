import { MEMBERS } from './constants'

export function computeNetBalances(expenses, expenseSplits, settlements) {
  const net = {}
  MEMBERS.forEach(m => net[m.id] = 0)

  expenseSplits?.forEach(split => {
    const expense = expenses?.find(e => e.id === split.expense_id)
    if (!expense) return
    net[expense.paid_by] += split.share
    net[split.member_id] -= split.share
  })

  settlements?.forEach(s => {
    net[s.from_member] -= s.amount
    net[s.to_member] += s.amount
  })

  return net
}

export function getMemberName(id) {
  return MEMBERS.find(m => m.id === id)?.name || 'Unknown'
}

export function computeMonthlySummary(expenses, expenseSplits, month, year) {
  const filtered = expenses?.filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === month && d.getFullYear() === year
  }) || []

  const totalExpense = filtered.reduce((sum, e) => sum + Number(e.amount), 0)
  const paidBy = {}
  const consumedBy = {}

  filtered.forEach(exp => {
    paidBy[exp.paid_by] = (paidBy[exp.paid_by] || 0) + Number(exp.amount)
    const splits = expenseSplits?.filter(s => s.expense_id === exp.id) || []
    splits.forEach(s => {
      consumedBy[s.member_id] = (consumedBy[s.member_id] || 0) + Number(s.share)
    })
  })

  return { totalExpense, paidBy, consumedBy, transactionCount: filtered.length }
}
