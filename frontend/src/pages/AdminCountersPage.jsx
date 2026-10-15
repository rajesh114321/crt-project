import React, { useState, useEffect, useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { playChime, announceToken } from '../utils/audio';
import { 
  SlidersHorizontal, 
  PhoneCall, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRightLeft, 
  Pause, 
  Play, 
  Clock, 
  User, 
  RefreshCw, 
  Plus, 
  ShieldCheck, 
  Volume2, 
  Timer,
  Building2,
  Calendar,
  X,
  History,
  Activity
} from 'lucide-react';

export const AdminCountersPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { 
    counters, 
    departments, 
    allTokens, 
    callNext, 
    completeToken, 
    skipToken, 
    recallToken, 
    transferToken,
    updateCounter,
    refreshQueue, 
    isRefreshing 
  } = useQueue();

  const [selectedCounterNum, setSelectedCounterNum] = useState(1);
  const [servingSeconds, setServingSeconds] = useState(145); // Live running service timer
  const [transferModalToken, setTransferModalToken] = useState(null);
  const [transferTargetDept, setTransferTargetDept] = useState('dept-accounts');
  const [transferTargetCounter, setTransferTargetCounter] = useState(2);
  const [transferReason, setTransferReason] = useState('Fee verification needed');
  const [transferring, setTransferring] = useState(false);
  const [showAddCounterModal, setShowAddCounterModal] = useState(false);
  const [newCounterDept, setNewCounterDept] = useState('dept-office');
  const [newCounterStaff, setNewCounterStaff] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Active counter object
  const activeCounter = counters.find(c => c.counterNumber === selectedCounterNum) || counters[0] || {
    id: 'cnt-1',
    counterNumber: 1,
    name: 'Counter 1',
    departmentName: 'Admin Office',
    departmentId: 'dept-office',
    status: 'Active',
    staffName: 'Officer on Duty',
    currentToken: 'F-101'
  };

  // Currently serving token at this selected counter
  const currentlyServingToken = useMemo(() => {
    return allTokens.find(t => 
      t.status === 'CALLING' && (t.counter === selectedCounterNum || t.departmentId === activeCounter.departmentId)
    ) || allTokens.find(t => t.status === 'CALLING');
  }, [allTokens, selectedCounterNum, activeCounter]);

  // Live timer tick for active serving token
  useEffect(() => {
    const timer = setInterval(() => {
      setServingSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Completed tokens served today
  const servedTodayTokens = useMemo(() => {
    return allTokens
      .filter(t => t.status === 'COMPLETED')
      .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt))
      .slice(0, 10);
  }, [allTokens]);

  // Live activity log feed
  const activityLogs = useMemo(() => {
    const logs = [];
    allTokens.forEach(t => {
      if (t.status === 'CALLING') {
        logs.push({
          id: `log_call_${t.id}`,
          time: t.calledAt || t.createdAt,
          text: `Token ${t.tokenNumber} called to Counter ${t.counter}`,
          type: 'call',
          badge: 'SERVING',
          badgeColor: 'text-emerald-400 bg-emerald-500/20'
        });
      }
      if (t.status === 'COMPLETED') {
        logs.push({
          id: `log_comp_${t.id}`,
          time: t.completedAt || t.createdAt,
          text: `Token ${t.tokenNumber} marked completed`,
          type: 'complete',
          badge: 'COMPLETED',
          badgeColor: 'text-blue-400 bg-blue-500/20'
        });
      }
      if (t.status === 'SKIPPED') {
        logs.push({
          id: `log_skip_${t.id}`,
          time: t.calledAt || t.createdAt,
          text: `Token ${t.tokenNumber} flagged as No-Show`,
          type: 'skip',
          badge: 'NO-SHOW',
          badgeColor: 'text-rose-400 bg-rose-500/20'
        });
      }
      if (t.transferredAt) {
        logs.push({
          id: `log_trans_${t.id}`,
          time: t.transferredAt,
          text: `Token ${t.tokenNumber} transferred to Counter ${t.counter}`,
          type: 'transfer',
          badge: 'TRANSFERRED',
          badgeColor: 'text-amber-400 bg-amber-500/20'
        });
      }
    });

    return logs.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 12);
  }, [allTokens]);

  const handleNextCall = async () => {
    setActionLoading('next');
    try {
      await callNext(activeCounter.departmentId, activeCounter.counterNumber);
      setServingSeconds(0);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async () => {
    if (!currentlyServingToken) return;
    setActionLoading('complete');
    try {
      await completeToken(currentlyServingToken.id);
      setServingSeconds(0);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSkip = async () => {
    if (!currentlyServingToken) return;
    setActionLoading('skip');
    try {
      await skipToken(currentlyServingToken.id);
      setServingSeconds(0);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRecall = async () => {
    if (!currentlyServingToken) return;
    setActionLoading('recall');
    try {
      await recallToken(currentlyServingToken.id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePause = async (counter) => {
    const newStatus = counter.status === 'Paused' ? 'Active' : 'Paused';
    try {
      await updateCounter(counter.id, { status: newStatus });
    } catch (e) {
      console.warn(e);
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
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Counter Management & Dispatch
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              ONESTQ STATION
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time counter console, live serving timer, quick dispatch actions and service logs.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => playChime('call')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Play Audio Chime"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddCounterModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Counter
          </button>
          <button
            onClick={() => refreshQueue()}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync
          </button>
        </div>
      </div>

      {/* Counter Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {counters.map(c => {
          const isSelected = c.counterNumber === selectedCounterNum;
          const isPaused = c.status === 'Paused';

          return (
            <button
              key={c.id}
              onClick={() => setSelectedCounterNum(c.counterNumber)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-102'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Counter {c.counterNumber} ({c.departmentName})</span>
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`} />
            </button>
          );
        })}
      </div>

      {/* HERO SECTION: CURRENTLY SERVING CARD (Matching Image 1 ONESTQ) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Hero Currently Serving Card */}
        <div className="lg:col-span-8 bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Hero Top Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  CURRENTLY SERVING
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Desk: <strong className="text-white">Counter {activeCounter.counterNumber}</strong> ({activeCounter.departmentName})
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Staff Operator: {activeCounter.staffName || 'Officer on Duty'}
              </h2>
            </div>

            {/* Live Serving Stopwatch Timer */}
            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl">
              <Timer className="w-5 h-5 text-emerald-400 animate-spin-slow" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block leading-none">Serving Duration</span>
                <span className="text-xl font-black font-mono text-emerald-400 tracking-wider">
                  {currentlyServingToken ? formatTimer(servingSeconds) : '00:00'}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Main Body: Token & Student Profile */}
          {currentlyServingToken ? (
            <div className="py-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white text-emerald-300 drop-shadow-md">
                    {currentlyServingToken.tokenNumber}
                  </div>
                  <div className="text-base font-bold text-slate-200 mt-1 flex items-center gap-2">
                    <span>{currentlyServingToken.service}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Counter {currentlyServingToken.counter || activeCounter.counterNumber}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1 min-w-[240px]">
                  <div className="text-xs text-slate-400">Student Name:</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-400" />
                    {currentlyServingToken.studentName}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Roll/ID: <strong className="text-slate-200">{currentlyServingToken.studentId}</strong>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                    Issued: {new Date(currentlyServingToken.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (Matching Image 1: Complete, Recall, No-Show, Transfer, Next Call) */}
              <div className="pt-4 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* 1. Complete */}
                <button
                  onClick={handleComplete}
                  disabled={actionLoading === 'complete'}
                  className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Complete</span>
                </button>

                {/* 2. Recall */}
                <button
                  onClick={handleRecall}
                  disabled={actionLoading === 'recall'}
                  className="py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Recall Chime</span>
                </button>

                {/* 3. No-Show / Skip */}
                <button
                  onClick={handleSkip}
                  disabled={actionLoading === 'skip'}
                  className="py-3 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span>No-Show / Skip</span>
                </button>

                {/* 4. Transfer */}
                <button
                  onClick={() => {
                    setTransferModalToken(currentlyServingToken);
                    setTransferTargetDept(activeCounter.departmentId);
                  }}
                  className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
                  <span>Transfer</span>
                </button>

                {/* 5. Next Call (Large Primary) */}
                <button
                  onClick={handleNextCall}
                  disabled={actionLoading === 'next'}
                  className="col-span-2 sm:col-span-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Next Call</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-4">
              <Clock className="w-12 h-12 text-slate-600 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-white">Counter {activeCounter.counterNumber} is Ready</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  There is currently no active token assigned at this desk. Click "Call Next Token" to advance the queue.
                </p>
              </div>
              <button
                onClick={handleNextCall}
                disabled={actionLoading === 'next'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                Call Next Token
              </button>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Live Activity Log (Image 1 Feature) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Live Activity Log</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Real-time Feed</span>
            </div>

            <div className="divide-y divide-slate-800/80 max-h-[360px] overflow-y-auto pr-1 mt-2 space-y-1">
              {activityLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-slate-300 font-medium leading-tight">{log.text}</p>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${log.badgeColor}`}>
                    {log.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Logged Events: {activityLogs.length}</span>
            <button 
              onClick={() => refreshQueue()}
              className="text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              Refresh Feed
            </button>
          </div>
        </div>

      </div>

      {/* ALL ACTIVE COUNTERS GRID (With Pause/Resume & Backlog Count) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
            Campus Service Desks Status
          </h2>
          <span className="text-xs text-slate-400">
            {counters.filter(c => c.status !== 'Paused').length} of {counters.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {counters.map((c) => {
            const isPaused = c.status === 'Paused';
            const deptTokens = allTokens.filter(t => t.departmentId === c.departmentId);
            const waitingCount = deptTokens.filter(t => t.status === 'WAITING').length;
            const currentServing = deptTokens.find(t => t.status === 'CALLING');

            return (
              <div 
                key={c.id} 
                className={`p-5 rounded-2xl border transition-all ${
                  isPaused 
                    ? 'bg-slate-900/50 border-slate-800 opacity-80' 
                    : 'bg-slate-800/80 border-slate-700/80 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    COUNTER {c.counterNumber}
                  </span>
                  <button
                    onClick={() => handleTogglePause(c)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isPaused 
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    }`}
                    title={isPaused ? 'Resume counter' : 'Pause counter'}
                  >
                    {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                </div>

                <div className="font-bold text-white text-sm">{c.departmentName}</div>
                <div className="text-xs text-slate-400 mb-4">{c.staffName || 'Officer on Duty'}</div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Serving</span>
                    <span className="text-base font-black font-mono text-emerald-400">
                      {currentServing ? currentServing.tokenNumber : (c.currentToken || '—')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">In Queue</span>
                    <span className="text-base font-black font-mono text-amber-400">
                      {waitingCount}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCounterNum(c.counterNumber);
                      handleNextCall();
                    }}
                    disabled={isPaused}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    Next Token
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SERVED TOKENS TABLE (Matching Image 1 Feature) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Completed Service Records Today
            </h2>
            <p className="text-xs text-slate-400">Audit trail of tokens marked completed during active desk shifts.</p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
            {servedTodayTokens.length} Completed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Service & Department</th>
                <th className="py-3 px-4">Counter</th>
                <th className="py-3 px-4">Called Time</th>
                <th className="py-3 px-4">Completed Time</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {servedTodayTokens.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {t.tokenNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{t.studentName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{t.studentId}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{t.service}</div>
                    <div className="text-[10px] text-slate-500">{t.departmentName}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-300">
                    Counter {t.counter || 1}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {t.calledAt ? new Date(t.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {t.completedAt ? new Date(t.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      COMPLETED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                <div className="text-slate-400">Current Station: Counter {transferModalToken.counter || activeCounter.counterNumber}</div>
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
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Counter Number:</label>
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  {transferring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Counter Modal */}
      {showAddCounterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">Deploy New Service Counter</h3>
              </div>
              <button 
                onClick={() => setShowAddCounterModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Counter Number:</label>
                <input
                  type="text"
                  disabled
                  value={`Counter ${counters.length + 1}`}
                  className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Department:</label>
                <select
                  value={newCounterDept}
                  onChange={(e) => setNewCounterDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Staff Officer in Charge:</label>
                <input
                  type="text"
                  value={newCounterStaff}
                  onChange={(e) => setNewCounterStaff(e.target.value)}
                  placeholder="e.g., Prof. Rajesh Sharma"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCounterModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Counter ${counters.length + 1} registered and assigned to ${departments.find(d => d.id === newCounterDept)?.name || 'Department'}.`);
                    setShowAddCounterModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Save & Deploy Counter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
