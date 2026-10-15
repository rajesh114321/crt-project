const jwt = require('jsonwebtoken');
const store = require('../services/store');

const JWT_SECRET = process.env.JWT_SECRET || 'queueless_super_secure_jwt_token_key_2026';

const protect = (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.purpose === 'admin_otp_pending') {
      return res.status(401).json({ success: false, requireOtp: true, message: 'Complete 2FA verification to continue' });
    }

    const user = store.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Attach user without password
    const { passwordHash, plainDemoPassword, ...safeUser } = user;
    safeUser.otpVerified = decoded.otpVerified === true;
    req.user = safeUser;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    if (req.user.otpVerified !== true) {
      return res.status(403).json({
        success: false,
        requireOtp: true,
        message: 'Two-factor OTP verification required for administrator access.'
      });
    }
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required' });
  }
};

module.exports = {
  protect,
  adminOnly,
  JWT_SECRET
};
