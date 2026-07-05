import { useState } from 'react'
import { formatCurrency } from '../utils/storage'

function HeaderCard({ total, count, income, onAddIncome }) {
  const [source, setSource] = useState('')
  const [amount, setAmount] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedSource = source.trim()
    const numericAmount = Number(amount)

    if (!trimmedSource || !amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setFeedback('Please enter a valid source and amount.')
      return
    }

    const added = onAddIncome(trimmedSource, numericAmount)

    if (added) {
      setFeedback(`${trimmedSource} added to this month’s income.`)
      setSource('')
      setAmount('')
    } else {
      setFeedback('Unable to add income right now.')
    }
  }

  return (
    <header className="hero-card">
      <div className="hero-top">
        <div>
          <p className="eyebrow">Smart spending</p>
          <h2 className="hero-heading">Stay on top of every rupee</h2>
          <p className="hero-text">
            Track this month’s income, expenses, and dues from one calm workspace.
          </p>
        </div>
        <div className="hero-badge">This month</div>
      </div>

      <div className="hero-stats">
        <div className="stat-card">
          <span>Expenses</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
        <div className="stat-card">
          <span>Income</span>
          <strong>{formatCurrency(income)}</strong>
        </div>
        <div className="stat-card">
          <span>Net</span>
          <strong>{formatCurrency(income - total)}</strong>
        </div>
        <div className="stat-card">
          <span>Entries</span>
          <strong>{count}</strong>
        </div>
      </div>

      <form className="income-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder="Income source"
          maxLength="24"
        />
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
        />
        <button type="submit" className="primary-btn compact-btn">
          Add income
        </button>
      </form>
      {feedback ? (
        <p className={`income-feedback ${feedback.includes('added') ? 'success' : 'error'}`}>
          {feedback}
        </p>
      ) : null}
    </header>
  )
}

export default HeaderCard
