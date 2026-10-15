const express = require('express');
const router = express.Router();
const store = require('../services/store');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Get system settings
// @route   GET /api/settings
router.get('/', (req, res) => {
  const settings = store.getSettings();
  res.json({
    success: true,
    data: settings
  });
});

// @desc    Update system settings (Admin only)
// @route   PUT /api/settings
router.put('/', protect, adminOnly, (req, res) => {
  const updated = store.updateSettings(req.body);
  res.json({
    success: true,
    data: updated,
    message: 'Settings updated successfully'
  });
});

module.exports = router;
