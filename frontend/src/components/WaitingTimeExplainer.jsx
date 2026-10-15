import React, { useState } from 'react';
import { Calculator, Sparkles, Brain, Cpu, Clock, Users, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

export const WaitingTimeExplainer = ({ 
  peopleAhead = 6, 
  avgServiceTime = 3, 
  activeCounters = 2,
  departmentName = "Accounts Section",
  onClose 
}) => {
  const [customPeople, setCustomPeople] = useState(peopleAhead);
  const [customAvgTime, setCustomAvgTime] = useState(avgServiceTime);
  const [customCounters, setCustomCounters] = useState(activeCounters || 2);
  const [congestionFactor, setCongestionFactor] = useState(1.0);

  // Official QueueLess waiting-time rule:
  // Estimated wait = ceil(people ahead × avg service time ÷ active counters × congestion factor)
  const calculatedMinutes = Math.max(1, Math.ceil((customPeople * customAvgTime * congestionFactor) / Math.max(1, customCounters)));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-w-xl w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Smart Waiting-Time Algorithm</h3>
            <p className="text-xs text-brand-100">Deterministic Mathematical Formula & ML Pipeline</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Core Mathematical Formula Display */}
        <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-brand-700 dark:text-brand-300 font-semibold">
            Mathematical Estimation Formula (v5 Standard)
          </p>
          <div className="text-sm font-mono bg-white dark:bg-slate-900 p-3 rounded-lg border border-brand-200/60 dark:border-brand-800 text-slate-800 dark:text-slate-200 flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-brand-600 dark:text-brand-400">Estimated Wait</span>
            <span>=</span>
            <span>(People Ahead: {customPeople} × Avg Time: {customAvgTime} min)</span>
            <span>÷</span>
            <span>Active Counters: {customCounters}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
            <span>Computed Waiting Time:</span>
            <span className="text-lg font-black text-brand-600 dark:text-brand-400 font-mono">
              ≈ {calculatedMinutes} Minutes
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-brand-200/40 dark:border-brand-900/40 pt-2">
            Average time is computed dynamically from completed service timestamps (start = called, end = completed). With fewer than 3 records, the department's configured default time is used as an <b>estimate</b>.
          </p>
        </div>

        {/* Interactive Parameter Sandbox */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-brand-500" />
            Interactive Parameter Sandbox (Move Sliders)
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> People Ahead In Queue:</span>
                <span className="font-mono font-bold text-brand-600">{customPeople} students</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                value={customPeople} 
                onChange={(e) => setCustomPeople(Number(e.target.value))}
                className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> Average Service Duration:</span>
                <span className="font-mono font-bold text-brand-600">{customAvgTime} min / student</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="15" 
                step="0.5"
                value={customAvgTime} 
                onChange={(e) => setCustomAvgTime(Number(e.target.value))}
                className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-slate-400" /> Active Service Desks / Counters:</span>
                <span className="font-mono font-bold text-brand-600">{customCounters} counter{customCounters > 1 ? 's' : ''}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="6" 
                value={customCounters} 
                onChange={(e) => setCustomCounters(Number(e.target.value))}
                className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <span>Congestion Factor Modifier:</span>
                <span className="font-mono font-bold text-brand-600">{congestionFactor}x ({congestionFactor > 1 ? 'Rush Hour' : 'Standard'})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Standard (1.0x)", val: 1.0 },
                  { label: "Moderate (1.15x)", val: 1.15 },
                  { label: "Rush Hour (1.35x)", val: 1.35 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setCongestionFactor(item.val)}
                    className={`py-1.5 px-2 text-xs rounded-lg border font-medium transition-all ${
                      congestionFactor === item.val
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Machine Learning Roadmap Card */}
        <div className="p-4 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/20">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h5 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
              ML Model Modular Integration Layer
            </h5>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The waiting time service is decoupled via the mathematical formula. In phase 2, this formula can be swapped with a gradient-boosted regression or LSTM neural network that factors in:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400 list-disc list-inside">
            <li>Historical Day-of-Week timestamp distribution</li>
            <li>Staff service rate performance per counter</li>
            <li>College calendar events (e.g., fee submission deadline surges)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
