const { Product } = require('../models');

const getAllProducts = async () => {
    return await Product.findAll();
};

const getProductById = async (id) => {
    return await Product.findByPk(id);
};

const createProduct = async (data) => {
    return await Product.create(data);
};

const updateProduct = async (id, data) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    return await product.update(data);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct
};
