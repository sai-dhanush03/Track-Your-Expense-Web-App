import { useMemo, useState } from 'react'
import ExpenseItem from './ExpenseItem'

function ExpenseList({
  expenses,
  onDeleteExpense,
  onEditExpense,
  categories,
  selectedCategory,
  onCategoryChange,
  timeFilter,
  onTimeFilterChange,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filteredExpenses = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase()

    const baseExpenses = expenses.filter((expense) => {
      if (!lowerSearch) {
        return true
      }

      return (
        expense.title.toLowerCase().includes(lowerSearch) ||
        (expense.category || '').toLowerCase().includes(lowerSearch)
      )
    })

    return [...baseExpenses].sort((first, second) => {
      if (sortBy === 'amount') {
        return second.amount - first.amount
      }

      if (sortBy === 'oldest') {
        return new Date(first.createdAt) - new Date(second.createdAt)
      }

      return new Date(second.createdAt) - new Date(first.createdAt)
    })
  }, [expenses, searchTerm, sortBy])
  return (
    <section className="card list-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Activity</p>
          <h2>Recent expenses</h2>
        </div>
        <span className="pill">{expenses.length}</span>
      </div>

      <div className="filters">
        <label className="filter-field">
          <span>Search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search expense"
          />
        </label>

        <label className="filter-field">
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amount">Highest amount</option>
          </select>
        </label>
      </div>

      <div className="filters secondary-filters">
        <label className="filter-field">
          <span>Category</span>
          <select value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>Time</span>
          <select value={timeFilter} onChange={(event) => onTimeFilterChange(event.target.value)}>
            <option value="all">All</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </label>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <h3>No matching expenses</h3>
          <p>Adjust your filters or add a new expense to get started.</p>
        </div>
      ) : (
        <div className="expense-list">
          {filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onDeleteExpense={onDeleteExpense}
              onEditExpense={onEditExpense}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ExpenseList
