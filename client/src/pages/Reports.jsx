import { useEffect, useState } from 'react';
import api from '../services/api';
import { formatCurrency, monthName } from '../utils/format';

const now = new Date();

export default function Reports() {
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/reports/summary', { params: { month, year } });
      setSummary(data);
    }
    load();
  }, [month, year]);

  const downloadCSV = async (type) => {
    const response = await api.get(`/reports/${type}/csv`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}-report.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="page">
      <h1>Reports</h1>

      <div className="form-row">
        <div>
          <label>Month</label>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{monthName(m)}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Year</label>
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        </div>
      </div>

      {summary && (
        <div className="panel panel-narrow">
          <h2>Monthly Summary — {monthName(summary.month)} {summary.year}</h2>
          <p><strong>Total Income:</strong> {formatCurrency(summary.totalIncome)}</p>
          <p><strong>Total Expense:</strong> {formatCurrency(summary.totalExpense)}</p>
          <p><strong>Savings:</strong> {formatCurrency(summary.savings)}</p>
          <h3>By Category</h3>
          {summary.byCategory.length === 0 ? (
            <p className="empty-state">No expenses recorded for this month.</p>
          ) : (
            <ul>
              {summary.byCategory.map((c) => (
                <li key={c.category}>{c.category}: {formatCurrency(c.total)}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="panel panel-narrow">
        <h2>Download Reports (CSV)</h2>
        <div className="hero-actions">
          <button className="btn-secondary" onClick={() => downloadCSV('income')}>Download Income Report</button>
          <button className="btn-secondary" onClick={() => downloadCSV('expense')}>Download Expense Report</button>
        </div>
      </div>
    </div>
  );
}
