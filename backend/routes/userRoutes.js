const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const store = require('../services/store');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Get all users / students / staff (Admin only)
// @route   GET /api/users
router.get('/', protect, adminOnly, (req, res) => {
  const { role, q } = req.query;
  let users = store.getUsers();

  if (role) {
    users = users.filter(u => u.role === role);
  }

  if (q) {
    const query = q.trim().toLowerCase();
    users = users.filter(u => 
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.studentId && u.studentId.toLowerCase().includes(query)) ||
      (u.department && u.department.toLowerCase().includes(query))
    );
  }

  // Sanitize passwords before returning
  const safeUsers = users.map(u => {
    const { passwordHash, plainDemoPassword, ...safe } = u;
    const userTokens = store.getTokensByUser(u.id);
    return {
      ...safe,
      tokensCount: userTokens.length,
      activeToken: userTokens.find(t => t.status === 'WAITING' || t.status === 'CALLING') || null
    };
  });

  res.json({
    success: true,
    data: safeUsers
  });
});

// @desc    Create new staff / user (Admin only)
// @route   POST /api/users
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, studentId, role, department, phone, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const existing = store.getUserByEmailOrStudentId(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'temp123', salt);

    const newUser = store.createUser({
      name,
      email,
      studentId: studentId || `EMP-${Date.now().toString().slice(-4)}`,
      role: role || 'staff',
      department: department || 'General Services',
      phone: phone || '',
      passwordHash
    });

    const { passwordHash: _, plainDemoPassword: __, ...safeUser } = newUser;
    res.status(201).json({
      success: true,
      data: safeUser,
      message: 'User created successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Update user or role (Admin only)
// @route   PUT /api/users/:id
router.put('/:id', protect, adminOnly, (req, res) => {
  const { role, department, name, phone } = req.body;
  const updated = store.updateUser(req.params.id, {
    ...(role && { role }),
    ...(department && { department }),
    ...(name && { name }),
    ...(phone !== undefined && { phone })
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { passwordHash, plainDemoPassword, ...safe } = updated;
  res.json({
    success: true,
    data: safe,
    message: 'User updated successfully'
  });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
router.delete('/:id', protect, adminOnly, (req, res) => {
  const deleted = store.deleteUser(req.params.id);
  if (!deleted) {
    return res.status(400).json({ success: false, message: 'Unable to delete user (master administrators cannot be removed).' });
  }
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = router;
