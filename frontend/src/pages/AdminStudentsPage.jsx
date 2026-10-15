import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useQueue } from '../context/QueueContext';
import { 
  Users, 
  Search, 
  GraduationCap, 
  Ticket, 
  Mail, 
  Phone, 
  History, 
  X, 
  CheckCircle2, 
  Clock, 
  Star,
  RefreshCw,
  Building2,
  Calendar
} from 'lucide-react';

export const AdminStudentsPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { allTokens, departments } = useQueue();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers({ role: 'student' });
      setUsers(data);
    } catch (err) {
      console.warn('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter students
  const filteredStudents = useMemo(() => {
    return users.filter(s => {
      if (deptFilter !== 'ALL' && s.department !== deptFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name?.toLowerCase().includes(q);
        const matchRoll = s.studentId?.toLowerCase().includes(q);
        const matchEmail = s.email?.toLowerCase().includes(q);
        return matchName || matchRoll || matchEmail;
      }
      return true;
    });
  }, [users, deptFilter, searchQuery]);

  // Selected student's tokens
  const studentTokens = useMemo(() => {
    if (!selectedStudentForHistory) return [];
    return allTokens.filter(t => 
      t.studentId === selectedStudentForHistory.studentId || 
      t.userId === selectedStudentForHistory.id
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [allTokens, selectedStudentForHistory]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            Student Directory & Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage enrolled students, monitor queue participation, and review personal service histories.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Reload Directory
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <div className="text-xs font-mono text-slate-400 uppercase">Enrolled Students</div>
          <div className="text-3xl font-black font-mono text-white mt-1">{users.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Registered campus profile accounts</p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 shadow-md">
          <div className="text-xs font-mono text-amber-400 uppercase">Students in Active Queue</div>
          <div className="text-3xl font-black font-mono text-amber-300 mt-1">
            {allTokens.filter(t => t.status === 'WAITING' || t.status === 'CALLING').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Currently holding waiting or calling tokens</p>
        </div>

        <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 shadow-md">
          <div className="text-xs font-mono text-blue-400 uppercase">Services Completed Today</div>
          <div className="text-3xl font-black font-mono text-blue-300 mt-1">
            {allTokens.filter(t => t.status === 'COMPLETED').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Resolved at campus service counters</p>
        </div>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, roll no, or email..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Electronics & Comm">Electronics & Comm</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const studentActiveToken = allTokens.find(t => 
            (t.studentId === student.studentId || t.userId === student.id) &&
            (t.status === 'WAITING' || t.status === 'CALLING')
          );

          const studentCompletedCount = allTokens.filter(t => 
            (t.studentId === student.studentId || t.userId === student.id) &&
            t.status === 'COMPLETED'
          ).length;

          return (
            <div 
              key={student.id}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-blue-500/50 shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm leading-tight">{student.name}</h3>
                      <span className="text-[11px] font-mono text-blue-400">{student.studentId || 'STUDENT'}</span>
                    </div>
                  </div>

                  {studentActiveToken ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                      ACTIVE ({studentActiveToken.tokenNumber})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 text-slate-400">
                      IDLE
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 py-3 border-y border-slate-700/60 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{student.phone || '+91 98765 43210'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{student.department || 'Computer Science & Engg'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Total Tokens: <strong className="text-white">{studentCompletedCount + (studentActiveToken ? 1 : 0)}</strong>
                </span>

                <button
                  onClick={() => setSelectedStudentForHistory(student)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <History className="w-3 h-3 text-blue-400" />
                  View Tokens
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Token History Modal */}
      {selectedStudentForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">
                  {selectedStudentForHistory.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{selectedStudentForHistory.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Roll: {selectedStudentForHistory.studentId} • {selectedStudentForHistory.email}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudentForHistory(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                Student Queue & Token Log ({studentTokens.length} Tokens)
              </h4>

              {studentTokens.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  This student has not yet generated any tokens in the system.
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80 pr-1 space-y-1">
                  {studentTokens.map(tok => (
                    <div key={tok.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-blue-400">{tok.tokenNumber}</span>
                          <span className="font-medium text-white">{tok.service}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {tok.departmentName} (Counter {tok.counter}) • {new Date(tok.createdAt).toLocaleDateString()} at {new Date(tok.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {tok.rating && (
                          <span className="flex items-center gap-0.5 text-amber-400 font-mono text-[11px]">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {tok.rating}★
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          tok.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-300' :
                          tok.status === 'CALLING' ? 'bg-emerald-500/20 text-emerald-300' :
                          tok.status === 'WAITING' ? 'bg-amber-500/20 text-amber-300' :
                          tok.status === 'SKIPPED' ? 'bg-rose-500/20 text-rose-300' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {tok.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedStudentForHistory(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
