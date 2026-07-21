const app = require('./app');
const { testConnection } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`BudgetWise API running on port ${PORT}`);
  await testConnection();
});
