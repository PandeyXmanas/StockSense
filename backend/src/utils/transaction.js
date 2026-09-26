const { sequelize } = require('../config/database');

/**
 * Execute a callback inside a managed database transaction.
 * Automatically commits on successful completion, or rolls back if an error occurs.
 *
 * @param {Function} callback - Async function that receives the transaction `(t) => Promise<any>`
 * @param {Object} [options] - Optional Sequelize transaction options (e.g., isolationLevel)
 * @returns {Promise<any>}
 */
const withTransaction = async (callback, options = {}) => {
  return await sequelize.transaction(options, async (t) => {
    return await callback(t);
  });
};

/**
 * Create an unmanaged transaction for advanced multi-step workflows.
 * Caller MUST explicitly call `await t.commit()` or `await t.rollback()`.
 *
 * @param {Object} [options] - Optional Sequelize transaction options
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (options = {}) => {
  return await sequelize.transaction(options);
};

module.exports = {
  withTransaction,
  createTransaction
};
