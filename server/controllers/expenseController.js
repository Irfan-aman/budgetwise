const ExpenseModel = require('../models/expenseModel');

const VALID_CATEGORIES = ['Food', 'Rent', 'Shopping', 'Travel', 'Education', 'Health', 'Entertainment', 'Bills', 'Others'];

exports.getAll = async (req, res, next) => {
  try {
    const { search, category, startDate, endDate } = req.query;
    const rows = await ExpenseModel.findAllByUser(req.user.id, { search, category, startDate, endDate });
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { category, amount, description, date } = req.body;
    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Amount, category, and date are required.' });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }
    const id = await ExpenseModel.create(req.user.id, { category, amount, description, date });
    res.status(201).json({ message: 'Expense added.', id });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await ExpenseModel.findById(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ message: 'Expense record not found.' });

    const { category, amount, description, date } = req.body;
    await ExpenseModel.update(req.params.id, req.user.id, { category, amount, description, date });
    res.json({ message: 'Expense updated.' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await ExpenseModel.findById(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ message: 'Expense record not found.' });

    await ExpenseModel.delete(req.params.id, req.user.id);
    res.json({ message: 'Expense deleted.' });
  } catch (err) {
    next(err);
  }
};
