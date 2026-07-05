import { useEffect, useState } from 'react'
import DuesSection from './components/DuesSection'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import HeaderCard from './components/HeaderCard'
import ReportsSection from './components/ReportsSection'
import SettingsPanel from './components/Settings/SettingsPanel'
import { useExpenses } from './hooks/useExpenses'





function App() {

  



  const {
    expenses,
    visibleExpenses,
    totalExpenses,
    categories,
    selectedCategory,
    setSelectedCategory,
    timeFilter,
    setTimeFilter,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    dues,
    addDue,
    toggleDueStatus,
    deleteDue,
    monthlyIncome,
    monthlyExpenseCount,
    addIncome,
  } = useExpenses()

  const [editingExpense, setEditingExpense] = useState(null)
  const [activeTab, setActiveTab] = useState('expenses')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('expense-theme') || 'dark'
    }

    return 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('expense-theme', theme)
    }
  }, [theme])

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
  }

  const handleCancelEdit = () => {
    setEditingExpense(null)
  }

  const handleUpdateExpense = (id, title, amount, category) => {
    updateExpense(id, title, amount, category)
    setEditingExpense(null)
  }

  const handleThemeToggle = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <main className="app-shell">
      <div className="app-frame">
        <div className="top-bar">
          <div className="brand-block">
            <p className="eyebrow">Finance hub</p>
            <h1 className="brand-title">Expense Tracker</h1>
          </div>
          <button
            type="button"
            className="settings-icon-btn"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
            title="Settings"
          >
            ⚙️
          </button>
        </div>

        <HeaderCard
          total={totalExpenses}
          count={monthlyExpenseCount}
          income={monthlyIncome}
          onAddIncome={addIncome}
        />

        <div className="tab-switcher">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'expenses' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'dues' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('dues')}
          >
            My Dues
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'reports' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>

        {activeTab === 'expenses' ? (
          <div className="content-grid">
            <ExpenseForm
              editingExpense={editingExpense}
              onAddExpense={addExpense}
              onUpdateExpense={handleUpdateExpense}
              onCancelEdit={handleCancelEdit}
              categories={categories}
              onAddCategory={addCategory}
            />
            <ExpenseList
              expenses={visibleExpenses}
              onDeleteExpense={deleteExpense}
              onEditExpense={handleEditExpense}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
            />
          </div>
        ) : null}

        {activeTab === 'dues' ? (
          <DuesSection
            dues={dues}
            onAddDue={addDue}
            onToggleDueStatus={toggleDueStatus}
            onDeleteDue={deleteDue}
          />
        ) : null}

        {activeTab === 'reports' ? <ReportsSection expenses={expenses} monthlyIncome={monthlyIncome} /> : null}

        <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          onThemeChange={setTheme}
        />
      </div>
    </main>
  )
}

export default App
