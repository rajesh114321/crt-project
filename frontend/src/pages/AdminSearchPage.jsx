import React, { useState } from 'react';
import { api } from '../services/api';
import { useQueue } from '../context/QueueContext';
import { 
  Search, 
  User, 
  Ticket, 
  Building2, 
  Clock, 
  PhoneCall, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const AdminSearchPage = ({ setCurrentView }) => {
  const { allTokens, callNext, completeToken, skipToken, recallToken } = useQueue();
  const [query, setQuery] = useState('F-037'); // prefill demo search from prompt
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter local & backend tokens
  const results = allTokens.filter(t => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || (
      t.tokenNumber.toLowerCase().includes(q) ||
      (t.studentName && t.studentName.toLowerCase().includes(q)) ||
      (t.studentId && t.studentId.toLowerCase().includes(q)) ||
      (t.departmentName && t.departmentName.toLowerCase().includes(q)) ||
      (t.service && t.service.toLowerCase().includes(q))
    );

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Student & Token Registry Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Lookup any token number (e.g. F-037), student name (e.g. Rajesh), or Student ID (e.g. 2024CS108).
        </p>
      </div>

      {/* Search Input & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Token (F-037), Student Name (Rajesh), Student ID (2024CS108)..."
            className="w-full pl-12 pr-4 py-3 text-sm sm:text-base rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-slate-400 font-mono uppercase text-[11px] mr-1">Filter:</span>
            {['ALL', 'WAITING', 'CALLING', 'COMPLETED', 'SKIPPED', 'CANCELLED'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  statusFilter === s
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <span className="text-slate-400 font-mono">
            {results.length} result{results.length === 1 ? '' : 's'} found
          </span>
        </div>
      </div>

      {/* Results Grid (Section 16 Card Format) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">No matching student tokens found</h4>
            <p className="text-xs text-slate-400">Try searching for "Rajesh", "F-037", or "Accounts".</p>
          </div>
        ) : (
          results.map((tok) => {
            const isWaiting = tok.status === 'WAITING';
            const isCalling = tok.status === 'CALLING';

            return (
              <div
                key={tok.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-brand-600 dark:text-brand-400">
                      {tok.tokenNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isCalling ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse' :
                      isWaiting ? 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300' :
                      tok.status === 'COMPLETED' ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {tok.status}
                    </span>
                  </div>

                  {/* Metadata List Required in Section 16 */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Student:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{tok.studentName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Student ID:</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{tok.studentId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{tok.departmentName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Service:</span>
                      <span className="text-slate-700 dark:text-slate-300">{tok.service}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Counter:</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">Counter {tok.counter || 2}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Issued At:</span>
                      <span className="font-mono text-slate-500">
                        {new Date(tok.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Quick Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  {isCalling && (
                    <>
                      <button
                        onClick={() => completeToken(tok.id)}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => skipToken(tok.id, true)}
                        className="py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-colors"
                      >
                        Skip
                      </button>
                    </>
                  )}
                  {tok.status === 'SKIPPED' && (
                    <button
                      onClick={() => recallToken(tok.id)}
                      className="w-full py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Recall to Counter
                    </button>
                  )}
                  {isWaiting && (
                    <span className="text-[11px] text-slate-400 font-mono italic">
                      Waiting in queue for Counter {tok.counter || 2}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
