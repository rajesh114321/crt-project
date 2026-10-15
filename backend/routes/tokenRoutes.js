const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const store = require('../services/store');
const {
  getAllTokens,
  getUserTokens,
  createToken,
  getLiveQueue,
  callNext,
  completeToken,
  skipToken,
  recallToken,
  cancelToken,
  transferToken,
  searchTokens,
  rateToken,
  getServiceRecords
} = require('../controllers/tokenController');
const { protect, adminOnly, JWT_SECRET } = require('../middleware/authMiddleware');

// Middleware to optionally attach user if authorization header exists
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = store.getUserById(decoded.id);
      if (user) {
        const { passwordHash, plainDemoPassword, ...safeUser } = user;
        req.user = safeUser;
      }
    } catch (e) {
      // ignore invalid token for optional auth
    }
  }
  next();
};

router.get('/', protect, adminOnly, getAllTokens);
router.get('/my-tokens', protect, getUserTokens);
router.get('/live-status', optionalAuth, getLiveQueue);
router.get('/search', protect, adminOnly, searchTokens);
router.get('/service-records', protect, adminOnly, getServiceRecords);

router.post('/join', protect, createToken);
router.post('/call-next', protect, adminOnly, callNext);
router.post('/:id/complete', protect, adminOnly, completeToken);
router.post('/:id/skip', protect, adminOnly, skipToken);
router.post('/:id/recall', protect, adminOnly, recallToken);
router.post('/:id/transfer', protect, adminOnly, transferToken);
router.post('/:id/cancel', protect, cancelToken);
router.post('/:id/rate', protect, rateToken);

module.exports = router;
