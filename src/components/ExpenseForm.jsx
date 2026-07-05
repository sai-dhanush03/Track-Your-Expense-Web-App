import { useEffect, useState } from 'react'

function ExpenseForm({
  editingExpense,
  onAddExpense,
  onUpdateExpense,
  onCancelEdit,
  categories,
  onAddCategory,
}) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Food')
  const [customCategory, setCustomCategory] = useState('')

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title)
      setAmount(String(editingExpense.amount))
      setSelectedCategory(editingExpense.category || categories[0] || 'Food')
    } else {
      setTitle('')
      setAmount('')
      setSelectedCategory(categories[0] || 'Food')
    }

    setCustomCategory('')
  }, [editingExpense, categories])

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const numericAmount = Number(amount)
    const categoryToUse = selectedCategory || 'Food'

    if (!trimmedTitle || !amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return
    }

    if (editingExpense) {
      onUpdateExpense(editingExpense.id, trimmedTitle, numericAmount, categoryToUse)
    } else {
      onAddExpense(trimmedTitle, numericAmount, categoryToUse)
    }

    setTitle('')
    setAmount('')
    setSelectedCategory(categories[0] || 'Food')
    setCustomCategory('')
  }

  const handleAddCustomCategory = () => {
    const trimmedCategory = customCategory.trim()

    if (!trimmedCategory) {
      return
    }

    const added = onAddCategory(trimmedCategory)

    if (added) {
      setSelectedCategory(trimmedCategory)
      setCustomCategory('')
    }
  }

  return (
    <section className="card form-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">{editingExpense ? 'Update entry' : 'New payment'}</p>
          <h2>{editingExpense ? 'Edit expense' : 'Add an expense'}</h2>
        </div>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Groceries, rent, fuel..."
            maxLength="40"
          />
        </label>

        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
          />
        </label>

        <label className="field">
          <span>Category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="custom-category-row">
          <input
            type="text"
            value={customCategory}
            onChange={(event) => setCustomCategory(event.target.value)}
            placeholder="Add custom category"
            maxLength="24"
          />
          <button type="button" className="secondary-btn" onClick={handleAddCustomCategory}>
            Add
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn">
            {editingExpense ? 'Save changes' : 'Add expense'}
          </button>
          {editingExpense ? (
            <button type="button" className="ghost-btn" onClick={onCancelEdit}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  )
}

export default ExpenseForm
