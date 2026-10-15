// Frontend API Client with automatic live-backend connection & resilient fallback

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('queueless_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // --- AUTH ---
  async login(identifier, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getAdminRegisterStatus() {
    const res = await fetch(`${API_BASE}/auth/admin/register-status`);
    const data = await res.json();
    return data;
  },

  async sendAdminRegistrationOtp(phone, email) {
    const res = await fetch(`${API_BASE}/auth/admin/send-registration-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to dispatch phone verification code');
    return data;
  },

  async registerAdmin(adminData) {
    const res = await fetch(`${API_BASE}/auth/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Admin registration failed');
    return data;
  },

  async demoLogin(role) {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Demo login failed');
    return data;
  },

  async adminVerifyOtp(tempSessionId, otp) {
    const res = await fetch(`${API_BASE}/auth/admin/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempSessionId, otp })
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || 'OTP verification failed');
      err.code = data.code;
      err.attemptsRemaining = data.attemptsRemaining;
      throw err;
    }
    return data;
  },

  async adminResendOtp(tempSessionId, method) {
    const res = await fetch(`${API_BASE}/auth/admin/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempSessionId, method })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to resend verification code');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data.user;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data.user;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to change password');
    return data;
  },

  async getAdminConfigStatus() {
    const res = await fetch(`${API_BASE}/auth/admin/config-status`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load configuration status');
    return data;
  },

  async getAdminActivityLogs() {
    const res = await fetch(`${API_BASE}/auth/admin/activity-logs`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch activity logs');
    return data.logs || [];
  },

  async requestAdminContactUpdate(type, value) {
    const res = await fetch(`${API_BASE}/auth/admin/update-contact-request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ type, value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send verification code');
    return data;
  },

  async verifyAdminContactUpdate(sessionId, otp, type, value) {
    const res = await fetch(`${API_BASE}/auth/admin/update-contact-verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ sessionId, otp, type, value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to verify code');
    return data;
  },

  // --- DEPARTMENTS & SERVICES ---
  async getDepartments() {
    const res = await fetch(`${API_BASE}/departments`);
    const data = await res.json();
    return data.data || [];
  },

  async updateDepartment(departmentId, updates) {
    const res = await fetch(`${API_BASE}/departments/${departmentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update service');
    return data.data;
  },

  async createDepartment(departmentData) {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(departmentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create service');
    return data.data;
  },

  // --- COUNTERS ---
  async getCounters() {
    const res = await fetch(`${API_BASE}/counters`);
    const data = await res.json();
    return data.data || [];
  },

  async updateCounter(counterId, updates) {
    const res = await fetch(`${API_BASE}/counters/${counterId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update counter');
    return data.data;
  },

  // --- TOKENS ---
  async getLiveQueue() {
    const res = await fetch(`${API_BASE}/tokens/live-status`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.data;
  },

  async getUserTokens() {
    const res = await fetch(`${API_BASE}/tokens/my-tokens`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.data || [];
  },

  async getAllTokens() {
    const res = await fetch(`${API_BASE}/tokens`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.data || [];
  },

  async joinQueue(departmentId, service) {
    const res = await fetch(`${API_BASE}/tokens/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ departmentId, service })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to join queue');
    return data.data;
  },

  async callNext(departmentId, counterNumber) {
    const res = await fetch(`${API_BASE}/tokens/call-next`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ departmentId, counterNumber })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to call next token');
    return data;
  },

  async completeToken(tokenId) {
    const res = await fetch(`${API_BASE}/tokens/${tokenId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to complete token');
    return data;
  },

  async skipToken(tokenId, autoNext = true) {
    const res = await fetch(`${API_BASE}/tokens/${tokenId}/skip?autoNext=${autoNext}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to skip token');
    return data;
  },

  async recallToken(tokenId) {
    const res = await fetch(`${API_BASE}/tokens/${tokenId}/recall`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to recall token');
    return data;
  },

  async cancelToken(tokenId) {
    const res = await fetch(`${API_BASE}/tokens/${tokenId}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to cancel token');
    return data;
  },

  async transferToken(tokenId, transferData) {
    const res = await fetch(`${API_BASE}/tokens/${tokenId}/transfer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(transferData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to transfer token');
    return data;
  },

  async searchTokens(query) {
    const res = await fetch(`${API_BASE}/tokens/search?q=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.data || [];
  },

  async rateToken(tokenId, rating, feedback) {
    const res = await fetch(`${API_BASE}/tokens/${tokenId}/rate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, feedback })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit rating');
    return data;
  },

  async getServiceRecords() {
    const res = await fetch(`${API_BASE}/tokens/service-records`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.data || [];
  },

  // --- ANALYTICS & SYSTEM ---
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.data;
  },

  async resetDemo() {
    const res = await fetch(`${API_BASE}/analytics/reset-demo`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reset demo data');
    return data;
  },

  // --- NOTIFICATIONS ---
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.data || [];
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async broadcastNotification(data) {
    const res = await fetch(`${API_BASE}/notifications/broadcast`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to dispatch announcement');
    return result;
  },

  // --- APPOINTMENTS ---
  async getAppointments() {
    const res = await fetch(`${API_BASE}/appointments`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.data || [];
  },

  async createAppointment(aptData) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(aptData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to schedule appointment');
    return data.data;
  },

  async updateAppointment(id, updates) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update appointment');
    return data.data;
  },

  async deleteAppointment(id) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete appointment');
    return data;
  },

  // --- FEEDBACK & RATINGS ---
  async getFeedbacks() {
    const res = await fetch(`${API_BASE}/feedback`);
    const data = await res.json();
    return data;
  },

  async submitFeedback(feedbackData) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(feedbackData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit feedback');
    return data.data;
  },

  // --- SETTINGS ---
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    const data = await res.json();
    return data.data;
  },

  async updateSettings(updates) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update settings');
    return data.data;
  },

  // --- USERS & ROLES ---
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/users${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.data || [];
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create user');
    return data.data;
  },

  async updateUserRole(id, updates) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update user');
    return data.data;
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete user');
    return data;
  }
};
