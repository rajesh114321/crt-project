const express = require('express');
const router = express.Router();
const { getAnalytics, resetDemo } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAnalytics);
router.post('/reset-demo', protect, adminOnly, resetDemo);

module.exports = router;
