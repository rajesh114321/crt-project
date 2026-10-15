import React, { useState, useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Ticket, 
  Search, 
  Filter, 
  X, 
  Eye, 
  Ban, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRightLeft, 
  Download, 
  RefreshCw, 
  Calendar, 
  Clock, 
  User, 
  Building2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { CancelTokenModal } from '../components/CancelTokenModal';

export const AdminTokensPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { 
    allTokens, 
    departments, 
    completeToken, 
    skipToken, 
    recallToken, 
    cancelToken, 
    transferToken,
    refreshQueue, 
    isRefreshing 
  } = useQueue();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedTokenModal, setSelectedTokenModal] = useState(null);
  const [tokenToCancel, setTokenToCancel] = useState(null);
  const [transferModalToken, setTransferModalToken] = useState(null);
  const [transferTargetDept, setTransferTargetDept] = useState('');
  const [transferTargetCounter, setTransferTargetCounter] = useState(1);
  const [transferReason, setTransferReason] = useState('Student request');
  const [transferring, setTransferring] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Filtered Tokens
  const filteredTokens = useMemo(() => {
    return allTokens.filter(t => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (deptFilter !== 'ALL' && t.departmentId !== deptFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = t.tokenNumber?.toLowerCase().includes(q);
        const matchName = t.studentName?.toLowerCase().includes(q);
        const matchId = t.studentId?.toLowerCase().includes(q);
        const matchSvc = t.service?.toLowerCase().includes(q);
        return matchNum || matchName || matchId || matchSvc;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [allTokens, statusFilter, deptFilter, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Token Number', 'Student Name', 'Student ID', 'Department', 'Service', 'Counter', 'Status', 'Created At', 'Called At', 'Completed At'];
    const rows = filteredTokens.map(t => [
      `"${t.tokenNumber}"`,
      `"${t.studentName || ''}"`,
      `"${t.studentId || ''}"`,
      `"${t.departmentName || ''}"`,
      `"${t.service || ''}"`,
      t.counter || 1,
      t.status,
      `"${t.createdAt}"`,
      `"${t.calledAt || ''}"`,
      `"${t.completedAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `queueless_tokens_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAction = async (action, tokenId) => {
    setActionLoading(`${action}_${tokenId}`);
    try {
      if (action === 'complete') await completeToken(tokenId);
      else if (action === 'skip') await skipToken(tokenId);
      else if (action === 'recall') await recallToken(tokenId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferModalToken) return;
    setTransferring(true);
    try {
      await transferToken(transferModalToken.id, {
        departmentId: transferTargetDept,
        counterNumber: transferTargetCounter,
        reason: transferReason
      });
      setTransferModalToken(null);
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Ticket className="w-6 h-6 text-blue-400" />
            Token Management & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete database of campus tokens. Search, filter, re-dispatch, cancel or export queue records.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={() => refreshQueue()}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Tokens', count: allTokens.length, color: 'text-white bg-slate-800/80' },
          { label: 'Serving', count: allTokens.filter(t => t.status === 'CALLING').length, color: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30' },
          { label: 'Waiting', count: allTokens.filter(t => t.status === 'WAITING').length, color: 'text-amber-400 bg-amber-950/30 border-amber-500/30' },
          { label: 'No-Shows', count: allTokens.filter(t => t.status === 'SKIPPED').length, color: 'text-rose-400 bg-rose-950/30 border-rose-500/30' },
          { label: 'Completed', count: allTokens.filter(t => t.status === 'COMPLETED').length, color: 'text-blue-400 bg-blue-950/30 border-blue-500/30' },
          { label: 'Cancelled', count: allTokens.filter(t => t.status === 'CANCELLED').length, color: 'text-slate-400 bg-slate-800/40 border-slate-700' },
        ].map((stat, i) => (
          <div key={i} className={`p-3 rounded-2xl border border-slate-800 flex flex-col justify-between ${stat.color}`}>
            <span className="text-[11px] font-mono text-slate-400">{stat.label}</span>
            <span className="text-xl font-black font-mono mt-1">{stat.count}</span>
          </div>
        ))}
      </div>

      {/* Filter and Search Ribbon */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by token # (e.g. F-101), student name or roll..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="CALLING">Now Serving</option>
              <option value="WAITING">Waiting in Queue</option>
              <option value="SKIPPED">Skipped / No-Show</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Tokens Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                <th className="py-3.5 px-4">Token #</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Counter</th>
                <th className="py-3.5 px-4">Time Issued</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No tokens found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTokens.map((token) => {
                  const isServing = token.status === 'CALLING';
                  const isWaiting = token.status === 'WAITING';
                  const isSkipped = token.status === 'SKIPPED';
                  const isCompleted = token.status === 'COMPLETED';
                  const isCancelled = token.status === 'CANCELLED';

                  let badgeStyle = 'bg-slate-800 text-slate-300';
                  if (isServing) badgeStyle = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
                  else if (isWaiting) badgeStyle = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
                  else if (isSkipped) badgeStyle = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
                  else if (isCompleted) badgeStyle = 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
                  else if (isCancelled) badgeStyle = 'bg-slate-800 text-slate-400 border border-slate-700';

                  return (
                    <tr key={token.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                        {token.tokenNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{token.studentName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{token.studentId}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">
                        {token.service}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {token.departmentName}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                        Counter {token.counter || 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider ${badgeStyle}`}>
                          {token.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Details */}
                          <button
                            onClick={() => setSelectedTokenModal(token)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="View full token details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Complete action */}
                          {isServing && (
                            <button
                              onClick={() => handleAction('complete', token.id)}
                              disabled={actionLoading === `complete_${token.id}`}
                              className="p-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white transition-all cursor-pointer"
                              title="Complete token"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Skip / No-Show */}
                          {isServing && (
                            <button
                              onClick={() => handleAction('skip', token.id)}
                              disabled={actionLoading === `skip_${token.id}`}
                              className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-all cursor-pointer"
                              title="Flag as No-Show"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Recall */}
                          {(isServing || isSkipped) && (
                            <button
                              onClick={() => handleAction('recall', token.id)}
                              disabled={actionLoading === `recall_${token.id}`}
                              className="p-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white transition-all cursor-pointer"
                              title="Recall chime"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Transfer */}
                          {(isServing || isWaiting) && (
                            <button
                              onClick={() => {
                                setTransferModalToken(token);
                                setTransferTargetDept(token.departmentId);
                                setTransferTargetCounter(token.counter || 1);
                              }}
                              className="p-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-all cursor-pointer"
                              title="Transfer to another counter"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Cancel Token (Active only) */}
                          {(isServing || isWaiting) && (
                            <button
                              onClick={() => setTokenToCancel(token)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                              title="Cancel token"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Token Modal */}
      {tokenToCancel && (
        <CancelTokenModal
          token={tokenToCancel}
          isOpen={!!tokenToCancel}
          onClose={() => setTokenToCancel(null)}
          onSuccess={() => {
            setTokenToCancel(null);
            refreshQueue();
          }}
        />
      )}

      {/* Transfer Token Modal */}
      {transferModalToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white">
                <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg">Transfer Token {transferModalToken.tokenNumber}</h3>
              </div>
              <button 
                onClick={() => setTransferModalToken(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400">Student: <strong className="text-white">{transferModalToken.studentName}</strong> ({transferModalToken.studentId})</div>
                <div className="text-slate-400">Current Desk: {transferModalToken.departmentName} (Counter {transferModalToken.counter})</div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Department:</label>
                <select
                  value={transferTargetDept}
                  onChange={(e) => setTransferTargetDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Counter:</label>
                <select
                  value={transferTargetCounter}
                  onChange={(e) => setTransferTargetCounter(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  {[1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>Counter {n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Transfer Reason:</label>
                <input
                  type="text"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="e.g., Needs fee clearance"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransferModalToken(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferring}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  {transferring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-mono text-blue-400">{selectedTokenModal.tokenNumber}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300">
                  {selectedTokenModal.status}
                </span>
              </div>
              <button 
                onClick={() => setSelectedTokenModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Student Name</span>
                <span className="text-white font-bold">{selectedTokenModal.studentName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Student Roll / ID</span>
                <span className="text-white font-mono font-bold">{selectedTokenModal.studentId}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Department & Service</span>
                <span className="text-white font-semibold">{selectedTokenModal.departmentName} - {selectedTokenModal.service}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Counter</span>
                <span className="text-white font-mono font-bold">Counter {selectedTokenModal.counter || 1}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Created At</span>
                <span className="text-slate-300 font-mono">{new Date(selectedTokenModal.createdAt).toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-0.5">Called At</span>
                <span className="text-slate-300 font-mono">
                  {selectedTokenModal.calledAt ? new Date(selectedTokenModal.calledAt).toLocaleString() : 'Not yet called'}
                </span>
              </div>
            </div>

            {selectedTokenModal.rating && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
                <div className="text-emerald-400 font-bold mb-1">Student Feedback: {selectedTokenModal.rating} ★</div>
                <div className="text-slate-300 italic">"{selectedTokenModal.feedback || 'No comments provided'}"</div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTokenModal(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
