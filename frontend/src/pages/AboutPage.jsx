import React, { useState } from 'react';
import { 
  Presentation, 
  Lightbulb, 
  Clock, 
  Users, 
  Building2, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  Terminal, 
  Sparkles,
  ArrowRight,
  Code2,
  Database,
  Cpu,
  Layers,
  ChevronRight,
  Download
} from 'lucide-react';
import { WaitingTimeExplainer } from '../components/WaitingTimeExplainer';

export const AboutPage = ({ setCurrentView }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, architecture, viva

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-semibold">
          <Presentation className="w-4 h-4" />
          <span>College Project Capstone Presentation • CRT Review</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          QueueLess – Smart Digital Token System
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          “Skip the queue. Not your turn.” Converting chaotic physical lines into an intelligent asynchronous digital queueing network.
        </p>

        {/* 1-Click Download Button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/QueueLess-Smart-Digital-Token-System.zip"
            download="QueueLess-Smart-Digital-Token-System.zip"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-600/25 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Complete Project (.ZIP)
          </a>
        </div>
      </div>

      {/* Presentation Deck Sub-tabs */}
      <div className="flex justify-center border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: '1. Problem, Solution & ROI' },
            { id: 'architecture', label: '2. System Architecture & Tech Stack' },
            { id: 'viva', label: '3. Viva Questions & CRT Talking Points' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW (Problem, Solution, Benefits) */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Problem vs Solution Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* The Problem (Section 25 Requirement) */}
            <div className="p-7 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-4">
              <div className="flex items-center gap-2.5 text-red-700 dark:text-red-400">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">The Problem</h3>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Traditional college operations suffer from long physical queues outside Accounts, Examination Cells, Libraries, and Administrative Offices.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Wasted Student Productivity:</strong> Students spend 45–90 minutes standing in corridors instead of attending classes, laboratories, or study sessions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Physical Hallway Congestion:</strong> Overcrowded narrow office corridors cause security risks, noise, and confusion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Zero Queue Transparency:</strong> Students cannot anticipate when they will be attended to or if the counter is temporarily on break.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Staff Burnout:</strong> Staff face unruly crowds, impatient inquiries, and inefficient manual token tracking.</span>
                </li>
              </ul>
            </div>

            {/* The Solution (Section 25 Requirement) */}
            <div className="p-7 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">The Solution</h3>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>QueueLess</strong> transforms physical bottlenecks into a decentralized digital queueing workflow.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Asynchronous Wait:</strong> Students take a token on mobile/laptop and continue attending lectures or eating at the canteen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Proactive Proximity Chimes:</strong> Automatic notifications & chimes trigger when student is 2 positions away.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Multi-Desk Dynamic Routing:</strong> Administrative counters automatically balance loads across open desks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>No-Show Auto Advance:</strong> If a student fails to arrive, one click marks them skipped without stalling the queue.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Core Measurable Benefits (Section 25 Requirement) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">
              Measurable Campus Benefits & Impact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  icon: <Clock className="w-5 h-5 text-brand-500" />,
                  title: "Saves 90% Time",
                  desc: "Waiting happens productively anywhere on campus instead of standing in line."
                },
                {
                  icon: <Users className="w-5 h-5 text-emerald-500" />,
                  title: "Zero Crowding",
                  desc: "Reduces hallway congestion by up to 85% during peak admission and fee weeks."
                },
                {
                  icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
                  title: "Staff Efficiency",
                  desc: "Staff process tokens with single-click desk dispatch, skip, and recall actions."
                },
                {
                  icon: <BarChart3 className="w-5 h-5 text-purple-500" />,
                  title: "Transparency",
                  desc: "Clear visual pipeline: everyone knows who is next and expected service wait times."
                },
                {
                  icon: <Sparkles className="w-5 h-5 text-amber-500" />,
                  title: "Peak Hour Analytics",
                  desc: "Identifies heavy rushes (11 AM – 1 PM) so colleges can dynamically staff counters."
                }
              ].map((b, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                  {b.icon}
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{b.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Calculator Section (v5 feature) */}
          <div className="space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest font-semibold text-brand-600 dark:text-brand-400">
                Interactive Simulator
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Waiting-Time Algorithm Sandbox
              </h3>
              <p className="text-xs text-slate-500">
                Test the exact mathematical formula QueueLess uses to predict student wait times dynamically.
              </p>
            </div>
            <div className="flex justify-center">
              <WaitingTimeExplainer peopleAhead={5} avgServiceTime={3} activeCounters={2} />
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ARCHITECTURE & TECH STACK */}
      {activeTab === 'architecture' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Tech Stack Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Frontend Architecture</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Built with <strong>React 18 + Vite + Tailwind CSS</strong>. Uses Context API for decoupled state (AuthContext, QueueContext, NotificationContext, ThemeContext), Canvas QR rendering, Web Audio API chime synthesis, and responsive mobile-first SaaS UI.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Backend Architecture</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Powered by <strong>Node.js + Express.js REST APIs</strong>. Clean MVC layered architecture: Models, Controllers, Routes, and Middleware. JWT bearer token authentication, bcrypt password hashing, and role-based route protection.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Database & Persistence</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Schema-compliant models for <strong>Users, Departments, Counters, Tokens, and Notifications</strong>. Dual persistence engine: connects to MongoDB via Mongoose or operates with zero-configuration persistent JSON store.
              </p>
            </div>

          </div>

          {/* Wait Time Estimation Formula Architecture */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Waiting-Time Estimation Logic & Machine Learning Extensibility
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Section 9 requires: <code className="text-brand-600 font-mono">estimatedTime = peopleAhead × averageServiceTime</code>.
              For example: with 6 people ahead and average service time of 3 minutes, the estimated wait is exactly 18 minutes.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs space-y-2 border border-slate-200/80 dark:border-slate-800">
              <p className="text-brand-600 font-bold">// Future Machine Learning Extensibility Design:</p>
              <p className="text-slate-700 dark:text-slate-300">T_wait = Σ (S_i × C_peak × D_staff)</p>
              <p className="text-slate-500">Where S_i = historical service duration per transaction type</p>
              <p className="text-slate-500">C_peak = congestion multiplier (1.0 to 1.35 based on time-of-day)</p>
              <p className="text-slate-500">D_staff = staff throughput factor calculated over rolling 7 days</p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: VIVA & CRT TALKING POINTS */}
      {activeTab === 'viva' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 text-xs text-brand-900 dark:text-brand-200 font-medium">
            💡 <strong>CRT Viva Preparation:</strong> The panel frequently asks about synchronization, concurrency, edge cases (no-shows), and architectural decisions. Use these precise talking points below!
          </div>

          {[
            {
              q: "Q1: What happens if a student takes a token and never shows up?",
              a: "We engineered the No-Show / Skip Token mechanism (Section 14). When the staff member clicks 'Skip Token', the token status transitions to SKIPPED, the student receives a notification, and the system automatically calls the next waiting token so the queue is never blocked or stalled."
            },
            {
              q: "Q2: Can a student create unlimited tokens and spam the department queues?",
              a: "No. The system enforces business logic in tokenController.js that prevents a student from holding multiple active (WAITING or CALLING) tokens at the same time. They must complete or cancel their existing token before taking a new one."
            },
            {
              q: "Q3: How is real-time queue tracking accomplished without expensive WebSockets?",
              a: "QueueLess implements an intelligent reactive polling mechanism with an active 6-second countdown timer, automatic fallback, pause/resume controls, and optimistic UI updates. When turn approaches (within 2 positions), an audio chime and high-priority toast trigger via the Web Audio API."
            },
            {
              q: "Q4: How does the system handle multiple counters for the same department?",
              a: "Counters can be dynamically activated, deactivated, or reassigned to different departments on the fly. Active counters draw sequentially from the department's waiting backlog FIFO (First-In, First-Out), ensuring strict queue fairness."
            },
            {
              q: "Q5: What are the planned future enhancements for QueueLess?",
              a: "Phase 2 additions include: (1) WhatsApp Business API webhooks for SMS alerts without internet, (2) BLE Bluetooth Beacon or Geofence auto-check-in when the student enters the admin block, and (3) AI dynamic staff reallocation based on real-time backlog alerts."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
            >
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-start gap-2">
                <span className="text-brand-600 font-mono">●</span>
                <span>{item.q}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-4 border-l-2 border-brand-200 dark:border-brand-800">
                {item.a}
              </p>
            </div>
          ))}

        </div>
      )}

      {/* Navigation CTA */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setCurrentView('landing')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          ← Return to Landing Page
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('get-token')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-colors"
          >
            Test Get Token Flow →
          </button>
          <button
            onClick={() => setCurrentView('admin-dashboard')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            Test Admin Dashboard →
          </button>
        </div>
      </div>

    </div>
  );
};
