const EXPENSES_STORAGE_KEY = 'expense-tracker-expenses'
const CATEGORIES_STORAGE_KEY = 'expense-tracker-categories'
const DUES_STORAGE_KEY = 'expense-tracker-dues'
const INCOME_STORAGE_KEY = 'expense-tracker-income'

export const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills']

export const loadExpenses = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const savedExpenses = window.localStorage.getItem(EXPENSES_STORAGE_KEY)
    return savedExpenses ? JSON.parse(savedExpenses) : []
  } catch {
    return []
  }
}

export const saveExpenses = (expenses) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses))
}

export const loadCategories = () => {
  if (typeof window === 'undefined') {
    return [...DEFAULT_CATEGORIES]
  }

  try {
    const savedCategories = window.localStorage.getItem(CATEGORIES_STORAGE_KEY)
    return savedCategories ? JSON.parse(savedCategories) : [...DEFAULT_CATEGORIES]
  } catch {
    return [...DEFAULT_CATEGORIES]
  }
}

export const saveCategories = (categories) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
}

export const loadDues = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const savedDues = window.localStorage.getItem(DUES_STORAGE_KEY)
    return savedDues ? JSON.parse(savedDues) : []
  } catch {
    return []
  }
}

export const saveDues = (dues) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(DUES_STORAGE_KEY, JSON.stringify(dues))
}

export const loadIncomeEntries = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const savedIncome = window.localStorage.getItem(INCOME_STORAGE_KEY)
    return savedIncome ? JSON.parse(savedIncome) : []
  } catch {
    return []
  }
}

export const saveIncomeEntries = (incomeEntries) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(incomeEntries))
}

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
