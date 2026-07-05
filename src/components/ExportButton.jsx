import { useState } from 'react'
import Toast from './Toast'
import { generateSimplePDF } from '../utils/pdfExport'

export default function ExportButton({ expenses, income }) {
  const [showToast, setShowToast] = useState(false)

  const handleExport = () => {
    try {
      const now = new Date()
      generateSimplePDF(expenses, income, now.getMonth() + 1, now.getFullYear())
      setShowToast(true)
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }

  return (
    <>
      <button className="export-btn" onClick={handleExport}>
        <span className="export-icon">📄</span>
        <span className="export-text">Download Monthly Report</span>
      </button>

      {showToast && (
        <Toast
          message="Report downloaded successfully!"
          type="success"
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </>
  )
}
