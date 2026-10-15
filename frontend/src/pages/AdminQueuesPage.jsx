import React, { useState, useEffect, useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { playChime, announceToken } from '../utils/audio';
import { 
  Activity, 
  Layers, 
  Search, 
  PhoneCall, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRightLeft, 
  Clock, 
  User, 
  RefreshCw, 
  Volume2, 
  Eye, 
  SlidersHorizontal, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  X,
  Building2,
  Calendar
} from 'lucide-react';

export const AdminQueuesPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { 
    departments, 
    counters, 
    allTokens, 
    callNext, 
    completeToken, 
    skipToken, 
    recallToken, 
    transferToken,
    refreshQueue, 
    isRefreshing 
  } = useQueue();

  const [activeLaneTab, setActiveLaneTab] = useState('all'); // 'all' or departmentId
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'CALLING', 'WAITING', 'SKIPPED', 'COMPLETED', 'CANCELLED'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTokenModal, setSelectedTokenModal] = useState(null);
  const [transferModalToken, setTransferModalToken] = useState(null);
  const [transferTargetDept, setTransferTargetDept] = useState('');
  const [transferTargetCounter, setTransferTargetCounter] = useState(1);
  const [transferReason, setTransferReason] = useState('Service rerouting');
  const [transferring, setTransferring] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Auto-refresh timer count down
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Lane mappings: Lane 01 -> Office, Lane 02 -> Accounts, Lane 03 -> Library, Lane 04 -> Canteen
  const laneConfig = useMemo(() => {
    return [
      { laneNum: '01', id: 'dept-office', name: 'Lane 01 - Admin Office', code: 'F', color: 'blue' },
      { laneNum: '02', id: 'dept-accounts', name: 'Lane 02 - Accounts & Fees', code: 'A', color: 'indigo' },
      { laneNum: '03', id: 'dept-library', name: 'Lane 03 - Library Desk', code: 'L', color: 'amber' },
      { laneNum: '04', id: 'dept-canteen', name: 'Lane 04 - Cafeteria & Canteen', code: 'C', color: 'emerald' },
    ];
  }, []);

  // Filter tokens based on Lane, Status, Search
  const filteredTokens = useMemo(() => {
    return allTokens.filter(token => {
      // Lane filter
      if (activeLaneTab !== 'all' && token.departmentId !== activeLaneTab) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'CALLING' && token.status !== 'CALLING') return false;
        if (statusFilter === 'WAITING' && token.status !== 'WAITING') return false;
        if (statusFilter === 'SKIPPED' && token.status !== 'SKIPPED') return false;
        if (statusFilter === 'COMPLETED' && token.status !== 'COMPLETED') return false;
        if (statusFilter === 'CANCELLED' && token.status !== 'CANCELLED') return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = token.tokenNumber?.toLowerCase().includes(q);
        const matchStudent = token.studentName?.toLowerCase().includes(q);
        const matchId = token.studentId?.toLowerCase().includes(q);
        const matchService = token.service?.toLowerCase().includes(q);
        return matchNumber || matchStudent || matchId || matchService;
      }
      return true;
    }).sort((a, b) => {
      // Order: CALLING first, then WAITING by creation, then SKIPPED, then COMPLETED/CANCELLED
      const order = { CALLING: 1, WAITING: 2, SKIPPED: 3, COMPLETED: 4, CANCELLED: 5 };
      const diff = (order[a.status] || 99) - (order[b.status] || 99);
      if (diff !== 0) return diff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [allTokens, activeLaneTab, statusFilter, searchQuery]);

  // Status counts for legend
  const statusCounts = useMemo(() => {
    const counts = { CALLING: 0, WAITING: 0, SKIPPED: 0, COMPLETED: 0, CANCELLED: 0, TOTAL: allTokens.length };
    allTokens.forEach(t => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });
    return counts;
  }, [allTokens]);

  const handleAction = async (actionType, tokenId, params = {}) => {
    setActionLoading(`${actionType}_${tokenId}`);
    try {
      if (actionType === 'complete') {
        await completeToken(tokenId);
      } else if (actionType === 'skip') {
        await skipToken(tokenId);
      } else if (actionType === 'recall') {
        await recallToken(tokenId);
      } else if (actionType === 'call') {
        await callNext(params.departmentId, params.counter);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferModalToken || !transferTargetDept) return;
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
    <div className="min-h-screen bg-[#0b132b] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                Live Queue Monitor
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE DESK
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Multi-lane token dispatch, real-time lane cards, status filters & counter rerouting.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
            Last Sync: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={() => playChime('call')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white transition-all cursor-pointer"
            title="Test Chime Announcement"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => refreshQueue()}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Lanes
          </button>
        </div>
      </div>

      {/* Lane Summary Bar (Lanes 01 - 04) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {laneConfig.map((lane) => {
          const dept = departments.find(d => d.id === lane.id);
          const counter = counters.find(c => c.departmentId === lane.id);
          const laneTokens = allTokens.filter(t => t.departmentId === lane.id);
          const servingToken = laneTokens.find(t => t.status === 'CALLING');
          const waitingCount = laneTokens.filter(t => t.status === 'WAITING').length;
          const isPaused = counter?.status === 'Paused';

          return (
            <div 
              key={lane.id}
              onClick={() => setActiveLaneTab(activeLaneTab === lane.id ? 'all' : lane.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                activeLaneTab === lane.id 
                  ? 'bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/10' 
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  LANE {lane.laneNum}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isPaused 
                    ? 'bg-amber-500/20 text-amber-300' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`} />
                  {isPaused ? 'Paused' : 'Active'}
                </span>
              </div>
              
              <div className="text-sm font-bold text-white truncate">
                {dept?.name || lane.name}
              </div>
              <div className="text-[11px] text-slate-400 mb-3">
                Desk Counter {counter?.counterNumber || lane.laneNum} • {counter?.staffName || 'Officer on Duty'}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">Now Serving</div>
                  <div className="text-lg font-black font-mono text-emerald-400">
                    {servingToken ? servingToken.tokenNumber : (counter?.currentToken || '—')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase text-slate-400">In Backlog</div>
                  <div className="text-lg font-black font-mono text-amber-400">
                    {waitingCount}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Ribbon */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        
        {/* Lane Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80">
          <button
            onClick={() => setActiveLaneTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeLaneTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Lanes ({allTokens.length})
          </button>
          {laneConfig.map(lane => {
            const laneCount = allTokens.filter(t => t.departmentId === lane.id).length;
            return (
              <button
                key={lane.id}
                onClick={() => setActiveLaneTab(lane.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeLaneTab === lane.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{lane.name}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 font-mono text-slate-300">
                  {laneCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status Filters + Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          {/* Status Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono text-slate-400 mr-1 hidden sm:inline">Status:</span>
            {[
              { id: 'ALL', label: 'All', count: statusCounts.TOTAL, color: 'text-slate-300' },
              { id: 'CALLING', label: 'Serving', count: statusCounts.CALLING, color: 'text-emerald-400' },
              { id: 'WAITING', label: 'Waiting', count: statusCounts.WAITING, color: 'text-amber-400' },
              { id: 'SKIPPED', label: 'No-Show', count: statusCounts.SKIPPED, color: 'text-rose-400' },
              { id: 'COMPLETED', label: 'Completed', count: statusCounts.COMPLETED, color: 'text-blue-400' },
              { id: 'CANCELLED', label: 'Cancelled', count: statusCounts.CANCELLED, color: 'text-slate-400' },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === filter.id
                    ? 'bg-slate-700 text-white font-bold border border-slate-600'
                    : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{filter.label}</span>
                <span className={`text-[11px] font-mono font-bold ${filter.color}`}>
                  ({filter.count})
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] lg:min-w-[300px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search token #, student, roll no..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Color Legend Bar (From Reference Images 4 & 5) */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono text-slate-400">
        <span className="font-bold text-slate-300">Status Legend:</span>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-300">Serving (Active Desk)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-amber-300">Waiting (In Queue)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-rose-300">No-Show / Skipped</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-blue-300">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span className="text-slate-400">Cancelled</span>
          </div>
        </div>
        <div>
          Showing {filteredTokens.length} of {allTokens.length} Tokens
        </div>
      </div>

      {/* Queue Cards Grid (Matching Visual Reference 4 & 5) */}
      {filteredTokens.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Queue Tokens Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery 
              ? `No tokens match "${searchQuery}". Clear your search query to view all queue items.` 
              : 'There are currently no tokens matching the selected lane or status filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTokens.map((token) => {
            const isServing = token.status === 'CALLING';
            const isWaiting = token.status === 'WAITING';
            const isSkipped = token.status === 'SKIPPED';
            const isCompleted = token.status === 'COMPLETED';
            const isCancelled = token.status === 'CANCELLED';

            // Card styling by status
            let cardBg = 'bg-slate-900/80 border-slate-800 hover:border-slate-700';
            let badgeBg = 'bg-slate-800 text-slate-300';
            let statusTitle = token.status;

            if (isServing) {
              cardBg = 'bg-emerald-950/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10 hover:border-emerald-400';
              badgeBg = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
              statusTitle = 'NOW SERVING';
            } else if (isWaiting) {
              cardBg = 'bg-amber-950/20 border-amber-500/40 shadow-sm hover:border-amber-400';
              badgeBg = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
              statusTitle = 'WAITING';
            } else if (isSkipped) {
              cardBg = 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400';
              badgeBg = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
              statusTitle = 'NO-SHOW';
            } else if (isCompleted) {
              cardBg = 'bg-blue-950/20 border-blue-500/30 hover:border-blue-400';
              badgeBg = 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
              statusTitle = 'SERVED';
            } else if (isCancelled) {
              cardBg = 'bg-slate-900/40 border-slate-800/80 opacity-75';
              badgeBg = 'bg-slate-800 text-slate-400 border border-slate-700';
              statusTitle = 'CANCELLED';
            }

            return (
              <div
                key={token.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${cardBg}`}
              >
                <div>
                  {/* Card Header: Token Number & Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2">
                        {token.tokenNumber}
                        {isServing && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        Counter {token.counter || 1} • {token.departmentName}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider ${badgeBg}`}>
                      {statusTitle}
                    </span>
                  </div>

                  {/* Student Details */}
                  <div className="py-2 my-2 border-y border-slate-800/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-white font-semibold truncate">
                      <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{token.studentName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>ID: <strong className="text-slate-300">{token.studentId}</strong></span>
                      <span className="truncate ml-2 text-slate-400">{token.service}</span>
                    </div>
                  </div>

                  {/* Timing Meta */}
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {token.calledAt && (
                      <span className="text-emerald-400">
                        Called {new Date(token.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                  {/* If Waiting: Quick Call */}
                  {isWaiting && (
                    <button
                      onClick={() => handleAction('call', token.id, { departmentId: token.departmentId, counter: token.counter })}
                      disabled={actionLoading === `call_${token.id}`}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PhoneCall className="w-3 h-3" />
                      Call
                    </button>
                  )}

                  {/* If Serving: Complete, Skip, Recall */}
                  {isServing && (
                    <>
                      <button
                        onClick={() => handleAction('complete', token.id)}
                        disabled={actionLoading === `complete_${token.id}`}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Mark token finished"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Complete
                      </button>
                      <button
                        onClick={() => handleAction('skip', token.id)}
                        disabled={actionLoading === `skip_${token.id}`}
                        className="py-1.5 px-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Skip missing student"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        No-Show
                      </button>
                      <button
                        onClick={() => handleAction('recall', token.id)}
                        disabled={actionLoading === `recall_${token.id}`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Recall announcement"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </>
                  )}

                  {/* Transfer to another counter/service */}
                  {(isServing || isWaiting) && (
                    <button
                      onClick={() => {
                        setTransferModalToken(token);
                        setTransferTargetDept(token.departmentId);
                        setTransferTargetCounter(token.counter || 1);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Transfer to another counter"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                    </button>
                  )}

                  {/* If Skipped: Option to Recall */}
                  {isSkipped && (
                    <button
                      onClick={() => handleAction('recall', token.id)}
                      disabled={actionLoading === `recall_${token.id}`}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Re-Call to Desk
                    </button>
                  )}

                  {/* View Details Modal Trigger */}
                  <button
                    onClick={() => setSelectedTokenModal(token)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="View full token details"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transfer Token Modal */}
      {transferModalToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white">
                <ArrowRightLeft className="w-5 h-5 text-blue-400" />
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
                <div className="text-slate-400">Current Desk: <span className="text-blue-400">{transferModalToken.departmentName} - Counter {transferModalToken.counter}</span></div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Department / Service:</label>
                <select
                  value={transferTargetDept}
                  onChange={(e) => setTransferTargetDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
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
                <label className="block text-slate-300 font-semibold mb-1">Reason for Transfer:</label>
                <input
                  type="text"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="e.g., Needs fee clearance before document verification"
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
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  {transferring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Token Details Modal */}
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
                <span className="text-slate-500 block mb-0.5">Assigned Counter</span>
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
