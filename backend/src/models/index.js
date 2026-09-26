const { sequelize, Sequelize } = require('../config/database');

// Import model definition functions
const defineUser = require('./User');
const defineCategory = require('./Category');
const defineProduct = require('./Product');
const defineWarehouse = require('./Warehouse');
const defineLocation = require('./Location');
const defineInventoryBalance = require('./InventoryBalance');
const defineReceipt = require('./Receipt');
const defineReceiptItem = require('./ReceiptItem');
const defineDeliveryOrder = require('./DeliveryOrder');
const defineDeliveryItem = require('./DeliveryItem');
const defineInternalTransfer = require('./InternalTransfer');
const defineInternalTransferItem = require('./InternalTransferItem');
const defineInventoryAdjustment = require('./InventoryAdjustment');
const defineInventoryAdjustmentItem = require('./InventoryAdjustmentItem');
const defineStockLedgerEntry = require('./StockLedgerEntry');

// Initialize models
const User = defineUser(sequelize);
const Category = defineCategory(sequelize);
const Product = defineProduct(sequelize);
const Warehouse = defineWarehouse(sequelize);
const Location = defineLocation(sequelize);
const InventoryBalance = defineInventoryBalance(sequelize);
const Receipt = defineReceipt(sequelize);
const ReceiptItem = defineReceiptItem(sequelize);
const DeliveryOrder = defineDeliveryOrder(sequelize);
const DeliveryItem = defineDeliveryItem(sequelize);
const InternalTransfer = defineInternalTransfer(sequelize);
const InternalTransferItem = defineInternalTransferItem(sequelize);
const InventoryAdjustment = defineInventoryAdjustment(sequelize);
const InventoryAdjustmentItem = defineInventoryAdjustmentItem(sequelize);
const StockLedgerEntry = defineStockLedgerEntry(sequelize);

// ==========================================
// ASSOCIATIONS
// ==========================================

// Category <-> Product
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Warehouse <-> Location
Warehouse.hasMany(Location, { foreignKey: 'warehouseId', as: 'locations' });
Location.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });

// Product + Location <-> InventoryBalance
Product.hasMany(InventoryBalance, { foreignKey: 'productId', as: 'inventoryBalances' });
InventoryBalance.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Location.hasMany(InventoryBalance, { foreignKey: 'locationId', as: 'inventoryBalances' });
InventoryBalance.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });

// Receipt <-> ReceiptItem
Receipt.hasMany(ReceiptItem, { foreignKey: 'receiptId', as: 'items', onDelete: 'CASCADE' });
ReceiptItem.belongsTo(Receipt, { foreignKey: 'receiptId', as: 'receipt' });

ReceiptItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(ReceiptItem, { foreignKey: 'productId', as: 'receiptItems' });

ReceiptItem.belongsTo(Location, { foreignKey: 'destinationLocationId', as: 'destinationLocation' });
Location.hasMany(ReceiptItem, { foreignKey: 'destinationLocationId', as: 'receiptItems' });

Receipt.belongsTo(Location, { foreignKey: 'destinationLocationId', as: 'destinationLocation' });

// DeliveryOrder <-> DeliveryItem
DeliveryOrder.hasMany(DeliveryItem, { foreignKey: 'deliveryOrderId', as: 'items', onDelete: 'CASCADE' });
DeliveryItem.belongsTo(DeliveryOrder, { foreignKey: 'deliveryOrderId', as: 'deliveryOrder' });

DeliveryItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(DeliveryItem, { foreignKey: 'productId', as: 'deliveryItems' });

DeliveryItem.belongsTo(Location, { foreignKey: 'sourceLocationId', as: 'sourceLocation' });
Location.hasMany(DeliveryItem, { foreignKey: 'sourceLocationId', as: 'deliveryItems' });

DeliveryOrder.belongsTo(Location, { foreignKey: 'sourceLocationId', as: 'sourceLocation' });

// InternalTransfer <-> InternalTransferItem
InternalTransfer.hasMany(InternalTransferItem, { foreignKey: 'transferId', as: 'items', onDelete: 'CASCADE' });
InternalTransferItem.belongsTo(InternalTransfer, { foreignKey: 'transferId', as: 'transfer' });

InternalTransferItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(InternalTransferItem, { foreignKey: 'productId', as: 'transferItems' });

InternalTransfer.belongsTo(Location, { foreignKey: 'fromLocationId', as: 'fromLocation' });
InternalTransfer.belongsTo(Location, { foreignKey: 'toLocationId', as: 'toLocation' });

// InventoryAdjustment <-> InventoryAdjustmentItem
InventoryAdjustment.hasMany(InventoryAdjustmentItem, { foreignKey: 'adjustmentId', as: 'items', onDelete: 'CASCADE' });
InventoryAdjustmentItem.belongsTo(InventoryAdjustment, { foreignKey: 'adjustmentId', as: 'adjustment' });

InventoryAdjustmentItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(InventoryAdjustmentItem, { foreignKey: 'productId', as: 'adjustmentItems' });

InventoryAdjustment.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });

// StockLedgerEntry associations
StockLedgerEntry.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(StockLedgerEntry, { foreignKey: 'productId', as: 'ledgerEntries' });

StockLedgerEntry.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
Location.hasMany(StockLedgerEntry, { foreignKey: 'locationId', as: 'ledgerEntries' });

// User audit associations
User.hasMany(Receipt, { foreignKey: 'createdBy', as: 'receipts' });
Receipt.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(DeliveryOrder, { foreignKey: 'createdBy', as: 'deliveries' });
DeliveryOrder.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(InternalTransfer, { foreignKey: 'createdBy', as: 'transfers' });
InternalTransfer.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(InventoryAdjustment, { foreignKey: 'createdBy', as: 'adjustments' });
InventoryAdjustment.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(StockLedgerEntry, { foreignKey: 'createdBy', as: 'ledgerEntries' });
StockLedgerEntry.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Category,
  Product,
  Warehouse,
  Location,
  InventoryBalance,
  Receipt,
  ReceiptItem,
  DeliveryOrder,
  DeliveryItem,
  InternalTransfer,
  InternalTransferItem,
  InventoryAdjustment,
  InventoryAdjustmentItem,
  StockLedgerEntry
};
