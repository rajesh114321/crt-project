import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Activity, 
  Ticket, 
  Users, 
  SlidersHorizontal, 
  Building2, 
  Calendar, 
  History, 
  BarChart3, 
  Bell, 
  MessageSquare, 
  UserCheck, 
  Settings, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const AdminSidebar = ({ currentView, setCurrentView, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleNav = (view) => {
    setCurrentView(view);
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login');
    if (setMobileOpen) setMobileOpen(false);
  };

  const menuGroups = [
    {
      group: 'OPERATIONS',
      items: [
        { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'admin-queues', label: 'Live Queue Monitor', icon: Activity, badge: 'Live' },
        { id: 'admin-tokens', label: 'Token Management', icon: Ticket },
        { id: 'admin-counters', label: 'Counter Management', icon: SlidersHorizontal },
        { id: 'admin-services', label: 'Services Management', icon: Building2 },
      ]
    },
    {
      group: 'STUDENTS & SCHEDULING',
      items: [
        { id: 'admin-students', label: 'Student Management', icon: Users },
        { id: 'admin-appointments', label: 'Appointments', icon: Calendar },
        { id: 'admin-token-history', label: 'All Tokens / History', icon: History },
        { id: 'admin-users-roles', label: 'Users and Roles', icon: UserCheck },
      ]
    },
    {
      group: 'INSIGHTS & ALERTS',
      items: [
        { id: 'admin-analytics', label: 'Reports and Analytics', icon: BarChart3 },
        { id: 'admin-notifications', label: 'Notifications', icon: Bell },
        { id: 'admin-feedback', label: 'Feedback', icon: MessageSquare },
      ]
    },
    {
      group: 'PREFERENCES',
      items: [
        { id: 'admin-settings', label: 'Settings', icon: Settings },
        { id: 'admin-profile', label: 'Profile', icon: User },
      ]
    }
  ];

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-[#0f172a] text-white p-4 transition-all duration-300 select-none border-r border-slate-800 ${
      collapsed ? 'w-20' : 'w-68'
    }`}>
      
      {/* Top Header: Logo + Collapse Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div 
          onClick={() => handleNav('admin-dashboard')}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          title="QueueLess Command Center"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform shrink-0">
            <svg viewBox="0 0 36 36" fill="none" className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg">
              <circle cx="17" cy="17" r="11" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M24 24L31 31" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="17" cy="17" r="3.5" fill="#38bdf8" />
            </svg>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
                Queue<span className="text-blue-400">Less</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                Admin Center
              </span>
            </div>
          )}
        </div>
        
        {/* Toggle Collapse (Desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Close Button (Mobile Drawer) */}
        {mobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-5 text-xs font-medium scrollbar-thin scrollbar-thumb-slate-800">
        {menuGroups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {grp.group}
              </div>
            )}
            {grp.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 text-left cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-600/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Admin Profile & Logout Footer */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        <div 
          onClick={() => handleNav('admin-profile')}
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer ${
            currentView === 'admin-profile' ? 'bg-slate-800/80 ring-1 ring-blue-500/50' : ''
          }`}
          title="View Administrator Profile"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0 ring-2 ring-indigo-500/40">
            {user?.name?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-white truncate">
                {user?.name || 'Dr. Arvind Sharma'}
              </h4>
              <span className="text-[10px] text-indigo-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Admin (2FA)</span>
              </span>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-semibold cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-400 hover:text-rose-400" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`hidden md:block shrink-0 h-screen sticky top-0 z-30 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-68'
      }`}>
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
