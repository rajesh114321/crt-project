import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Settings, 
  ShieldCheck, 
  Clock, 
  Volume2, 
  SlidersHorizontal, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Mail,
  Phone,
  Lock,
  KeyRound,
  History,
  Activity,
  Server,
  AlertCircle,
  HelpCircle,
  Check,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const AdminSettingsPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useNotifications();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('security'); // 'security' | 'system'
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // System Rules State
  const [settings, setSettings] = useState({
    systemName: 'QueueLess – Smart Digital Token System',
    maxTokensPerStudent: 1,
    avgServiceTimeMinutes: 5,
    noShowTimeoutMinutes: 10,
    audioChimeEnabled: true,
    voiceAnnouncementEnabled: true,
    requireAdminOtp: true,
    preferredOtpMethod: 'email',
    campusOpenTime: '09:00',
    campusCloseTime: '17:00',
    lanes: [
      { lane: '01', name: 'Admin Office', deptId: 'dept-office' },
      { lane: '02', name: 'Accounts Section', deptId: 'dept-accounts' },
      { lane: '03', name: 'Central Library', deptId: 'dept-library' },
      { lane: '04', name: 'Campus Canteen', deptId: 'dept-canteen' },
    ]
  });

  // Gateway status
  const [configStatus, setConfigStatus] = useState(null);

  // Activity logs
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Contact update modal / state
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    type: 'email', // 'email' | 'phone'
    step: 'input', // 'input' | 'otp'
    value: '',
    sessionId: null,
    maskedTarget: '',
    otpDigits: ['', '', '', '', '', ''],
    loading: false,
    error: '',
    devNotice: '',
    devOtp: ''
  });

  // Password change state
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    loading: false,
    error: '',
    success: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsData, statusData, logsData] = await Promise.all([
        api.getSettings().catch(() => null),
        api.getAdminConfigStatus().catch(() => null),
        api.getAdminActivityLogs().catch(() => [])
      ]);

      if (settingsData) setSettings(prev => ({ ...prev, ...settingsData }));
      if (statusData) setConfigStatus(statusData);
      if (logsData) setActivityLogs(logsData);
    } catch (e) {
      console.warn('Failed loading settings data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSystemSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.updateSettings(settings);
      showToast('System rules and queue thresholds saved successfully!', 'success', 'Settings Saved');
    } catch (e) {
      showToast(e.message || 'Failed to save settings', 'warning', 'Error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Start contact update (send OTP)
  const handleOpenContactUpdate = (type) => {
    setUpdateModal({
      isOpen: true,
      type,
      step: 'input',
      value: type === 'email' ? (user?.email || '') : (user?.phone || ''),
      sessionId: null,
      maskedTarget: '',
      otpDigits: ['', '', '', '', '', ''],
      loading: false,
      error: '',
      devNotice: '',
      devOtp: ''
    });
  };

  const handleRequestContactOtp = async (e) => {
    e.preventDefault();
    setUpdateModal(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const res = await api.requestAdminContactUpdate(updateModal.type, updateModal.value);
      setUpdateModal(prev => ({
        ...prev,
        step: 'otp',
        sessionId: res.sessionId,
        maskedTarget: res.maskedTarget,
        loading: false,
        devNotice: res.devNotice || '',
        devOtp: res.devOtp || ''
      }));
      showToast(`Verification code dispatched to ${res.maskedTarget}`, 'info', 'OTP Sent');
    } catch (err) {
      setUpdateModal(prev => ({ ...prev, loading: false, error: err.message || 'Failed to request OTP' }));
    }
  };

  const handleVerifyContactOtp = async (e) => {
    e.preventDefault();
    const otp = updateModal.otpDigits.join('');
    if (otp.length !== 6) {
      setUpdateModal(prev => ({ ...prev, error: 'Please enter all 6 digits of your verification code.' }));
      return;
    }

    setUpdateModal(prev => ({ ...prev, loading: true, error: '' }));
    try {
      const res = await api.verifyAdminContactUpdate(
        updateModal.sessionId,
        otp,
        updateModal.type,
        updateModal.value
      );
      if (res.user) {
        await updateProfile(res.user);
      }
      setUpdateModal(prev => ({ ...prev, isOpen: false, loading: false }));
      showToast(res.message || 'Contact details updated successfully!', 'success', 'Verified');
      // Refresh logs
      const updatedLogs = await api.getAdminActivityLogs().catch(() => []);
      setActivityLogs(updatedLogs);
    } catch (err) {
      setUpdateModal(prev => ({ ...prev, loading: false, error: err.message || 'Verification failed.' }));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordState(prev => ({ ...prev, error: '', success: '', loading: true }));

    if (!passwordState.currentPassword) {
      setPasswordState(prev => ({ ...prev, loading: false, error: 'Please enter your current password.' }));
      return;
    }
    if (passwordState.newPassword.length < 6) {
      setPasswordState(prev => ({ ...prev, loading: false, error: 'New password must be at least 6 characters.' }));
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordState(prev => ({ ...prev, loading: false, error: 'New passwords do not match.' }));
      return;
    }

    try {
      const res = await api.changePassword(passwordState.currentPassword, passwordState.newPassword);
      setPasswordState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        loading: false,
        error: '',
        success: res.message || 'Password updated successfully!'
      });
      showToast('Administrator password updated successfully with bcrypt hashing.', 'success', 'Password Changed');
      const updatedLogs = await api.getAdminActivityLogs().catch(() => []);
      setActivityLogs(updatedLogs);
    } catch (err) {
      setPasswordState(prev => ({ ...prev, loading: false, error: err.message || 'Failed to change password.' }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-400" />
            Administrator Settings & 2FA Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your registered administrator contact info, 2FA verification policies, password, and campus queue rules.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Security & 2FA</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'system'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Campus Queue Rules</span>
          </button>
        </div>
      </div>

      {activeTab === 'security' ? (
        /* TAB 1: ADMIN SECURITY & 2FA CREDENTIALS */
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: Registered Administrator Contact Details */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                  <h2 className="text-sm font-bold text-white">Registered Administrator Identity</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                  Role: Super Admin
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Full Name */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Administrator Name</span>
                    <span className="text-white font-bold text-sm">{user?.name || 'Rajesh Guguloth'}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-xs">{user?.studentId || 'ADMIN-01'}</span>
                </div>

                {/* Registered Gmail Address */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Registered Gmail Address</span>
                      <span className="text-white font-mono font-bold text-sm">
                        {user?.email || '24r21a6620@mlrit.ac.in'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenContactUpdate('email')}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    Update Gmail
                  </button>
                </div>

                {/* Registered Phone Number */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Registered Mobile Number</span>
                      <span className="text-white font-mono font-bold text-sm">
                        {user?.phone || '+91 8121301736'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenContactUpdate('phone')}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    Update Mobile
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Changes to contact information require immediate one-time cryptographic code verification before saving.</span>
                </div>
              </div>
            </div>

            {/* Card 2: Change Password with Bcrypt */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-400" />
                  <h2 className="text-sm font-bold text-white">Change Administrator Password</h2>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Bcrypt Salted</span>
              </div>

              {passwordState.error && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordState.error}</span>
                </div>
              )}

              {passwordState.success && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passwordState.success}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current Password:</label>
                  <input
                    type="password"
                    value={passwordState.currentPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">New Password (min 6 characters):</label>
                  <input
                    type="password"
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Confirm New Password:</label>
                  <input
                    type="password"
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordState.loading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {passwordState.loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Update Administrator Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

          {/* Card 3: Cloud Messaging & Gateway Configuration Status */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Server className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Cloud Delivery Gateways & Verification Health</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Gmail SMTP Status */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <span>Gmail SMTP Gateway</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    configStatus?.gmail?.configured
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {configStatus?.gmail?.configured ? 'Active (Live SMTP)' : 'Local Simulator Mode'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {configStatus?.gmail?.instructions || 'Configure GMAIL_APP_PASSWORD in backend/.env to dispatch live emails directly.'}
                </p>
                <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-slate-900">
                  From: {configStatus?.gmail?.user || '24r21a6620@mlrit.ac.in'}
                </div>
              </div>

              {/* Twilio SMS Status */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-purple-400" />
                    <span>Twilio SMS Gateway</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    configStatus?.twilio?.configured
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {configStatus?.twilio?.configured ? 'Active (Live SMS)' : 'Local Simulator Mode'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {configStatus?.twilio?.instructions || 'Configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER for real SMS.'}
                </p>
                <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-slate-900">
                  Destination: {user?.phone || '+91 8121301736'}
                </div>
              </div>

            </div>
          </div>

          {/* Card 4: Recent Login Activity Log (Audit Trail) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Recent Login & Security Activity Log</h2>
              </div>
              <button
                type="button"
                onClick={loadData}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 font-semibold text-[11px]">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {activityLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-500 font-sans">
                        No login activity recorded yet.
                      </td>
                    </tr>
                  ) : (
                    activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-3 text-white font-bold">{log.action}</td>
                        <td className="py-2.5 px-3 text-purple-300">{log.method}</td>
                        <td className="py-2.5 px-3 text-slate-400">{log.ip}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'Success' 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : log.status === 'Challenged' 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate font-sans">
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* TAB 2: SYSTEM RULES & QUEUE POLICIES */
        <form onSubmit={handleSaveSystemSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          
          {/* Card 1: Queue Policies & Limits */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <SlidersHorizontal className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Queue Rules & Thresholds</h2>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Max Active Tokens per Student:
                </label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={settings.maxTokensPerStudent}
                  onChange={(e) => setSettings({ ...settings, maxTokensPerStudent: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Prevents students from blocking multiple counters simultaneously.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Average Service Time Estimate (Minutes):
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.avgServiceTimeMinutes}
                  onChange={(e) => setSettings({ ...settings, avgServiceTimeMinutes: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Used to compute estimated student waiting times.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  No-Show Timeout (Minutes):
                </label>
                <input
                  type="number"
                  min="3"
                  max="30"
                  value={settings.noShowTimeoutMinutes}
                  onChange={(e) => setSettings({ ...settings, noShowTimeoutMinutes: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Time before an unattended calling token is automatically flagged as No-Show.
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Operating Hours */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Campus Operating Hours</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Opening Time:</label>
                <input
                  type="time"
                  value={settings.campusOpenTime}
                  onChange={(e) => setSettings({ ...settings, campusOpenTime: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Closing Time:</label>
                <input
                  type="time"
                  value={settings.campusCloseTime}
                  onChange={(e) => setSettings({ ...settings, campusCloseTime: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Tokens generated outside operating hours will be scheduled for the next business morning.
            </span>
          </div>

          {/* Card 3: Audio & Chime Policies */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Volume2 className="w-5 h-5 text-purple-400" />
              <h2 className="text-sm font-bold text-white">Audio & Chime Announcements</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-white block">Ding-Dong Audio Chime</span>
                  <span className="text-[11px] text-slate-400">Play pleasant synthesized chime when calling next token</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.audioChimeEnabled}
                  onChange={(e) => setSettings({ ...settings, audioChimeEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-white block">Speech Synthesis Announcement</span>
                  <span className="text-[11px] text-slate-400">Voice broadcast: "Token F-101 please report to Counter 1"</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.voiceAnnouncementEnabled}
                  onChange={(e) => setSettings({ ...settings, voiceAnnouncementEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save System Rules</span>
            </button>
          </div>

        </form>
      )}

      {/* Contact Update Verification Modal */}
      {updateModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Update {updateModal.type === 'phone' ? 'Mobile Number' : 'Gmail Address'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUpdateModal(prev => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            {updateModal.error && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{updateModal.error}</span>
              </div>
            )}

            {updateModal.step === 'input' ? (
              <form onSubmit={handleRequestContactOtp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Enter New {updateModal.type === 'phone' ? 'Mobile Number (+91)' : 'Gmail Address'}:
                  </label>
                  <input
                    type={updateModal.type === 'phone' ? 'tel' : 'email'}
                    value={updateModal.value}
                    onChange={(e) => setUpdateModal(prev => ({ ...prev, value: e.target.value }))}
                    placeholder={updateModal.type === 'phone' ? '+91 8121301736' : '24r21a6620@mlrit.ac.in'}
                    required
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    A 6-digit one-time code will be dispatched to verify ownership.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUpdateModal(prev => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateModal.loading}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    {updateModal.loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Send Code</span>}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyContactOtp} className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <span>Enter the 6-digit code sent to: </span>
                  <span className="text-purple-300 font-mono font-bold block mt-0.5">{updateModal.maskedTarget}</span>
                </div>

                {updateModal.devOtp && (
                  <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] text-purple-300 flex items-center justify-between">
                    <span>Test OTP: <strong className="font-mono">{updateModal.devOtp}</strong></span>
                    <button
                      type="button"
                      onClick={() => setUpdateModal(prev => ({ ...prev, otpDigits: String(prev.devOtp).split('') }))}
                      className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px]"
                    >
                      Fill
                    </button>
                  </div>
                )}

                <div className="flex justify-between gap-2">
                  {updateModal.otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const next = [...updateModal.otpDigits];
                        next[idx] = e.target.value.replace(/\D/g, '');
                        setUpdateModal(prev => ({ ...prev, otpDigits: next }));
                      }}
                      className="w-11 h-13 text-center font-mono font-bold text-xl rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-purple-500"
                    />
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUpdateModal(prev => ({ ...prev, step: 'input' }))}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={updateModal.loading}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    {updateModal.loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify & Save</span>}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
