import { formatCurrency } from './storage'

export const getHighestExpense = (expenses) => {
  if (expenses.length === 0) return null
  return expenses.reduce((max, expense) =>
    expense.amount > max.amount ? expense : max
  )
}

export const getMostUsedCategory = (expenses) => {
  if (expenses.length === 0) return null

  const categoryCount = {}
  expenses.forEach((expense) => {
    categoryCount[expense.category] = (categoryCount[expense.category] || 0) + 1
  })

  const mostUsed = Object.entries(categoryCount).reduce((max, [category, count]) =>
    count > max.count ? { category, count } : max
  )

  return { category: mostUsed.category, count: mostUsed.count }
}

export const getAverageDailySpending = (expenses) => {
  if (expenses.length === 0) return 0

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const uniqueDays = new Set(
    expenses.map((expense) => new Date(expense.date).toDateString())
  )

  return uniqueDays.size > 0 ? totalSpent / uniqueDays.size : 0
}

export const getExpenseBreakdown = (expenses) => {
  const breakdown = {}
  expenses.forEach((expense) => {
    breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount
  })

  return Object.entries(breakdown)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

export const getTopExpenses = (expenses, limit = 5) => {
  return expenses
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
}

export const getSpendingByDateRange = (expenses, days) => {
  const now = new Date()
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  return expenses
    .filter((expense) => new Date(expense.date) >= startDate)
    .reduce((sum, expense) => sum + expense.amount, 0)
}

export const getMonthlyStats = (expenses) => {
  const breakdown = getExpenseBreakdown(expenses)
  const highest = getHighestExpense(expenses)

  return {
    totalTransactions: expenses.length,
    averageExpense: expenses.length > 0 ? expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length : 0,
    highestExpense: highest?.amount || 0,
    lowestExpense: expenses.length > 0 ? Math.min(...expenses.map((e) => e.amount)) : 0,
    uniqueCategories: new Set(expenses.map((e) => e.category)).size,
  }
}

export const getMostActiveDay = (expenses) => {
  if (expenses.length === 0) return null

  const dayTotals = {}
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  expenses.forEach((expense) => {
    const day = dayNames[new Date(expense.date).getDay()]
    dayTotals[day] = (dayTotals[day] || 0) + expense.amount
  })

  const mostActive = Object.entries(dayTotals).reduce((max, [day, total]) =>
    total > max.total ? { day, total } : max
  )

  return mostActive
}

export const getSpendingPercentage = (expenses) => {
  const breakdown = getExpenseBreakdown(expenses)
  const total = breakdown.reduce((sum, item) => sum + item.total, 0)

  return breakdown.map((item) => ({
    category: item.category,
    amount: item.total,
    percentage: total > 0 ? (item.total / total) * 100 : 0,
  }))
}
