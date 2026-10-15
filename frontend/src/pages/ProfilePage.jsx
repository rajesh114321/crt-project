import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Save, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Menu
} from 'lucide-react';

export const ProfilePage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useNotifications();

  // Profile fields using active user session details
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    studentId: user?.studentId || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Keep state synced when user updates
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        studentId: user.studentId || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Password fields matching reference image
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification toggles matching reference image
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    tokenUpdates: true,
    queueAlerts: true
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleProfileSave = async (e) => {
    if (e) e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name: profileData.name,
        phone: profileData.phone
      });
      setEditMode(false);
      showToast('Profile and preferences updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'warning');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      showToast('Please enter your current password.', 'warning');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'warning');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match.', 'warning');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast(res.message || 'Password changed successfully with bcrypt!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'warning');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button 
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Profile & Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your account information and preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Top Grid: Profile Details & Account Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Top Left Card: Profile Details - Matching Reference Image */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80" 
                alt="Rajesh avatar" 
                className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/50"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {profileData.name}
              </h2>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold block">
                Student
              </span>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Roll No:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{profileData.studentId}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Email:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{profileData.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Phone:</span>
              {editMode ? (
                <input 
                  type="text" 
                  value={profileData.phone}
                  onChange={(e) => setProfileData(p => ({ ...p, phone: e.target.value }))}
                  className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              ) : (
                <span className="font-semibold text-slate-900 dark:text-white">{profileData.phone}</span>
              )}
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => setEditMode(!editMode)}
            className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            {editMode ? 'Done Editing' : 'Edit Profile'}
          </button>
        </div>

        {/* Top Right Card: Account Settings (Password) - Matching Reference Image */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Account Settings
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer mt-1"
            >
              {savingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Grid: Notification Preferences & Save/Logout Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Bottom Left Card: Notification Preferences - Matching Reference Image */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Notification Preferences
          </h2>

          <div className="space-y-3.5 text-xs">
            {/* Email Notifications */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Email Notifications</span>
                <span className="text-[11px] text-slate-400">Receive queue receipts and booking summaries</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications(n => ({ ...n, emailNotifications: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Token Updates */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Token Updates</span>
                <span className="text-[11px] text-slate-400">Get notified when people ahead move</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.tokenUpdates}
                  onChange={(e) => setNotifications(n => ({ ...n, tokenUpdates: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Queue Alerts */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Queue Alerts</span>
                <span className="text-[11px] text-slate-400">Sound chime alert when turn is 2 places away</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.queueAlerts}
                  onChange={(e) => setNotifications(n => ({ ...n, queueAlerts: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Right Card: Save Changes & Logout Buttons - Matching Reference Image */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Actions
          </h2>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleProfileSave}
              disabled={savingProfile}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl border border-red-300 dark:border-red-800/80 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
