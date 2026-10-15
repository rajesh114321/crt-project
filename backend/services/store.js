const fs = require('fs');
const path = require('path');
const {
  initialUsers,
  initialDepartments,
  initialCounters,
  initialTokens,
  initialNotifications,
  initialAppointments,
  initialFeedbacks,
  initialSettings,
  analyticsData
} = require('../data/demoData');

const DB_FILE = path.join(__dirname, '../data/db.json');

class Store {
  constructor() {
    this.data = {
      users: [...initialUsers],
      departments: [...initialDepartments],
      counters: [...initialCounters],
      tokens: [...initialTokens],
      notifications: [...initialNotifications],
      appointments: [...initialAppointments],
      feedbacks: [...initialFeedbacks],
      loginLogs: [],
      settings: JSON.parse(JSON.stringify(initialSettings)),
      analytics: JSON.parse(JSON.stringify(analyticsData))
    };
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.tokens && parsed.counters) {
          this.data = parsed;
          if (!this.data.appointments) this.data.appointments = [...initialAppointments];
          if (!this.data.feedbacks) this.data.feedbacks = [...initialFeedbacks];
          if (!this.data.loginLogs) this.data.loginLogs = [];
          if (!this.data.settings) this.data.settings = JSON.parse(JSON.stringify(initialSettings));
          return;
        }
      }
      this.saveToFile();
    } catch (err) {
      console.warn("Using in-memory store due to load error:", err.message);
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.warn("Failed saving state to disk:", err.message);
    }
  }

  // --- USERS ---
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmailOrStudentId(identifier) {
    const clean = identifier.trim().toLowerCase();
    return this.data.users.find(u => 
      u.email.toLowerCase() === clean || 
      (u.studentId && u.studentId.toLowerCase() === clean) ||
      (u.secondaryEmail && u.secondaryEmail.toLowerCase() === clean)
    );
  }

  getUserByPhone(phone) {
    if (!phone) return null;
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) return null;
    const last10 = cleanDigits.slice(-10);
    return this.data.users.find(u => {
      if (!u.phone) return false;
      const uDigits = u.phone.replace(/[^0-9]/g, '');
      return uDigits.slice(-10) === last10;
    });
  }

  getAdminsCount() {
    return this.data.users.filter(u => u.role === 'admin').length;
  }

  createUser(userData) {
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...userData
    };
    this.data.users.push(newUser);
    this.saveToFile();
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveToFile();
    return this.data.users[idx];
  }

  // --- LOGIN ACTIVITY LOGS ---
  addLoginLog(log) {
    if (!this.data.loginLogs) {
      this.data.loginLogs = [];
    }
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.data.loginLogs.unshift(newLog);
    // Keep last 100 entries
    if (this.data.loginLogs.length > 100) {
      this.data.loginLogs = this.data.loginLogs.slice(0, 100);
    }
    this.saveToFile();
    return newLog;
  }

  getLoginLogs(userId, limit = 20) {
    if (!this.data.loginLogs) return [];
    if (userId) {
      return this.data.loginLogs.filter(l => l.userId === userId).slice(0, limit);
    }
    return this.data.loginLogs.slice(0, limit);
  }

  // --- DEPARTMENTS ---
  getDepartments() {
    return this.data.departments;
  }

  getDepartmentById(id) {
    return this.data.departments.find(d => d.id === id);
  }

  updateDepartment(id, updates) {
    const idx = this.data.departments.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.departments[idx] = { ...this.data.departments[idx], ...updates };
    this.saveToFile();
    return this.data.departments[idx];
  }

  addDepartment(deptData) {
    const newDept = {
      id: deptData.id || `dept_${Date.now()}`,
      name: deptData.name,
      code: deptData.code || (deptData.name ? deptData.name[0].toUpperCase() : 'S'),
      location: deptData.location || "Campus Service Desk",
      avgServiceTimeMinutes: Number(deptData.avgServiceTimeMinutes) || 3,
      description: deptData.description || "",
      active: deptData.active !== undefined ? deptData.active : true,
      services: deptData.services || [
        {
          id: `srv_${Date.now()}`,
          name: deptData.name,
          code: deptData.code || (deptData.name ? deptData.name[0].toUpperCase() : 'S'),
          estimatedMinutes: Number(deptData.avgServiceTimeMinutes) || 3,
          description: "General Service"
        }
      ]
    };
    this.data.departments.push(newDept);
    this.saveToFile();
    return newDept;
  }

  // --- COUNTERS ---
  getCounters() {
    return this.data.counters;
  }

  getCounterById(id) {
    return this.data.counters.find(c => c.id === id);
  }

  getCounterByNumber(num) {
    return this.data.counters.find(c => c.counterNumber === Number(num));
  }

  updateCounter(id, updates) {
    const idx = this.data.counters.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.counters[idx] = { ...this.data.counters[idx], ...updates };
    this.saveToFile();
    return this.data.counters[idx];
  }

  // --- TOKENS ---
  getTokens() {
    return this.data.tokens;
  }

  getTokenById(id) {
    if (!id) return null;
    return this.data.tokens.find(t => 
      t.id === id || (t.tokenNumber && t.tokenNumber.toUpperCase() === id.toUpperCase())
    );
  }

  getTokenByNumber(tokenNumber) {
    if (!tokenNumber) return null;
    return this.data.tokens.find(t => t.tokenNumber.toUpperCase() === tokenNumber.toUpperCase());
  }

  getActiveTokens() {
    return this.data.tokens.filter(t => t.status === 'WAITING' || t.status === 'CALLING');
  }

  getTokensByDepartment(departmentId) {
    return this.data.tokens.filter(t => t.departmentId === departmentId);
  }

  getTokensByUser(userId) {
    return this.data.tokens.filter(t => t.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createToken({ userId, studentName, studentId, departmentId, service }) {
    const dept = this.getDepartmentById(departmentId);
    if (!dept) throw new Error("Department not found");

    // Generate unique token number with Dept code, e.g. F-038
    const deptTokens = this.data.tokens.filter(t => t.departmentId === departmentId);
    const code = dept.code || "T";
    
    // Find highest token number for department today
    let maxNum = 20;
    deptTokens.forEach(t => {
      const parts = t.tokenNumber.split('-');
      if (parts.length === 2) {
        const n = parseInt(parts[1], 10);
        if (!isNaN(n) && n > maxNum) maxNum = n;
      }
    });
    const nextSeq = String(maxNum + 1).padStart(3, '0');
    const tokenNumber = `${code}-${nextSeq}`;

    // Find assigned active counter for this department
    const counter = this.data.counters.find(c => c.departmentId === departmentId && c.status === 'Active') ||
                    this.data.counters.find(c => c.departmentId === departmentId) ||
                    this.data.counters[0];

    const newToken = {
      id: `tok_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tokenNumber,
      userId,
      studentName,
      studentId,
      departmentId,
      departmentName: dept.name,
      service,
      status: 'WAITING',
      counter: counter ? counter.counterNumber : 1,
      createdAt: new Date().toISOString(),
      calledAt: null,
      completedAt: null
    };

    this.data.tokens.push(newToken);

    // Create confirmation notification for student
    this.createNotification({
      userId,
      title: `Token ${tokenNumber} Issued`,
      message: `You joined the queue for ${service} at ${dept.name}. Your token is ${tokenNumber}.`,
      type: 'info'
    });

    this.saveToFile();
    return newToken;
  }

  // Call Next Token for a department/counter
  callNextToken({ departmentId, counterNumber }) {
    const deptTokens = this.data.tokens.filter(t => 
      t.departmentId === departmentId && t.status === 'WAITING'
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (deptTokens.length === 0) {
      return null;
    }

    const nextToken = deptTokens[0];
    nextToken.status = 'CALLING';
    nextToken.calledAt = new Date().toISOString();
    nextToken.counter = counterNumber || nextToken.counter;

    // Update counter's current token
    const counter = this.data.counters.find(c => c.counterNumber === nextToken.counter);
    if (counter) {
      counter.currentToken = nextToken.tokenNumber;
    }

    // Notify the student that their turn is now!
    this.createNotification({
      userId: nextToken.userId,
      title: "🔔 Your turn is near!",
      message: `Token ${nextToken.tokenNumber}: Please proceed immediately to Counter ${nextToken.counter} for ${nextToken.service}.`,
      type: 'alert'
    });

    // Check who is next in line (1-2 positions away) and notify them too
    if (deptTokens.length > 1) {
      const nearToken = deptTokens[1];
      this.createNotification({
        userId: nearToken.userId,
        title: "🔔 Your turn is approaching!",
        message: `Token ${nearToken.tokenNumber}: You are next in line! Currently serving ${nextToken.tokenNumber} at Counter ${nextToken.counter}. Please be ready.`,
        type: 'warning'
      });
    }

    this.saveToFile();
    return nextToken;
  }

  // Complete Token
  completeToken(tokenId) {
    const token = this.getTokenById(tokenId);
    if (!token) return null;

    token.status = 'COMPLETED';
    token.completedAt = new Date().toISOString();

    // Clear counter's current token if it matches
    const counter = this.data.counters.find(c => c.currentToken === token.tokenNumber);
    if (counter) {
      counter.currentToken = null;
    }

    this.createNotification({
      userId: token.userId,
      title: "Token Completed",
      message: `Your token ${token.tokenNumber} for ${token.service} has been marked completed. Thank you!`,
      type: 'success'
    });

    this.saveToFile();
    return token;
  }

  // Skip Token (No-Show)
  skipToken(tokenId) {
    const token = this.getTokenById(tokenId);
    if (!token) return null;

    token.status = 'SKIPPED';
    token.completedAt = null;

    // Clear counter's current token if it matches
    const counter = this.data.counters.find(c => c.currentToken === token.tokenNumber);
    if (counter) {
      counter.currentToken = null;
    }

    this.createNotification({
      userId: token.userId,
      title: "Token Skipped (No-Show)",
      message: `Token ${token.tokenNumber} was marked skipped as you did not report to Counter ${token.counter}. Please generate a new token if needed.`,
      type: 'warning'
    });

    this.saveToFile();
    return token;
  }

  // Recall Token (Re-calling a token that was waiting or skipped)
  recallToken(tokenId) {
    const token = this.getTokenById(tokenId);
    if (!token) return null;

    token.status = 'CALLING';
    token.calledAt = new Date().toISOString();

    const counter = this.data.counters.find(c => c.counterNumber === token.counter);
    if (counter) {
      counter.currentToken = token.tokenNumber;
    }

    this.createNotification({
      userId: token.userId,
      title: "🔔 Token Recalled!",
      message: `Token ${token.tokenNumber} is being recalled at Counter ${token.counter}. Please report now!`,
      type: 'alert'
    });

    this.saveToFile();
    return token;
  }

  // Transfer Token (to another department/counter)
  transferToken(tokenId, { departmentId, counterNumber, reason }) {
    const token = this.getTokenById(tokenId);
    if (!token) return null;

    if (departmentId) {
      const dept = this.getDepartmentById(departmentId);
      if (dept) {
        token.departmentId = dept.id;
        token.departmentName = dept.name;
      }
    }

    if (counterNumber) {
      token.counter = Number(counterNumber);
    }

    token.status = 'WAITING';
    token.transferredAt = new Date().toISOString();
    token.transferReason = reason || 'Transferred by staff';

    const counter = this.data.counters.find(c => c.currentToken === token.tokenNumber);
    if (counter) {
      counter.currentToken = null;
    }

    this.createNotification({
      userId: token.userId,
      title: "🔄 Token Transferred",
      message: `Token ${token.tokenNumber} has been reassigned to ${token.departmentName} (Counter ${token.counter}).`,
      type: 'info'
    });

    this.saveToFile();
    return token;
  }

  // Cancel Token (by student)
  cancelToken(tokenId, userId) {
    const token = this.getTokenById(tokenId);
    if (!token) return null;
    if (userId && token.userId !== userId) {
      throw new Error("Unauthorized to cancel this token");
    }

    token.status = 'CANCELLED';

    const counter = this.data.counters.find(c => c.currentToken === token.tokenNumber);
    if (counter) {
      counter.currentToken = null;
    }

    this.createNotification({
      userId: token.userId,
      title: "Token Cancelled",
      message: `Token ${token.tokenNumber} has been successfully cancelled.`,
      type: 'info'
    });

    this.saveToFile();
    return token;
  }

  // Search Tokens
  searchTokens(query) {
    if (!query) return this.data.tokens;
    const q = query.trim().toLowerCase();
    return this.data.tokens.filter(t => 
      t.tokenNumber.toLowerCase().includes(q) ||
      (t.studentName && t.studentName.toLowerCase().includes(q)) ||
      (t.studentId && t.studentId.toLowerCase().includes(q)) ||
      (t.departmentName && t.departmentName.toLowerCase().includes(q)) ||
      (t.service && t.service.toLowerCase().includes(q))
    );
  }

  // Rate Token & Feedback
  rateToken(tokenId, rating, comment) {
    const token = this.getTokenById(tokenId);
    if (!token) return null;
    token.rating = Number(rating);
    token.feedback = (comment || '').trim();
    token.ratedAt = new Date().toISOString();
    this.saveToFile();
    return token;
  }

  // Service Records (Completed services with duration)
  getServiceRecords() {
    return this.data.tokens
      .filter(t => t.status === 'COMPLETED' && t.completedAt)
      .map(t => {
        const start = t.calledAt || t.createdAt;
        const end = t.completedAt;
        const diffSeconds = Math.max(15, Math.round((new Date(end) - new Date(start)) / 1000));
        return {
          id: t.id,
          tokenNumber: t.tokenNumber,
          studentName: t.studentName,
          studentId: t.studentId,
          departmentName: t.departmentName,
          service: t.service,
          counter: t.counter,
          counterName: `Counter ${t.counter}`,
          startedAt: start,
          completedAt: end,
          durationSeconds: diffSeconds,
          durationFormatted: diffSeconds < 60 ? `${diffSeconds} sec` : `${(diffSeconds / 60).toFixed(1)} min`,
          rating: t.rating || null,
          feedback: t.feedback || null
        };
      })
      .reverse();
  }

  // Reset Demo Data
  resetDemo() {
    this.data = {
      users: [...initialUsers],
      departments: [...initialDepartments],
      counters: [...initialCounters],
      tokens: [...initialTokens],
      notifications: [...initialNotifications],
      analytics: JSON.parse(JSON.stringify(analyticsData))
    };
    this.saveToFile();
    return true;
  }

  // --- NOTIFICATIONS ---
  getNotificationsByUser(userId) {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createNotification({ userId, title, message, type = 'info' }) {
    const notif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.unshift(notif);
    this.saveToFile();
    return notif;
  }

  markNotificationRead(id) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveToFile();
    }
    return notif;
  }

  markAllNotificationsRead(userId) {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this.saveToFile();
  }

  // --- ANALYTICS ---
  getAnalytics() {
    const tokens = this.data.tokens;
    const completed = tokens.filter(t => t.status === 'COMPLETED').length;
    const waiting = tokens.filter(t => t.status === 'WAITING').length;
    const calling = tokens.filter(t => t.status === 'CALLING').length;
    const skipped = tokens.filter(t => t.status === 'SKIPPED').length;
    const cancelled = tokens.filter(t => t.status === 'CANCELLED').length;
    const totalToday = tokens.length + 320; // adding historical baseline

    return {
      summary: {
        totalTokensToday: totalToday,
        currentlyWaiting: waiting + calling,
        completed: completed + 270,
        skipped: skipped + 23,
        cancelled: cancelled + 12,
        averageWaitingTimeMinutes: 16,
        averageServiceTimeMinutes: 3.4,
        peakHours: "11:00 AM – 1:00 PM",
        mostBusyDepartment: "Accounts Section"
      },
      dailyVolume: this.data.analytics.dailyVolume,
      departmentBreakdown: this.data.analytics.departmentBreakdown,
      hourlyTraffic: this.data.analytics.hourlyTraffic,
      activeCountersCount: this.data.counters.filter(c => c.status === 'Active').length
    };
  }

  // --- APPOINTMENTS ---
  getAppointments() {
    return this.data.appointments || [];
  }

  createAppointment(aptData) {
    const newApt = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      ...aptData
    };
    if (!this.data.appointments) this.data.appointments = [];
    this.data.appointments.unshift(newApt);
    this.saveToFile();
    return newApt;
  }

  updateAppointment(id, updates) {
    if (!this.data.appointments) return null;
    const idx = this.data.appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.appointments[idx] = { ...this.data.appointments[idx], ...updates };
    this.saveToFile();
    return this.data.appointments[idx];
  }

  deleteAppointment(id) {
    if (!this.data.appointments) return false;
    const initialLen = this.data.appointments.length;
    this.data.appointments = this.data.appointments.filter(a => a.id !== id);
    this.saveToFile();
    return this.data.appointments.length !== initialLen;
  }

  // --- FEEDBACK ---
  getFeedbacks() {
    return this.data.feedbacks || [];
  }

  createFeedback(feedbackData) {
    const newFb = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      sentiment: Number(feedbackData.rating) >= 4 ? 'Positive' : (Number(feedbackData.rating) === 3 ? 'Neutral' : 'Needs Improvement'),
      ...feedbackData
    };
    if (!this.data.feedbacks) this.data.feedbacks = [];
    this.data.feedbacks.unshift(newFb);
    this.saveToFile();
    return newFb;
  }

  // --- SETTINGS ---
  getSettings() {
    return this.data.settings || JSON.parse(JSON.stringify(initialSettings));
  }

  updateSettings(updates) {
    this.data.settings = {
      ...this.getSettings(),
      ...updates
    };
    this.saveToFile();
    return this.data.settings;
  }

  // --- USERS MANAGEMENT ---
  deleteUser(id) {
    const user = this.getUserById(id);
    if (!user || user.role === 'admin') return false; // Prevent deleting master admin
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.saveToFile();
    return true;
  }

  // --- COUNTER ACTIONS ---
  pauseCounter(id) {
    return this.updateCounter(id, { status: 'Paused' });
  }

  resumeCounter(id) {
    return this.updateCounter(id, { status: 'Active' });
  }

  // --- BROADCAST NOTIFICATIONS ---
  createBroadcastNotification({ title, message, type = 'info' }) {
    const students = this.data.users.filter(u => u.role === 'student');
    const createdNotifs = [];
    students.forEach(student => {
      const notif = this.createNotification({
        userId: student.id,
        title,
        message,
        type
      });
      createdNotifs.push(notif);
    });
    return createdNotifs;
  }
}

const store = new Store();
module.exports = store;
