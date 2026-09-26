const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', warehouseController.getAll);
router.post('/', warehouseController.create);

module.exports = router;
