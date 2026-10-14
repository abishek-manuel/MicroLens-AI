import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, Mail, Calendar, Search, Trash2, Eye,
  FileText, Activity, X, ChevronRight, AlertTriangle,
  BarChart2, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

// ── Confirmation Dialog ────────────────────────────────────────────────────────
function ConfirmDialog({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative glass-card !bg-white dark:!bg-navy-900 !p-8 w-full max-w-sm z-10 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-navy-900 dark:text-white mb-1">Delete User</h2>
        <p className="text-sm text-navy-500 dark:text-navy-400 mb-6">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold text-navy-800 dark:text-white">{user.name}</span>?
          This will also remove all their samples and reports.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 btn-secondary py-2.5 text-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── User Detail Drawer ─────────────────────────────────────────────────────────
function UserDrawer({ user, onClose, onDelete }) {
  const [tab, setTab] = useState('activity');
  const [reports, setReports] = useState([]);
  const [activity, setActivity] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setDrawerLoading(true);
      try {
        const [r, a] = await Promise.all([
          adminService.getUserReports(user.id),
          adminService.getUserActivity(user.id),
        ]);
        setReports(r);
        setActivity(a);
      } catch (err) {
        toast.error('Failed to load user data');
      } finally {
        setDrawerLoading(false);
      }
    };
    load();
  }, [user.id]);

  const tabs = [
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative w-full max-w-lg h-full bg-white dark:bg-navy-950 shadow-2xl flex flex-col z-10"
      >
        {/* Drawer Header */}
        <div className="flex items-start justify-between p-6 border-b border-navy-200 dark:border-navy-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-navy-900 dark:text-white">{user.name}</h2>
              <p className="text-xs text-navy-500 dark:text-navy-400 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {user.email}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-navy-100 dark:hover:bg-navy-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-navy-500" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 p-4 border-b border-navy-200 dark:border-navy-700/50">
          {[
            { label: 'Analyses', value: drawerLoading ? '—' : activity.length, icon: BarChart2, color: 'text-primary-500' },
            { label: 'Reports', value: drawerLoading ? '—' : reports.length, icon: FileText, color: 'text-cyan-500' },
            { label: 'Role', value: user.role === 'admin' ? 'Admin' : 'Researcher', icon: Shield, color: 'text-purple-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-navy-50 dark:bg-navy-800/40 rounded-xl p-3 text-center">
              <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
              <p className="text-sm font-bold text-navy-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-navy-200 dark:border-navy-700/50">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-navy-500 dark:text-navy-400 hover:text-navy-700 dark:hover:text-navy-200'
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {drawerLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-7 h-7 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : tab === 'activity' ? (
            activity.length === 0 ? (
              <div className="text-center py-12 text-navy-400 dark:text-navy-500">
                <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No analysis activity yet</p>
              </div>
            ) : (
              activity.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/40">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="w-4 h-4 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 dark:text-white truncate">
                      {item.fileName || 'Sample Analysis'}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        (item.severity || 0) > 60
                          ? 'bg-red-500/10 text-red-500'
                          : (item.severity || 0) > 30
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        Severity: {item.severity ?? '—'}
                      </span>
                      <span className="text-xs text-navy-400 dark:text-navy-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                    <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">
                      {item.particleCount !== undefined ? `${item.particleCount} particles detected` : ''}
                      {item.location ? ` · ${item.location}` : ''}
                      {item.sampleType ? ` · ${item.sampleType}` : ''}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : (
            reports.length === 0 ? (
              <div className="text-center py-12 text-navy-400 dark:text-navy-500">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No reports generated yet</p>
              </div>
            ) : (
              reports.map(r => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/40">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{r.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs flex items-center gap-1 ${
                        r.status === 'completed' ? 'text-green-500' : 'text-amber-500'
                      }`}>
                        {r.status === 'completed'
                          ? <><CheckCircle className="w-3 h-3" /> Completed</>
                          : <><AlertCircle className="w-3 h-3" /> Pending</>}
                      </span>
                      <span className="text-xs text-navy-400 dark:text-navy-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                    <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">
                      {r.totalSamples} samples · Avg severity {r.avgSeverity ?? '—'}
                    </p>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Footer actions */}
        {user.role !== 'admin' && (
          <div className="p-4 border-t border-navy-200 dark:border-navy-700/50">
            <button
              onClick={() => onDelete(user)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete this user
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────────
export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/dashboard');
      return;
    }
    const fetchUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user, navigate]);

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteUser(confirmDelete.id);
      setUsers(prev => prev.filter(u => u.id !== confirmDelete.id));
      toast.success(`${confirmDelete.name} has been removed.`);
      if (selectedUser?.id === confirmDelete.id) setSelectedUser(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary-500" />
              Admin Panel
            </h1>
            <p className="text-navy-500 dark:text-navy-400 mt-1">
              Manage users, view reports and monitor activity.
            </p>
          </div>

          {/* Stats chips */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold border border-primary-500/20">
              <Users className="w-3.5 h-3.5" />
              {users.length} Users
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold border border-purple-500/20">
              <Shield className="w-3.5 h-3.5" />
              {users.filter(u => u.role === 'admin').length} Admins
            </span>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field !pl-9"
          />
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-navy-200 dark:border-navy-700/50 bg-navy-50/50 dark:bg-navy-800/20">
                  <th className="px-6 py-4 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-200 dark:divide-navy-700/50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/50 dark:hover:bg-navy-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-primary-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-navy-900 dark:text-white">{u.name || 'Unknown User'}</p>
                            <div className="flex items-center gap-1.5 text-xs text-navy-500 dark:text-navy-400 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          u.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                            : 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20'
                        }`}>
                          {u.role === 'admin' ? 'Admin' : 'Researcher'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-navy-600 dark:text-navy-300">
                          <Calendar className="w-4 h-4 text-navy-400" />
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          }) : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Button */}
                          <button
                            onClick={() => setSelectedUser(u)}
                            title="View activity & reports"
                            className="p-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {/* Delete Button — hidden for admins */}
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => setConfirmDelete(u)}
                              title="Delete user"
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-navy-500 dark:text-navy-400 text-sm">
                      No users found{searchTerm ? ` matching "${searchTerm}"` : ''}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* User Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <UserDrawer
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onDelete={(u) => { setConfirmDelete(u); }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && !deleting && (
          <ConfirmDialog
            user={confirmDelete}
            onConfirm={handleDeleteConfirmed}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
