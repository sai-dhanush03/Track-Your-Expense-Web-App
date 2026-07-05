import { useState } from 'react'
import { parseBackupFile } from '../../utils/restore'

export default function RestoreDialog({
  onConfirm,
  onCancel,
  backupFile,
  setBackupFile,
}) {
  const [selectedMode, setSelectedMode] = useState('merge')
  const [error, setError] = useState('')
  const [fileInput, setFileInput] = useState(null)

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setError('')
      const backup = await parseBackupFile(file)
      setBackupFile(backup)
    } catch (err) {
      setError(err.message)
      setBackupFile(null)
    }
  }

  const handleRestore = () => {
    if (!backupFile) {
      setError('Please select a backup file')
      return
    }
    onConfirm(selectedMode, backupFile)
  }

  return (
    <div className="restore-dialog-overlay">
      <div className="restore-dialog">
        <div className="dialog-header">
          <h2>Restore Your Records</h2>
          <button
            type="button"
            className="dialog-close"
            onClick={onCancel}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="dialog-body">
          <p className="dialog-subtitle">
            Choose how you would like to restore your financial records.
          </p>

          {!backupFile ? (
            <div className="file-upload-section">
              <label htmlFor="backup-file" className="file-upload-label">
                <input
                  id="backup-file"
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  ref={(el) => setFileInput(el)}
                  style={{ display: 'none' }}
                />
                <div className="file-upload-box">
                  <span className="upload-icon">📂</span>
                  <p>Click to select backup file</p>
                  <span className="file-hint">.json format</span>
                </div>
              </label>
            </div>
          ) : (
            <div className="file-selected">
              <p className="file-name">✓ Backup file loaded</p>

              <div className="restore-modes">
                <label className="mode-option">
                  <input
                    type="radio"
                    name="restore-mode"
                    value="merge"
                    checked={selectedMode === 'merge'}
                    onChange={(e) => setSelectedMode(e.target.value)}
                  />
                  <div className="mode-content">
                    <p className="mode-title">Merge with Existing Records</p>
                    <p className="mode-description">
                      Adds imported records while preserving existing data.
                    </p>
                  </div>
                </label>

                <label className="mode-option">
                  <input
                    type="radio"
                    name="restore-mode"
                    value="replace"
                    checked={selectedMode === 'replace'}
                    onChange={(e) => setSelectedMode(e.target.value)}
                  />
                  <div className="mode-content">
                    <p className="mode-title">Replace Existing Records</p>
                    <p className="mode-description">
                      Removes existing data and replaces it with imported data.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="dialog-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={handleRestore}
            disabled={!backupFile}
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  )
}
