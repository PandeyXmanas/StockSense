const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.post('/:id/validate', transferController.validateTransfer);

module.exports = router;
