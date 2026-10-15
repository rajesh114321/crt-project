import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { CancelTokenModal } from '../components/CancelTokenModal';
import { 
  Ticket, 
  Clock, 
  Users, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Menu,
  Trash2,
  ShieldAlert
} from 'lucide-react';

export const GetTokenPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { user, isAuthenticated } = useAuth();
  const { departments, activeToken, joinQueue, cancelToken } = useQueue();
  const [loadingDept, setLoadingDept] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // 4 services from reference image
  const services = [
    {
      id: 'dept_office',
      name: 'College Office',
      desc: 'Document services & certificates',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
      serviceName: 'Bonafide Certificate'
    },
    {
      id: 'dept_accounts',
      name: 'Accounts Section',
      desc: 'Fee payments & receipts',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      serviceName: 'Fee Payment'
    },
    {
      id: 'dept_library',
      name: 'Central Library',
      desc: 'Book services & resources',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
      serviceName: 'Book Issue'
    },
    {
      id: 'dept_canteen',
      name: 'Campus Canteen',
      desc: 'Food ordering & collection',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      serviceName: 'Food Order'
    }
  ];

  const handleGenerate = async (deptId, serviceName) => {
    if (!isAuthenticated) {
      setCurrentView('login');
      return;
    }

    setErrorMsg('');
    setLoadingDept(deptId);
    try {
      await joinQueue(deptId, serviceName);
      // Navigate to live queue tracking page as in reference flow
      setCurrentView('live-queue');
    } catch (err) {
      setErrorMsg(err.message || 'Unable to generate token. You may already have an active token.');
    } finally {
      setLoadingDept(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!activeToken) return;
    setCancelling(true);
    try {
      await cancelToken(activeToken.id);
      setShowCancelModal(false);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel token');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
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
              Select a Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choose a campus facility to generate your digital token and join the line remotely.
            </p>
          </div>
        </div>
      </div>

      {/* Active Token Notice & Cancellation Banner */}
      {activeToken && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border-2 border-amber-500/30 dark:border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Active Token in Progress
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  {activeToken.status === 'CALLING' ? 'Serving' : 'Waiting'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Token <strong className="font-mono font-extrabold text-slate-900 dark:text-white text-sm">{activeToken.tokenNumber}</strong> for {activeToken.departmentName || activeToken.service}. Complete or cancel this token to request another.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setCurrentView('live-queue')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Track Status →
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cancel Token</span>
            </button>
          </div>
        </div>
      )}

      {/* Error alert with instant cancel button */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {activeToken && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Cancel Token</span>
              </button>
            )}
            <button
              onClick={() => setCurrentView('live-queue')}
              className="font-bold underline cursor-pointer"
            >
              View Active Token →
            </button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <CancelTokenModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        token={activeToken}
        loading={cancelling}
      />

      {/* 4 Large Service Cards - Matching Reference Image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((srv) => {
          const isLoading = loadingDept === srv.id;
          return (
            <div
              key={srv.id}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-40 w-full overflow-hidden relative">
                <img 
                  src={srv.image} 
                  alt={srv.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600');
                  }}
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {srv.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleGenerate(srv.id, srv.serviceName)}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Get Token</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Card: Current Queue Information - Matching Reference Image */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Current Queue Information
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 block text-[11px]">Current Token</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                  {activeToken ? activeToken.tokenNumber : 'F100'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">People Ahead</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {activeToken?.peopleAhead ?? 5}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated Wait</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {activeToken?.estimatedWaitMinutes ?? 15} min
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeToken) {
                setCurrentView('live-queue');
              } else {
                handleGenerate('dept_office', 'Bonafide Certificate');
              }
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer text-center"
          >
            {activeToken ? 'View Active Token' : 'Generate Token'}
          </button>
        </div>
      </div>

    </div>
  );
};
