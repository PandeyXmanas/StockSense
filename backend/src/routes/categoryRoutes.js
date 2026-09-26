const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', categoryController.getAll);
router.post('/', categoryController.create);

module.exports = router;
