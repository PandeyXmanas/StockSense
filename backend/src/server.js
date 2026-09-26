const app = require('./app');
const { testConnection } = require('./config/database');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Verify database connection
  await testConnection();

  app.listen(PORT, () => {
    console.log(`[StockSense Backend] Server is running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
