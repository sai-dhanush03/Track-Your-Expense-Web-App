export default function AppearanceCard({ theme, onThemeChange }) {
  return (
    <div className="settings-row">
      <div className="row-content">
        <span className="row-label">🎨 Theme</span>
      </div>
      <button
        type="button"
        className="row-action-btn"
        onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
        title="Toggle theme"
      >
        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        <span className="arrow">›</span>
      </button>
    </div>
  )
}
