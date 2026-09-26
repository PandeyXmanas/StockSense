// src/models/index.js
// This is a stub for the Sequelize models owned by Member 3.
// The backend logic requires a 'User' model with email, name, passwordHash, role fields.
// And it should implement standard Sequelize methods like findOne, create, update.

const stubModel = {
    findOne: async () => { throw new Error('Database models not yet implemented by Member 3'); },
    findAll: async () => { throw new Error('Database models not yet implemented by Member 3'); },
    findByPk: async () => { throw new Error('Database models not yet implemented by Member 3'); },
    create: async () => { throw new Error('Database models not yet implemented by Member 3'); },
    update: async () => { throw new Error('Database models not yet implemented by Member 3'); },
    increment: async () => { throw new Error('Database models not yet implemented by Member 3'); },
    decrement: async () => { throw new Error('Database models not yet implemented by Member 3'); }
};

const stubSequelize = {
    transaction: async () => {
        return {
            commit: async () => {},
            rollback: async () => {}
        };
    }
};

module.exports = {
    User: stubModel,
    Product: stubModel,
    Category: stubModel,
    Warehouse: stubModel,
    Location: stubModel,
    InventoryBalance: stubModel,
    StockLedgerEntry: stubModel,
    Receipt: stubModel,
    DeliveryOrder: stubModel,
    InternalTransfer: stubModel,
    InventoryAdjustment: stubModel,
    sequelize: stubSequelize
};
