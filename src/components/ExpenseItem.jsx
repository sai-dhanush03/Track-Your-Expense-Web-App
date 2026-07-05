import { formatCurrency } from '../utils/storage'

function ExpenseItem({ expense, onDeleteExpense, onEditExpense }) {
  const formattedAmount = formatCurrency(expense.amount)
  const formattedDate = new Date(expense.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <article className="expense-item">
      <div className="expense-main">
        <div className="expense-icon">₹</div>
        <div>
          <h3>{expense.title}</h3>
          <p>{formattedDate}</p>
        </div>
      </div>

      <div className="expense-content">
        <span className="category-pill">{expense.category || 'Uncategorized'}</span>
        <div className="expense-meta">
          <strong>{formattedAmount}</strong>
          <div className="action-group">
            <button type="button" className="ghost-btn" onClick={() => onEditExpense(expense)}>
              Edit
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => onDeleteExpense(expense.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ExpenseItem
