import { useEffect, useState } from 'react';
import api from '../services/api';
import { EXPENSE_CATEGORIES, formatCurrency, monthName } from '../utils/format';

const now = new Date();

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/budget', { params: { month, year } });
    setBudgets(data);
  };

  useEffect(() => { load(); }, [month, year]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/budget', { category, budget_amount: amount, month, year });
      setAmount('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save budget.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return;
    await api.delete(`/budget/${id}`);
    load();
  };

  return (
    <div className="page">
      <h1>Budget Planning</h1>

      <form className="inline-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <div className="form-row">
          <div>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label>Monthly Budget Amount</label>
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
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
        <button type="submit" className="btn-primary">Set Budget</button>
      </form>

      <h2>Budgets for {monthName(month)} {year}</h2>
      {budgets.length === 0 ? (
        <p className="empty-state">No budgets set for this month yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={b.id}>
                <td>{b.category}</td>
                <td>{formatCurrency(b.budget_amount)}</td>
                <td>
                  <button className="btn-small btn-danger" onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
