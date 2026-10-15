import React, { useState } from 'react';
import { QRCodeCanvas } from './QRCodeCanvas';
import { QueueProgressBar } from './QueueProgressBar';
import { playChime } from '../utils/audio';
import { SmsSimulatorModal } from './SmsSimulatorModal';
import { ReceiptModal } from './ReceiptModal';
import { 
  Printer, 
  MapPin, 
  Clock, 
  Users, 
  Ticket, 
  AlertCircle, 
  Volume2, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  FileText
} from 'lucide-react';

export const TokenPass = ({ 
  token, 
  currentlyServing = "F-031", 
  peopleAhead = 6, 
  estimatedWait = 18, 
  onTrackQueue, 
  onCancel,
  showActions = true 
}) => {
  const [copied, setCopied] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  if (!token) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`QueueLess Token Pass: ${token.tokenNumber} for ${token.service}. Counter ${token.counter}.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isCalling = token.status === 'CALLING';
  const isWaiting = token.status === 'WAITING';

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Printable Boarding Pass Card */}
      <div 
        id="printable-token-pass" 
        className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Pass Top Header Banner */}
        <div className={`p-6 text-white transition-colors ${
          isCalling 
            ? 'bg-gradient-to-r from-emerald-600 to-green-600' 
            : 'bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-xs">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-100 font-semibold">
                  QueueLess Campus Pass
                </span>
                <h3 className="font-bold text-lg leading-tight">{token.departmentName}</h3>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide shadow-xs ${
                isCalling 
                  ? 'bg-white text-emerald-700 animate-pulse' 
                  : isWaiting 
                    ? 'bg-brand-500/80 text-white' 
                    : 'bg-slate-800 text-slate-200'
              }`}>
                {token.status}
              </span>
            </div>
          </div>
        </div>

        {/* Big Token Number Display Section */}
        <div className="p-6 sm:p-8 text-center bg-radial from-brand-50/50 to-transparent dark:from-brand-950/20">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
            YOUR DIGITAL TOKEN
          </p>
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {token.tokenNumber}
          </div>
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mt-2">
            {token.service}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Issued to <span className="font-medium text-slate-800 dark:text-slate-200">{token.studentName}</span> ({token.studentId})
          </p>
        </div>

        {/* Perforated dashed divider with notches */}
        <div className="relative flex items-center px-4">
          <div className="ticket-notch-left bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800" />
          <div className="w-full border-t-2 border-dashed border-slate-200 dark:border-slate-800" />
          <div className="ticket-notch-right bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800" />
        </div>

        {/* Live Queue Context Metrics */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                Serving Now
              </span>
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {currentlyServing}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                People Ahead
              </span>
              <span className="text-xl font-bold font-mono text-brand-600 dark:text-brand-400">
                {isCalling ? 0 : peopleAhead}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                Est. Wait
              </span>
              <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">
                {isCalling ? '0 min' : `${estimatedWait} min`}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                Counter
              </span>
              <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {token.counter || 2}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <QueueProgressBar 
            status={token.status} 
            peopleAhead={isCalling ? 0 : peopleAhead} 
            counter={token.counter || 2} 
          />

          {/* QR Code and Instructions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-5 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-left space-y-1.5 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>Report to Counter {token.counter || 2}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isCalling 
                  ? "Your token has been announced! Please present this pass at the counter immediately."
                  : "Keep this digital pass open or take a screenshot. You will receive an audio & visual alert when you are 2 positions away."}
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-1">
                Generated: {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>

            <div className="shrink-0">
              <QRCodeCanvas value={token.tokenNumber} size={110} />
            </div>
          </div>
        </div>

        {/* Pass Actions Bar */}
        {showActions && (
          <div className="no-print p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Print Digital Ticket"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Pass
              </button>
              <button
                type="button"
                onClick={() => setShowSmsModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors"
                title="Simulate SMS/WhatsApp turn alerts"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                SMS Alert Demo
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 transition-colors"
                title="View official college receipt voucher"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                E-Receipt
              </button>
              <button
                type="button"
                onClick={() => playChime('call')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Test Counter Bell"
              >
                <Volume2 className="w-3.5 h-3.5 text-brand-500" />
                Chime Test
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {onCancel && isWaiting && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3.5 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                >
                  Cancel Token
                </button>
              )}
              {onTrackQueue && (
                <button
                  type="button"
                  onClick={onTrackQueue}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-xl shadow-xs transition-all"
                >
                  Track Live Queue
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp / SMS Alert Simulator Modal */}
      <SmsSimulatorModal
        isOpen={showSmsModal}
        onClose={() => setShowSmsModal(false)}
        token={token}
      />

      {/* Official College E-Receipt Slip Modal */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        token={token}
      />
    </div>
  );
};
