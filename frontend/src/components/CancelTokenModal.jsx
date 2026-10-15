import React from 'react';
import { AlertTriangle, X, Check, Trash2 } from 'lucide-react';

export const CancelTokenModal = ({
  isOpen,
  onClose,
  onConfirm,
  token,
  loading = false
}) => {
  if (!isOpen || !token) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-scaleUp"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Icon */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Are you sure you want to cancel this token?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Cancelling token <strong className="font-mono text-slate-900 dark:text-white font-bold">{token.tokenNumber}</strong> for <span className="font-semibold text-slate-800 dark:text-slate-200">{token.departmentName || token.service}</span> will forfeit your current position in the queue. You can take a new token right away.
          </p>
        </div>

        {/* Token Summary Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Active Token Number</span>
            <span className="font-mono font-black text-xl text-rose-600 dark:text-rose-400">{token.tokenNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Department / Service</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{token.departmentName || token.service}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
          >
            Keep Token
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Cancel Token</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
