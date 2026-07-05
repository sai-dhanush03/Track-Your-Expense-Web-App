import { useMemo, useState } from 'react'
import { formatCurrency } from '../utils/storage'

function DuesSection({ dues, onAddDue, onToggleDueStatus, onDeleteDue }) {
  const pendingTotal = useMemo(
    () => dues.filter((due) => due.status !== 'Settled').reduce((sum, due) => sum + due.amount, 0),
    [dues],
  )

  const [friendName, setFriendName] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState('Pending')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedName = friendName.trim()
    const numericAmount = Number(amount)

    if (!trimmedName || !amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return
    }

    onAddDue({
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      friendName: trimmedName,
      amount: numericAmount,
      reason: reason.trim(),
      date,
      status,
    })

    setFriendName('')
    setAmount('')
    setReason('')
    setDate(new Date().toISOString().slice(0, 10))
    setStatus('Pending')
  }

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Friend payments</p>
          <h2>My Dues</h2>
        </div>
        <span className="pill">{formatCurrency(pendingTotal)}</span>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Friend name</span>
          <input
            value={friendName}
            onChange={(event) => setFriendName(event.target.value)}
            placeholder="Friend name"
            maxLength="30"
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
          <span>Reason</span>
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Optional"
            maxLength="50"
          />
        </label>

        <label className="field">
          <span>Date</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>

        <label className="field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Settled">Settled</option>
          </select>
        </label>

        <button type="submit" className="primary-btn">
          Add due
        </button>
      </form>

      <div className="expense-list" style={{ marginTop: '16px' }}>
        {dues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <h3>No dues yet</h3>
            <p>Track who you paid for and when it is settled.</p>
          </div>
        ) : (
          dues.map((due) => (
            <article key={due.id} className="expense-item">
              <div className="expense-main">
                <div className="expense-icon">↺</div>
                <div>
                  <h3>{due.friendName}</h3>
                  <p>{due.reason || 'No reason provided'}</p>
                </div>
              </div>

              <div className="expense-content">
                <span className={`category-pill ${due.status === 'Settled' ? 'settled-pill' : ''}`}>
                  {due.status}
                </span>
                <div className="expense-meta">
                  <strong>{formatCurrency(due.amount)}</strong>
                  <div className="action-group">
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => onToggleDueStatus(due.id)}
                    >
                      {due.status === 'Settled' ? 'Reopen' : 'Settle'}
                    </button>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => onDeleteDue(due.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default DuesSection
