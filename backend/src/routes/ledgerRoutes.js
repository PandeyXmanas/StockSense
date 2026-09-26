const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/', ledgerController.getHistory);

module.exports = router;
