import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { QueueProvider } from './context/QueueContext';

// Components & Layouts
import { StudentSidebar } from './components/StudentSidebar';
import { AdminSidebar } from './components/AdminSidebar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toaster } from './components/Toaster';
import { NotificationDrawer } from './components/NotificationDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { GetTokenPage } from './pages/GetTokenPage';
import { DigitalTokenPage } from './pages/DigitalTokenPage';
import { LiveQueuePage } from './pages/LiveQueuePage';
import { TokenHistoryPage } from './pages/TokenHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminQueuesPage } from './pages/AdminQueuesPage';
import { AdminCountersPage } from './pages/AdminCountersPage';
import { AdminServicesPage } from './pages/AdminServicesPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminSearchPage } from './pages/AdminSearchPage';
import { AboutPage } from './pages/AboutPage';
import { KioskDisplayPage } from './pages/KioskDisplayPage';
import { AdminOtpVerifyPage } from './pages/AdminOtpVerifyPage';
import { AdminTokensPage } from './pages/AdminTokensPage';
import { AdminStudentsPage } from './pages/AdminStudentsPage';
import { AdminAppointmentsPage } from './pages/AdminAppointmentsPage';
import { AdminUsersRolesPage } from './pages/AdminUsersRolesPage';
import { AdminNotificationsPage } from './pages/AdminNotificationsPage';
import { AdminFeedbackPage } from './pages/AdminFeedbackPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AdminRegisterPage } from './pages/AdminRegisterPage';

const AppContent = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  
  // Section 1 & 2 Requirement: When the website opens, the Login page must appear first!
  const [currentView, setCurrentView] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user signs in, route them immediately to their relevant dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (currentView === 'login' || currentView === 'register' || currentView === 'admin-register' || currentView === 'admin-otp') {
        setCurrentView(isAdmin ? 'admin-dashboard' : 'student-dashboard');
      }
    }
  }, [isAuthenticated, isAdmin]);

  // Page 1 & 2: Standalone Auth Views (Split-Screen, no sidebars)
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        <LoginPage setCurrentView={setCurrentView} />
        <Toaster />
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        <RegisterPage setCurrentView={setCurrentView} />
        <Toaster />
      </div>
    );
  }

  if (currentView === 'admin-register') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        <AdminRegisterPage setCurrentView={setCurrentView} />
        <Toaster />
      </div>
    );
  }

  if (currentView === 'admin-otp') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        <AdminOtpVerifyPage setCurrentView={setCurrentView} />
        <Toaster />
      </div>
    );
  }

  // Hallway Kiosk TV Mode (Full Screen)
  if (currentView === 'kiosk') {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans">
        <KioskDisplayPage setCurrentView={setCurrentView} />
        <Toaster />
      </div>
    );
  }

  // Public Landing / About Page
  if (currentView === 'landing' || currentView === 'about') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1">
          {currentView === 'landing' ? (
            <LandingPage setCurrentView={setCurrentView} />
          ) : (
            <AboutPage setCurrentView={setCurrentView} />
          )}
        </main>
        <Footer setCurrentView={setCurrentView} />
        <NotificationDrawer />
        <Toaster />
      </div>
    );
  }

  // Route guarding for private authenticated pages
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        <LoginPage setCurrentView={setCurrentView} />
        <Toaster />
      </div>
    );
  }

  // Admin Routes (Protected - Only authorized administrators)
  const isAdminView = currentView.startsWith('admin-');
  if (isAdminView) {
    if (!isAdmin) {
      // Non-admins are prevented from accessing admin command center
      return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <StudentSidebar 
            currentView="student-dashboard" 
            setCurrentView={setCurrentView} 
            mobileOpen={mobileMenuOpen} 
            setMobileOpen={setMobileMenuOpen} 
          />
          <main className="flex-1 overflow-y-auto min-h-screen">
            <StudentDashboard setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          </main>
          <Toaster />
        </div>
      );
    }

    const renderAdminPage = () => {
      switch (currentView) {
        case 'admin-dashboard':
          return <AdminDashboard setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-queues':
          return <AdminQueuesPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-tokens':
          return <AdminTokensPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-counters':
          return <AdminCountersPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-services':
          return <AdminServicesPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-students':
          return <AdminStudentsPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-appointments':
          return <AdminAppointmentsPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-token-history':
        case 'admin-reports':
          return <AdminReportsPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-users-roles':
          return <AdminUsersRolesPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-analytics':
          return <AdminAnalyticsPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-notifications':
          return <AdminNotificationsPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-feedback':
          return <AdminFeedbackPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-settings':
          return <AdminSettingsPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-profile':
          return <ProfilePage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        case 'admin-search':
          return <AdminSearchPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
        default:
          return <AdminDashboard setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
      }
    };

    return (
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <AdminSidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          mobileOpen={mobileMenuOpen} 
          setMobileOpen={setMobileMenuOpen} 
        />
        <main className="flex-1 overflow-y-auto min-h-screen">
          {renderAdminPage()}
        </main>
        <Toaster />
      </div>
    );
  }

  // Student Routes (Protected - Authenticated Students)
  const renderStudentPage = () => {
    switch (currentView) {
      case 'student-dashboard':
        return <StudentDashboard setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
      case 'get-token':
      case 'generate-token':
        return <GetTokenPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
      case 'live-queue':
        return <LiveQueuePage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
      case 'token-history':
      case 'my-tokens':
        return <TokenHistoryPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
      case 'profile':
        return <ProfilePage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
      case 'digital-token':
        return <DigitalTokenPage setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
      default:
        return <StudentDashboard setCurrentView={setCurrentView} onOpenMobileMenu={() => setMobileMenuOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <StudentSidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        mobileOpen={mobileMenuOpen} 
        setMobileOpen={setMobileMenuOpen} 
      />
      <main className="flex-1 overflow-y-auto min-h-screen">
        {renderStudentPage()}
      </main>
      <Toaster />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <QueueProvider>
            <AppContent />
          </QueueProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
