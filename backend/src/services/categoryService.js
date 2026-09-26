const { Category } = require('../models');

const getAllCategories = async () => {
    return await Category.findAll();
};

const createCategory = async (data) => {
    return await Category.create(data);
};

module.exports = {
    getAllCategories,
    createCategory
};
