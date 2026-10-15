const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead, markAllAsRead, broadcastNotification } = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getUserNotifications);
router.post('/broadcast', protect, adminOnly, broadcastNotification);
router.put('/:id/read', protect, markAsRead);
router.put('/mark-all-read', protect, markAllAsRead);

module.exports = router;
