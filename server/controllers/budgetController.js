const BudgetModel = require('../models/budgetModel');

exports.getAll = async (req, res, next) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const rows = await BudgetModel.findAllByUser(req.user.id, month, year);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { category, budget_amount, month, year } = req.body;
    if (!category || !budget_amount || !month || !year) {
      return res.status(400).json({ message: 'Category, budget_amount, month, and year are required.' });
    }
    const id = await BudgetModel.create(req.user.id, { category, budget_amount, month, year });
    res.status(201).json({ message: 'Budget set.', id });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await BudgetModel.findById(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ message: 'Budget not found.' });

    const { budget_amount } = req.body;
    await BudgetModel.update(req.params.id, req.user.id, { budget_amount });
    res.json({ message: 'Budget updated.' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await BudgetModel.findById(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ message: 'Budget not found.' });

    await BudgetModel.delete(req.params.id, req.user.id);
    res.json({ message: 'Budget deleted.' });
  } catch (err) {
    next(err);
  }
};
