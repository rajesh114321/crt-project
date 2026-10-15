const store = require('../services/store');

const getUserNotifications = (req, res) => {
  const notifs = store.getNotificationsByUser(req.user.id);
  res.json({
    success: true,
    data: notifs
  });
};

const markAsRead = (req, res) => {
  const notif = store.markNotificationRead(req.params.id);
  res.json({
    success: true,
    data: notif
  });
};

const markAllAsRead = (req, res) => {
  store.markAllNotificationsRead(req.user.id);
  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
};

const broadcastNotification = (req, res) => {
  const { title, message, type } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required.' });
  }

  const created = store.createBroadcastNotification({ title, message, type });
  res.status(201).json({
    success: true,
    data: created,
    message: `Broadcast dispatched to ${created.length} students`
  });
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  broadcastNotification
};
