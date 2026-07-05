import { formatCurrency } from './storage'
import {
  getExpenseBreakdown,
  getTopExpenses,
  getMonthlyStats,
} from './insights'

export const generatePDFReport = (expenses, income, currentMonth, currentYear) => {
  const doc = {
    title: 'TrackYourMoney Monthly Report',
    content: [],
  }

  // Header
  doc.content.push({
    type: 'heading1',
    text: 'TrackYourMoney',
    alignment: 'center',
  })

  doc.content.push({
    type: 'text',
    text: `Monthly Report - ${currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
    alignment: 'center',
    style: 'subtitle',
  })

  doc.content.push({ type: 'spacing', height: 20 })

  // Summary Section
  doc.content.push({
    type: 'heading2',
    text: 'Summary',
  })

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const savings = income - totalExpenses

  doc.content.push({
    type: 'table',
    rows: [
      ['Metric', 'Amount'],
      ['Income', formatCurrency(income)],
      ['Total Expenses', formatCurrency(totalExpenses)],
      ['Savings', formatCurrency(savings)],
      ['Number of Transactions', expenses.length.toString()],
    ],
  })

  doc.content.push({ type: 'spacing', height: 15 })

  // Expense Breakdown
  doc.content.push({
    type: 'heading2',
    text: 'Expense Breakdown by Category',
  })

  const breakdown = getExpenseBreakdown(expenses)
  const breakdownRows = [['Category', 'Amount', 'Transactions']]
  const categoryCount = {}

  expenses.forEach((e) => {
    categoryCount[e.category] = (categoryCount[e.category] || 0) + 1
  })

  breakdown.forEach((item) => {
    breakdownRows.push([
      item.category,
      formatCurrency(item.total),
      categoryCount[item.category].toString(),
    ])
  })

  doc.content.push({
    type: 'table',
    rows: breakdownRows,
  })

  doc.content.push({ type: 'spacing', height: 15 })

  // Top 5 Expenses
  if (expenses.length > 0) {
    doc.content.push({
      type: 'heading2',
      text: 'Top 5 Highest Expenses',
    })

    const topExpenses = getTopExpenses(expenses, 5)
    const topRows = [['Expense', 'Category', 'Amount', 'Date']]

    topExpenses.forEach((expense) => {
      topRows.push([
        expense.title,
        expense.category,
        formatCurrency(expense.amount),
        new Date(expense.date).toLocaleDateString('en-US'),
      ])
    })

    doc.content.push({
      type: 'table',
      rows: topRows,
    })

    doc.content.push({ type: 'spacing', height: 15 })
  }

  // Monthly Statistics
  doc.content.push({
    type: 'heading2',
    text: 'Monthly Statistics',
  })

  const stats = getMonthlyStats(expenses)

  doc.content.push({
    type: 'table',
    rows: [
      ['Metric', 'Value'],
      ['Total Transactions', stats.totalTransactions.toString()],
      [
        'Average Expense',
        formatCurrency(stats.averageExpense),
      ],
      ['Highest Expense', formatCurrency(stats.highestExpense)],
      ['Lowest Expense', formatCurrency(stats.lowestExpense)],
      ['Unique Categories', stats.uniqueCategories.toString()],
    ],
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

// Simple PDF generation using a library-free approach
export const generateSimplePDF = (expenses, income, currentMonth, currentYear) => {
  const month = String(currentMonth).padStart(2, '0')
  const year = String(currentYear)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const savings = income - totalExpenses

  let pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>
endobj
5 0 obj
<< /Length 1200 >>
stream
BT
/F1 24 Tf
50 750 Td
(TrackYourMoney Monthly Report) Tj
0 -30 Td
/F1 12 Tf
(${currentMonth.toLocaleString('en-US', { month: 'long' })} ${currentYear}) Tj
0 -40 Td
/F1 14 Tf
(Summary) Tj
0 -20 Td
/F1 10 Tf
(Income: ₹${income.toLocaleString('en-IN')}) Tj
0 -15 Td
(Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}) Tj
0 -15 Td
(Savings: ₹${savings.toLocaleString('en-IN')}) Tj
0 -15 Td
(Transactions: ${expenses.length}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
0000000332 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1582
%%EOF`

  const blob = new Blob([pdfContent], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `TrackYourMoney_Report_${year}_${month}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
