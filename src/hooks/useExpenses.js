import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_CATEGORIES,
  loadCategories,
  loadDues,
  loadExpenses,
  loadIncomeEntries,
  saveCategories,
  saveDues,
  saveExpenses,
  saveIncomeEntries,
} from '../utils/storage'

const matchesTimeFilter = (createdAt, timeFilter) => {
  if (timeFilter === 'all') {
    return true
  }

  const createdDate = new Date(createdAt)
  const now = new Date()

  if (Number.isNaN(createdDate.getTime())) {
    return false
  }

  if (timeFilter === 'week') {
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)
    return createdDate >= weekAgo
  }

  const monthAgo = new Date(now)
  monthAgo.setMonth(now.getMonth() - 1)
  return createdDate >= monthAgo
}

export function useExpenses() {
  const [expenses, setExpenses] = useState(() => loadExpenses())
  const [categories, setCategories] = useState(() => loadCategories())
  const [dues, setDues] = useState(() => loadDues())
  const [incomeEntries, setIncomeEntries] = useState(() => loadIncomeEntries())
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  useEffect(() => {
    saveCategories(categories)
  }, [categories])

  useEffect(() => {
    saveDues(dues)
  }, [dues])

  useEffect(() => {
    saveIncomeEntries(incomeEntries)
  }, [incomeEntries])

  const currentMonthRange = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    return { start, end }
  }, [])

  const monthlyExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const createdDate = new Date(expense.createdAt)
      return createdDate >= currentMonthRange.start && createdDate < currentMonthRange.end
    })
  }, [expenses, currentMonthRange.end, currentMonthRange.start])

  const totalExpenses = useMemo(
    () => monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [monthlyExpenses],
  )

  const monthlyIncome = useMemo(() => {
    return incomeEntries.reduce((sum, entry) => {
      const createdDate = new Date(entry.createdAt)
      if (createdDate >= currentMonthRange.start && createdDate < currentMonthRange.end) {
        return sum + entry.amount
      }

      return sum
    }, 0)
  }, [incomeEntries, currentMonthRange.end, currentMonthRange.start])

  const visibleExpenses = useMemo(() => {
    return [...expenses]
      .filter((expense) => {
        const categoryMatch =
          selectedCategory === 'all' || expense.category === selectedCategory
        const timeMatch = matchesTimeFilter(expense.createdAt, timeFilter)

        return categoryMatch && timeMatch
      })
      .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
  }, [expenses, selectedCategory, timeFilter])

  const addExpense = (title, amount, category) => {
    const newExpense = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      title,
      amount,
      category,
      createdAt: new Date().toISOString(),
    }

    setExpenses((currentExpenses) => [newExpense, ...currentExpenses])
  }

  const updateExpense = (id, title, amount, category) => {
    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              title,
              amount,
              category,
            }
          : expense,
      ),
    )
  }

  const deleteExpense = (id) => {
    setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id))
  }

  const addCategory = (categoryName) => {
    const trimmedName = categoryName.trim()

    if (!trimmedName) {
      return false
    }

    setCategories((currentCategories) => {
      if (currentCategories.includes(trimmedName)) {
        return currentCategories
      }

      return [...currentCategories, trimmedName]
    })

    return true
  }

  const addDue = (due) => {
    setDues((currentDues) => [due, ...currentDues])
  }

  const toggleDueStatus = (id) => {
    setDues((currentDues) =>
      currentDues.map((due) =>
        due.id === id
          ? {
              ...due,
              status: due.status === 'Settled' ? 'Pending' : 'Settled',
            }
          : due,
      ),
    )
  }

  const deleteDue = (id) => {
    setDues((currentDues) => currentDues.filter((due) => due.id !== id))
  }

  const addIncome = (source, amount) => {
    const trimmedSource = source?.trim()
    const numericAmount = Number(amount)

    if (!trimmedSource || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return false
    }

    const newIncomeEntry = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      source: trimmedSource,
      amount: numericAmount,
      createdAt: new Date().toISOString(),
    }

    setIncomeEntries((currentEntries) => [newIncomeEntry, ...currentEntries])
    return true
  }

  return {
    expenses,
    visibleExpenses,
    totalExpenses,
    monthlyIncome,
    monthlyExpenseCount: monthlyExpenses.length,
    categories: categories.length > 0 ? categories : DEFAULT_CATEGORIES,
    dues,
    selectedCategory,
    setSelectedCategory,
    timeFilter,
    setTimeFilter,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    addDue,
    toggleDueStatus,
    deleteDue,
    addIncome,
  }
}
