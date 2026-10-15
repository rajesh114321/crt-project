import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { 
  UserCheck, 
  ShieldCheck, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  User, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Building2
} from 'lucide-react';

export const AdminUsersRolesPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    studentId: '',
    department: 'Computer Science',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      console.warn('Failed to load users', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = u.name?.toLowerCase().includes(q);
        const matchEmail = u.email?.toLowerCase().includes(q);
        const matchRole = u.role?.toLowerCase().includes(q);
        const matchId = u.studentId?.toLowerCase().includes(q);
        return matchName || matchEmail || matchRole || matchId;
      }
      return true;
    });
  }, [users, roleFilter, searchQuery]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, { role: newRole });
      fetchUsers();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to remove user "${name}"?`)) return;
    try {
      await api.deleteUser(userId);
      fetchUsers();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createUser(newUser);
      setShowAddModal(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        studentId: '',
        department: 'Computer Science',
        phone: ''
      });
      fetchUsers();
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
            <UserCheck className="w-6 h-6 text-blue-400" />
            Users & Role Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access control for Administrators, Counter Staff Officers, and Students.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add User / Staff
          </button>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Role Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <div className="text-[11px] font-mono text-purple-400 uppercase">System Administrators</div>
          <div className="text-3xl font-black font-mono text-purple-300 mt-1">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Full dashboard & queue administration</p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30">
          <div className="text-[11px] font-mono text-blue-400 uppercase">Desk Staff Officers</div>
          <div className="text-3xl font-black font-mono text-blue-300 mt-1">
            {users.filter(u => u.role === 'staff').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Counter operators & queue callers</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Student Accounts</div>
          <div className="text-3xl font-black font-mono text-emerald-300 mt-1">
            {users.filter(u => u.role === 'student').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Token generation & tracking access</p>
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
            placeholder="Search by name, email, or role..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="staff">Staff Officers</option>
            <option value="student">Students</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Department / ID</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => {
                const isAdmin = u.role === 'admin';
                const isStaff = u.role === 'staff';
                const isStudent = u.role === 'student';

                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {u.studentId ? `Roll: ${u.studentId}` : (u.department || 'Campus General')}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`py-1 px-2.5 rounded-xl font-mono text-[11px] font-bold border focus:outline-none cursor-pointer ${
                          isAdmin ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                          isStaff ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        <option value="admin">Administrator</option>
                        <option value="staff">Staff Officer</option>
                        <option value="student">Student</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active Member'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">Create New Campus User</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g., Rajesh Kumar"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="e.g., rajesh@college.edu"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password:</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Secure password"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Role:</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="staff">Staff Desk Officer</option>
                    <option value="admin">Administrator</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student Roll / Staff ID:</label>
                  <input
                    type="text"
                    value={newUser.studentId}
                    onChange={(e) => setNewUser({ ...newUser, studentId: e.target.value })}
                    placeholder="e.g., STF-014"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
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
                  {submitting ? 'Creating...' : 'Register User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
