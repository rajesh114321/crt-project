import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { CancelTokenModal } from '../components/CancelTokenModal';
import { 
  Activity, 
  Clock, 
  Users, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Menu,
  ShieldCheck,
  Trash2
} from 'lucide-react';

export const LiveQueuePage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { user } = useAuth();
  const { 
    activeToken, 
    counters, 
    refreshQueue, 
    isRefreshing, 
    liveQueue,
    cancelToken 
  } = useQueue();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [lastUpdated, setLastUpdated] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const handleRefresh = async () => {
    await refreshQueue();
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleConfirmCancel = async () => {
    if (!activeToken) return;
    setCancelling(true);
    try {
      await cancelToken(activeToken.id);
      setShowCancelModal(false);
      setCurrentView('student-dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  // Metrics from active token or reference defaults
  const tokenNumber = activeToken?.tokenNumber || 'F101';
  const status = activeToken?.status === 'CALLING' ? 'Serving' : 'Waiting';
  const peopleAhead = activeToken?.peopleAhead ?? 5;
  const estimatedWait = activeToken?.estimatedWaitMinutes ?? 15;
  const counterNumber = activeToken?.counter || 1;
  const serviceName = activeToken?.departmentName || activeToken?.service || 'College Office';
  
  // Currently serving token at assigned counter
  const servingToken = counters.find(c => c.counterNumber === counterNumber)?.currentToken || 'F100';

  // Calculate realistic queue progress (e.g. 35%)
  const progressPercent = activeToken 
    ? Math.max(15, Math.min(95, Math.round(100 - (peopleAhead / (peopleAhead + 3)) * 100))) 
    : 35;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      
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
              Live Queue Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track your queue position in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeToken && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-bold shadow-xs hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cancel Token</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Featured Big Gradient Card - Matching Reference Image */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-10 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-100/90 block mb-1">
              Your Token
            </span>
            <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-sm">
              {tokenNumber}
            </div>
          </div>

          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/25 text-white">
            {status}
          </span>
        </div>
      </div>

      {/* 3 White Metric Cards Grid - Matching Reference Image */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        
        {/* People Ahead */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
          <span className="text-xs text-slate-400 block mb-1 font-medium">People Ahead</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
            {peopleAhead}
          </div>
        </div>

        {/* Estimated Wait */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
          <span className="text-xs text-slate-400 block mb-1 font-medium">Estimated Wait</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            {estimatedWait} <span className="text-sm font-sans font-bold text-slate-500">min</span>
          </div>
        </div>

        {/* Counter Number */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 text-center shadow-xs">
          <span className="text-xs text-slate-400 block mb-1 font-medium">Counter</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
            {counterNumber}
          </div>
        </div>

      </div>

      {/* Queue Progress Card - Matching Reference Image */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-800 dark:text-slate-200">Queue Progress</span>
          <span className="text-blue-600 dark:text-blue-400 font-mono">{progressPercent}%</span>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div 
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer Status Bar - Matching Reference Image */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Currently Serving</span>
            <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
              {servingToken}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Service</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {serviceName}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Last Updated</span>
            <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              {lastUpdated}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeToken && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cancel Token</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <CancelTokenModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        token={activeToken}
        loading={cancelling}
      />

    </div>
  );
};
