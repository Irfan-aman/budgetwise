const IncomeModel = require('../models/incomeModel');
const ExpenseModel = require('../models/expenseModel');
const BudgetModel = require('../models/budgetModel');

function getPrevMonthYear(month, year) {
  if (month === 1) return { prevMonth: 12, prevYear: year - 1 };
  return { prevMonth: month - 1, prevYear: year };
}

// Rule-based "Smart Budget Insights" - no AI, pure logic on the numbers we already have.
function buildInsights({ totalIncome, totalExpense, byCategory, prevByCategory, budgets, daysElapsed }) {
  const insights = [];
  const savings = totalIncome - totalExpense;

  // Highest spending category
  if (byCategory.length > 0) {
    const top = [...byCategory].sort((a, b) => b.total - a.total)[0];
    insights.push(`Highest spending category is ${top.category} (₹${top.total.toFixed(2)}).`);

    // Category share of total expense
    if (totalExpense > 0) {
      const share = (top.total / totalExpense) * 100;
      insights.push(`${top.category} accounts for ${share.toFixed(0)}% of total expenses.`);
    }
  }

  // Category month-over-month comparison
  byCategory.forEach((cur) => {
    const prev = prevByCategory.find((p) => p.category === cur.category);
    if (prev && prev.total > 0) {
      const change = ((cur.total - prev.total) / prev.total) * 100;
      if (Math.abs(change) >= 15) {
        const direction = change > 0 ? 'more' : 'less';
        insights.push(`You spent ${Math.abs(change).toFixed(0)}% ${direction} on ${cur.category} this month compared to last month.`);
      }
    }
  });

  // Budget exceeded checks
  budgets.forEach((b) => {
    const spent = byCategory.find((c) => c.category === b.category)?.total || 0;
    if (spent > Number(b.budget_amount)) {
      insights.push(`${b.category} budget exceeded by ₹${(spent - b.budget_amount).toFixed(2)}.`);
    } else if (b.budget_amount > 0 && spent / b.budget_amount >= 0.9) {
      insights.push(`${b.category} budget is almost used up (${((spent / b.budget_amount) * 100).toFixed(0)}%).`);
    }
  });

  // Savings
  if (savings >= 0) {
    insights.push(`You saved ₹${savings.toFixed(2)} this month.`);
  } else {
    insights.push(`You overspent by ₹${Math.abs(savings).toFixed(2)} this month.`);
  }

  // Average daily expense
  if (daysElapsed > 0) {
    const avgDaily = totalExpense / daysElapsed;
    insights.push(`Average daily expense is ₹${avgDaily.toFixed(2)}.`);
  }

  return insights;
};

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();
    const { prevMonth, prevYear } = getPrevMonthYear(month, year);

    const [totalIncome, totalExpense, byCategory, prevByCategory, budgets] = await Promise.all([
      IncomeModel.getTotalByUser(userId, month, year),
      ExpenseModel.getTotalByUser(userId, month, year),
      ExpenseModel.getByCategoryForMonth(userId, month, year),
      ExpenseModel.getByCategoryForMonth(userId, prevMonth, prevYear),
      BudgetModel.findAllByUser(userId, month, year)
    ]);

    const byCategoryNum = byCategory.map((c) => ({ category: c.category, total: Number(c.total) }));
    const prevByCategoryNum = prevByCategory.map((c) => ({ category: c.category, total: Number(c.total) }));

    const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();
    const daysElapsed = isCurrentMonth ? now.getDate() : new Date(year, month, 0).getDate();

    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.budget_amount), 0);
    const remainingBudget = totalBudget - totalExpense;
    const remainingBalance = totalIncome - totalExpense;
    const savings = totalIncome - totalExpense;

    const insights = buildInsights({
      totalIncome,
      totalExpense,
      byCategory: byCategoryNum,
      prevByCategory: prevByCategoryNum,
      budgets,
      daysElapsed
    });

    const [recentIncome, recentExpenses] = await Promise.all([
      IncomeModel.findAllByUser(userId),
      ExpenseModel.findAllByUser(userId)
    ]);

    const recentTransactions = [
      ...recentIncome.map((i) => ({ ...i, type: 'income' })),
      ...recentExpenses.map((e) => ({ ...e, type: 'expense' }))
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json({
      month,
      year,
      totalIncome,
      totalExpense,
      remainingBalance,
      totalBudget,
      remainingBudget,
      savings,
      byCategory: byCategoryNum,
      recentTransactions,
      insights
    });
  } catch (err) {
    next(err);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const [byCategory, dailyTotals, monthlyTotals, totalIncome, totalExpense] = await Promise.all([
      ExpenseModel.getByCategoryForMonth(userId, month, year),
      ExpenseModel.getDailyTotalsForMonth(userId, month, year),
      ExpenseModel.getMonthlyTotalsForYear(userId, year),
      IncomeModel.getTotalByUser(userId, month, year),
      ExpenseModel.getTotalByUser(userId, month, year)
    ]);

    res.json({
      month,
      year,
      totalIncome,
      totalExpense,
      remainingBudget: totalIncome - totalExpense,
      savings: totalIncome - totalExpense,
      pieChart: byCategory.map((c) => ({ category: c.category, total: Number(c.total) })),
      barChart: byCategory.map((c) => ({ category: c.category, total: Number(c.total) })),
      lineChart: dailyTotals.map((d) => ({ day: d.day, total: Number(d.total) })),
      yearlyTrend: monthlyTotals.map((m) => ({ month: m.month, total: Number(m.total) }))
    });
  } catch (err) {
    next(err);
  }
};
