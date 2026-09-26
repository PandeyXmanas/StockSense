const { StockLedgerEntry } = require('../models');

const getLedgerHistory = async (filters = {}) => {
    const query = { where: {} };
    if (filters.productId) query.where.productId = filters.productId;
    if (filters.locationId) query.where.locationId = filters.locationId;
    if (filters.movementType) query.where.movementType = filters.movementType;
    
    query.order = [['createdAt', 'DESC']];
    return await StockLedgerEntry.findAll(query);
};

module.exports = { getLedgerHistory };
