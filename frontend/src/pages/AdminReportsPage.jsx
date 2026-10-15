import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useQueue } from '../context/QueueContext';
import { 
  FileText, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Download, 
  RefreshCw,
  Layers,
  Star,
  Users
} from 'lucide-react';

export const AdminReportsPage = ({ setCurrentView }) => {
  const { allTokens, departments, refreshQueue, isRefreshing } = useQueue();
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [resetting, setResetting] = useState(false);

  const fetchRecords = async () => {
    setLoadingRecords(true);
    try {
      const data = await api.getServiceRecords();
      setRecords(data);
    } catch (err) {
      console.warn("Failed to fetch service records:", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleResetDemo = async () => {
    if (!window.confirm("Are you sure you want to RESET all demo queue data to initial factory state?")) {
      return;
    }
    setResetting(true);
    try {
      await api.resetDemo();
      await refreshQueue();
      await fetchRecords();
      alert("Demo queue data successfully reset!");
    } catch (err) {
      alert("Failed to reset: " + err.message);
    } finally {
      setResetting(false);
    }
  };

  const handleExportCSV = () => {
    if (!records.length) return;
    const headers = ['Token Number', 'Service', 'Counter', 'Started At', 'Completed At', 'Duration (sec)', 'Rating', 'Student'];
    const rows = records.map(r => [
      r.tokenNumber,
      `"${r.departmentName || r.service || ''}"`,
      `"${r.counterName || ''}"`,
      r.startedAt || '',
      r.completedAt || '',
      r.durationSeconds || '',
      r.rating || '',
      `"${r.studentName || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `QueueLess_Service_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status distributions
  const statusCounts = {
    WAITING: allTokens.filter(t => t.status === 'WAITING').length,
    CALLING: allTokens.filter(t => t.status === 'CALLING').length,
    COMPLETED: allTokens.filter(t => t.status === 'COMPLETED').length,
    SKIPPED: allTokens.filter(t => t.status === 'SKIPPED').length,
    CANCELLED: allTokens.filter(t => t.status === 'CANCELLED').length
  };
  const maxStatus = Math.max(1, ...Object.values(statusCounts));

  // Service distributions
  const serviceCounts = departments.map(d => ({
    name: d.name,
    count: allTokens.filter(t => t.departmentId === d.id).length
  }));
  const maxDept = Math.max(1, ...serviceCounts.map(s => s.count));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
              Operational Reporting
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Service-Time Records & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real service durations (called to completed), status breakdowns, and historical reporting.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => { refreshQueue(); fetchRecords(); }}
            disabled={isRefreshing || loadingRecords}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold"
            title="Reset demo data to initial factory state"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Two Column Distribution Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tokens by Status */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-500" />
            Tokens by Lifecycle Status
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Waiting', count: statusCounts.WAITING, color: 'bg-amber-500' },
              { label: 'Serving (Now)', count: statusCounts.CALLING, color: 'bg-emerald-500' },
              { label: 'Completed', count: statusCounts.COMPLETED, color: 'bg-indigo-500' },
              { label: 'Skipped (No-Show)', count: statusCounts.SKIPPED, color: 'bg-rose-500' },
              { label: 'Cancelled', count: statusCounts.CANCELLED, color: 'bg-slate-400' }
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(item.count / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tokens by Service */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Tokens by Department Service
          </h3>
          <div className="space-y-3">
            {serviceCounts.map(item => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{item.count} tokens</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxDept) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Service-Time Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Empirical Service Records</h3>
            <p className="text-xs text-slate-400">Exact duration logged from staff calling to completion</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60">
            {records.length} Completed Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-mono uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Token</th>
                <th className="py-3.5 px-6 font-semibold">Service</th>
                <th className="py-3.5 px-6 font-semibold">Counter</th>
                <th className="py-3.5 px-6 font-semibold">Started</th>
                <th className="py-3.5 px-6 font-semibold">Completed</th>
                <th className="py-3.5 px-6 font-semibold">Duration</th>
                <th className="py-3.5 px-6 font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No completed service records logged yet. Complete a token at a counter to create an audit record.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                      {r.tokenNumber}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {r.departmentName}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {r.service}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {r.counterName}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-500">
                      {r.startedAt ? new Date(r.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-500">
                      {r.completedAt ? new Date(r.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-200/60">
                        {r.durationFormatted}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {r.rating ? (
                        <div className="flex items-center gap-1 text-amber-500">
                          {'★'.repeat(r.rating)}
                          {'☆'.repeat(5 - r.rating)}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
