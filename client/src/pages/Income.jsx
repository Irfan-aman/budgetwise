import { useEffect, useState } from 'react';
import api from '../services/api';
import TransactionTable from '../components/TransactionTable';

const emptyForm = { amount: '', source: '', description: '', date: '' };

export default function Income() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = async (searchTerm = '') => {
    const { data } = await api.get('/income', { params: { search: searchTerm } });
    setRows(data);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/income/${editingId}`, form);
      } else {
        await api.post('/income', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save income.');
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      amount: row.amount,
      source: row.source,
      description: row.description || '',
      date: row.date?.slice(0, 10)
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this income record?')) return;
    await api.delete(`/income/${id}`);
    load(search);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  return (
    <div className="page">
      <h1>Income</h1>

      <form className="inline-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <div className="form-row">
          <div>
            <label>Amount</label>
            <input type="number" name="amount" step="0.01" value={form.amount} onChange={handleChange} required />
          </div>
          <div>
            <label>Source</label>
            <input type="text" name="source" value={form.source} onChange={handleChange} required />
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
        <button type="submit" className="btn-primary">{editingId ? 'Update Income' : 'Add Income'}</button>
        {editingId && (
          <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
            Cancel
          </button>
        )}
      </form>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by source or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-secondary">Search</button>
      </form>

      <TransactionTable rows={rows} type="income" onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
