const { Warehouse } = require('../models');

const getAllWarehouses = async () => {
    return await Warehouse.findAll();
};

const createWarehouse = async (data) => {
    return await Warehouse.create(data);
};

module.exports = {
    getAllWarehouses,
    createWarehouse
};
