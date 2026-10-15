const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const counterRoutes = require('./routes/counterRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for debug
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root & Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'QueueLess API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/counters', counterRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);

const path = require('path');
const fs = require('fs');

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found` });
});

// Centralized error handler
app.use(errorHandler);

// Serve Frontend Static Distribution in Production / Cloud deployment
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 QueueLess Backend Server running on port ${PORT}`);
  console.log(`📍 Base API URL: http://localhost:${PORT}/api`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`👤 Student Demo: student@queueless.com / student123`);
  console.log(`🛡️ Admin Demo:   24r21a6620@mlrit.ac.in / admin123`);
  console.log(`====================================================`);
});

// Graceful shutdown handling for Cloud Containers
const gracefulShutdown = (signal) => {
  console.log(`\n[QueueLess Server] Received ${signal}. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log('[QueueLess Server] HTTP server closed cleanly. Exiting process.');
    process.exit(0);
  });
  // Force shutdown after 10s if hanging
  setTimeout(() => {
    console.error('[QueueLess Server] Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

