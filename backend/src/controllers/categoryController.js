const categoryService = require('../services/categoryService');

const getAll = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) { next(error); }
};

module.exports = { getAll, create };
