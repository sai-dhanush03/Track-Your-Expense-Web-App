import { jsPDF } from 'jspdf'
import { formatCurrency } from './storage'
import {
  getExpenseBreakdown,
  getTopExpenses,
  getMonthlyStats,
} from './insights'

const currency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`

const addSectionTitle = (doc, text, y) => {
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235)
  doc.text(text, 14, y)
  return y + 8
}

const addDivider = (doc, y) => {
  doc.setDrawColor(203, 213, 225)
  doc.line(14, y, 196, y)
}

export const generatePDFReport = (expenses, income, currentMonth, currentYear) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 28
  const lineHeight = 16
  let y = 42

  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, pageWidth, 90, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('TrackYourMoney', margin, 28)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `${currentMonth.toLocaleString('en-US', { month: 'long' })} ${currentYear} Monthly Report`,
    margin,
    50,
  )

  doc.setFontSize(10)
  doc.setTextColor(226, 232, 240)
  doc.text('Personal finance summary exported from your dashboard', margin, 68)

  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const savings = Number(income || 0) - totalExpenses

  y = 120
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary', margin, y)
  y += 10
  addDivider(doc, y)
  y += 18

  const summaryRows = [
    ['Income', currency(income)],
    ['Total Expenses', currency(totalExpenses)],
    ['Savings', currency(savings)],
    ['Transactions', expenses.length.toString()],
  ]

  summaryRows.forEach(([label, value]) => {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(label, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(value, pageWidth - margin - 120, y, { align: 'right' })
    y += lineHeight
  })

  y += 14
  addSectionTitle(doc, 'Expense Breakdown', y)
  y += 10
  addDivider(doc, y)
  y += 16

  const breakdown = getExpenseBreakdown(expenses)
  breakdown.forEach((item) => {
    doc.setFontSize(10.5)
    doc.setFont('helvetica', 'bold')
    doc.text(item.category, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(currency(item.total), pageWidth - margin - 120, y, { align: 'right' })
    y += lineHeight
  })

  if (expenses.length > 0) {
    y += 12
    addSectionTitle(doc, 'Top Expenses', y)
    y += 10
    addDivider(doc, y)
    y += 16

    const topExpenses = getTopExpenses(expenses, 5)
    topExpenses.forEach((expense) => {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(expense.title, margin, y)
      doc.setFont('helvetica', 'normal')
      doc.text(`${expense.category} • ${new Date(expense.date).toLocaleDateString('en-US')}`, margin + 120, y)
      doc.text(currency(expense.amount), pageWidth - margin - 120, y, { align: 'right' })
      y += lineHeight
    })
  }

  y += 12
  addSectionTitle(doc, 'Monthly Statistics', y)
  y += 10
  addDivider(doc, y)
  y += 16

  const stats = getMonthlyStats(expenses)
  const statRows = [
    ['Average Expense', currency(stats.averageExpense)],
    ['Highest Expense', currency(stats.highestExpense)],
    ['Lowest Expense', currency(stats.lowestExpense)],
    ['Unique Categories', stats.uniqueCategories.toString()],
  ]

  statRows.forEach(([label, value]) => {
    doc.setFontSize(10.5)
    doc.setFont('helvetica', 'bold')
    doc.text(label, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(value, pageWidth - margin - 120, y, { align: 'right' })
    y += lineHeight
  })

  return doc
}

export const downloadReportAsJSON = (doc, month, year) => {
  const jsonStr = JSON.stringify(doc, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `TrackYourMoney_Report_${year}_${String(month).padStart(2, '0')}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const generateSimplePDF = (expenses, income, currentMonth, currentYear) => {
  const month = String(currentMonth).padStart(2, '0')
  const year = String(currentYear)
  const report = generatePDFReport(expenses, income, currentMonth, currentYear)
  report.save(`TrackYourMoney_Report_${year}_${month}.pdf`)
}
