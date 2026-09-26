const {
  InventoryBalance,
  StockLedgerEntry,
  sequelize
} = require('../models');
const { withTransaction } = require('./transaction');

/**
 * Helper to get or create InventoryBalance row with pessimistic row locking
 */
const getOrCreateBalance = async (productId, locationId, transaction, lock = true) => {
  let balance = await InventoryBalance.findOne({
    where: { productId, locationId },
    transaction,
    lock: lock ? transaction.LOCK.UPDATE : false
  });

  if (!balance) {
    balance = await InventoryBalance.create(
      { productId, locationId, quantity: 0 },
      { transaction }
    );
  }
  return balance;
};

/**
 * Receive stock at a specific location
 */
const receiveStock = async ({
  productId,
  locationId,
  quantity,
  referenceId,
  referenceNumber = null,
  createdBy = null
}, externalTransaction = null) => {
  if (quantity <= 0) {
    throw new Error('Received quantity must be greater than zero.');
  }

  const execute = async (t) => {
    const balance = await getOrCreateBalance(productId, locationId, t, true);
    balance.quantity += Number(quantity);
    await balance.save({ transaction: t });

    const ledger = await StockLedgerEntry.create({
      productId,
      locationId,
      movementType: 'RECEIPT',
      quantityDelta: Number(quantity),
      referenceType: 'RECEIPT',
      referenceId,
      referenceNumber,
      createdBy,
      createdAt: new Date()
    }, { transaction: t });

    return { balance, ledger };
  };

  return externalTransaction ? execute(externalTransaction) : withTransaction(execute);
};

/**
 * Deliver stock from a specific location
 */
const deliverStock = async ({
  productId,
  locationId,
  quantity,
  referenceId,
  referenceNumber = null,
  createdBy = null
}, externalTransaction = null) => {
  if (quantity <= 0) {
    throw new Error('Delivered quantity must be greater than zero.');
  }

  const execute = async (t) => {
    const balance = await getOrCreateBalance(productId, locationId, t, true);
    if (balance.quantity < quantity) {
      throw new Error(`Insufficient stock at location. Available: ${balance.quantity}, requested: ${quantity}.`);
    }

    balance.quantity -= Number(quantity);
    await balance.save({ transaction: t });

    const ledger = await StockLedgerEntry.create({
      productId,
      locationId,
      movementType: 'DELIVERY',
      quantityDelta: -Number(quantity),
      referenceType: 'DELIVERY',
      referenceId,
      referenceNumber,
      createdBy,
      createdAt: new Date()
    }, { transaction: t });

    return { balance, ledger };
  };

  return externalTransaction ? execute(externalTransaction) : withTransaction(execute);
};

/**
 * Internal Transfer of stock between two locations
 */
const transferStock = async ({
  productId,
  fromLocationId,
  toLocationId,
  quantity,
  referenceId,
  referenceNumber = null,
  createdBy = null
}, externalTransaction = null) => {
  if (quantity <= 0) {
    throw new Error('Transfer quantity must be greater than zero.');
  }
  if (fromLocationId === toLocationId) {
    throw new Error('Source and destination locations must be different.');
  }

  const execute = async (t) => {
    // 1. Lock and validate source balance
    const sourceBalance = await getOrCreateBalance(productId, fromLocationId, t, true);
    if (sourceBalance.quantity < quantity) {
      throw new Error(`Insufficient stock at source location. Available: ${sourceBalance.quantity}, requested: ${quantity}.`);
    }

    // 2. Lock destination balance
    const destBalance = await getOrCreateBalance(productId, toLocationId, t, true);

    // 3. Atomically update balances
    sourceBalance.quantity -= Number(quantity);
    await sourceBalance.save({ transaction: t });

    destBalance.quantity += Number(quantity);
    await destBalance.save({ transaction: t });

    // 4. Create source ledger entry (TRANSFER_OUT)
    const ledgerOut = await StockLedgerEntry.create({
      productId,
      locationId: fromLocationId,
      movementType: 'TRANSFER_OUT',
      quantityDelta: -Number(quantity),
      referenceType: 'TRANSFER',
      referenceId,
      referenceNumber,
      createdBy,
      createdAt: new Date()
    }, { transaction: t });

    // 5. Create destination ledger entry (TRANSFER_IN)
    const ledgerIn = await StockLedgerEntry.create({
      productId,
      locationId: toLocationId,
      movementType: 'TRANSFER_IN',
      quantityDelta: Number(quantity),
      referenceType: 'TRANSFER',
      referenceId,
      referenceNumber,
      createdBy,
      createdAt: new Date()
    }, { transaction: t });

    return { sourceBalance, destBalance, ledgerOut, ledgerIn };
  };

  return externalTransaction ? execute(externalTransaction) : withTransaction(execute);
};

/**
 * Adjust stock at a location based on physical count
 */
const adjustStock = async ({
  productId,
  locationId,
  countedQuantity,
  referenceId,
  referenceNumber = null,
  createdBy = null
}, externalTransaction = null) => {
  if (countedQuantity < 0) {
    throw new Error('Counted quantity cannot be negative.');
  }

  const execute = async (t) => {
    const balance = await getOrCreateBalance(productId, locationId, t, true);
    const previousQuantity = balance.quantity;
    const deltaQuantity = Number(countedQuantity) - previousQuantity;

    balance.quantity = Number(countedQuantity);
    await balance.save({ transaction: t });

    const ledger = await StockLedgerEntry.create({
      productId,
      locationId,
      movementType: 'ADJUSTMENT',
      quantityDelta: deltaQuantity,
      referenceType: 'ADJUSTMENT',
      referenceId,
      referenceNumber,
      createdBy,
      createdAt: new Date()
    }, { transaction: t });

    return { balance, ledger, previousQuantity, deltaQuantity };
  };

  return externalTransaction ? execute(externalTransaction) : withTransaction(execute);
};

module.exports = {
  getOrCreateBalance,
  receiveStock,
  deliverStock,
  transferStock,
  adjustStock
};
