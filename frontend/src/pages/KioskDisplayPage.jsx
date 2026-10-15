import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { playChime, announceToken } from '../utils/audio';
import { 
  Tv, 
  Clock, 
  Volume2, 
  Maximize, 
  Minimize, 
  ArrowLeft, 
  Activity, 
  Sparkles,
  School
} from 'lucide-react';

export const KioskDisplayPage = ({ setCurrentView }) => {
  const { counters, allTokens, departments, refreshQueue } = useQueue();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Get active waiting tokens for the right ticker
  const waitingTokens = allTokens
    .filter(t => t.status === 'WAITING')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-brand-500">
      
      {/* Top Kiosk Header */}
      <header className="border-b border-slate-800 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <School className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Queue<span className="text-brand-400">Less</span>
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-900/60 text-brand-300 border border-brand-700/50 uppercase">
                Campus Live Display
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Central Student Services & Administrative Hall Display
            </p>
          </div>
        </div>

        {/* Live Clock & Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-emerald-400">
              {timeStr}
            </div>
            <div className="text-xs font-mono text-slate-400">
              {dateStr}
            </div>
          </div>

          <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
            <button
              onClick={() => playChime('call')}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Test Chime Sound"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Toggle Fullscreen TV Mode"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCurrentView('landing')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Exit Kiosk
            </button>
          </div>
        </div>
      </header>

      {/* Main Kiosk Split Screen */}
      <main className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Column (8 cols): Currently Serving Counters */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 font-bold">
                NOW SERVING AT COUNTERS
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Please present your QR pass at the designated desk
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {counters.map((c) => {
              const isServing = c.status === 'Active' && c.currentlyServing && c.currentlyServing !== 'None';

              return (
                <div
                  key={c.counterId || c.counterNumber}
                  className={`p-6 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between ${
                    isServing
                      ? 'bg-slate-900/90 border-brand-500 shadow-2xl shadow-brand-500/10 ring-2 ring-brand-500/50'
                      : 'bg-slate-900/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="text-base font-black font-mono tracking-wider text-slate-300">
                      COUNTER {c.counterNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      c.status === 'Active' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  {/* Gigantic Token Display */}
                  <div className="my-6 text-center">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">
                      Token Number
                    </span>
                    <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white">
                      {c.currentlyServing || c.currentToken || '---'}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">{c.departmentName}</span>
                    <span className="font-mono">{c.waitingCount ?? 0} waiting</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Upcoming Tokens Queue Backlog */}
        <div className="lg:col-span-4 bg-slate-900/70 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-300">
                UPCOMING IN QUEUE
              </h3>
              <span className="text-xs font-mono text-brand-400 font-bold">
                Next {waitingTokens.length}
              </span>
            </div>

            <div className="space-y-2 mt-4">
              {waitingTokens.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 font-mono">
                  No pending tokens in line.
                </div>
              ) : (
                waitingTokens.map((tok, idx) => (
                  <div
                    key={tok.id}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-base text-white">{tok.tokenNumber}</span>
                        <p className="text-[11px] text-slate-400 font-sans">{tok.service}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      Desk {tok.counter || 2}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Department Wait Times Mini Table */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Department Avg Wait Times
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {departments.map(d => (
                <div key={d.id} className="p-2 rounded-xl bg-slate-950/50 border border-slate-800 flex justify-between">
                  <span className="text-slate-400 truncate">{d.name.split(' ')[0]}</span>
                  <span className="font-bold text-brand-400">~{d.estimatedWaitMinutes}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* Footer Ticker */}
      <footer className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>QueueLess Digital Token Kiosk • Real-Time Synchronization Active</span>
        </div>
        <div>
          <span>Please report to your counter when your token number appears on screen.</span>
        </div>
      </footer>

    </div>
  );
};
