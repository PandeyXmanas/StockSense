const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', locationController.getAll);
router.post('/', locationController.create);

module.exports = router;
