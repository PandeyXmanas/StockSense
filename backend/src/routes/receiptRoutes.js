const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.post('/:id/validate', receiptController.validateReceipt);

module.exports = router;
