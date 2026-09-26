const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/summary', dashboardController.getSummary);

module.exports = router;
