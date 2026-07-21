import { useEffect, useState } from 'react';
import api from '../services/api';
import TransactionTable from '../components/TransactionTable';
import { EXPENSE_CATEGORIES } from '../utils/format';

const emptyForm = { amount: '', category: EXPENSE_CATEGORIES[0], description: '', date: '' };

export default function Expense() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [error, setError] = useState('');

  const load = async (searchTerm = '', category = '') => {
    const { data } = await api.get('/expense', { params: { search: searchTerm, category } });
    setRows(data);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/expense/${editingId}`, form);
      } else {
        await api.post('/expense', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load(search, categoryFilter);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save expense.');
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      amount: row.amount,
      category: row.category,
      description: row.description || '',
      date: row.date?.slice(0, 10)
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense record?')) return;
    await api.delete(`/expense/${id}`);
    load(search, categoryFilter);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    load(search, categoryFilter);
  };

  return (
    <div className="page">
      <h1>Expense</h1>

      <form className="inline-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <div className="form-row">
          <div>
            <label>Amount</label>
            <input type="number" name="amount" step="0.01" value={form.amount} onChange={handleChange} required />
          </div>
          <div>
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              {EXPENSE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </div>
          <div>
            <label>Description</label>
            <input type="text" name="description" value={form.description} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="btn-primary">{editingId ? 'Update Expense' : 'Add Expense'}</button>
        {editingId && (
          <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
            Cancel
          </button>
        )}
      </form>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by category or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button type="submit" className="btn-secondary">Search</button>
      </form>

      <TransactionTable rows={rows} type="expense" onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
