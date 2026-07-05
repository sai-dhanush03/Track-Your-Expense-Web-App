import {
  saveExpenses,
  saveCategories,
  saveDues,
  saveIncomeEntries,
} from './storage'

export const validateBackupStructure = (backup) => {
  if (!backup || typeof backup !== 'object') {
    return { valid: false, error: 'Invalid backup format' }
  }

  if (!backup.version || !backup.data) {
    return { valid: false, error: 'Backup is missing required fields' }
  }

  const { data } = backup
  if (!data.expenses || !data.categories || !data.dues || !data.income) {
    return { valid: false, error: 'Backup data is incomplete' }
  }

  if (
    !Array.isArray(data.expenses) ||
    !Array.isArray(data.categories) ||
    !Array.isArray(data.dues) ||
    !Array.isArray(data.income)
  ) {
    return { valid: false, error: 'Backup data format is incorrect' }
  }

  return { valid: true }
}

export const parseBackupFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result)
        const validation = validateBackupStructure(backup)

        if (!validation.valid) {
          reject(new Error(validation.error))
        } else {
          resolve(backup)
        }
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

export const mergeBackupData = (currentData, importedData) => {
  const expenseIds = new Set(currentData.expenses.map((e) => e.id))
  const dueIds = new Set(currentData.dues.map((d) => d.id))
  const incomeIds = new Set(currentData.income.map((i) => i.id))

  const newExpenses = [
    ...currentData.expenses,
    ...importedData.expenses.filter((e) => !expenseIds.has(e.id)),
  ]

  const newDues = [
    ...currentData.dues,
    ...importedData.dues.filter((d) => !dueIds.has(d.id)),
  ]

  const newIncome = [
    ...currentData.income,
    ...importedData.income.filter((i) => !incomeIds.has(i.id)),
  ]

  const allCategories = Array.from(
    new Set([...currentData.categories, ...importedData.categories])
  )

  return {
    expenses: newExpenses,
    categories: allCategories,
    dues: newDues,
    income: newIncome,
    theme: currentData.theme,
  }
}

export const getCurrentDataSnapshot = () => {
  return {
    expenses: JSON.parse(
      window.localStorage.getItem('expense-tracker-expenses') || '[]'
    ),
    categories: JSON.parse(
      window.localStorage.getItem('expense-tracker-categories') ||
        '["Food", "Travel", "Shopping", "Bills"]'
    ),
    dues: JSON.parse(
      window.localStorage.getItem('expense-tracker-dues') || '[]'
    ),
    income: JSON.parse(
      window.localStorage.getItem('expense-tracker-income') || '[]'
    ),
    theme: window.localStorage.getItem('expense-theme') || 'dark',
  }
}

export const restoreData = (data, mode = 'merge') => {
  if (mode === 'replace') {
    saveExpenses(data.expenses)
    saveCategories(data.categories)
    saveDues(data.dues)
    saveIncomeEntries(data.income)
    window.localStorage.setItem('expense-theme', data.theme)
  } else if (mode === 'merge') {
    const currentData = getCurrentDataSnapshot()
    const mergedData = mergeBackupData(currentData, data)
    saveExpenses(mergedData.expenses)
    saveCategories(mergedData.categories)
    saveDues(mergedData.dues)
    saveIncomeEntries(mergedData.income)
  }
}
