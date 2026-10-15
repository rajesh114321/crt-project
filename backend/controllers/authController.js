const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../services/store');
const otpService = require('../services/otpService');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (user, otpVerified = false) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      name: user.name,
      otpVerified: user.role === 'admin' ? otpVerified : true
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, studentId, email, phone, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = store.getUserByEmailOrStudentId(email) || (studentId ? store.getUserByEmailOrStudentId(studentId) : null);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A user with this email or Student ID already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = store.createUser({
      name,
      studentId: studentId || `STU-${Date.now().toString().slice(-4)}`,
      email,
      phone: phone || '',
      passwordHash,
      role: 'student',
      department: department || 'General Studies'
    });

    const token = generateToken(newUser);
    const { passwordHash: _, plainDemoPassword: __, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      user: safeUser,
      token,
      message: 'Registration successful'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user (email or studentId)
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { identifier, password, method } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/student ID and password.' });
    }

    const user = store.getUserByEmailOrStudentId(identifier);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // Check password (matches bcrypt hash or plain demo password)
    let isMatch = false;
    if (user.plainDemoPassword && user.plainDemoPassword === password) {
      isMatch = true;
    } else if (user.passwordHash) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      store.addLoginLog({
        userId: user.id,
        email: user.email,
        role: user.role,
        action: 'LOGIN_FAILED',
        method: 'Password',
        ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        status: 'Failed',
        details: 'Incorrect password attempt',
        userAgent: req.headers['user-agent'] || 'Browser'
      });
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Step 2 Requirement: If Admin, require 2FA OTP verification
    if (user.role === 'admin') {
      const sessionId = `adm_sess_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
      const preferredMethod = (method === 'phone' && user.phone) ? 'phone' : 'email';

      const challenge = await otpService.createChallenge({
        sessionId,
        userId: user.id,
        email: user.email,
        phone: user.phone,
        method: preferredMethod
      });

      store.addLoginLog({
        userId: user.id,
        email: user.email,
        role: user.role,
        action: '2FA_CHALLENGE',
        method: challenge.method === 'phone' ? 'Phone SMS OTP' : 'Gmail SMTP OTP',
        ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        status: 'Challenged',
        details: `Dispatched 6-digit verification code to ${challenge.method === 'phone' ? challenge.maskedPhone : challenge.maskedEmail}`,
        userAgent: req.headers['user-agent'] || 'Browser'
      });

      const tempToken = jwt.sign(
        { sessionId, userId: user.id, role: 'admin', purpose: 'admin_otp_pending' },
        JWT_SECRET,
        { expiresIn: '10m' }
      );

      return res.json({
        success: true,
        requireOtp: true,
        tempSessionId: sessionId,
        tempToken,
        method: challenge.method,
        maskedEmail: challenge.maskedEmail,
        maskedPhone: challenge.maskedPhone,
        hasEmail: Boolean(user.email),
        hasPhone: Boolean(user.phone),
        expiresAt: challenge.expiresAt,
        cooldownSeconds: challenge.cooldownSeconds,
        isSimulated: challenge.isSimulated,
        devNotice: challenge.devNotice,
        devOtp: challenge.devOtp,
        message: `Admin credentials verified. One-time verification code sent to your registered ${challenge.method === 'phone' ? 'phone' : 'Gmail'}.`
      });
    }

    const token = generateToken(user);
    const { passwordHash: _, plainDemoPassword: __, ...safeUser } = user;

    store.addLoginLog({
      userId: user.id,
      email: user.email,
      role: user.role,
      action: 'LOGIN_SUCCESS',
      method: 'Password',
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      status: 'Success',
      details: 'Student session authorized',
      userAgent: req.headers['user-agent'] || 'Browser'
    });

    res.json({
      success: true,
      user: safeUser,
      token,
      message: 'Login successful'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Quick 1-Click Demo Login (student or admin)
// @route   POST /api/auth/demo-login
const demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body; // 'student' or 'admin'
    const targetEmail = role === 'admin' ? 'admin@queueless.com' : 'student@queueless.com';
    const user = store.getUserByEmailOrStudentId(targetEmail);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Demo user not found' });
    }

    if (user.role === 'admin') {
      const sessionId = `adm_sess_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
      const preferredMethod = (req.body.method === 'phone' && user.phone) ? 'phone' : 'email';

      const challenge = await otpService.createChallenge({
        sessionId,
        userId: user.id,
        email: user.email,
        phone: user.phone,
        method: preferredMethod
      });

      const tempToken = jwt.sign(
        { sessionId, userId: user.id, role: 'admin', purpose: 'admin_otp_pending' },
        JWT_SECRET,
        { expiresIn: '10m' }
      );

      return res.json({
        success: true,
        requireOtp: true,
        tempSessionId: sessionId,
        tempToken,
        method: challenge.method,
        maskedEmail: challenge.maskedEmail,
        maskedPhone: challenge.maskedPhone,
        hasEmail: Boolean(user.email),
        hasPhone: Boolean(user.phone),
        expiresAt: challenge.expiresAt,
        cooldownSeconds: challenge.cooldownSeconds,
        isSimulated: challenge.isSimulated,
        devNotice: challenge.devNotice,
        devOtp: challenge.devOtp,
        message: `Admin credentials verified. Verification code dispatched.`
      });
    }

    const token = generateToken(user);
    const { passwordHash: _, plainDemoPassword: __, ...safeUser } = user;

    res.json({
      success: true,
      user: safeUser,
      token,
      message: `Signed in as Demo Student`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify Admin 2FA OTP code
// @route   POST /api/auth/admin/verify-otp
const verifyAdminOtp = async (req, res, next) => {
  try {
    const { tempSessionId, otp } = req.body;
    if (!tempSessionId || !otp) {
      return res.status(400).json({ success: false, message: 'Session ID and verification code are required.' });
    }

    const verification = otpService.verifyChallenge({ sessionId: tempSessionId, otp });
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        code: verification.code,
        message: verification.message,
        attemptsRemaining: verification.attemptsRemaining
      });
    }

    const user = store.getUserById(verification.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Administrator account not found.' });
    }

    // Generate fully authorized JWT with otpVerified: true
    const token = generateToken(user, true);
    const { passwordHash: _, plainDemoPassword: __, ...safeUser } = user;
    safeUser.otpVerified = true;

    // Log successful 2FA verification
    store.addLoginLog({
      userId: user.id,
      email: user.email,
      role: user.role,
      action: '2FA_SUCCESS',
      method: verification.method === 'phone' ? 'Phone SMS OTP' : 'Gmail SMTP OTP',
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      status: 'Success',
      details: 'Administrator 2FA verified successfully',
      userAgent: req.headers['user-agent'] || 'Browser'
    });

    // Invalidate OTP session from memory
    otpService.clearSession(tempSessionId);

    res.json({
      success: true,
      user: safeUser,
      token,
      message: 'Admin 2FA verification successful. Access granted to Admin Dashboard.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Resend Admin 2FA OTP code or switch method (Gmail vs Phone)
// @route   POST /api/auth/admin/resend-otp
const resendAdminOtp = async (req, res, next) => {
  try {
    const { tempSessionId, method } = req.body;
    if (!tempSessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }

    const session = otpService.getSession(tempSessionId);
    if (!session) {
      return res.status(400).json({ success: false, message: 'Verification session expired. Please log in again.' });
    }

    const user = store.getUserById(session.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const targetMethod = method || session.method || 'email';
    if (targetMethod === 'phone' && !user.phone) {
      return res.status(400).json({ success: false, message: 'No registered phone number found for this administrator.' });
    }

    const challenge = await otpService.createChallenge({
      sessionId: tempSessionId,
      userId: user.id,
      email: user.email,
      phone: user.phone,
      method: targetMethod
    });

    res.json({
      success: true,
      tempSessionId,
      method: challenge.method,
      maskedEmail: challenge.maskedEmail,
      maskedPhone: challenge.maskedPhone,
      expiresAt: challenge.expiresAt,
      cooldownSeconds: challenge.cooldownSeconds,
      isSimulated: challenge.isSimulated,
      devNotice: challenge.devNotice,
      message: `A new verification code was dispatched via ${challenge.method === 'phone' ? 'SMS' : 'Gmail'}.`
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
const getMe = (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
const updateProfile = (req, res, next) => {
  try {
    const { name, phone, department } = req.body;
    const updated = store.updateUser(req.user.id, {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(department && { department })
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { passwordHash: _, plainDemoPassword: __, ...safeUser } = updated;
    res.json({
      success: true,
      user: safeUser,
      message: 'Profile updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Admin Registration Status & Security Policy
// @route   GET /api/auth/admin/register-status
const getAdminRegisterStatus = (req, res) => {
  const adminCount = store.getAdminsCount();
  const isFirstAdmin = adminCount === 0;
  res.json({
    success: true,
    isFirstAdmin,
    adminCount,
    requiresSetupKey: true,
    message: isFirstAdmin
      ? 'Initial Administrator Setup Mode active.'
      : 'Public administrator registration is disabled. An authorized Admin Security Setup Key is required.'
  });
};

// @desc    Send Phone OTP for Admin Registration Verification
// @route   POST /api/auth/admin/send-registration-otp
const sendAdminRegistrationOtp = async (req, res, next) => {
  try {
    const { phone, email } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Mobile number (+91) is required.' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }

    const existingPhone = store.getUserByPhone(phone);
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'An account with this mobile number already exists.' });
    }

    if (email) {
      const existingEmail = store.getUserByEmailOrStudentId(email);
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }
    }

    const sessionId = `reg_phone_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const challenge = await otpService.createChallenge({
      sessionId,
      userId: 'admin_registration_pending',
      email: email || 'admin-registration@queueless.com',
      phone,
      method: 'phone'
    });

    res.json({
      success: true,
      sessionId,
      method: 'phone',
      maskedPhone: challenge.maskedPhone,
      expiresAt: challenge.expiresAt,
      devNotice: challenge.devNotice,
      devOtp: challenge.devOtp,
      message: `Verification code sent to ${phone}.`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Register a new Administrator
// @route   POST /api/auth/admin/register
const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword, setupKey, phoneOtpSessionId, phoneOtp } = req.body;

    // 1. Field validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full Name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email Address is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Mobile Number (+91) is required.' });
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match. Please verify.' });
    }

    // 2. Requirement 10: Enforce Admin Security Setup Key
    const configuredKey = process.env.ADMIN_SETUP_KEY || 'QueueLessAdmin2026!';
    if (!setupKey || setupKey.trim() !== configuredKey) {
      return res.status(403).json({
        success: false,
        code: 'INVALID_SETUP_KEY',
        message: 'Access Denied: Public administrator registration is disabled. A valid Admin Security Setup Key is required to create an administrator account.'
      });
    }

    // 3. Duplicate checks (Requirement 7)
    const existingEmail = store.getUserByEmailOrStudentId(email.trim());
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in or use another email.'
      });
    }

    const existingPhone = store.getUserByPhone(phone.trim());
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'An account with this mobile number already exists. Please verify your phone number.'
      });
    }

    // 4. Requirement 8: Verify Phone OTP if supplied
    if (phoneOtpSessionId && phoneOtp) {
      const verifyResult = otpService.verifyChallenge({ sessionId: phoneOtpSessionId, otp: phoneOtp });
      if (!verifyResult.success) {
        return res.status(400).json({
          success: false,
          code: verifyResult.code,
          message: `Mobile phone OTP verification failed: ${verifyResult.message}`
        });
      }
      otpService.clearSession(phoneOtpSessionId);
    }

    // 5. Requirement 6: Bcrypt hash password (never store plain-text!)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 6. Create admin user in database
    const newAdmin = store.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim().startsWith('+91') ? phone.trim() : `+91 ${phone.trim().slice(-10)}`,
      studentId: `ADM-${Date.now().toString().slice(-4)}`,
      passwordHash,
      role: 'admin',
      department: 'Administration',
      status: 'Active',
      phoneVerified: Boolean(phoneOtpSessionId && phoneOtp),
      createdAt: new Date().toISOString()
    });

    const { passwordHash: _, plainDemoPassword: __, ...safeUser } = newAdmin;

    res.status(201).json({
      success: true,
      user: safeUser,
      message: 'Administrator account registered successfully! You may now log in.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change User / Admin Password with bcrypt hashing
// @route   POST /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new password.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const user = store.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let isMatch = false;
    if (user.plainDemoPassword && user.plainDemoPassword === currentPassword) {
      isMatch = true;
    } else if (user.passwordHash) {
      isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    }

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    store.updateUser(user.id, {
      passwordHash,
      plainDemoPassword: null,
      passwordUpdatedAt: new Date().toISOString()
    });

    store.addLoginLog({
      userId: user.id,
      email: user.email,
      role: user.role,
      action: 'PASSWORD_CHANGE',
      method: 'Bcrypt Hash',
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      status: 'Success',
      details: 'Password securely changed with bcrypt 10-round salt',
      userAgent: req.headers['user-agent'] || 'Browser'
    });

    res.json({
      success: true,
      message: 'Password updated successfully. Please use your new password next time you sign in.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Request OTP to update Admin Gmail or Phone
// @route   POST /api/auth/admin/update-contact-request
const requestContactUpdateOtp = async (req, res, next) => {
  try {
    const { type, value } = req.body;
    if (!type || !value) {
      return res.status(400).json({ success: false, message: 'Update type (email or phone) and target value are required.' });
    }

    const cleanValue = value.trim();
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanValue)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid Gmail / email address.' });
      }
      const existing = store.getUserByEmailOrStudentId(cleanValue);
      if (existing && existing.id !== req.user.id) {
        return res.status(400).json({ success: false, message: 'This email address is already associated with another account.' });
      }
    } else if (type === 'phone') {
      const cleanDigits = cleanValue.replace(/[^0-9]/g, '');
      if (cleanDigits.length < 10) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
      }
      const existing = store.getUserByPhone(cleanValue);
      if (existing && existing.id !== req.user.id) {
        return res.status(400).json({ success: false, message: 'This phone number is already associated with another account.' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid update type. Must be email or phone.' });
    }

    const sessionId = `upd_${type}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const challenge = await otpService.createChallenge({
      sessionId,
      userId: req.user.id,
      email: type === 'email' ? cleanValue : req.user.email,
      phone: type === 'phone' ? cleanValue : req.user.phone,
      method: type === 'phone' ? 'phone' : 'email'
    });

    res.json({
      success: true,
      sessionId,
      type,
      targetValue: cleanValue,
      maskedTarget: type === 'phone' ? challenge.maskedPhone : challenge.maskedEmail,
      expiresAt: challenge.expiresAt,
      cooldownSeconds: challenge.cooldownSeconds,
      isSimulated: challenge.isSimulated,
      devNotice: challenge.devNotice,
      devOtp: challenge.devOtp,
      message: `A 6-digit verification code has been dispatched to ${type === 'phone' ? 'mobile' : 'Gmail'} ${type === 'phone' ? challenge.maskedPhone : challenge.maskedEmail}.`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify OTP and commit Admin Gmail or Phone update
// @route   POST /api/auth/admin/update-contact-verify
const verifyContactUpdateOtp = async (req, res, next) => {
  try {
    const { sessionId, otp, type, value } = req.body;
    if (!sessionId || !otp || !type || !value) {
      return res.status(400).json({ success: false, message: 'Session ID, OTP code, type, and value are required.' });
    }

    const verification = otpService.verifyChallenge({ sessionId, otp });
    if (!verification.success) {
      return res.status(400).json({
        success: false,
        code: verification.code,
        message: verification.message
      });
    }

    otpService.clearSession(sessionId);

    const updates = {};
    if (type === 'email') {
      updates.email = value.trim().toLowerCase();
    } else if (type === 'phone') {
      const cleanVal = value.trim();
      updates.phone = cleanVal.startsWith('+91') ? cleanVal : `+91 ${cleanVal.slice(-10)}`;
    }

    const updated = store.updateUser(req.user.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Administrator account not found.' });
    }

    store.addLoginLog({
      userId: req.user.id,
      email: updated.email,
      role: 'admin',
      action: 'CONTACT_UPDATED',
      method: type === 'phone' ? 'Phone SMS OTP' : 'Gmail SMTP OTP',
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      status: 'Success',
      details: `Updated registered ${type} to ${type === 'phone' ? updated.phone : updated.email}`,
      userAgent: req.headers['user-agent'] || 'Browser'
    });

    const { passwordHash: _, plainDemoPassword: __, ...safeUser } = updated;

    res.json({
      success: true,
      user: safeUser,
      message: `Administrator ${type === 'phone' ? 'phone number' : 'Gmail address'} updated and verified successfully.`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check Gmail SMTP and Twilio SMS configuration status
// @route   GET /api/auth/admin/config-status
const getAdminConfigStatus = (req, res) => {
  const hasGmailUser = Boolean(process.env.GMAIL_USER);
  const hasGmailPass = Boolean(process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_APP_PASSWORD.trim().length >= 8);
  const gmailConfigured = hasGmailUser && hasGmailPass;

  const hasTwilioSid = Boolean(process.env.TWILIO_ACCOUNT_SID);
  const hasTwilioAuth = Boolean(process.env.TWILIO_AUTH_TOKEN);
  const hasTwilioPhone = Boolean(process.env.TWILIO_PHONE_NUMBER);
  const twilioConfigured = hasTwilioSid && hasTwilioAuth && hasTwilioPhone;

  res.json({
    success: true,
    gmail: {
      configured: gmailConfigured,
      user: process.env.GMAIL_USER || '24r21a6620@mlrit.ac.in',
      hasPassword: hasGmailPass,
      instructions: !gmailConfigured
        ? 'To enable direct Gmail delivery, generate a 16-character Google App Password at https://myaccount.google.com/apppasswords and set GMAIL_APP_PASSWORD in backend/.env.'
        : 'Gmail SMTP is actively configured and ready to dispatch live email OTPs.'
    },
    twilio: {
      configured: twilioConfigured,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '+91 8121301736',
      instructions: !twilioConfigured
        ? 'To enable direct Twilio SMS, set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER from console.twilio.com in backend/.env.'
        : 'Twilio SMS service is actively configured and ready to dispatch live mobile OTPs.'
    }
  });
};

// @desc    Get Administrator Login & Security Audit Trail
// @route   GET /api/auth/admin/activity-logs
const getActivityLogs = (req, res) => {
  const logs = store.getLoginLogs(null, 30);
  res.json({
    success: true,
    logs
  });
};

module.exports = {
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
};
