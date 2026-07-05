import {
  loadExpenses,
  loadCategories,
  loadDues,
  loadIncomeEntries,
} from './storage'

export const createBackup = () => {
  const expenses = loadExpenses()
  const categories = loadCategories()
  const dues = loadDues()
  const income = loadIncomeEntries()
  const theme = window.localStorage.getItem('expense-theme') || 'dark'

  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    data: {
      expenses,
      categories,
      dues,
      income,
      theme,
    },
  }

  return backup
}

export const downloadBackup = (backup) => {
  const dataStr = JSON.stringify(backup, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  const today = new Date()
  const dateStr = today.toISOString().split('T')[0]
  link.href = url
  link.download = `TrackYourMoney_Backup_${dateStr}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const saveBackupToFile = async () => {
  const backup = createBackup()
  downloadBackup(backup)
  return backup
}
