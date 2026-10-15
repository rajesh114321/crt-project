import React from 'react';
import { 
  FileText, 
  Printer, 
  ShieldCheck, 
  School, 
  CheckCircle2, 
  X,
  QrCode
} from 'lucide-react';
import { QRCodeCanvas } from './QRCodeCanvas';

export const ReceiptModal = ({ isOpen, onClose, token }) => {
  if (!isOpen) return null;

  const currentToken = token || {
    tokenNumber: "F-031",
    studentName: "Rajesh Kumar",
    studentId: "2024CS108",
    departmentName: "Accounts Section",
    service: "Fee Payment",
    counter: 2,
    status: "COMPLETED",
    createdAt: new Date().toISOString()
  };

  const receiptRef = `ACK-${new Date().getFullYear()}-${currentToken.tokenNumber.replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-brand-400" />
            <span className="font-bold text-sm">Official College E-Receipt Slip</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div id="printable-token-pass" className="p-6 sm:p-8 space-y-6 bg-white text-slate-900">
          
          {/* Institutional Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                QL
              </div>
              <h2 className="font-black text-base uppercase tracking-wider text-slate-900">
                QueueLess College Services Center
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">
              Digital Queue Management & Administrative Clearance Slip
            </p>
          </div>

          {/* Reference & Date Bar */}
          <div className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-200">
            <div>
              <span className="text-slate-400">RECEIPT NO: </span>
              <span className="font-bold text-slate-900">{receiptRef}</span>
            </div>
            <div>
              <span className="text-slate-400">ISSUED: </span>
              <span className="font-bold">{new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Main Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs py-2">
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Student Name</span>
              <span className="font-bold text-sm text-slate-900">{currentToken.studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Student ID / Roll No</span>
              <span className="font-mono font-bold text-sm text-slate-900">{currentToken.studentId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Department</span>
              <span className="font-semibold text-slate-800">{currentToken.departmentName}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Service Rendered</span>
              <span className="font-semibold text-slate-800">{currentToken.service}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Processed At</span>
              <span className="font-mono font-bold text-slate-800">Counter {currentToken.counter || 2}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Token Number</span>
              <span className="font-mono font-bold text-brand-600 text-sm">{currentToken.tokenNumber}</span>
            </div>
          </div>

          {/* Verification Stamp & QR Code */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
            {/* Circular Digital Verification Stamp */}
            <div className="p-3 border-2 border-emerald-600 rounded-2xl text-center space-y-0.5 max-w-[200px]">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-black text-[11px] uppercase tracking-wider font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                VERIFIED & CLEARED
              </div>
              <p className="text-[9px] text-slate-500 font-mono">
                Administrative Desk Server Auth
              </p>
              <p className="text-[9px] font-mono font-bold text-slate-600">
                Timestamp: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="shrink-0 text-center">
              <QRCodeCanvas value={currentToken.tokenNumber} size={85} />
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-3 border-t border-dashed border-slate-200 text-center text-[10px] text-slate-400 font-mono">
            This is an authentic computer-generated digital acknowledgement slip generated by QueueLess. Valid for all college department documentation.
          </div>

        </div>

      </div>
    </div>
  );
};
