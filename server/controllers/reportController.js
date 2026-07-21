const IncomeModel = require('../models/incomeModel');
const ExpenseModel = require('../models/expenseModel');

function toCSV(rows, columns) {
  const header = columns.join(',');
  const lines = rows.map((row) =>
    columns.map((col) => {
      const val = row[col] === null || row[col] === undefined ? '' : String(row[col]).replace(/"/g, '""');
      return /[",\n]/.test(val) ? `"${val}"` : val;
    }).join(',')
  );
  return [header, ...lines].join('\n');
}

exports.monthlySummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const [totalIncome, totalExpense, byCategory] = await Promise.all([
      IncomeModel.getTotalByUser(userId, month, year),
      ExpenseModel.getTotalByUser(userId, month, year),
      ExpenseModel.getByCategoryForMonth(userId, month, year)
    ]);

    res.json({
      month,
      year,
      totalIncome,
      totalExpense,
      savings: totalIncome - totalExpense,
      byCategory: byCategory.map((c) => ({ category: c.category, total: Number(c.total) }))
    });
  } catch (err) {
    next(err);
  }
};

exports.incomeReportCSV = async (req, res, next) => {
  try {
    const rows = await IncomeModel.findAllByUser(req.user.id, {
      startDate: req.query.startDate,
      endDate: req.query.endDate
    });
    const csv = toCSV(rows, ['id', 'amount', 'source', 'description', 'date']);
    res.header('Content-Type', 'text/csv');
    res.attachment('income-report.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

exports.expenseReportCSV = async (req, res, next) => {
  try {
    const rows = await ExpenseModel.findAllByUser(req.user.id, {
      startDate: req.query.startDate,
      endDate: req.query.endDate
    });
    const csv = toCSV(rows, ['id', 'category', 'amount', 'description', 'date']);
    res.header('Content-Type', 'text/csv');
    res.attachment('expense-report.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
