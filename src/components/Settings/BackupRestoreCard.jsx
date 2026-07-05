export default function BackupRestoreCard({ onBackup, onRestore, lastBackupTime }) {
  const formatBackupTime = (timestamp) => {
    if (!timestamp) return 'Never'

    const date = new Date(timestamp)
    const now = new Date()
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()

    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()

    if (isYesterday) {
      return 'Yesterday'
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  return (
    <>
      <div className="backup-actions-grid">
        <button type="button" className="backup-action-btn primary" onClick={onBackup}>
          <span className="action-icon">🛡</span>
          <span className="action-text">Save My Records</span>
        </button>

        <button type="button" className="backup-action-btn secondary" onClick={onRestore}>
          <span className="action-icon">📂</span>
          <span className="action-text">Restore My Records</span>
        </button>
      </div>

      <div className="backup-info-row">
        <div className="row-content">
          <span className="row-label">Last Backup</span>
        </div>
        <div className="row-value">{formatBackupTime(lastBackupTime)}</div>
      </div>
    </>
  )
}
