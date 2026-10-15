import React, { useState } from 'react';
import { 
  MessageSquare, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  CheckCheck, 
  Bell, 
  Send, 
  X,
  Volume2
} from 'lucide-react';
import { playChime } from '../utils/audio';

export const SmsSimulatorModal = ({ isOpen, onClose, token }) => {
  const [activeStep, setActiveStep] = useState('near'); // 'near', 'calling', 'completed'

  if (!isOpen) return null;

  const tokenNum = token?.tokenNumber || "F-037";
  const serviceName = token?.service || "Fee Payment";
  const studentName = token?.studentName?.split(' ')[0] || "Rajesh";
  const counterNum = token?.counter || 2;

  const triggerStep = (step) => {
    setActiveStep(step);
    playChime(step === 'calling' ? 'call' : 'near');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm sm:max-w-md w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/20 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Mobile SMS & WhatsApp Simulator</h3>
              <p className="text-[11px] text-emerald-100">Live notification simulation for students away from screen</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Smartphone Chat Interface */}
        <div className="p-5 space-y-4 bg-slate-100 dark:bg-slate-950/60">
          
          {/* Chat Contact Header */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              QL
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  QueueLess Campus Desk
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">
                  ✓
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                Official College Notification Bot
              </p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">9:41 AM</span>
          </div>

          {/* Conversation Bubble */}
          <div className="space-y-3">
            
            {activeStep === 'near' && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800 font-mono">
                  <span>🔔 PROXIMITY ALERT</span>
                  <span>Just now</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  Hi <strong>{studentName}</strong>! 👋 Your Token <strong className="font-mono text-emerald-600 font-bold">{tokenNum}</strong> for <strong>{serviceName}</strong> is now <strong className="text-amber-600">2 positions away</strong>.
                </p>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200 font-medium">
                  📍 Please begin walking towards <strong>Counter {counterNum}</strong> (Accounts Section, Room 104). Expected arrival in ~4 mins.
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                  <span>Delivered via College Gateway</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            )}

            {activeStep === 'calling' && (
              <div className="bg-emerald-50 dark:bg-emerald-950/50 p-4 rounded-2xl rounded-tl-xs shadow-xs border border-emerald-300 dark:border-emerald-800 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300 pb-1 border-b border-emerald-200 dark:border-emerald-800 font-mono font-bold">
                  <span>📢 NOW SERVING AT DESK</span>
                  <span>Just now</span>
                </div>
                <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed">
                  Attention <strong>{studentName}</strong>! Token <strong className="font-mono text-xl text-emerald-700 dark:text-emerald-300 block my-1">{tokenNum}</strong> is being served right now at <strong>Counter {counterNum}</strong>!
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Please show your digital boarding pass or QR code directly to the officer.
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                  <span>Delivered</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            )}

            {activeStep === 'completed' && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] text-emerald-600 font-mono font-bold pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span>✓ SERVICE COMPLETED</span>
                  <span>Just now</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  Thank you, <strong>{studentName}</strong>! Your service for <strong>{serviceName}</strong> (Token {tokenNum}) was marked completed.
                </p>
                <p className="text-[11px] text-slate-500">
                  Receipt Ref: <span className="font-mono font-bold">ACK-2026-{Math.floor(1000 + Math.random() * 9000)}</span>.
                </p>
              </div>
            )}

          </div>

          {/* Simulation Step Switcher */}
          <div className="pt-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block mb-1.5">
              Simulate Different Queue Stages:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => triggerStep('near')}
                className={`py-1.5 px-2 rounded-xl border text-[11px] font-semibold transition-all ${
                  activeStep === 'near' 
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Turn Near (2 Away)
              </button>
              <button
                type="button"
                onClick={() => triggerStep('calling')}
                className={`py-1.5 px-2 rounded-xl border text-[11px] font-semibold transition-all ${
                  activeStep === 'calling' 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Now Serving
              </button>
              <button
                type="button"
                onClick={() => triggerStep('completed')}
                className={`py-1.5 px-2 rounded-xl border text-[11px] font-semibold transition-all ${
                  activeStep === 'completed' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          >
            Close Simulator
          </button>
        </div>

      </div>
    </div>
  );
};
