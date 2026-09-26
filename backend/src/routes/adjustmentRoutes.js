const express = require('express');
const router = express.Router();
const adjustmentController = require('../controllers/adjustmentController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.post('/:id/validate', adjustmentController.validateAdjustment);

module.exports = router;
