const {
  sequelize,
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
} = require('../models');

const {
  receiveStock,
  deliverStock,
  transferStock,
  adjustStock
} = require('../utils/inventoryEngine');
const { withTransaction } = require('../utils/transaction');

const runIntegrationTests = async () => {
  console.log('====================================================');
  console.log('Starting StockSense Database & Model Integration Tests');
  console.log('====================================================\n');

  try {
    // Authenticate
    await sequelize.authenticate();
    console.log('✓ Database connection verified.');

    // Sync database schema for testing
    await sequelize.sync({ force: true });
    console.log('✓ Database tables synchronized successfully.\n');

    // 1. Seed Base Entities
    console.log('--- Seeding Base Entities ---');
    const user = await User.create({
      name: 'Test Manager',
      email: 'manager@stocksense.test',
      passwordHash: 'hashed_password_123',
      role: 'Inventory Manager'
    });
    console.log(`✓ User created: id=${user.id}, email=${user.email}`);

    const category = await Category.create({
      name: 'Raw Materials',
      description: 'Metals and plastics'
    });
    console.log(`✓ Category created: id=${category.id}, name=${category.name}`);

    const product = await Product.create({
      name: 'Steel Rods 10mm',
      sku: 'STL-10MM',
      categoryId: category.id,
      unitOfMeasure: 'kg',
      minReorderLevel: 25
    });
    console.log(`✓ Product created: id=${product.id}, sku=${product.sku}`);

    const warehouse = await Warehouse.create({
      name: 'Main Central Warehouse',
      code: 'WH-MAIN',
      address: '100 Logistics Blvd'
    });
    console.log(`✓ Warehouse created: id=${warehouse.id}, code=${warehouse.code}`);

    const locA = await Location.create({
      warehouseId: warehouse.id,
      name: 'Location A',
      code: 'LOC-A'
    });

    const locB = await Location.create({
      warehouseId: warehouse.id,
      name: 'Location B',
      code: 'LOC-B'
    });
    console.log(`✓ Locations created: LocA=${locA.id} (${locA.code}), LocB=${locB.id} (${locB.code})\n`);

    // ====================================================
    // Scenario 1 — Receipt
    // Initial: 20
    // Receipt: +30
    // Expected: InventoryBalance = 50, Ledger: RECEIPT +30
    // ====================================================
    console.log('--- Running Scenario 1: Receipt ---');
    await InventoryBalance.create({
      productId: product.id,
      locationId: locA.id,
      quantity: 20
    });

    const receipt = await Receipt.create({
      referenceNumber: 'REC-2026-TEST-001',
      supplierName: 'Apex Metal Co',
      status: 'Ready',
      createdBy: user.id,
      destinationLocationId: locA.id
    });

    await ReceiptItem.create({
      receiptId: receipt.id,
      productId: product.id,
      quantity: 30,
      destinationLocationId: locA.id
    });

    // Validate receipt inside a transaction
    await withTransaction(async (t) => {
      await receiveStock({
        productId: product.id,
        locationId: locA.id,
        quantity: 30,
        referenceId: receipt.id,
        referenceNumber: receipt.referenceNumber,
        createdBy: user.id
      }, t);

      receipt.status = 'Done';
      receipt.validatedAt = new Date();
      await receipt.save({ transaction: t });
    });

    const balanceScen1 = await InventoryBalance.findOne({
      where: { productId: product.id, locationId: locA.id }
    });
    const ledgerScen1 = await StockLedgerEntry.findOne({
      where: { referenceType: 'RECEIPT', referenceId: receipt.id }
    });

    console.log(`Expected Balance: 50 | Actual: ${balanceScen1.quantity}`);
    console.log(`Expected Ledger Delta: +30 | Actual: ${ledgerScen1.quantityDelta} (${ledgerScen1.movementType})`);
    if (balanceScen1.quantity === 50 && ledgerScen1.quantityDelta === 30) {
      console.log('✓ Scenario 1 PASSED!\n');
    } else {
      throw new Error('Scenario 1 Failed assertion');
    }

    // ====================================================
    // Scenario 2 — Delivery
    // Initial: 50
    // Delivery: -15
    // Expected: InventoryBalance = 35, Ledger: DELIVERY -15
    // ====================================================
    console.log('--- Running Scenario 2: Delivery ---');
    const delivery = await DeliveryOrder.create({
      referenceNumber: 'DEL-2026-TEST-001',
      recipientName: 'BuildCorp Construction',
      status: 'Ready',
      createdBy: user.id,
      sourceLocationId: locA.id
    });

    await DeliveryItem.create({
      deliveryOrderId: delivery.id,
      productId: product.id,
      quantity: 15,
      sourceLocationId: locA.id
    });

    await withTransaction(async (t) => {
      await deliverStock({
        productId: product.id,
        locationId: locA.id,
        quantity: 15,
        referenceId: delivery.id,
        referenceNumber: delivery.referenceNumber,
        createdBy: user.id
      }, t);

      delivery.status = 'Done';
      delivery.validatedAt = new Date();
      await delivery.save({ transaction: t });
    });

    const balanceScen2 = await InventoryBalance.findOne({
      where: { productId: product.id, locationId: locA.id }
    });
    const ledgerScen2 = await StockLedgerEntry.findOne({
      where: { referenceType: 'DELIVERY', referenceId: delivery.id }
    });

    console.log(`Expected Balance: 35 | Actual: ${balanceScen2.quantity}`);
    console.log(`Expected Ledger Delta: -15 | Actual: ${ledgerScen2.quantityDelta} (${ledgerScen2.movementType})`);
    if (balanceScen2.quantity === 35 && ledgerScen2.quantityDelta === -15) {
      console.log('✓ Scenario 2 PASSED!\n');
    } else {
      throw new Error('Scenario 2 Failed assertion');
    }

    // ====================================================
    // Scenario 3 — Transfer
    // Location A = 40, Location B = 10
    // Transfer = 15
    // Expected: A = 25, B = 25, Total = 50
    // Ledger: TRANSFER_OUT -15, TRANSFER_IN +15
    // ====================================================
    console.log('--- Running Scenario 3: Transfer ---');
    // Set initial state for scenario 3
    balanceScen2.quantity = 40;
    await balanceScen2.save();

    await InventoryBalance.upsert({
      productId: product.id,
      locationId: locB.id,
      quantity: 10
    });

    const transfer = await InternalTransfer.create({
      referenceNumber: 'TRN-2026-TEST-001',
      fromLocationId: locA.id,
      toLocationId: locB.id,
      status: 'Ready',
      createdBy: user.id
    });

    await InternalTransferItem.create({
      transferId: transfer.id,
      productId: product.id,
      quantity: 15
    });

    await withTransaction(async (t) => {
      await transferStock({
        productId: product.id,
        fromLocationId: locA.id,
        toLocationId: locB.id,
        quantity: 15,
        referenceId: transfer.id,
        referenceNumber: transfer.referenceNumber,
        createdBy: user.id
      }, t);

      transfer.status = 'Done';
      transfer.validatedAt = new Date();
      await transfer.save({ transaction: t });
    });

    const balA = await InventoryBalance.findOne({ where: { productId: product.id, locationId: locA.id } });
    const balB = await InventoryBalance.findOne({ where: { productId: product.id, locationId: locB.id } });
    const ledgerTransfers = await StockLedgerEntry.findAll({
      where: { referenceType: 'TRANSFER', referenceId: transfer.id }
    });

    const ledgerOut = ledgerTransfers.find((e) => e.movementType === 'TRANSFER_OUT');
    const ledgerIn = ledgerTransfers.find((e) => e.movementType === 'TRANSFER_IN');

    console.log(`Expected LocA: 25 | Actual: ${balA.quantity}`);
    console.log(`Expected LocB: 25 | Actual: ${balB.quantity}`);
    console.log(`Expected Total: 50 | Actual: ${balA.quantity + balB.quantity}`);
    console.log(`Ledger OUT: ${ledgerOut.quantityDelta} at Loc ${ledgerOut.locationId}`);
    console.log(`Ledger IN: ${ledgerIn.quantityDelta} at Loc ${ledgerIn.locationId}`);

    if (balA.quantity === 25 && balB.quantity === 25 && (balA.quantity + balB.quantity === 50)) {
      console.log('✓ Scenario 3 PASSED!\n');
    } else {
      throw new Error('Scenario 3 Failed assertion');
    }

    // ====================================================
    // Scenario 4 — Adjustment
    // Recorded = 50, Counted = 47
    // Expected: InventoryBalance = 47, Ledger delta = -3
    // ====================================================
    console.log('--- Running Scenario 4: Adjustment ---');
    // Set recorded to 50
    balA.quantity = 50;
    await balA.save();

    const adjustment = await InventoryAdjustment.create({
      referenceNumber: 'ADJ-2026-TEST-001',
      locationId: locA.id,
      status: 'Ready',
      reason: 'Physical count audit',
      createdBy: user.id
    });

    await withTransaction(async (t) => {
      const { previousQuantity, deltaQuantity } = await adjustStock({
        productId: product.id,
        locationId: locA.id,
        countedQuantity: 47,
        referenceId: adjustment.id,
        referenceNumber: adjustment.referenceNumber,
        createdBy: user.id
      }, t);

      await InventoryAdjustmentItem.create({
        adjustmentId: adjustment.id,
        productId: product.id,
        previousQuantity,
        countedQuantity: 47,
        deltaQuantity
      }, { transaction: t });

      adjustment.status = 'Done';
      adjustment.validatedAt = new Date();
      await adjustment.save({ transaction: t });
    });

    const balAfterAdj = await InventoryBalance.findOne({ where: { productId: product.id, locationId: locA.id } });
    const ledgerAdj = await StockLedgerEntry.findOne({
      where: { referenceType: 'ADJUSTMENT', referenceId: adjustment.id }
    });

    console.log(`Expected Balance: 47 | Actual: ${balAfterAdj.quantity}`);
    console.log(`Expected Ledger Delta: -3 | Actual: ${ledgerAdj.quantityDelta}`);

    if (balAfterAdj.quantity === 47 && ledgerAdj.quantityDelta === -3) {
      console.log('✓ Scenario 4 PASSED!\n');
    } else {
      throw new Error('Scenario 4 Failed assertion');
    }

    // ====================================================
    // Scenario 5 — Failure & Rollback
    // Source stock = 10, Attempt transfer = 20
    // Expected: Operation fails, no partial changes remain.
    // ====================================================
    console.log('--- Running Scenario 5: Failure & Rollback ---');
    balA.quantity = 10;
    await balA.save();
    balB.quantity = 25;
    await balB.save();

    const initialLedgerCount = await StockLedgerEntry.count();
    let errorCaught = false;

    try {
      await withTransaction(async (t) => {
        // This must fail because stock (10) < requested (20)
        await transferStock({
          productId: product.id,
          fromLocationId: locA.id,
          toLocationId: locB.id,
          quantity: 20,
          referenceId: 999,
          referenceNumber: 'TRN-FAIL-TEST',
          createdBy: user.id
        }, t);
      });
    } catch (err) {
      errorCaught = true;
      console.log(`✓ Caught expected error: "${err.message}"`);
    }

    const balAAfterRollback = await InventoryBalance.findOne({ where: { productId: product.id, locationId: locA.id } });
    const balBAfterRollback = await InventoryBalance.findOne({ where: { productId: product.id, locationId: locB.id } });
    const ledgerCountAfterRollback = await StockLedgerEntry.count();

    console.log(`LocA stock: Expected 10 | Actual: ${balAAfterRollback.quantity}`);
    console.log(`LocB stock: Expected 25 | Actual: ${balBAfterRollback.quantity}`);
    console.log(`Ledger rows: Expected ${initialLedgerCount} | Actual: ${ledgerCountAfterRollback}`);

    if (errorCaught && balAAfterRollback.quantity === 10 && balBAfterRollback.quantity === 25 && ledgerCountAfterRollback === initialLedgerCount) {
      console.log('✓ Scenario 5 PASSED! Transaction successfully rolled back all changes.\n');
    } else {
      throw new Error('Scenario 5 Failed rollback assertion');
    }

    console.log('====================================================');
    console.log('ALL 5 DATA INTEGRITY & TRANSACTION SCENARIOS PASSED!');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('Integration test failed with error:', err);
    process.exit(1);
  }
};

runIntegrationTests();
