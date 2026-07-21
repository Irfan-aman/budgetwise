const { pool } = require('../config/db');

const IncomeModel = {
  async create(userId, { amount, source, description, date }) {
    const [result] = await pool.query(
      'INSERT INTO income (user_id, amount, source, description, date) VALUES (?, ?, ?, ?, ?)',
      [userId, amount, source, description || null, date]
    );
    return result.insertId;
  },

  async findAllByUser(userId, { search, startDate, endDate } = {}) {
    let query = 'SELECT * FROM income WHERE user_id = ?';
    const params = [userId];

    if (search) {
      query += ' AND (source LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
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
      'SELECT * FROM income WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  },

  async update(id, userId, { amount, source, description, date }) {
    await pool.query(
      'UPDATE income SET amount = ?, source = ?, description = ?, date = ? WHERE id = ? AND user_id = ?',
      [amount, source, description || null, date, id, userId]
    );
  },

  async delete(id, userId) {
    await pool.query('DELETE FROM income WHERE id = ? AND user_id = ?', [id, userId]);
  },

  async getTotalByUser(userId, month, year) {
    const [rows] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM income WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?',
      [userId, month, year]
    );
    return Number(rows[0].total);
  }
};

module.exports = IncomeModel;
