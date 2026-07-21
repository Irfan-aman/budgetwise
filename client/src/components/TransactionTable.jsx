import { formatCurrency, formatDate } from '../utils/format';

export default function TransactionTable({ rows, type, onEdit, onDelete }) {
  if (!rows || rows.length === 0) {
    return <p className="empty-state">No records found.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Date</th>
          {type === 'expense' && <th>Category</th>}
          {type === 'income' && <th>Source</th>}
          <th>Description</th>
          <th>Amount</th>
          {(onEdit || onDelete) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{formatDate(row.date)}</td>
            {type === 'expense' && <td>{row.category}</td>}
            {type === 'income' && <td>{row.source}</td>}
            <td>{row.description || '-'}</td>
            <td>{formatCurrency(row.amount)}</td>
            {(onEdit || onDelete) && (
              <td className="actions-cell">
                {onEdit && <button className="btn-small" onClick={() => onEdit(row)}>Edit</button>}
                {onDelete && <button className="btn-small btn-danger" onClick={() => onDelete(row.id)}>Delete</button>}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
