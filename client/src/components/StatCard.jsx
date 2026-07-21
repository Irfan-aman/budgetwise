export default function StatCard({ label, value, tone = 'default' }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}
