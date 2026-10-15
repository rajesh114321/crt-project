const express = require('express');
const router = express.Router();
const store = require('../services/store');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Get all student feedback & ratings
// @route   GET /api/feedback
router.get('/', (req, res) => {
  const feedbacks = store.getFeedbacks();
  
  // Calculate average rating
  const total = feedbacks.length;
  const avgRating = total > 0 
    ? (feedbacks.reduce((sum, f) => sum + Number(f.rating || 5), 0) / total).toFixed(1)
    : '4.8';

  res.json({
    success: true,
    data: feedbacks,
    stats: {
      averageRating: avgRating,
      totalFeedback: total,
      positiveCount: feedbacks.filter(f => f.sentiment === 'Positive').length,
      neutralCount: feedbacks.filter(f => f.sentiment === 'Neutral').length,
      needsImprovementCount: feedbacks.filter(f => f.sentiment === 'Needs Improvement').length
    }
  });
});

// @desc    Submit student feedback
// @route   POST /api/feedback
router.post('/', protect, (req, res) => {
  const { tokenNumber, service, departmentName, rating, comment } = req.body;
  if (!rating) {
    return res.status(400).json({ success: false, message: 'Rating is required' });
  }

  const feedback = store.createFeedback({
    tokenNumber: tokenNumber || 'N/A',
    service: service || 'General Assistance',
    departmentName: departmentName || 'Campus Desk',
    studentName: req.user ? req.user.name : 'Anonymous Student',
    studentId: req.user ? req.user.studentId : 'STU-001',
    rating: Number(rating),
    comment: comment || ''
  });

  res.status(201).json({
    success: true,
    data: feedback,
    message: 'Thank you for your feedback!'
  });
});

module.exports = router;
