import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { CancelTokenModal } from '../components/CancelTokenModal';
import { 
  Ticket, 
  Clock, 
  Users, 
  CheckCircle2, 
  RefreshCw, 
  Menu,
  Trash2
} from 'lucide-react';

export const StudentDashboard = ({ setCurrentView, onOpenMobileMenu }) => {
  const { user } = useAuth();
  const { 
    departments, 
    activeToken, 
    userTokens, 
    refreshQueue, 
    isRefreshing, 
    liveQueue,
    cancelToken 
  } = useQueue();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleRefresh = async () => {
    await refreshQueue();
  };

  const handleConfirmCancel = async () => {
    if (!activeToken) return;
    setCancelling(true);
    try {
      await cancelToken(activeToken.id);
      setShowCancelModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  // 4 Photographic Service Cards data from reference image
  const serviceCards = [
    {
      id: 'dept_office',
      name: 'College Office',
      desc: 'Document services & certificates',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
      counterNum: 1
    },
    {
      id: 'dept_accounts',
      name: 'Accounts Section',
      desc: 'Fee payments & receipts',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      counterNum: 2
    },
    {
      id: 'dept_library',
      name: 'Library',
      desc: 'Book services & resources',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
      counterNum: 3
    },
    {
      id: 'dept_canteen',
      name: 'Canteen',
      desc: 'Food ordering & collection',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      counterNum: 4
    }
  ];

  // Fallback demo tokens matching reference image if history is empty
  const defaultRecentTokens = [
    { tokenNumber: 'P100', service: 'College Office', date: '22 Apr, 10:15 AM', status: 'Completed' },
    { tokenNumber: 'A045', service: 'Accounts', date: '21 Apr, 02:30 PM', status: 'Completed' },
    { tokenNumber: 'U012', service: 'Library', date: '20 Apr, 11:20 AM', status: 'Completed' },
    { tokenNumber: 'C033', service: 'Canteen', date: '19 Apr, 01:45 PM', status: 'Completed' }
  ];

  const recentTokensToDisplay = userTokens.length > 0 
    ? userTokens.slice(0, 5).map(t => ({
        tokenNumber: t.tokenNumber,
        service: t.departmentName || t.service,
        date: new Date(t.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) + ', ' + new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: t.status === 'COMPLETED' ? 'Completed' : t.status
      }))
    : defaultRecentTokens;

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header Row - Welcome & Date */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {onOpenMobileMenu && (
              <button 
                onClick={onOpenMobileMenu}
                className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome, {user?.name || 'Rajesh'}!
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your time matters. Let's make your campus experience better.
          </p>
        </div>

        {/* Date on right matching Reference Image */}
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          {currentDateStr}
        </div>
      </div>

      {/* 4 Service Cards Grid - Matching Reference Image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {serviceCards.map((service) => (
          <div 
            key={service.id}
            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Service Photo */}
            <div className="h-32 w-full overflow-hidden relative">
              <img 
                src={service.image} 
                alt={service.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600');
                }}
              />
            </div>

            {/* Info & Button */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {service.desc}
                </p>
              </div>

              <button
                onClick={() => setCurrentView('get-token')}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Select Service
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lower Section: 2 Columns (Active Token & Recent Tokens) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Token Card (Matching Reference Image) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Active Token
          </h2>

          {activeToken ? (
            <div className="space-y-4">
              {/* Token Number & Status Pill */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Token No:</span>
                  <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                    {activeToken.tokenNumber || 'F101'}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                  activeToken.status === 'CALLING' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' 
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {activeToken.status === 'CALLING' ? 'Serving' : 'Waiting'}
                </span>
              </div>

              {/* Details List */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{activeToken.departmentName || activeToken.service || 'College Office'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">People Ahead:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{activeToken.peopleAhead ?? 5}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Wait:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeToken.estimatedWaitMinutes ?? 15} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Counter:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{activeToken.counter || 1}</span>
                </div>
              </div>

              {/* Action Buttons: Refresh Queue Status & Cancel Token */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh Status</span>
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="py-2.5 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Cancel active token"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>

              {/* Cancel Confirmation Modal */}
              <CancelTokenModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancel}
                token={activeToken}
                loading={cancelling}
              />
            </div>
          ) : (
            // Default active preview matching reference image or allowing generation
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Token No:</span>
                  <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                    F101
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Waiting
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">College Office</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">People Ahead:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Wait:</span>
                  <span className="font-bold text-slate-900 dark:text-white">15 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Counter:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">1</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh Queue Status</span>
                </button>
                <button
                  onClick={() => setCurrentView('get-token')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
                  title="Generate new token"
                >
                  New
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Recent Tokens Table (Matching Reference Image) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Tokens
            </h2>
            <button
              onClick={() => setCurrentView('token-history')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3 font-semibold">Token No</th>
                  <th className="pb-3 font-semibold">Service</th>
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTokensToDisplay.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {row.tokenNumber}
                    </td>
                    <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                      {row.service}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {row.date}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
