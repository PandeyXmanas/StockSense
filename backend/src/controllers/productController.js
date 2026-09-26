const productService = require('../services/productService');

const getAll = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json({ success: true, data: products });
    } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, data: product });
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ success: true, data: product });
    } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update };
