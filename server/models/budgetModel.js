const { pool } = require('../config/db');

const BudgetModel = {
  async create(userId, { category, budget_amount, month, year }) {
    const [result] = await pool.query(
      `INSERT INTO budgets (user_id, category, budget_amount, month, year)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE budget_amount = VALUES(budget_amount)`,
      [userId, category, budget_amount, month, year]
    );
    return result.insertId;
  },

  async findAllByUser(userId, month, year) {
    const [rows] = await pool.query(
      'SELECT * FROM budgets WHERE user_id = ? AND month = ? AND year = ?',
      [userId, month, year]
    );
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM budgets WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  },

  async update(id, userId, { budget_amount }) {
    await pool.query(
      'UPDATE budgets SET budget_amount = ? WHERE id = ? AND user_id = ?',
      [budget_amount, id, userId]
    );
  },

  async delete(id, userId) {
    await pool.query('DELETE FROM budgets WHERE id = ? AND user_id = ?', [id, userId]);
  }
};

module.exports = BudgetModel;
