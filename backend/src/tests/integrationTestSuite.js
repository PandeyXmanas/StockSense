/**
 * StockSense — Integration & QA Automated Test Suite (Member 4)
 * 
 * Verifies core inventory invariants, transaction integrity, overdraw rules,
 * stock operations, and ledger auditability.
 */

const { inventoryService } = require('../services/inventoryService');
const {
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
  StockLedgerEntry,
  sequelize
} = require('../models');

async function runQaTestSuite() {
  console.log('====================================================');
  console.log('StockSense — Integration & QA Test Suite Execution');
  console.log('====================================================');

  try {
    await sequelize.authenticate();
    console.log('✓ Database connection authenticated.');

    // Sync schema in test mode
    await sequelize.sync({ force: true });
    console.log('✓ Test Database schema reset and synchronized.');

    // Setup Test Fixtures
    const user = await User.create({
      name: 'QA Auditor',
      email: 'qa@stocksense.com',
      passwordHash: '$2b$10$hashedpassword',
      role: 'Inventory Manager'
    });

    const category = await Category.create({ name: 'Raw Materials' });

    const product = await Product.create({
      name: 'Steel Rods 10mm',
      sku: 'STL-ROD-10',
      categoryId: category.id,
      unitOfMeasure: 'pcs',
      minReorderLevel: 10
    });

    const warehouse = await Warehouse.create({
      name: 'Central Warehouse',
      code: 'WH-MAIN',
      address: '100 Industrial Parkway'
    });

    const locA = await Location.create({
      warehouseId: warehouse.id,
      name: 'Rack A1',
      code: 'RACK-A1'
    });

    const locB = await Location.create({
      warehouseId: warehouse.id,
      name: 'Rack B2',
      code: 'RACK-B2'
    });

    console.log('✓ Fixtures initialized: User, Category, Product, Warehouse, Locations (A1 & B2).');

    // ----------------------------------------------------
    // TEST 1 — RECEIPT (Initial: 0 + 30 -> 30)
    // ----------------------------------------------------
    console.log('\n--- Running TEST 1: Receipt Stock Increase ---');
    const receiptResult = await inventoryService.receiveStock({
      productId: product.id,
      destinationLocationId: locA.id,
      quantity: 30,
      referenceType: 'Receipt',
      referenceId: 'REC-001',
      userId: user.id
    });

    const balA1_afterReceipt = await InventoryBalance.findOne({
      where: { productId: product.id, locationId: locA.id }
    });

    if (balA1_afterReceipt.quantity !== 30) {
      throw new Error(`TEST 1 FAILED: Expected stock 30 at Loc A1, got ${balA1_afterReceipt.quantity}`);
    }

    const ledgerReceipt = await StockLedgerEntry.findOne({
      where: { productId: product.id, movementType: 'RECEIPT' }
    });

    if (!ledgerReceipt || ledgerReceipt.quantityDelta !== 30) {
      throw new Error('TEST 1 FAILED: Missing or incorrect RECEIPT stock ledger entry.');
    }
    console.log('✓ TEST 1 PASSED: Stock increased by 30 at Rack A1 and logged in Stock Ledger.');

    // ----------------------------------------------------
    // TEST 2 — DELIVERY (Initial: 30 - 15 -> 15)
    // ----------------------------------------------------
    console.log('\n--- Running TEST 2: Delivery Stock Decrease ---');
    await inventoryService.deliverStock({
      productId: product.id,
      sourceLocationId: locA.id,
      quantity: 15,
      referenceType: 'DeliveryOrder',
      referenceId: 'DEL-001',
      userId: user.id
    });

    const balA1_afterDelivery = await InventoryBalance.findOne({
      where: { productId: product.id, locationId: locA.id }
    });

    if (balA1_afterDelivery.quantity !== 15) {
      throw new Error(`TEST 2 FAILED: Expected stock 15 at Loc A1, got ${balA1_afterDelivery.quantity}`);
    }

    const ledgerDelivery = await StockLedgerEntry.findOne({
      where: { productId: product.id, movementType: 'DELIVERY' }
    });

    if (!ledgerDelivery || ledgerDelivery.quantityDelta !== -15) {
      throw new Error('TEST 2 FAILED: Missing or incorrect DELIVERY stock ledger entry.');
    }
    console.log('✓ TEST 2 PASSED: Stock decreased by 15 at Rack A1 and logged in Stock Ledger.');

    // ----------------------------------------------------
    // TEST 3 — DELIVERY OVERDRAW PREVENTION
    // ----------------------------------------------------
    console.log('\n--- Running TEST 3: Delivery Overdraw Prevention ---');
    let overdrawPrevented = false;
    try {
      await inventoryService.deliverStock({
        productId: product.id,
        sourceLocationId: locA.id,
        quantity: 100, // Available is 15
        referenceType: 'DeliveryOrder',
        referenceId: 'DEL-002-OVERDRAW',
        userId: user.id
      });
    } catch (err) {
      overdrawPrevented = true;
    }

    if (!overdrawPrevented) {
      throw new Error('TEST 3 FAILED: System allowed delivery overdraw beyond available stock!');
    }

    const balA1_afterOverdrawAttempt = await InventoryBalance.findOne({
      where: { productId: product.id, locationId: locA.id }
    });

    if (balA1_afterOverdrawAttempt.quantity !== 15) {
      throw new Error('TEST 3 FAILED: Stock changed after rejected overdraw attempt!');
    }
    console.log('✓ TEST 3 PASSED: Overdraw attempt (100 > 15) was rejected and stock remained unchanged at 15.');

    // ----------------------------------------------------
    // TEST 4 — INTERNAL TRANSFER (Loc A: 15, Loc B: 0 -> Transfer 10 -> Loc A: 5, Loc B: 10, Total: 15)
    // ----------------------------------------------------
    console.log('\n--- Running TEST 4: Internal Transfer Between Locations ---');
    await inventoryService.transferStock({
      productId: product.id,
      fromLocationId: locA.id,
      toLocationId: locB.id,
      quantity: 10,
      referenceType: 'InternalTransfer',
      referenceId: 'TRN-001',
      userId: user.id
    });

    const balA1_afterTransfer = await InventoryBalance.findOne({
      where: { productId: product.id, locationId: locA.id }
    });

    const balB2_afterTransfer = await InventoryBalance.findOne({
      where: { productId: product.id, locationId: locB.id }
    });

    if (balA1_afterTransfer.quantity !== 5 || balB2_afterTransfer.quantity !== 10) {
      throw new Error(`TEST 4 FAILED: Transfer results incorrect (Loc A: ${balA1_afterTransfer.quantity}, Loc B: ${balB2_afterTransfer.quantity})`);
    }

    const totalStockAfterTransfer = balA1_afterTransfer.quantity + balB2_afterTransfer.quantity;
    if (totalStockAfterTransfer !== 15) {
      throw new Error(`TEST 4 FAILED: Total stock altered during transfer! Got ${totalStockAfterTransfer}`);
    }

    const ledgerTransferOut = await StockLedgerEntry.findOne({
      where: { productId: product.id, movementType: 'TRANSFER_OUT' }
    });
    const ledgerTransferIn = await StockLedgerEntry.findOne({
      where: { productId: product.id, movementType: 'TRANSFER_IN' }
    });

    if (!ledgerTransferOut || !ledgerTransferIn) {
      throw new Error('TEST 4 FAILED: Transfer ledger entries missing.');
    }
    console.log('✓ TEST 4 PASSED: 10 units transferred (Loc A1 = 5, Rack B2 = 10, Total = 15) with dual audit ledger entries.');

    // ----------------------------------------------------
    // TEST 5 — STOCK ADJUSTMENT (Recorded: 5 at Loc A1, Counted: 3 -> Delta: -2)
    // ----------------------------------------------------
    console.log('\n--- Running TEST 5: Inventory Stock Adjustment ---');
    await inventoryService.adjustStock({
      productId: product.id,
      locationId: locA.id,
      countedQuantity: 3,
      referenceType: 'InventoryAdjustment',
      referenceId: 'ADJ-001',
      userId: user.id
    });

    const balA1_afterAdjustment = await InventoryBalance.findOne({
      where: { productId: product.id, locationId: locA.id }
    });

    if (balA1_afterAdjustment.quantity !== 3) {
      throw new Error(`TEST 5 FAILED: Expected adjusted stock 3, got ${balA1_afterAdjustment.quantity}`);
    }

    const ledgerAdjustment = await StockLedgerEntry.findOne({
      where: { productId: product.id, movementType: 'ADJUSTMENT' }
    });

    if (!ledgerAdjustment || ledgerAdjustment.quantityDelta !== -2) {
      throw new Error('TEST 5 FAILED: Incorrect adjustment ledger delta calculation.');
    }
    console.log('✓ TEST 5 PASSED: Reconciled physical count 3 (Recorded 5, Delta -2) with audit ledger entry.');

    // ----------------------------------------------------
    // SUMMARY REPORT
    // ----------------------------------------------------
    console.log('\n====================================================');
    console.log('🎉 ALL INTEGRATION & QA BUSINESS RULE TESTS PASSED!');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ QA TEST SUITE FAILED:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runQaTestSuite();
}

module.exports = { runQaTestSuite };
