import { formatCurrency } from '../utils/storage'

export default function InsightCard({ icon, label, value, subtext, gradient }) {
  return (
    <div className="insight-card">
      <div className="insight-icon" style={{ backgroundImage: gradient }}>
        {icon}
      </div>
      <div className="insight-content">
        <p className="insight-label">{label}</p>
        <p className="insight-value">{value}</p>
        {subtext && <p className="insight-subtext">{subtext}</p>}
      </div>
    </div>
  )
}
