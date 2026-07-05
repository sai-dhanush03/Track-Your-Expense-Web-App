import { useMemo, useState } from 'react'
import { formatCurrency } from '../utils/storage'
import {
  getHighestExpense,
  getMostUsedCategory,
  getAverageDailySpending,
  getExpenseBreakdown,
  getTopExpenses,
  getSpendingByDateRange,
  getMonthlyStats,
  getMostActiveDay,
  getSpendingPercentage,
} from '../utils/insights'
import InsightCard from './InsightCard'
import MonthlySummary from './MonthlySummary'
import ExportButton from './ExportButton'

function ReportsSection({ expenses, monthlyIncome = 0 }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // Get all unique months from expenses
  const availableMonths = useMemo(() => {
    if (expenses.length === 0) return []

    const monthsSet = new Set()
    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt || expense.date)
      if (!isNaN(date.getTime())) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthsSet.add(monthKey)
      }
    })

    // Sort months in descending order (newest first)
    return Array.from(monthsSet).sort().reverse()
  }, [expenses])

  // Filter expenses for selected month
  const selectedMonthExpenses = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number)
    return expenses.filter((expense) => {
      const date = new Date(expense.createdAt || expense.date)
      if (isNaN(date.getTime())) return false
      return date.getFullYear() === year && date.getMonth() + 1 === month
    })
  }, [expenses, selectedMonth])

  // Filter income for selected month
  const selectedMonthIncome = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number)
    // For now, we'll use the monthlyIncome directly if it matches the current month
    // In the future, you might want to store income entries with dates
    const now = new Date()
    if (
      year === now.getFullYear() &&
      month === now.getMonth() + 1
    ) {
      return monthlyIncome
    }
    // For past months, return 0 unless income history is implemented
    return 0
  }, [selectedMonth, monthlyIncome])

  // Format month for display
  const formatMonthDisplay = (monthKey) => {
    const [year, month] = monthKey.split('-').map(Number)
    const date = new Date(year, month - 1)
    const monthName = date.toLocaleDateString('en-US', { month: 'long' })
    const now = new Date()
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1
    return `${monthName} ${year}${isCurrentMonth ? ' (Current)' : ''}`
  }

  const insights = useMemo(() => {
    const highest = getHighestExpense(selectedMonthExpenses)
    const mostUsed = getMostUsedCategory(selectedMonthExpenses)
    const avgDaily = getAverageDailySpending(selectedMonthExpenses)
    const breakdown = getExpenseBreakdown(selectedMonthExpenses)
    const top5 = getTopExpenses(selectedMonthExpenses, 5)
    const last7 = getSpendingByDateRange(selectedMonthExpenses, 7)
    const last30 = getSpendingByDateRange(selectedMonthExpenses, 30)
    const stats = getMonthlyStats(selectedMonthExpenses)
    const mostActive = getMostActiveDay(selectedMonthExpenses)
    const distribution = getSpendingPercentage(selectedMonthExpenses)
    const totalExpenses = selectedMonthExpenses.reduce((sum, e) => sum + e.amount, 0)

    return {
      highest,
      mostUsed,
      avgDaily,
      breakdown,
      top5,
      last7,
      last30,
      stats,
      mostActive,
      distribution,
      totalExpenses,
    }
  }, [selectedMonthExpenses])

  return (
    <section className="reports-section">
      <div className="reports-header">
        <div>
          <h2 className="reports-title">📊 Financial Report</h2>
        </div>
        <div className="month-selector-container">
          <label htmlFor="month-select" className="month-label">
            📅 Select Month:
          </label>
          <select
            id="month-select"
            className="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map((monthKey) => (
              <option key={monthKey} value={monthKey}>
                {formatMonthDisplay(monthKey)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="insights-grid">
        <InsightCard
          icon="💸"
          label="Highest Expense"
          value={insights.highest ? formatCurrency(insights.highest.amount) : '—'}
          subtext={insights.highest?.title || 'No expenses yet'}
          gradient="linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))"
        />

        <InsightCard
          icon="🏷"
          label="Most Used Category"
          value={insights.mostUsed?.category || '—'}
          subtext={insights.mostUsed ? `${insights.mostUsed.count} transactions` : 'No data'}
          gradient="linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.08))"
        />

        <InsightCard
          icon="📅"
          label="Expenses This Month"
          value={insights.stats.totalTransactions}
          subtext={formatCurrency(insights.totalExpenses)}
          gradient="linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(34, 211, 238, 0.08))"
        />

        <InsightCard
          icon="📈"
          label="Average Daily Spending"
          value={formatCurrency(insights.avgDaily)}
          subtext="Current month"
          gradient="linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.08))"
        />
      </div>

      {/* Monthly Summary */}
      <MonthlySummary income={selectedMonthIncome} expenses={insights.totalExpenses} />

      {/* Export Button */}
      <div className="export-container">
        <ExportButton expenses={selectedMonthExpenses} income={selectedMonthIncome} />
      </div>

      {/* Expense Breakdown */}
      <div className="report-section">
        <h3 className="section-title">Expense Breakdown</h3>
        {insights.breakdown.length === 0 ? (
          <p className="empty-state-text">No spending data yet.</p>
        ) : (
          <div className="breakdown-list">
            {insights.breakdown.map((item) => (
              <div key={item.category} className="breakdown-item">
                <div className="breakdown-label">
                  <span className="category-name">{item.category}</span>
                </div>
                <span className="breakdown-amount">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top 5 Expenses */}
      {insights.top5.length > 0 && (
        <div className="report-section">
          <h3 className="section-title">Top 5 Biggest Expenses</h3>
          <div className="top-expenses-list">
            {insights.top5.map((expense) => (
              <div key={expense.id} className="top-expense-item">
                <div className="expense-info">
                  <p className="expense-title">{expense.title}</p>
                  <div className="expense-meta-row">
                    <span className="category-badge">{expense.category}</span>
                    <span className="expense-date">
                      {new Date(expense.date).toLocaleDateString('en-US')}
                    </span>
                  </div>
                </div>
                <span className="expense-amount">{formatCurrency(expense.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending Trends */}
      <div className="report-section">
        <h3 className="section-title">Recent Spending Trend</h3>
        <div className="trends-grid">
          <div className="trend-card">
            <span className="trend-label">Last 7 Days</span>
            <p className="trend-amount">{formatCurrency(insights.last7)}</p>
          </div>
          <div className="trend-card">
            <span className="trend-label">Last 30 Days</span>
            <p className="trend-amount">{formatCurrency(insights.last30)}</p>
          </div>
          <div className="trend-card">
            <span className="trend-label">Current Month</span>
            <p className="trend-amount">{formatCurrency(insights.totalExpenses)}</p>
          </div>
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="report-section">
        <h3 className="section-title">Monthly Statistics</h3>
        <div className="stats-grid">
          <div className="stat-row">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{insights.stats.totalTransactions}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Average Expense</span>
            <span className="stat-value">{formatCurrency(insights.stats.averageExpense)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Highest Expense</span>
            <span className="stat-value">{formatCurrency(insights.stats.highestExpense)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Lowest Expense</span>
            <span className="stat-value">{formatCurrency(insights.stats.lowestExpense)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Unique Categories</span>
            <span className="stat-value">{insights.stats.uniqueCategories}</span>
          </div>
        </div>
      </div>

      {/* Spending Distribution */}
      {insights.distribution.length > 0 && (
        <div className="report-section">
          <h3 className="section-title">Spending Distribution</h3>
          <div className="distribution-list">
            {insights.distribution.map((item) => (
              <div key={item.category} className="distribution-item">
                <div className="distribution-header">
                  <span className="dist-category">{item.category}</span>
                  <span className="dist-percentage">{Math.round(item.percentage)}%</span>
                </div>
                <div className="distribution-bar">
                  <div
                    className="distribution-progress"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Active Day */}
      {insights.mostActive && (
        <div className="report-section">
          <h3 className="section-title">Most Active Spending Day</h3>
          <div className="active-day-card">
            <p className="day-name">{insights.mostActive.day}</p>
            <p className="day-total">
              You spent <strong>{formatCurrency(insights.mostActive.total)}</strong> on{' '}
              {insights.mostActive.day}s this month.
            </p>
          </div>
        </div>
      )}

      {/* Report Summary */}
      <div className="report-section report-summary">
        <h3 className="section-title">This Month</h3>
        <div className="summary-rows">
          <div className="summary-row">
            <span>Income</span>
            <span className="summary-value income-value">{formatCurrency(monthlyIncome)}</span>
          </div>
          <div className="summary-row">
            <span>Expenses</span>
            <span className="summary-value expense-value">
              {formatCurrency(insights.totalExpenses)}
            </span>
          </div>
          <div className="summary-row total-row">
            <span>Savings</span>
            <span className={`summary-value ${monthlyIncome - insights.totalExpenses >= 0 ? 'savings-value' : 'deficit-value'}`}>
              {formatCurrency(monthlyIncome - insights.totalExpenses)}
            </span>
          </div>
          {insights.mostUsed && (
            <div className="summary-row">
              <span>Highest Category</span>
              <span className="summary-value">{insights.mostUsed.category}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Transactions</span>
            <span className="summary-value">{insights.stats.totalTransactions}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReportsSection
