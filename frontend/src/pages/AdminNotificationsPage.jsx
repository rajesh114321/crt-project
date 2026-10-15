import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useQueue } from '../context/QueueContext';
import { 
  Bell, 
  Send, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Megaphone, 
  Users, 
  Building2, 
  RefreshCw, 
  Clock,
  Radio
} from 'lucide-react';

export const AdminNotificationsPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { departments } = useQueue();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    type: 'info', // 'info', 'warning', 'alert', 'success'
    targetDepartmentId: 'all'
  });
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Initial demo broadcast log
  useEffect(() => {
    setAnnouncements([
      {
        id: 'ann-1',
        title: 'Fee Payment Window Closes at 4:00 PM',
        message: 'Accounts Counter 2 will strictly process fee slips till 4:00 PM today.',
        type: 'warning',
        target: 'All Students',
        sentAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'ann-2',
        title: 'Library Digital Token Priority',
        message: 'Students collecting book clearances are requested to line up at Counter 3.',
        type: 'info',
        target: 'Library Desk',
        sentAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'ann-3',
        title: 'System Server Maintenance Completed',
        message: 'QueueLess high-speed token generation has been optimized.',
        type: 'success',
        target: 'All Campus',
        sentAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;
    setSending(true);
    setSuccessMsg('');
    try {
      await api.broadcastNotification({
        title: broadcastForm.title,
        message: broadcastForm.message,
        type: broadcastForm.type,
        departmentId: broadcastForm.targetDepartmentId !== 'all' ? broadcastForm.targetDepartmentId : null
      });

      const targetLabel = broadcastForm.targetDepartmentId === 'all' 
        ? 'All Students' 
        : departments.find(d => d.id === broadcastForm.targetDepartmentId)?.name || 'Department';

      setAnnouncements(prev => [
        {
          id: `ann-${Date.now()}`,
          title: broadcastForm.title,
          message: broadcastForm.message,
          type: broadcastForm.type,
          target: targetLabel,
          sentAt: new Date().toISOString()
        },
        ...prev
      ]);

      setSuccessMsg('Announcement successfully broadcasted to student notification drawers!');
      setBroadcastForm({
        title: '',
        message: '',
        type: 'info',
        targetDepartmentId: 'all'
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Radio className="w-6 h-6 text-blue-400 animate-pulse" />
            Campus Broadcast & Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dispatch instant notifications, service alerts, and announcements to student portal drawers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Compose Broadcast Announcement */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-white text-base">Compose Broadcast Notice</h2>
          </div>

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Audience:</label>
              <select
                value={broadcastForm.targetDepartmentId}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, targetDepartmentId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">📢 All Registered Students</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>🏛️ {d.name} Students</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Notification Priority & Type:</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'info', label: 'Info', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
                  { id: 'warning', label: 'Warning', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                  { id: 'alert', label: 'Urgent', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
                  { id: 'success', label: 'Good News', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setBroadcastForm({ ...broadcastForm, type: p.id })}
                    className={`py-2 px-1 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                      broadcastForm.type === p.id 
                        ? `${p.color} ring-2 ring-blue-500 shadow-sm` 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Headline / Subject:</label>
              <input
                type="text"
                required
                value={broadcastForm.title}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                placeholder="e.g., Accounts Section closing early today"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Message Content:</label>
              <textarea
                rows={4}
                required
                value={broadcastForm.message}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                placeholder="Enter detailed notice for students to read on their devices..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Dispatch Campus Broadcast</span>
            </button>
          </form>
        </div>

        {/* Right 7 Cols: Broadcast History & Live Previews */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-white text-base">Broadcast History & Log</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">{announcements.length} Sent</span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {announcements.map((ann) => {
              const isAlert = ann.type === 'alert' || ann.type === 'warning';
              const isSuccess = ann.type === 'success';

              return (
                <div 
                  key={ann.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${
                        isAlert ? 'bg-rose-500/20 text-rose-400' :
                        isSuccess ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        <Bell className="w-3.5 h-3.5" />
                      </span>
                      <h3 className="font-bold text-white text-sm">{ann.title}</h3>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                      {ann.target}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-8">
                    {ann.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900 pl-8">
                    <span>Type: <strong className="text-slate-400 uppercase">{ann.type}</strong></span>
                    <span>{new Date(ann.sentAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
