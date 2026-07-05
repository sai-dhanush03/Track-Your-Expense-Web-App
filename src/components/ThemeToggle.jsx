function ThemeToggle({ theme, onToggle }) {
  return (
    <button type="button" className="theme-toggle" onClick={onToggle}>
      <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
      <span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
    </button>
  )
}

export default ThemeToggle
