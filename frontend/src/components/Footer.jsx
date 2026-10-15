import React from 'react';
import { Ticket, Github, Heart, Shield, Sparkles, Terminal } from 'lucide-react';

export const Footer = ({ setCurrentView }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <svg viewBox="0 0 36 36" fill="none" className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="17" cy="17" r="11" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M24 24L31 31" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="17" cy="17" r="3.5" fill="#38bdf8" />
                </svg>
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Queue<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Less</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              “Skip the queue. Not your turn.” Smart digital token system engineered to eliminate physical college lines, enhance student productivity, and provide real-time counter transparency.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono text-slate-500">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">React + Vite</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">Tailwind CSS</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">Node.js Express</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">REST APIs</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              College Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <button onClick={() => setCurrentView('get-token')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Accounts & Fees
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('get-token')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  College Office & Certificates
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('get-token')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Central Library Circulation
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('get-token')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Campus Canteen Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Project Presentation
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <button onClick={() => setCurrentView('about')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Problem & Solution Pitch
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('live-queue')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Public Live Display
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin-dashboard')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Staff Admin Dashboard
                </button>
              </li>
              <li>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                  ● Ready for CRT Evaluation
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 QueueLess Technologies. Engineered for College Campus Innovation.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for Academic Capstone Review</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
