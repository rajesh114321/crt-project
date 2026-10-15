const express = require('express');
const router = express.Router();
const { getAllCounters, updateCounter } = require('../controllers/counterController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllCounters);
router.put('/:id', protect, adminOnly, updateCounter);

module.exports = router;
