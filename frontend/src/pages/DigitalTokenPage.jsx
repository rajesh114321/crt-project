import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { TokenPass } from '../components/TokenPass';
import { Modal } from '../components/Modal';
import { Ticket, ArrowLeft, RefreshCw, AlertTriangle, Sparkles, PlusCircle } from 'lucide-react';

export const DigitalTokenPage = ({ setCurrentView }) => {
  const { activeToken, liveQueue, cancelToken, refreshQueue, isRefreshing } = useQueue();
  const [cancelModal, setCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const studentStatus = liveQueue?.studentStatus;
  const currentlyServing = studentStatus?.currentlyServing || "None";
  const peopleAhead = studentStatus?.peopleAhead ?? 0;
  const estimatedWait = studentStatus?.estimatedWaitMinutes ?? 0;

  const handleConfirmCancel = async () => {
    if (!activeToken) return;
    setCanceling(true);
    try {
      await cancelToken(activeToken.id);
      setCancelModal(false);
      setCurrentView('student-dashboard');
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('student-dashboard')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <button
          onClick={() => refreshQueue()}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {activeToken ? (
        <div className="space-y-6">
          {/* Main Boarding Pass Component */}
          <TokenPass
            token={activeToken}
            currentlyServing={currentlyServing}
            peopleAhead={peopleAhead}
            estimatedWait={estimatedWait}
            onTrackQueue={() => setCurrentView('live-queue')}
            onCancel={() => setCancelModal(true)}
          />
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-4">
          <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            No Active Digital Token
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            You do not currently have a token in the queue. Select a service to take a digital token.
          </p>
          <button
            onClick={() => setCurrentView('get-token')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Get Token Now
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Confirm Token Cancellation"
        confirmText="Yes, Cancel"
        confirmVariant="danger"
        loading={canceling}
        onConfirm={handleConfirmCancel}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>
              Are you sure you want to cancel token <strong className="font-mono">{activeToken?.tokenNumber}</strong>?
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Canceling will free up this spot for other waiting students.
          </p>
        </div>
      </Modal>

    </div>
  );
};
