import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('queueless_token'));
  const [loading, setLoading] = useState(true);
  const [adminChallenge, setAdminChallenge] = useState(null);

  // Initialize and verify user session on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('queueless_token');
      if (storedToken) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.warn("Session expired, clearing token:", err.message);
          localStorage.removeItem('queueless_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier, password, method) => {
    const data = await api.login(identifier, password, method);
    if (data.requireOtp) {
      setAdminChallenge(data);
      return data;
    }
    localStorage.setItem('queueless_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setAdminChallenge(null);
    return data.user;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('queueless_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const demoLogin = async (role = 'student') => {
    const data = await api.demoLogin(role);
    if (data.requireOtp) {
      setAdminChallenge(data);
      return data;
    }
    localStorage.setItem('queueless_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setAdminChallenge(null);
    return data.user;
  };

  const verifyAdminOtp = async (otp) => {
    if (!adminChallenge?.tempSessionId) {
      throw new Error('No active verification session found. Please log in again.');
    }
    const data = await api.adminVerifyOtp(adminChallenge.tempSessionId, otp);
    localStorage.setItem('queueless_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setAdminChallenge(null);
    return data.user;
  };

  const resendAdminOtp = async (method) => {
    if (!adminChallenge?.tempSessionId) {
      throw new Error('No active verification session found.');
    }
    const data = await api.adminResendOtp(adminChallenge.tempSessionId, method);
    setAdminChallenge(prev => ({
      ...prev,
      method: data.method,
      maskedEmail: data.maskedEmail,
      maskedPhone: data.maskedPhone,
      expiresAt: data.expiresAt,
      cooldownSeconds: data.cooldownSeconds,
      isSimulated: data.isSimulated,
      devNotice: data.devNotice
    }));
    return data;
  };

  const cancelAdminOtp = () => {
    setAdminChallenge(null);
  };

  const updateProfile = async (updates) => {
    const updated = await api.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const logout = () => {
    localStorage.removeItem('queueless_token');
    setToken(null);
    setUser(null);
    setAdminChallenge(null);
  };

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStudent,
        adminChallenge,
        setAdminChallenge,
        login,
        register,
        demoLogin,
        verifyAdminOtp,
        resendAdminOtp,
        cancelAdminOtp,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
