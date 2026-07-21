const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { monthlySummary, incomeReportCSV, expenseReportCSV } = require('../controllers/reportController');

router.use(authenticate);
router.get('/summary', monthlySummary);
router.get('/income/csv', incomeReportCSV);
router.get('/expense/csv', expenseReportCSV);

module.exports = router;
