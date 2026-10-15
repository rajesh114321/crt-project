const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  demoLogin, 
  verifyAdminOtp, 
  resendAdminOtp, 
  getMe, 
  updateProfile,
  getAdminRegisterStatus,
  sendAdminRegistrationOtp,
  registerAdmin,
  changePassword,
  requestContactUpdateOtp,
  verifyContactUpdateOtp,
  getAdminConfigStatus,
  getActivityLogs
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.post('/admin/verify-otp', verifyAdminOtp);
router.post('/admin/resend-otp', resendAdminOtp);

// Admin Registration Endpoints
router.get('/admin/register-status', getAdminRegisterStatus);
router.post('/admin/send-registration-otp', sendAdminRegistrationOtp);
router.post('/admin/register', registerAdmin);

// User Profile & Password
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

// Administrator Security, 2FA Contact Config & Audit Logs
router.get('/admin/config-status', protect, getAdminConfigStatus);
router.get('/admin/activity-logs', protect, getActivityLogs);
router.post('/admin/update-contact-request', protect, requestContactUpdateOtp);
router.post('/admin/update-contact-verify', protect, verifyContactUpdateOtp);

module.exports = router;

