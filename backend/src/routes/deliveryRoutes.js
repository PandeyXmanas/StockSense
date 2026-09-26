const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.post('/:id/validate', deliveryController.validateDelivery);

module.exports = router;
