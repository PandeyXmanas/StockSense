const { InventoryBalance, StockLedgerEntry, sequelize } = require('../models');

const receiveStock = async (receiptId, items, userId) => {
    const transaction = await sequelize.transaction();
    try {
        for (const item of items) {
            const { productId, destinationLocationId, quantity } = item;
            if (quantity <= 0) throw new Error('Quantity must be positive');
            
            let balance = await InventoryBalance.findOne({
                where: { productId, locationId: destinationLocationId },
                transaction, lock: true 
            });
            
            if (!balance) {
                balance = await InventoryBalance.create({
                    productId, locationId: destinationLocationId, quantity: 0
                }, { transaction });
            }
            await balance.increment('quantity', { by: quantity, transaction });
            
            await StockLedgerEntry.create({
                productId, locationId: destinationLocationId, movementType: 'RECEIPT',
                quantityDelta: quantity, referenceType: 'Receipt', referenceId: receiptId, createdBy: userId
            }, { transaction });
        }
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const deliverStock = async (deliveryId, items, userId) => {
    const transaction = await sequelize.transaction();
    try {
        for (const item of items) {
            const { productId, sourceLocationId, quantity } = item;
            if (quantity <= 0) throw new Error('Quantity must be positive');
            
            const balance = await InventoryBalance.findOne({
                where: { productId, locationId: sourceLocationId },
                transaction, lock: true
            });
            
            if (!balance || balance.quantity < quantity) {
                throw new Error(`Insufficient stock for product ${productId}`);
            }
            await balance.decrement('quantity', { by: quantity, transaction });
            
            await StockLedgerEntry.create({
                productId, locationId: sourceLocationId, movementType: 'DELIVERY',
                quantityDelta: -quantity, referenceType: 'DeliveryOrder', referenceId: deliveryId, createdBy: userId
            }, { transaction });
        }
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const transferStock = async (transferId, items, fromLocationId, toLocationId, userId) => {
    const transaction = await sequelize.transaction();
    try {
        if (fromLocationId === toLocationId) throw new Error('Locations must be different');
        
        for (const item of items) {
            const { productId, quantity } = item;
            if (quantity <= 0) throw new Error('Quantity must be positive');
            
            const sourceBalance = await InventoryBalance.findOne({
                where: { productId, locationId: fromLocationId },
                transaction, lock: true
            });
            
            if (!sourceBalance || sourceBalance.quantity < quantity) {
                throw new Error(`Insufficient stock at source`);
            }
            await sourceBalance.decrement('quantity', { by: quantity, transaction });
            
            let destBalance = await InventoryBalance.findOne({
                where: { productId, locationId: toLocationId },
                transaction, lock: true
            });
            
            if (!destBalance) {
                destBalance = await InventoryBalance.create({
                    productId, locationId: toLocationId, quantity: 0
                }, { transaction });
            }
            await destBalance.increment('quantity', { by: quantity, transaction });
            
            await StockLedgerEntry.create({
                productId, locationId: fromLocationId, movementType: 'TRANSFER_OUT',
                quantityDelta: -quantity, referenceType: 'InternalTransfer', referenceId: transferId, createdBy: userId
            }, { transaction });
            
            await StockLedgerEntry.create({
                productId, locationId: toLocationId, movementType: 'TRANSFER_IN',
                quantityDelta: quantity, referenceType: 'InternalTransfer', referenceId: transferId, createdBy: userId
            }, { transaction });
        }
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const adjustStock = async (adjustmentId, productId, locationId, countedQuantity, recordedQuantity, userId) => {
    const transaction = await sequelize.transaction();
    try {
        if (countedQuantity < 0) throw new Error('Quantity cannot be negative');
        const delta = countedQuantity - recordedQuantity;
        
        let balance = await InventoryBalance.findOne({
            where: { productId, locationId }, transaction, lock: true
        });
        
        if (!balance) {
            balance = await InventoryBalance.create({
                productId, locationId, quantity: countedQuantity
            }, { transaction });
        } else {
            await balance.update({ quantity: countedQuantity }, { transaction });
        }
        
        await StockLedgerEntry.create({
            productId, locationId, movementType: 'ADJUSTMENT', quantityDelta: delta,
            referenceType: 'InventoryAdjustment', referenceId: adjustmentId, createdBy: userId
        }, { transaction });
        
        await transaction.commit();
        return { delta, newQuantity: countedQuantity };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = { receiveStock, deliverStock, transferStock, adjustStock };
