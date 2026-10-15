const express = require('express');
const router = express.Router();
const store = require('../services/store');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Get all appointments
// @route   GET /api/appointments
router.get('/', protect, (req, res) => {
  const appointments = store.getAppointments();
  res.json({
    success: true,
    data: appointments
  });
});

// @desc    Create new appointment
// @route   POST /api/appointments
router.post('/', protect, (req, res) => {
  const { studentName, studentId, departmentId, service, scheduledDate, scheduledTime, notes } = req.body;
  if (!scheduledDate || !scheduledTime || !service) {
    return res.status(400).json({ success: false, message: 'Please provide date, time, and service.' });
  }

  const dept = store.getDepartmentById(departmentId) || { name: 'General College Desk' };

  const newApt = store.createAppointment({
    studentId: studentId || (req.user ? req.user.studentId : 'STU-001'),
    studentName: studentName || (req.user ? req.user.name : 'Student'),
    departmentId: departmentId || 'dept_office',
    departmentName: dept.name,
    service,
    scheduledDate,
    scheduledTime,
    notes: notes || ''
  });

  res.status(201).json({
    success: true,
    data: newApt,
    message: 'Appointment scheduled successfully'
  });
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
router.put('/:id', protect, adminOnly, (req, res) => {
  const updated = store.updateAppointment(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }
  res.json({
    success: true,
    data: updated,
    message: 'Appointment updated successfully'
  });
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
router.delete('/:id', protect, adminOnly, (req, res) => {
  const deleted = store.deleteAppointment(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }
  res.json({
    success: true,
    message: 'Appointment removed'
  });
});

module.exports = router;
