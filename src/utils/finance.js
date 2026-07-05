export const getMonthlyExpenseSummary = (expenses, referenceDate = new Date()) => {
  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()

  const monthlyExpenses = expenses.filter((expense) => {
    const createdDate = new Date(expense.createdAt)
    return (
      createdDate.getFullYear() === year &&
      createdDate.getMonth() === month
    )
  })

  const breakdown = monthlyExpenses.reduce((accumulator, expense) => {
    const existing = accumulator.find((entry) => entry.category === expense.category)

    if (existing) {
      existing.total += expense.amount
    } else {
      accumulator.push({ category: expense.category || 'Uncategorized', total: expense.amount })
    }

    return accumulator
  }, [])

  breakdown.sort((first, second) => second.total - first.total)

  const highestSpendingCategory = breakdown[0]?.category || 'No data'

  return {
    totalSpentThisMonth: monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    categoryBreakdown: breakdown,
    highestSpendingCategory,
  }
}
