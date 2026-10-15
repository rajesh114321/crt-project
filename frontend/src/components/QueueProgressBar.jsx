import React from 'react';
import { CheckCircle2, Clock, MapPin, Bell } from 'lucide-react';

export const QueueProgressBar = ({ 
  status = "WAITING", 
  peopleAhead = 6, 
  counter = 2 
}) => {
  // Determine percentage completed (assuming typical initial queue of ~10)
  const maxBaseline = Math.max(peopleAhead + 2, 8);
  const progressPercent = status === 'CALLING' || status === 'COMPLETED' 
    ? 100 
    : Math.max(10, Math.round(((maxBaseline - peopleAhead) / maxBaseline) * 100));

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-brand-500" />
          Queue Proximity
        </span>
        <span className={`font-mono font-bold ${
          status === 'CALLING' 
            ? 'text-emerald-600 dark:text-emerald-400 animate-pulse' 
            : peopleAhead <= 2 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-brand-600 dark:text-brand-400'
        }`}>
          {status === 'CALLING' 
            ? 'Now Serving!' 
            : peopleAhead === 0 
              ? 'You are Next' 
              : `${peopleAhead} people ahead`}
        </span>
      </div>

      {/* Bar container */}
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/80">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            status === 'CALLING' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-sm shadow-emerald-500/50' 
              : peopleAhead <= 1 
                ? 'bg-gradient-to-r from-amber-500 to-orange-400' 
                : 'bg-gradient-to-r from-brand-500 to-indigo-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step tags */}
      <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
        <span>Joined</span>
        <span className={peopleAhead <= 3 ? 'text-amber-500 font-bold' : ''}>Turn Approaching</span>
        <span className={status === 'CALLING' ? 'text-emerald-500 font-bold' : ''}>Counter {counter}</span>
      </div>
    </div>
  );
};
