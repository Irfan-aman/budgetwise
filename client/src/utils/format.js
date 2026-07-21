export function formatCurrency(amount) {
  const num = Number(amount || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const EXPENSE_CATEGORIES = [
  'Food', 'Rent', 'Shopping', 'Travel', 'Education', 'Health', 'Entertainment', 'Bills', 'Others'
];

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Rent: '#6366f1',
  Shopping: '#ec4899',
  Travel: '#06b6d4',
  Education: '#8b5cf6',
  Health: '#10b981',
  Entertainment: '#eab308',
  Bills: '#ef4444',
  Others: '#64748b'
};

export function monthName(monthNum) {
  const names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return names[monthNum - 1] || '';
}
