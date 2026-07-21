import { useEffect, useState } from 'react';
import api from '../services/api';
import { formatCurrency, formatDate, EXPENSE_CATEGORIES } from '../utils/format';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const load = async () => {
    const params = { startDate: startDate || undefined, endDate: endDate || undefined };
    const [incomeRes, expenseRes] = await Promise.all([
      filterType === 'expense' ? Promise.resolve({ data: [] }) : api.get('/income', { params }),
      filterType === 'income' ? Promise.resolve({ data: [] }) : api.get('/expense', { params: { ...params, category: category || undefined } })
    ]);

    let combined = [
      ...incomeRes.data.map((i) => ({ ...i, type: 'income' })),
      ...expenseRes.data.map((e) => ({ ...e, type: 'expense' }))
    ];

    if (sortBy === 'date-desc') combined.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'date-asc') combined.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === 'amount-desc') combined.sort((a, b) => b.amount - a.amount);
    if (sortBy === 'amount-asc') combined.sort((a, b) => a.amount - b.amount);

    setTransactions(combined);
  };

  useEffect(() => { load(); }, [filterType, category, startDate, endDate, sortBy]);

  return (
    <div className="page">
      <h1>Transaction History</h1>

      <div className="filters-bar">
        <div>
          <label>Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        {filterType !== 'income' && (
          <div>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        )}
        <div>
          <label>From</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>To</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="empty-state">No transactions match these filters.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category / Source</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={`${t.type}-${t.id}`}>
                <td>{formatDate(t.date)}</td>
                <td className={t.type === 'income' ? 'text-positive' : 'text-negative'}>
                  {t.type === 'income' ? 'Income' : 'Expense'}
                </td>
                <td>{t.type === 'income' ? t.source : t.category}</td>
                <td>{t.description || '-'}</td>
                <td>{formatCurrency(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
