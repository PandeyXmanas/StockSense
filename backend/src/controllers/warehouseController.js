const warehouseService = require('../services/warehouseService');

const getAll = async (req, res, next) => {
    try {
        const warehouses = await warehouseService.getAllWarehouses();
        res.status(200).json({ success: true, data: warehouses });
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const warehouse = await warehouseService.createWarehouse(req.body);
        res.status(201).json({ success: true, data: warehouse });
    } catch (error) { next(error); }
};

module.exports = { getAll, create };
