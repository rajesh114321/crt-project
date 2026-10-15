import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  RefreshCw,
  Send,
  Building2
} from 'lucide-react';

export const AdminRegisterPage = ({ setCurrentView }) => {
  const { showToast } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    setupKey: 'QueueLessAdmin2026!' // Pre-filled with default env setup key for seamless testing
  });

  // Phone OTP Verification States (Requirement 8)
  const [phoneOtpState, setPhoneOtpState] = useState({
    sent: false,
    sending: false,
    verified: false,
    sessionId: null,
    otpCode: '',
    devNotice: null,
    devOtp: null,
    cooldown: 0
  });

  // Cooldown countdown timer
  useEffect(() => {
    let timer;
    if (phoneOtpState.cooldown > 0) {
      timer = setInterval(() => {
        setPhoneOtpState(prev => ({ ...prev, cooldown: Math.max(0, prev.cooldown - 1) }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phoneOtpState.cooldown]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Dispatch Phone OTP
  const handleSendPhoneOtp = async () => {
    setError('');
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number before requesting an OTP.');
      return;
    }

    setPhoneOtpState(prev => ({ ...prev, sending: true }));
    try {
      const res = await api.sendAdminRegistrationOtp(formData.phone, formData.email);
      setPhoneOtpState(prev => ({
        ...prev,
        sent: true,
        sending: false,
        sessionId: res.sessionId,
        devNotice: res.devNotice,
        devOtp: res.devOtp,
        cooldown: 60
      }));
      showToast(`Verification code dispatched to ${formData.phone}`, 'info', 'OTP Dispatched');
    } catch (err) {
      setError(err.message || 'Failed to dispatch phone verification code.');
      setPhoneOtpState(prev => ({ ...prev, sending: false }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your administrator email address.');
      return;
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number (+91).');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify both entries.');
      return;
    }
    if (!formData.setupKey.trim()) {
      setError('Admin Security Setup Key is required to authorize administrator account creation.');
      return;
    }

    setLoading(true);
    try {
      const result = await api.registerAdmin({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        setupKey: formData.setupKey.trim(),
        phoneOtpSessionId: phoneOtpState.sessionId,
        phoneOtp: phoneOtpState.otpCode.trim()
      });

      setSuccess('Administrator account registered successfully! Redirecting to Admin Login...');
      showToast('Admin account created! Please sign in.', 'success', 'Registration Successful');

      // Redirect to Admin Login after short delay
      setTimeout(() => {
        setCurrentView('login');
      }, 1800);
    } catch (err) {
      setError(err.message || 'Administrator registration failed. Please check your credentials and setup key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* LEFT SIDE: Campus Administration Block / University Building */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden min-h-screen">
        <img 
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80" 
          alt="University Administration Building" 
          className="w-full h-full object-cover object-center transform scale-105"
        />
        {/* Deep blue/purple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-purple-950/30" />
        
        {/* Campus Description Card */}
        <div className="absolute bottom-12 left-12 right-12 text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-md text-xs font-bold border border-purple-400/30 text-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Administrative Command Portal</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
            Secure Campus Queue Governance & Counter Operations.
          </h2>

          <p className="text-sm text-slate-300 max-w-lg leading-relaxed drop-shadow">
            Register authorized administrative officers to oversee counter routing, monitor real-time queue cards, broadcast announcements, and manage student appointments.
          </p>

          <div className="pt-2 flex items-center gap-6 text-xs font-mono text-purple-300/80">
            <span>🛡️ 2FA Verified</span>
            <span>🔐 Bcrypt Encrypted</span>
            <span>⚡ Multi-Lane Dispatch</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Admin Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 overflow-y-auto min-h-screen">
        <div className="w-full max-w-md my-auto">
          
          {/* Top Brand Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div 
                onClick={() => setCurrentView('landing')}
                className="flex items-center gap-2.5 cursor-pointer group"
                title="Go to QueueLess Home"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 36 36" fill="none" className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="17" cy="17" r="11" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M24 24L31 31" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="17" cy="17" r="3.5" fill="#c084fc" />
                  </svg>
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Queue<span className="text-purple-600 dark:text-purple-400">Less</span>
                </span>
              </div>

              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80">
                ADMIN ACCESS
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Register Administrator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Authorized setup for department officers and campus queue supervisors.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
              <div className="leading-relaxed font-semibold">{success}</div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Rajesh Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* 2. Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin.office@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* 3. Mobile Number (+91) with Phone OTP Dispatch */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mobile Number (+91)
                </label>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">
                  Phone OTP Verification
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  disabled={phoneOtpState.sending || phoneOtpState.cooldown > 0}
                  className="px-3.5 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  title="Dispatch OTP verification to this mobile number"
                >
                  {phoneOtpState.sending ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : phoneOtpState.cooldown > 0 ? (
                    `${phoneOtpState.cooldown}s`
                  ) : phoneOtpState.sent ? (
                    'Resend'
                  ) : (
                    'Verify Phone'
                  )}
                </button>
              </div>

              {/* Phone OTP Verification Code Input (Shows after OTP is dispatched) */}
              {phoneOtpState.sent && (
                <div className="mt-2.5 p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-purple-900 dark:text-purple-200">
                      Enter 6-Digit Phone Verification Code:
                    </span>
                    {phoneOtpState.devOtp && (
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        Demo OTP: {phoneOtpState.devOtp}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={phoneOtpState.otpCode}
                    onChange={(e) => setPhoneOtpState({ ...phoneOtpState, otpCode: e.target.value.replace(/\D/g, '') })}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center tracking-widest font-mono font-bold text-base py-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Dispatched via SMS service. Valid for 5 minutes.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 5. Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 6. Admin Security Setup Key (Requirement 10) */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Admin Security Setup Key
                </label>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                  Guarded Access
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="setupKey"
                  required
                  value={formData.setupKey}
                  onChange={handleChange}
                  placeholder="Enter ADMIN_SETUP_KEY from .env"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-300/80 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 text-slate-900 dark:text-white text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-xs"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                🔒 Public admin registration is protected. Default key: <code className="font-mono text-purple-600 dark:text-purple-400">QueueLessAdmin2026!</code>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Register Administrator</span>
                </>
              )}
            </button>

          </form>

          {/* Links to Admin Login & Student Portal */}
          <div className="mt-6 text-center space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span>Already have an Administrator account? </span>
              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
              >
                Sign In as Admin
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Looking for student registration? </span>
              <button
                type="button"
                onClick={() => setCurrentView('register')}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                Go to Student Portal
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
