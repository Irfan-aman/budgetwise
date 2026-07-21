import { useEffect, useState } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { formatCurrency, formatDate } from '../utils/format';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/dashboard');
        setData(data);
      } catch (err) {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="page"><p>Loading dashboard...</p></div>;
  if (error) return <div className="page"><p className="form-error">{error}</p></div>;

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <StatCard label="Total Income" value={formatCurrency(data.totalIncome)} tone="positive" />
        <StatCard label="Total Expense" value={formatCurrency(data.totalExpense)} tone="negative" />
        <StatCard label="Remaining Balance" value={formatCurrency(data.remainingBalance)} />
        <StatCard label="Monthly Budget" value={formatCurrency(data.totalBudget)} />
        <StatCard label="Remaining Budget" value={formatCurrency(data.remainingBudget)} />
        <StatCard label="Savings" value={formatCurrency(data.savings)} tone={data.savings >= 0 ? 'positive' : 'negative'} />
      </div>

      <div className="dashboard-columns">
        <div className="panel">
          <h2>Smart Budget Insights</h2>
          {data.insights.length === 0 ? (
            <p className="empty-state">Add some transactions to see insights here.</p>
          ) : (
            <ul className="insights-list">
              {data.insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <h2>Recent Transactions</h2>
          {data.recentTransactions.length === 0 ? (
            <p className="empty-state">No transactions yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Detail</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map((t) => (
                  <tr key={`${t.type}-${t.id}`}>
                    <td>{formatDate(t.date)}</td>
                    <td className={t.type === 'income' ? 'text-positive' : 'text-negative'}>
                      {t.type === 'income' ? 'Income' : 'Expense'}
                    </td>
                    <td>{t.type === 'income' ? t.source : t.category}</td>
                    <td>{formatCurrency(t.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
