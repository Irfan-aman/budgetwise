const IncomeModel = require('../models/incomeModel');

exports.getAll = async (req, res, next) => {
  try {
    const { search, startDate, endDate } = req.query;
    const rows = await IncomeModel.findAllByUser(req.user.id, { search, startDate, endDate });
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { amount, source, description, date } = req.body;
    if (!amount || !source || !date) {
      return res.status(400).json({ message: 'Amount, source, and date are required.' });
    }
    const id = await IncomeModel.create(req.user.id, { amount, source, description, date });
    res.status(201).json({ message: 'Income added.', id });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await IncomeModel.findById(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ message: 'Income record not found.' });

    const { amount, source, description, date } = req.body;
    await IncomeModel.update(req.params.id, req.user.id, { amount, source, description, date });
    res.json({ message: 'Income updated.' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await IncomeModel.findById(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ message: 'Income record not found.' });

    await IncomeModel.delete(req.params.id, req.user.id);
    res.json({ message: 'Income deleted.' });
  } catch (err) {
    next(err);
  }
};
