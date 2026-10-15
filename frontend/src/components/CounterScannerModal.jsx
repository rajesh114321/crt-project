import React, { useState, useRef, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Clock, 
  MapPin, 
  Check, 
  X,
  ScanLine,
  Camera,
  CameraOff,
  AlertTriangle
} from 'lucide-react';

export const CounterScannerModal = ({ isOpen, onClose }) => {
  const { allTokens, completeToken, callNext } = useQueue();
  const [scannedCode, setScannedCode] = useState('F-037');
  const [matchedToken, setMatchedToken] = useState(null);
  const [completedSuccess, setCompletedSuccess] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  const handleLookup = (codeToSearch) => {
    const raw = (codeToSearch || scannedCode).trim();
    if (!raw) return;

    let found = null;
    // Format 1: QL|tokenNumber|studentId|id (Official QueueLess QR barcode standard)
    if (raw.startsWith('QL|')) {
      const parts = raw.split('|');
      const byId = parts[3] ? allTokens.find(t => t.id === parts[3]) : null;
      const byNum = parts[1] ? allTokens.find(t => t.tokenNumber.toUpperCase() === parts[1].toUpperCase()) : null;
      found = byId || byNum;
    } else {
      const clean = raw.toUpperCase();
      found = allTokens.find(t => 
        t.tokenNumber.toUpperCase() === clean ||
        t.id === raw ||
        (t.studentId && t.studentId.toUpperCase() === clean)
      );
    }

    setMatchedToken(found || 'NOT_FOUND');
    setCompletedSuccess(false);
  };

  const handleServeComplete = async () => {
    if (!matchedToken || matchedToken === 'NOT_FOUND') return;
    try {
      await completeToken(matchedToken.id);
      setCompletedSuccess(true);
      setTimeout(() => {
        setMatchedToken(null);
        setCompletedSuccess(false);
      }, 2500);
    } catch (e) {}
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);

      // Check for native BarcodeDetector API (Chrome/Edge/Modern Android)
      if ('BarcodeDetector' in window) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128', 'ean_13'] });
        scanIntervalRef.current = setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const detectedVal = barcodes[0].rawValue;
                setScannedCode(detectedVal);
                handleLookup(detectedVal);
                stopCamera();
              }
            } catch (err) {}
          }
        }, 500);
      }
    } catch (err) {
      setCameraError(err.message || 'Unable to access webcam. Please type or paste the code instead.');
      setIsCameraActive(false);
    }
  };

  // Determine queue fair order for waiting tokens
  const waitingForDept = matchedToken && matchedToken !== 'NOT_FOUND' && matchedToken.status === 'WAITING'
    ? allTokens
        .filter(t => t.departmentId === matchedToken.departmentId && t.status === 'WAITING')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    : [];
  const isFirstInLine = waitingForDept.length > 0 && waitingForDept[0].id === matchedToken.id;
  const aheadCount = waitingForDept.findIndex(t => t.id === matchedToken.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => { stopCamera(); onClose(); }} />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Counter Token & QR Scanner</h3>
              <p className="text-xs text-brand-100">Scan or type student passes at the service desk (Fair Order Enforced)</p>
            </div>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Camera Scanner Viewport */}
          {isCameraActive && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-brand-500 shadow-inner">
              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
              <div className="absolute inset-0 border-2 border-dashed border-emerald-400 m-8 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-mono text-emerald-300 bg-black/60 px-2.5 py-1 rounded-md">
                  Align Token QR Code Here
                </span>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold flex items-center gap-1 shadow-md"
              >
                <CameraOff className="w-3.5 h-3.5" /> Stop Camera
              </button>
            </div>
          )}

          {cameraError && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Scanner Input / Simulation Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Token Code, QR Payload, or Student ID
              </label>
              {!isCameraActive && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Use Camera Scanner
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  placeholder="e.g. F-037, QL|F-031|2024CS108|..., 2024CS108"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleLookup()}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Verify
              </button>
            </div>

            {/* Quick 1-click test pills */}
            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400 font-mono flex-wrap">
              <span>Quick Test:</span>
              {['F-037', 'F-031', 'O-024', 'L-015', 'QL|F-031|2024CS108|tok_demo'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setScannedCode(t);
                    handleLookup(t);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 font-bold"
                >
                  {t.length > 10 ? t.substring(0, 10) + '…' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Result Area */}
          {matchedToken && matchedToken !== 'NOT_FOUND' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-700">
                <div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PASS VERIFIED & AUTHENTIC
                  </span>
                  <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                    {matchedToken.tokenNumber}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  matchedToken.status === 'COMPLETED' ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' :
                  matchedToken.status === 'CALLING' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
                }`}>
                  {matchedToken.status}
                </span>
              </div>

              {/* Fair Order Indicator */}
              {matchedToken.status === 'WAITING' && (
                <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  isFirstInLine 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200' 
                    : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200'
                }`}>
                  {isFirstInLine ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Next in line:</strong> This student is first in queue for {matchedToken.departmentName} and ready to be served.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>Queue Fair Order:</strong> {aheadCount} student{aheadCount > 1 ? 's are' : ' is'} ahead in line. Keep fair first-come, first-served order.</span>
                    </>
                  )}
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{matchedToken.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student ID / Roll No:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{matchedToken.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department / Counter:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {matchedToken.departmentName} (Counter {matchedToken.counter || 2})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Required Service:</span>
                  <span className="text-brand-600 dark:text-brand-400 font-semibold">{matchedToken.service}</span>
                </div>
              </div>

              {completedSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Service marked completed! Student receipt generated.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleServeComplete}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark Service Completed at Counter
                </button>
              )}
            </div>
          )}

          {matchedToken === 'NOT_FOUND' && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Token not found in registry. Please check the code or verify with the student.</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          >
            Close Scanner
          </button>
        </div>

      </div>
    </div>
  );
};
