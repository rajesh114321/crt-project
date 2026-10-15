import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useQueue } from '../context/QueueContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Search, 
  RefreshCw, 
  Building2, 
  AlertCircle,
  X,
  ChevronRight
} from 'lucide-react';

export const AdminAppointmentsPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { departments } = useQueue();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    departmentId: 'dept-office',
    service: 'Document Attestation',
    date: new Date().toISOString().slice(0, 10),
    timeSlot: '10:30 AM',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await api.getAppointments();
      setAppointments(data);
    } catch (e) {
      console.warn('Failed to load appointments', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      if (statusFilter !== 'ALL' && apt.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = apt.studentName?.toLowerCase().includes(q);
        const matchId = apt.studentId?.toLowerCase().includes(q);
        const matchSvc = apt.service?.toLowerCase().includes(q);
        return matchName || matchId || matchSvc;
      }
      return true;
    }).sort((a, b) => new Date(a.date + ' ' + a.timeSlot) - new Date(b.date + ' ' + b.timeSlot));
  }, [appointments, statusFilter, searchQuery]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.updateAppointment(id, { status: newStatus });
      fetchAppointments();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedDept = departments.find(d => d.id === formData.departmentId);
      await api.createAppointment({
        ...formData,
        departmentName: selectedDept?.name || 'Admin Office'
      });
      setShowAddModal(false);
      setFormData({
        studentName: '',
        studentId: '',
        departmentId: 'dept-office',
        service: 'Document Attestation',
        date: new Date().toISOString().slice(0, 10),
        timeSlot: '10:30 AM',
        notes: ''
      });
      fetchAppointments();
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-400" />
            Appointments & Slot Scheduling
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pre-booked student service sessions, priority slots and digital check-ins.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Book Slot
          </button>
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Total Appointments</div>
          <div className="text-2xl font-black font-mono text-white mt-1">{appointments.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
          <div className="text-[11px] font-mono text-amber-400 uppercase">Upcoming / Booked</div>
          <div className="text-2xl font-black font-mono text-amber-300 mt-1">
            {appointments.filter(a => a.status === 'Scheduled').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Checked-In / Ready</div>
          <div className="text-2xl font-black font-mono text-emerald-300 mt-1">
            {appointments.filter(a => a.status === 'Checked-In').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30">
          <div className="text-[11px] font-mono text-blue-400 uppercase">Completed</div>
          <div className="text-2xl font-black font-mono text-blue-300 mt-1">
            {appointments.filter(a => a.status === 'Completed').length}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, roll no, service..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Checked-In">Checked-In</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Service & Department</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Time Slot</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Desk Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No appointments scheduled matching your filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const isScheduled = apt.status === 'Scheduled';
                  const isCheckedIn = apt.status === 'Checked-In';
                  const isCompleted = apt.status === 'Completed';

                  return (
                    <tr key={apt.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-400" />
                          {apt.studentName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{apt.studentId}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">
                        <div className="font-medium">{apt.service}</div>
                        <div className="text-[10px] text-slate-500">{apt.departmentName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {apt.date}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                        {apt.timeSlot}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isScheduled ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          isCheckedIn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          isCompleted ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {isScheduled && (
                            <button
                              onClick={() => handleStatusUpdate(apt.id, 'Checked-In')}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                            >
                              Check-In
                            </button>
                          )}
                          {isCheckedIn && (
                            <button
                              onClick={() => handleStatusUpdate(apt.id, 'Completed')}
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                          {!isCompleted && apt.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleStatusUpdate(apt.id, 'Cancelled')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 hover:text-rose-300 font-medium text-xs transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">Schedule Student Appointment</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Student Full Name:</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g., Sneha Reddy"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Student Roll Number / ID:</label>
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="e.g., 2024-CSE-099"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Campus Department:</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Slot Date:</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot:</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    {['09:30 AM', '10:00 AM', '10:30 AM', '11:15 AM', '12:00 PM', '02:00 PM', '02:45 PM', '03:30 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Requested:</label>
                <input
                  type="text"
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="e.g., Scholarship Certificate Verification"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
