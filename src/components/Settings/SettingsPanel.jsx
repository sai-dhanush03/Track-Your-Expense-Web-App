import { useState, useEffect } from 'react'
import { saveBackupToFile } from '../../utils/backup'
import { restoreData } from '../../utils/restore'
import AppearanceCard from './AppearanceCard'
import BackupRestoreCard from './BackupRestoreCard'
import AboutCard from './AboutCard'
import RestoreDialog from './RestoreDialog'
import Toast from '../Toast'

export default function SettingsPanel({ isOpen, onClose, theme, onThemeChange }) {
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [toast, setToast] = useState(null)
  const [backupFile, setBackupFile] = useState(null)
  const [lastBackupTime, setLastBackupTime] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('last-backup-time')
    }
    return null
  })

  useEffect(() => {
    if (lastBackupTime) {
      window.localStorage.setItem('last-backup-time', lastBackupTime)
    }
  }, [lastBackupTime])

  const handleBackup = async () => {
    try {
      await saveBackupToFile()
      setLastBackupTime(new Date().toISOString())
      setToast({
        message: 'Your records have been saved successfully.',
        type: 'success',
      })
    } catch (error) {
      setToast({
        message: 'Failed to save backup. Please try again.',
        type: 'error',
      })
    }
  }

  const handleRestoreClick = () => {
    setBackupFile(null)
    setShowRestoreDialog(true)
  }

  const handleConfirmRestore = (mode, backup) => {
    try {
      restoreData(backup.data, mode)
      setShowRestoreDialog(false)
      setBackupFile(null)

      setToast({
        message: 'Your records have been restored successfully.',
        type: 'success',
      })

      window.location.reload()
    } catch (error) {
      setToast({
        message: 'Failed to restore backup. Please try again.',
        type: 'error',
      })
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />

      <div className={`settings-panel ${isOpen ? 'settings-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="settings-header">
          <h2 className="settings-title" id="settings-title">⚙️ Settings</h2>
          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <AppearanceCard theme={theme} onThemeChange={onThemeChange} />
          </div>

          <div className="settings-section">
            <BackupRestoreCard
              onBackup={handleBackup}
              onRestore={handleRestoreClick}
              lastBackupTime={lastBackupTime}
            />
          </div>

          <div className="settings-section">
            <AboutCard />
          </div>
        </div>
      </div>

      {showRestoreDialog && (
        <RestoreDialog
          onConfirm={handleConfirmRestore}
          onCancel={() => setShowRestoreDialog(false)}
          backupFile={backupFile}
          setBackupFile={setBackupFile}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
