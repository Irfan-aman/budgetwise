import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';
import api from '../services/api';
import { formatCurrency, CATEGORY_COLORS, monthName } from '../utils/format';
import StatCard from '../components/StatCard';

const now = new Date();

export default function Analytics() {
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await api.get('/dashboard/analytics', { params: { month, year } });
      setData(data);
      setLoading(false);
    }
    load();
  }, [month, year]);

  return (
    <div className="page">
      <h1>Analytics Dashboard</h1>

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

      {loading || !data ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard label="Monthly Income" value={formatCurrency(data.totalIncome)} tone="positive" />
            <StatCard label="Monthly Expense" value={formatCurrency(data.totalExpense)} tone="negative" />
            <StatCard label="Remaining Budget" value={formatCurrency(data.remainingBudget)} />
            <StatCard label="Monthly Savings" value={formatCurrency(data.savings)} tone={data.savings >= 0 ? 'positive' : 'negative'} />
          </div>

          <div className="charts-grid">
            <div className="panel">
              <h2>Spending by Category (Pie)</h2>
              {data.pieChart.length === 0 ? <p className="empty-state">No expense data yet.</p> : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={data.pieChart} dataKey="total" nameKey="category" outerRadius={100} label>
                      {data.pieChart.map((entry, idx) => (
                        <Cell key={idx} fill={CATEGORY_COLORS[entry.category] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="panel">
              <h2>Spending by Category (Bar)</h2>
              {data.barChart.length === 0 ? <p className="empty-state">No expense data yet.</p> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.barChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="panel panel-wide">
              <h2>Daily Spending Trend (Line)</h2>
              {data.lineChart.length === 0 ? <p className="empty-state">No expense data yet.</p> : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.lineChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
