import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useQueue } from '../context/QueueContext';
import { 
  Ticket, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  Activity, 
  Layers, 
  SlidersHorizontal,
  ChevronDown,
  Presentation,
  Tv,
  Download
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { user, isAuthenticated, isAdmin, logout, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, setIsOpen } = useNotifications();
  const { activeToken } = useQueue();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const handleNav = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* QueueLess Logo with Modern Q Icon */}
          <div 
            onClick={() => handleNav(isAuthenticated ? (isAdmin ? 'admin-dashboard' : 'student-dashboard') : 'landing')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg">
                <circle cx="17" cy="17" r="11" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M24 24L31 31" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="17" cy="17" r="3.5" fill="#38bdf8" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  Queue<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Less</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono border border-indigo-200/50 dark:border-indigo-800/50">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block leading-none mt-0.5">
                Skip the queue. Not your turn.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNav('landing')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'landing' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="px-3 py-1.5 rounded-lg transition-colors hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-3 py-1.5 rounded-lg transition-colors hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('counters')}
                  className="px-3 py-1.5 rounded-lg transition-colors hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Counters
                </button>
                <button
                  onClick={() => handleNav('about')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${currentView === 'about' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Presentation className="w-4 h-4 text-purple-500" />
                  About
                </button>
                <button
                  onClick={() => handleNav('live-queue')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${currentView === 'live-queue' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Live Queue
                </button>
                <button
                  onClick={() => handleNav('kiosk')}
                  className="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Launch Hallway Big Screen TV Display"
                >
                  <Tv className="w-4 h-4 text-purple-500" />
                  Campus TV Kiosk
                </button>
              </>
            ) : isAdmin ? (
              // Admin Links
              <>
                <button
                  onClick={() => handleNav('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'admin-dashboard' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('admin-queues')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'admin-queues' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Queues & Actions
                </button>
                <button
                  onClick={() => handleNav('admin-counters')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'admin-counters' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Counters
                </button>
                <button
                  onClick={() => handleNav('admin-services')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'admin-services' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Services
                </button>
                <button
                  onClick={() => handleNav('admin-reports')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'admin-reports' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Reports
                </button>
                <button
                  onClick={() => handleNav('admin-analytics')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'admin-analytics' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => handleNav('admin-search')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'admin-search' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Search
                </button>
                <button
                  onClick={() => handleNav('about')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'about' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Project Viva
                </button>
              </>
            ) : (
              // Student Links
              <>
                <button
                  onClick={() => handleNav('student-dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'student-dashboard' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('get-token')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${currentView === 'get-token' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Ticket className="w-4 h-4 text-brand-500" />
                  Get Token
                </button>
                {activeToken && (
                  <button
                    onClick={() => handleNav('digital-token')}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${currentView === 'digital-token' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    My Pass ({activeToken.tokenNumber})
                  </button>
                )}
                <button
                  onClick={() => handleNav('live-queue')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${currentView === 'live-queue' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Live Queue
                </button>
                <button
                  onClick={() => handleNav('token-history')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'token-history' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  History
                </button>
                <button
                  onClick={() => handleNav('about')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'about' ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 font-semibold' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  About
                </button>
              </>
            )}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Switcher (Instant Testing Pills) */}
            <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
              <span className="text-[11px] text-slate-400 px-1 font-mono uppercase">Demo:</span>
              <button
                onClick={async () => {
                  await demoLogin('student');
                  handleNav('student-dashboard');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  isAuthenticated && !isAdmin 
                    ? 'bg-brand-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                Student
              </button>
              <button
                onClick={async () => {
                  await demoLogin('admin');
                  handleNav('admin-dashboard');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  isAuthenticated && isAdmin 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Download Project ZIP */}
            <a
                href="/QueueLess-Smart-Digital-Token-System.zip"
                download="QueueLess-Smart-Digital-Token-System.zip"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 dark:bg-slate-800 dark:hover:bg-brand-950/40 text-slate-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400 text-xs font-semibold transition-all border border-slate-200/80 dark:border-slate-700"
                title="Download complete QueueLess Project (.ZIP)"
              >
                <Download className="w-3.5 h-3.5 text-brand-500" />
                <span className="hidden xl:inline">Download</span>
                <span>.ZIP</span>
              </a>

            {/* Notification Bell */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-600 text-[10px] font-bold text-white items-center justify-center">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {/* Authentication Buttons / User Profile */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 rounded-xl shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white ${isAdmin ? 'bg-indigo-600' : 'bg-brand-600'}`}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold leading-tight text-slate-900 dark:text-white">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono leading-none capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      {user?.studentId && (
                        <p className="text-[10px] font-mono text-brand-600 dark:text-brand-400 mt-0.5">ID: {user.studentId}</p>
                      )}
                    </div>
                    <div className="py-1 text-xs font-medium">
                      {!isAdmin && (
                        <>
                          <button
                            onClick={() => handleNav('profile')}
                            className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            My Profile
                          </button>
                          <button
                            onClick={() => handleNav('token-history')}
                            className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                          >
                            <Layers className="w-4 h-4 text-slate-400" />
                            Token History
                          </button>
                        </>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => handleNav('admin-counters')}
                          className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                          Manage Counters
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          handleNav('landing');
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('landing')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNav('about')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                About Project
              </button>
              <button
                onClick={() => handleNav('live-queue')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Live Queue Status
              </button>
              <button
                onClick={() => handleNav('kiosk')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Tv className="w-4 h-4" />
                Campus TV Kiosk (Hallway Display)
              </button>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2.5 rounded-xl text-center text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </button>
              </div>
            </>
          ) : isAdmin ? (
            <>
              <button onClick={() => handleNav('admin-dashboard')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Admin Dashboard</button>
              <button onClick={() => handleNav('admin-queues')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Queue Operations</button>
              <button onClick={() => handleNav('admin-counters')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Counters</button>
              <button onClick={() => handleNav('admin-services')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Services & Timings</button>
              <button onClick={() => handleNav('admin-reports')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Reports & Audit Log</button>
              <button onClick={() => handleNav('admin-analytics')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Analytics</button>
              <button onClick={() => handleNav('admin-search')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Search Students</button>
              <button onClick={() => handleNav('about')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Project Viva Presentation</button>
            </>
          ) : (
            <>
              <button onClick={() => handleNav('student-dashboard')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Dashboard</button>
              <button onClick={() => handleNav('get-token')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Get Digital Token</button>
              {activeToken && (
                <button onClick={() => handleNav('digital-token')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400 font-bold hover:bg-brand-50">
                  Active Pass ({activeToken.tokenNumber})
                </button>
              )}
              <button onClick={() => handleNav('live-queue')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Live Queue Tracking</button>
              <button onClick={() => handleNav('token-history')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Token History</button>
              <button onClick={() => handleNav('profile')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">My Profile</button>
              <button onClick={() => handleNav('about')} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">About Project</button>
            </>
          )}

          {/* Quick Demo Switcher on mobile */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Quick Demo Switch:</span>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await demoLogin('student');
                  handleNav('student-dashboard');
                }}
                className="px-3 py-1 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 font-semibold"
              >
                Student
              </button>
              <button
                onClick={async () => {
                  await demoLogin('admin');
                  handleNav('admin-dashboard');
                }}
                className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-semibold"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
