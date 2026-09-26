const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT, 10) || 3306;
const dbName = process.env.DB_NAME || 'stocksense_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? (msg) => console.log(`[Sequelize] ${msg}`) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: false
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[DB] Successfully connected to MySQL database: ${dbName} on ${dbHost}:${dbPort}`);
    return true;
  } catch (error) {
    console.error(`[DB Error] Unable to connect to MySQL database (${dbName}):`, error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  Sequelize,
  testConnection
};
