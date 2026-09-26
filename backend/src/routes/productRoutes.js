const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth); // Protect all product routes

router.get('/', productController.getAll);
router.post('/', productController.create);
router.get('/:id', productController.getById);
router.patch('/:id', productController.update);

module.exports = router;
