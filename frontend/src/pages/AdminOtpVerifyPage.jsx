import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  Clock, 
  RefreshCw, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  Sparkles,
  Terminal,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

export const AdminOtpVerifyPage = ({ setCurrentView }) => {
  const { adminChallenge, verifyAdminOtp, resendAdminOtp, cancelAdminOtp } = useAuth();
  
  // 6-digit individual inputs
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  
  const [selectedMethod, setSelectedMethod] = useState(adminChallenge?.method || 'email');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(adminChallenge?.message || 'Verification code dispatched.');
  const [copied, setCopied] = useState(false);
  
  // Resend cooldown timer (60s)
  const [cooldown, setCooldown] = useState(adminChallenge?.cooldownSeconds || 60);

  // 5-minute expiration countdown
  const [timeLeft, setTimeLeft] = useState(() => {
    if (adminChallenge?.expiresAt) {
      return Math.max(0, Math.floor((adminChallenge.expiresAt - Date.now()) / 1000));
    }
    return 300; // 5 min
  });

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(c => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Expiration countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    const char = cleaned.slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = char;
    setDigits(nextDigits);

    // Auto-advance to next input
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    
    const nextDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = pasted[i] || '';
    }
    setDigits(nextDigits);
    
    const focusIdx = Math.min(5, pasted.length);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleFillTestOtp = () => {
    if (adminChallenge?.devOtp) {
      const parts = String(adminChallenge.devOtp).split('').slice(0, 6);
      setDigits(parts);
      setError('');
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const fullOtp = digits.join('');
    
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    if (timeLeft <= 0) {
      setError('This verification code has expired. Please click Resend OTP to request a fresh code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await verifyAdminOtp(fullOtp);
      setCurrentView('admin-dashboard');
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the 6-digit code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (methodToUse) => {
    if (cooldown > 0 || resending) return;
    
    setError('');
    setResending(true);
    setDigits(['', '', '', '', '', '']);

    try {
      const data = await resendAdminOtp(methodToUse || selectedMethod);
      setSuccessMsg(data.message || 'A new verification code was dispatched.');
      setCooldown(data.cooldownSeconds || 60);
      setTimeLeft(300); // 5 min
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  const handleSwitchMethod = async (newMethod) => {
    if (newMethod === selectedMethod) return;
    setSelectedMethod(newMethod);
    await handleResend(newMethod);
  };

  const handleCancel = () => {
    cancelAdminOtp();
    setCurrentView('login');
  };

  // Masked destination strictly using actual registered administrator details
  const maskedDestination = selectedMethod === 'phone' 
    ? (adminChallenge?.maskedPhone || '+91 ******1736')
    : (adminChallenge?.maskedEmail || '2*******0@mlrit.ac.in');

  return (
    <div className="relative min-h-screen w-full bg-[#f4f6fb] dark:bg-slate-950 flex flex-col justify-between overflow-x-hidden font-sans select-none">
      
      {/* Background Shapes matching reference image */}
      <div className="pointer-events-none fixed -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-transparent opacity-80 filter blur-2xl" />
      <div className="pointer-events-none fixed -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-tl from-emerald-400 via-teal-500 to-transparent opacity-75 filter blur-2xl" />

      {/* Top Header with 4-Color Dots */}
      <header className="pt-8 sm:pt-10 pb-4 text-center z-10">
        <div className="inline-flex flex-col items-center gap-2 cursor-pointer" onClick={handleCancel}>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#f87171] shadow-xs" />
            <span className="w-4 h-4 rounded-full bg-[#34d399] shadow-xs" />
            <span className="w-4 h-4 rounded-full bg-[#38bdf8] shadow-xs" />
            <span className="w-4 h-4 rounded-full bg-[#fbbf24] shadow-xs" />
          </div>
          <span className="font-extrabold text-sm tracking-[0.25em] text-slate-800 dark:text-slate-100 uppercase">
            QUEUELESS
          </span>
          <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">
            Two-Factor Authentication Gateway
          </span>
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-900/10 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 space-y-6 transition-all">
          
          {/* Back button */}
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>

          {/* Heading */}
          <div className="space-y-1.5">
            <div className="w-8 h-1 rounded-full bg-[#7c3aed] mb-2" />
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Two-Factor Verification
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter the 6-digit one-time code to authorize administrator access.
                </p>
              </div>
            </div>
          </div>

          {/* Method Selector Tabs: Gmail OTP vs Phone OTP */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
            <button
              type="button"
              onClick={() => handleSwitchMethod('email')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedMethod === 'email'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Gmail OTP</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMethod('phone')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedMethod === 'phone'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Phone OTP</span>
            </button>
          </div>

          {/* Registered Contact & Expiration Box */}
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-900/40 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {selectedMethod === 'phone' ? (
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
              )}
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                  Registered Administrator Contact:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {maskedDestination}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-mono font-bold shrink-0 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-purple-200/80 dark:border-purple-900/80 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-purple-500" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cloud & Configuration Helper Banner */}
          {adminChallenge?.isSimulated && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Terminal className="w-4 h-4 text-purple-500" />
                  <span>Developer / Evaluation Environment Notice</span>
                </div>
                {adminChallenge.devOtp && (
                  <button
                    type="button"
                    onClick={handleFillTestOtp}
                    className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-mono text-[11px] font-bold cursor-pointer flex items-center gap-1"
                  >
                    <span>Auto-Fill Test OTP ({adminChallenge.devOtp})</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {selectedMethod === 'email' 
                  ? 'Gmail SMTP App Password not configured in backend/.env. For real delivery, create a 16-character App Password at myaccount.google.com/apppasswords. The generated OTP was securely logged to the backend terminal.'
                  : 'Twilio SMS credentials not configured in backend/.env. For real SMS delivery, configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.'}
              </p>
            </div>
          )}

          {/* 6-Digit OTP Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Enter 6-Digit Code
              </label>

              {/* 6 Individual Digit Boxes */}
              <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-14 sm:w-13 sm:h-16 text-center font-mono font-bold text-2xl rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/20 transition-all shadow-xs"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button - Purple Pill Matching Reference */}
            <button
              type="submit"
              disabled={loading || timeLeft <= 0}
              className="w-full py-4 px-6 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-[0.99] text-white font-extrabold tracking-[0.2em] text-xs shadow-lg shadow-purple-600/30 uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>VERIFY OTP & SIGN IN</span>
                </>
              )}
            </button>
          </form>

          {/* Resend OTP Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Didn't receive code?
            </span>
            <button
              type="button"
              onClick={() => handleResend(selectedMethod)}
              disabled={cooldown > 0 || resending}
              className="font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
              </span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-500 z-10 flex items-center justify-center gap-4">
        <span>QueueLess Smart Digital Token System</span>
        <span>•</span>
        <span>Encrypted 2FA Gateway</span>
      </footer>

    </div>
  );
};
