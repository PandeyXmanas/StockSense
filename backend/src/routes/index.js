const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const warehouseRoutes = require('./warehouseRoutes');
const locationRoutes = require('./locationRoutes');
const receiptRoutes = require('./receiptRoutes');
const deliveryRoutes = require('./deliveryRoutes');
const transferRoutes = require('./transferRoutes');
const adjustmentRoutes = require('./adjustmentRoutes');
const ledgerRoutes = require('./ledgerRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/locations', locationRoutes);
router.use('/receipts', receiptRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/transfers', transferRoutes);
router.use('/adjustments', adjustmentRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
