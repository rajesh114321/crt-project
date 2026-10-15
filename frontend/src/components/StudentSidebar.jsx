import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Ticket, 
  FileText, 
  Activity, 
  User, 
  LogOut,
  X
} from 'lucide-react';

export const StudentSidebar = ({ currentView, setCurrentView, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();

  const handleNav = (view) => {
    setCurrentView(view);
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login');
    if (setMobileOpen) setMobileOpen(false);
  };

  const navItems = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'get-token', label: 'Generate Token', icon: Ticket },
    { id: 'token-history', label: 'My Tokens', icon: FileText },
    { id: 'live-queue', label: 'Live Queue Tracking', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#131b2e] text-white p-5 w-64 select-none">
      
      {/* Top Logo - QueueLess */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div 
          onClick={() => handleNav('student-dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 36 36" fill="none" className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg">
              <circle cx="17" cy="17" r="11" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M24 24L31 31" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="17" cy="17" r="3.5" fill="#38bdf8" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Queue<span className="text-blue-400">Less</span>
          </span>
        </div>
        
        {mobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Student Profile Card - Matching Reference Image */}
      <div className="pt-6 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" 
              alt="Rajesh avatar" 
              className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/50"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-11 h-11 rounded-full bg-blue-600 text-white font-bold items-center justify-center text-sm ring-2 ring-blue-500/50">
              {user?.name?.charAt(0) || 'R'}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#131b2e]" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-white truncate">
              Hi, {user?.name || 'Rajesh'}
            </h4>
            <p className="text-xs text-blue-400 font-medium">
              Student
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links - Matching Reference Image */}
      <nav className="flex-1 py-6 space-y-1.5 text-sm font-medium">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-150 text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Logout Button */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 overflow-y-auto z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
