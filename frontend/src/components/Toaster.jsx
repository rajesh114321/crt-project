import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const Toaster = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <Bell className="w-5 h-5 text-amber-500 animate-bounce" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'alert':
        return 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100';
      case 'warning':
        return 'border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100';
      case 'success':
        return 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100';
      default:
        return 'border-blue-300 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100';
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 ${getBorderColor(toast.type)}`}
        >
          <div className="shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h5 className="font-semibold text-sm leading-tight mb-1">
                {toast.title}
              </h5>
            )}
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
