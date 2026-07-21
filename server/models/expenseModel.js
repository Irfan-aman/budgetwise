const { pool } = require('../config/db');

const ExpenseModel = {
  async create(userId, { category, amount, description, date }) {
    const [result] = await pool.query(
      'INSERT INTO expenses (user_id, category, amount, description, date) VALUES (?, ?, ?, ?, ?)',
      [userId, category, amount, description || null, date]
    );
    return result.insertId;
  },

  async findAllByUser(userId, { search, category, startDate, endDate } = {}) {
    let query = 'SELECT * FROM expenses WHERE user_id = ?';
    const params = [userId];

    if (search) {
      query += ' AND (category LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }
    query += ' ORDER BY date DESC, id DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  },

  async update(id, userId, { category, amount, description, date }) {
    await pool.query(
      'UPDATE expenses SET category = ?, amount = ?, description = ?, date = ? WHERE id = ? AND user_id = ?',
      [category, amount, description || null, date, id, userId]
    );
  },

  async delete(id, userId) {
    await pool.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
  },

  async getTotalByUser(userId, month, year) {
    const [rows] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?',
      [userId, month, year]
    );
    return Number(rows[0].total);
  },

  async getByCategoryForMonth(userId, month, year) {
    const [rows] = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) AS total
       FROM expenses
       WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
       GROUP BY category`,
      [userId, month, year]
    );
    return rows;
  },

  async getDailyTotalsForMonth(userId, month, year) {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS day, COALESCE(SUM(amount), 0) AS total
       FROM expenses
       WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
       GROUP BY day
       ORDER BY day ASC`,
      [userId, month, year]
    );
    return rows;
  },

  async getMonthlyTotalsForYear(userId, year) {
    const [rows] = await pool.query(
      `SELECT MONTH(date) AS month, COALESCE(SUM(amount), 0) AS total
       FROM expenses
       WHERE user_id = ? AND YEAR(date) = ?
       GROUP BY month
       ORDER BY month ASC`,
      [userId, year]
    );
    return rows;
  }
};

module.exports = ExpenseModel;
