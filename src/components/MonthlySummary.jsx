import { formatCurrency } from '../utils/storage'

export default function MonthlySummary({ income, expenses }) {
  const savings = income - expenses
  const isSaving = savings > 0

  return (
    <div className="monthly-summary">
      <h3 className="summary-title">💰 Monthly Summary</h3>

      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-label">Income</span>
          <p className="summary-amount">{formatCurrency(income)}</p>
        </div>
        <div className="summary-item">
          <span className="summary-label">Expenses</span>
          <p className="summary-amount expense">{formatCurrency(expenses)}</p>
        </div>
        <div className="summary-item">
          <span className="summary-label">Savings</span>
          <p className={`summary-amount ${isSaving ? 'savings' : 'deficit'}`}>
            {formatCurrency(savings)}
          </p>
        </div>
      </div>

      <div className={`summary-message ${isSaving ? 'success' : 'warning'}`}>
        {isSaving ? (
          <>
            <span className="message-icon">✅</span>
            <span className="message-text">Great! You're saving money this month.</span>
          </>
        ) : (
          <>
            <span className="message-icon">⚠️</span>
            <span className="message-text">
              Your expenses exceeded your income this month.
            </span>
          </>
        )}
      </div>
    </div>
  )
}
