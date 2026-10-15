import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Ticket, 
  Clock, 
  Bell, 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Activity,
  ChevronRight,
  School,
  QrCode,
  Zap,
  Building2,
  BookOpen,
  Coffee,
  FileText,
  Smartphone,
  Lock,
  UserPlus,
  Volume2
} from 'lucide-react';

export const LandingPage = ({ setCurrentView }) => {
  const { demoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  const handleStudentDemo = async () => {
    await demoLogin('student');
    setCurrentView('student-dashboard');
  };

  const handleAdminDemo = async () => {
    await demoLogin('admin');
    setCurrentView('admin-dashboard');
  };

  // Safe image load handler with fallback gradient
  const handleImageError = (e, fallbackBg = 'from-blue-600 to-indigo-800') => {
    e.target.style.display = 'none';
    if (e.target.parentElement) {
      e.target.parentElement.classList.add('bg-gradient-to-tr', ...fallbackBg.split(' '));
    }
  };

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      
      {/* 1. HERO SECTION: Beautiful College Campus Background + Welcome Copy */}
      <section className="relative isolate pt-12 lg:pt-20 pb-16 lg:pb-28 overflow-hidden bg-slate-950 text-white">
        
        {/* Ambient Campus Background Image with Blue/Purple Glassmorphic Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80" 
            alt="University Campus with Students" 
            className="w-full h-full object-cover object-center filter saturate-125 opacity-35 scale-105 transform animate-in fade-in duration-1000"
            onError={(e) => handleImageError(e, 'from-slate-900 via-indigo-950 to-slate-900')}
          />
          {/* Subtle multi-layer gradient veil: blue, purple, and deep tone */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-indigo-950/90 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/25 via-purple-600/15 to-transparent" />
        </div>

        {/* Floating background decorative glowing orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading, Description & Action Buttons */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              
              {/* Modern Welcome Badge with Q icon */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 text-white backdrop-blur-md shadow-lg shadow-indigo-500/10">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  <svg viewBox="0 0 36 36" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="17" cy="17" r="11" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <path d="M24 24L31 31" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="17" cy="17" r="3.5" fill="#38bdf8" />
                  </svg>
                </div>
                <span className="text-xs font-semibold tracking-wide text-indigo-100">
                  Smart Digital Token Management System
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-300 font-bold hidden sm:inline">Active</span>
              </div>

              {/* Main Prominent Heading Required in Prompt */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Your Time Matters. <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Your Queue, Simplified.
                </span>
              </h1>

              {/* Exact Description Required in Prompt */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-200 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
                Skip long queues at college offices, fee counters, libraries, and canteens. Generate your digital token, track your queue position, and know when it's your turn.
              </p>

              {/* Primary Call to Action Buttons Required in Prompt: Get Started & Login */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                
                {/* 1. Get Started Button -> Opens existing registration page */}
                <button
                  onClick={() => setCurrentView('register')}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/35 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2.5 group cursor-pointer"
                >
                  <UserPlus className="w-5 h-5 text-indigo-200 group-hover:scale-110 transition-transform" />
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 2. Login Button -> Opens existing login page */}
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/25 hover:border-white/40 backdrop-blur-md shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
                >
                  <Lock className="w-5 h-5 text-blue-300" />
                  <span>Login</span>
                </button>

                {/* Direct Get Token Shortcut */}
                <button
                  onClick={() => setCurrentView('get-token')}
                  className="px-5 py-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 text-slate-300 hover:text-white font-semibold text-sm border border-slate-700/60 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-purple-400" />
                  <span>Instant Token</span>
                </button>
              </div>

              {/* Quick Demo Credentials Triggers for College Reviewers / CRT Panel */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-300 font-medium">
                <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">Reviewer Demos:</span>
                <button
                  onClick={handleStudentDemo}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white border border-white/15 transition-all flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Student Demo (Rajesh)
                </button>
                <button
                  onClick={handleAdminDemo}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white border border-white/15 transition-all flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Staff Desk Demo (Admin)
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero Physical Lines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Audio & Proximity Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>4 Connected Counters</span>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Digital Token Dashboard Card */}
            <div className="lg:col-span-5 relative">
              
              {/* Floating Student Campus Photo Chip (Requirement 3: Student using smartphone) */}
              <div className="absolute -top-6 -right-4 sm:-right-6 z-20 hidden sm:flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-md animate-bounce duration-1000">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Student using phone" 
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="text-left pr-2">
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">Student on Campus Lawn</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Tracking queue remotely
                  </p>
                </div>
              </div>

              {/* Digital Boarding Pass Hero Card */}
              <div className="relative mx-auto max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6">
                
                {/* Header with Department & Live Ticker */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                        Accounts & Fee Desk
                      </h4>
                      <p className="text-xs text-slate-400">
                        Counter 2 • Semester Fee Payment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>LIVE QUEUE</span>
                  </div>
                </div>

                {/* Dashboard Numbers Grid: Serving, Token, People Ahead, Estimated Wait */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Currently Serving */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                      Currently Serving
                    </span>
                    <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      A024
                    </span>
                  </div>

                  {/* Your Token */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block mb-0.5">
                      Your Token
                    </span>
                    <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                      A031
                    </span>
                  </div>

                  {/* People Ahead */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                      People Ahead
                    </span>
                    <span className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">
                      7 students
                    </span>
                  </div>

                  {/* Estimated Wait */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                      Estimated Wait
                    </span>
                    <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
                      14 min
                    </span>
                  </div>
                </div>

                {/* Counter & Proximity Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
                      Assigned Desk: Counter 2
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    Approx. 11:35 AM
                  </span>
                </div>

                {/* Live Queue Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>Queue Proximity</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Position 8 of 15</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-[55%] rounded-full transition-all" />
                  </div>
                </div>

                {/* Proximity Notification Simulated Alert */}
                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-start gap-3">
                  <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-950 dark:text-purple-200 leading-snug">
                    <strong className="font-semibold text-purple-700 dark:text-purple-300">Smart Turn Alert: </strong> 
                    When you are 2 positions away, QueueLess sounds a chime and guides you to Counter 2.
                  </p>
                </div>

                {/* Live Card Actions */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <button 
                    onClick={() => setCurrentView('live-queue')}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    View Remote Pipeline →
                  </button>
                  <button 
                    onClick={() => setCurrentView('get-token')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Take This Token
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION (Required 4 Cards in Prompt) */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered to Solve Campus Congestion
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Four pillars designed to make college queues transparent, predictable, and 100% digital.
          </p>
        </div>

        {/* 4 Cards Requested in Requirement 4:
            1. Digital Tokens — Generate a token online in seconds.
            2. Live Queue Tracking — Check your queue position.
            3. Waiting-Time Estimation — Know your estimated waiting time.
            4. Less Crowding — Reduce unnecessary waiting in lines/hallways. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Digital Tokens */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                  Feature 01
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Digital Tokens
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate a token online in seconds. Receive an authenticated digital boarding pass with scannable QR code on your smartphone.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Instant Generation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Live Queue Tracking */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                  Feature 02
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Live Queue Tracking
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Check your queue position in real time. Watch serving tokens advance step-by-step from anywhere on campus without standing in line.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Real-Time Position</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Waiting-Time Estimation */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-purple-600 dark:text-purple-400">
                  Feature 03
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Waiting-Time Estimation
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Know your estimated waiting time. Dynamic calculation multiplies people ahead by historical desk service duration so you can plan your day.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>Mathematical Prediction</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Less Crowding */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                  Feature 04
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Less Crowding
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Reduce unnecessary waiting in crowded hallways. Receive automated chime and voice notifications to proceed to your counter only when called.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>85% Less Hallway Crowds</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* 4. CAMPUS SERVICE COUNTERS SHOWCASE WITH HIGH QUALITY REAL PHOTOGRAPHS (Requirement 3) */}
      <section id="counters" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <School className="w-3.5 h-3.5" />
              <span>Campus Life & Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Integrated Across Every Campus Facility
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              From administrative clearances to library book issues and canteen pickups, QueueLess connects all physical desks into one digital network.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('get-token')}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all self-start md:self-auto flex items-center gap-2"
          >
            <span>Explore All 4 Departments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Department Photographic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. College Office */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="h-48 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80" 
                  alt="College Administration Office Desk" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => handleImageError(e, 'from-blue-600 to-indigo-700')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-[11px] font-bold backdrop-blur-md">
                  Counter 1
                </span>
                <span className="absolute bottom-3 right-3 text-emerald-400 font-mono text-xs font-bold">
                  Serving: O-024
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  College Office
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Bonafide certificates, ID card replacement, attendance certificates, and general student inquiries.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setCurrentView('get-token')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-800 dark:text-slate-200 hover:text-indigo-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Join Office Queue →
              </button>
            </div>
          </div>

          {/* 2. Fee Counter / Accounts */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="h-48 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" 
                  alt="College Accounts & Fee Counter Desk" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => handleImageError(e, 'from-indigo-600 to-purple-700')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-[11px] font-bold backdrop-blur-md">
                  Counter 2
                </span>
                <span className="absolute bottom-3 right-3 text-emerald-400 font-mono text-xs font-bold">
                  Serving: F-031
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  Accounts & Fee Desk
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Semester tuition payments, exam fee receipts, scholarship forms, and official clearance slips.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setCurrentView('get-token')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-800 dark:text-slate-200 hover:text-indigo-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Join Fee Queue →
              </button>
            </div>
          </div>

          {/* 3. Central Library */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="h-48 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80" 
                  alt="University Central Library" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => handleImageError(e, 'from-purple-600 to-indigo-800')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-[11px] font-bold backdrop-blur-md">
                  Counter 3
                </span>
                <span className="absolute bottom-3 right-3 text-emerald-400 font-mono text-xs font-bold">
                  Serving: L-015
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  Central Library
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Book issue, book returns, semester book bank, and student library membership clearances.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setCurrentView('get-token')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-800 dark:text-slate-200 hover:text-indigo-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Join Library Queue →
              </button>
            </div>
          </div>

          {/* 4. College Canteen */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="h-48 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" 
                  alt="College Canteen & Dining Hall" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => handleImageError(e, 'from-amber-600 to-orange-700')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-[11px] font-bold backdrop-blur-md">
                  Counter 4
                </span>
                <span className="absolute bottom-3 right-3 text-emerald-400 font-mono text-xs font-bold">
                  Serving: C-007
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  Campus Canteen
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Food order tokens, meal coupon collection, snack pickup, and zero lunch-hour corridor rush.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setCurrentView('get-token')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-800 dark:text-slate-200 hover:text-indigo-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Join Canteen Queue →
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* 5. HOW IT WORKS: 4-STEP PIPELINE */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200/60 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Workflow & Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How QueueLess Works in 4 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            From joining from your phone to walking up to the service counter, smooth and transparent at every moment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {[
            {
              step: "01",
              title: "Select Service",
              desc: "Choose between College Office, Accounts, Library, or Canteen and see live desk queue lengths.",
              icon: <Building2 className="w-6 h-6 text-blue-600" />
            },
            {
              step: "02",
              title: "Get Digital Token",
              desc: "Instantly receive a digital boarding pass with scannable QR code and position timestamp.",
              icon: <Ticket className="w-6 h-6 text-indigo-600" />
            },
            {
              step: "03",
              title: "Track Queue Remotely",
              desc: "Study in the library or relax in the cafeteria while your progress bar updates live in real-time.",
              icon: <Smartphone className="w-6 h-6 text-purple-600" />
            },
            {
              step: "04",
              title: "Arrive When Called",
              desc: "Hear the audio chime and turn alert when 2 places away, show your QR pass, and complete service.",
              icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            }
          ].map((item, index) => (
            <div 
              key={item.step}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200/80 dark:border-slate-700">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 transition-colors">
                    {item.step}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                Step {index + 1} of 4
              </div>
            </div>
          ))}

        </div>

      </section>

      {/* 6. ABOUT QUEUELESS & CAMPUS IMPACT */}
      <section id="about-queueless" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-900/50 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
              About QueueLess • Campus Productivity
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Transforming Campus Experience
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              QueueLess was engineered to solve physical line congestion across colleges. By digitizing ticket issuance, position calculating, and audio desk dispatching, students regain productive study and cafeteria hours while administration operates with calm and transparent counter efficiency.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-3xl sm:text-4xl font-black font-mono text-blue-400">85%</p>
              <p className="text-xs text-slate-300 mt-1 font-medium">Wait Time Saved</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-3xl sm:text-4xl font-black font-mono text-purple-400">0</p>
              <p className="text-xs text-slate-300 mt-1 font-medium">Physical Line Fatigue</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">&lt; 15s</p>
              <p className="text-xs text-slate-300 mt-1 font-medium">Token Generation</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-3xl sm:text-4xl font-black font-mono text-amber-400">100%</p>
              <p className="text-xs text-slate-300 mt-1 font-medium">Queue Transparency</p>
            </div>
          </div>

          {/* Sample Data Disclaimer Required by User */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] font-mono text-indigo-300/80">
              * Note: Metrics and figures above reflect simulated demonstration performance data for academic capstone presentation.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6 text-center sm:text-left">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-200 font-bold">
                Join the QueueLess Revolution
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Your Time Matters. Start Using QueueLess Today.
              </h3>
              <p className="text-indigo-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                Experience hassle-free, modern digital token management for every college service. No more standing in crowded lines.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
              <button
                onClick={() => setCurrentView('register')}
                className="px-8 py-4 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm sm:text-base shadow-xl shadow-black/10 active:scale-95 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('login')}
                className="px-7 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base backdrop-blur-xs transition-colors flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>Student / Admin Login</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
