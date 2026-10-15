import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Settings, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Building2, 
  Save, 
  RefreshCw,
  Power,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const AdminServicesPage = ({ setCurrentView }) => {
  const { departments, updateDepartment, createDepartment, refreshQueue, isRefreshing } = useQueue();
  const [editingTimes, setEditingTimes] = useState({});
  const [savingId, setSavingId] = useState(null);

  // New Service Form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState(3);
  const [isAdding, setIsAdding] = useState(false);

  const handleTimeChange = (id, val) => {
    setEditingTimes(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const handleSaveTime = async (dept) => {
    const val = Number(editingTimes[dept.id] !== undefined ? editingTimes[dept.id] : dept.avgServiceTimeMinutes);
    if (!val || val < 1 || val > 60) return;
    setSavingId(dept.id);
    try {
      await updateDepartment(dept.id, {
        avgServiceTimeMinutes: val
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (dept) => {
    await updateDepartment(dept.id, {
      active: dept.active === false ? true : false
    });
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsAdding(true);
    try {
      await createDepartment({
        name: newName.trim(),
        description: newDesc.trim(),
        avgServiceTimeMinutes: Number(newTime) || 3
      });
      setNewName('');
      setNewDesc('');
      setNewTime(3);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-brand-600 dark:text-brand-400 font-semibold">
              Admin Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Services & Service Times
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure default service times, enable/disable college services, and view empirical turnaround benchmarks.
          </p>
        </div>

        <button
          onClick={() => refreshQueue()}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Services
        </button>
      </div>

      {/* Add New Service Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <PlusCircle className="w-4 h-4 text-brand-500" />
          <span>Add New College Service</span>
        </div>

        <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4 space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Service Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Examination Cell"
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Description</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="e.g. Hall tickets, re-evaluation forms, grade queries"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Default (min)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              disabled={isAdding}
              className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Active College Services</h3>
            <p className="text-xs text-slate-400">Manage duration settings and availability across campus</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {departments.length} Services Configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-mono uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Service Name</th>
                <th className="py-3.5 px-6 font-semibold">Default Time</th>
                <th className="py-3.5 px-6 font-semibold">Calculated Average</th>
                <th className="py-3.5 px-6 font-semibold">Service Records</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departments.map((dept) => {
                const isActive = dept.active !== false;
                const currentVal = editingTimes[dept.id] !== undefined ? editingTimes[dept.id] : dept.avgServiceTimeMinutes;

                return (
                  <tr key={dept.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950 font-bold font-mono text-brand-600 flex items-center justify-center shrink-0">
                          {dept.code || dept.name[0]}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block text-sm">
                            {dept.name}
                          </span>
                          <span className="text-slate-400 line-clamp-1 max-w-xs text-[11px]">
                            {dept.description || 'General administrative counter'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={currentVal}
                          onChange={(e) => handleTimeChange(dept.id, e.target.value)}
                          className="w-16 px-2.5 py-1 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <span className="text-slate-400">min</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {dept.isEstimate ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-semibold font-mono text-[11px] border border-amber-200/60">
                          <Clock className="w-3 h-3" />
                          {dept.effectiveAvg} min (Estimate)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold font-mono text-[11px] border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3" />
                          {dept.realAvg} min (Real Benchmark)
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                        {dept.completedRecords || 0} completed
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleSaveTime(dept)}
                          disabled={savingId === dept.id}
                          className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-semibold text-xs transition-colors flex items-center gap-1"
                          title="Save configured default duration"
                        >
                          <Save className="w-3 h-3" />
                          Save Time
                        </button>
                        <button
                          onClick={() => handleToggleActive(dept)}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 ${
                            isActive
                              ? 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          {isActive ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-500 shrink-0" />
          <span>
            <strong>QueueLess Formula Rule:</strong> The default time is used only until a department has at least 3 completed records. Once 3+ records exist, the dynamic real average is automatically used to estimate student wait times.
          </span>
        </div>
      </div>

    </div>
  );
};
