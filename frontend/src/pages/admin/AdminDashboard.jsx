import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMail, FiTrash2, FiLogOut, FiRefreshCw,
  FiCheck, FiCircle, FiInbox, FiAlertCircle, FiGrid,
} from 'react-icons/fi';
import { HiOutlineMailOpen } from 'react-icons/hi';
import adminApi from '../../adminApi';
import ProjectsManager from './ProjectsManager';

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-mist border border-border rounded-xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
      <div>
        <p className="font-display text-2xl text-paper leading-none mb-0.5">{value}</p>
        <p className="text-xs text-dim font-light">{label}</p>
      </div>
    </div>
  );
}

function SubmissionRow({ sub, onToggleRead, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation();
    setToggling(true);
    await onToggleRead(sub._id);
    setToggling(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this submission?')) return;
    setDeleting(true);
    await onDelete(sub._id);
  };

  const date = new Date(sub.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = new Date(sub.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className={`border rounded-xl overflow-hidden transition-colors duration-200 ${sub.isRead ? 'border-border bg-mist/20' : 'border-champagne/20 bg-champagne/[0.03]'}`}>
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex-shrink-0">
          {sub.isRead ? <FiCheck size={14} className="text-dim/50" /> : <span className="block w-2 h-2 rounded-full bg-champagne" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`text-sm font-medium ${sub.isRead ? 'text-paper/70' : 'text-paper'}`}>{sub.name}</span>
            <span className="text-xs text-dim font-light">{sub.email}</span>
          </div>
          <p className="text-xs text-dim font-light truncate mt-0.5">{sub.subject}</p>
        </div>
        <div className="text-right flex-shrink-0 hidden sm:block">
          <p className="text-xs text-dim">{date}</p>
          <p className="text-xs text-dim/50">{time}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <button onClick={handleToggle} disabled={toggling} title={sub.isRead ? 'Mark as unread' : 'Mark as read'}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-dim hover:text-champagne hover:bg-champagne/10 transition-all duration-200 disabled:opacity-40">
            {sub.isRead ? <FiCircle size={13} /> : <HiOutlineMailOpen size={14} />}
          </button>
          <button onClick={handleDelete} disabled={deleting} title="Delete"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-dim hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 disabled:opacity-40">
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-border/50 pt-4">
              <p className="text-xs text-dim uppercase tracking-widest mb-3 font-medium">Message</p>
              <p className="text-sm text-paper/80 font-light leading-relaxed whitespace-pre-wrap">{sub.message}</p>
              <div className="mt-4 flex items-center gap-3">
                <a href={`mailto:${sub.email}?subject=Re: ${encodeURIComponent(sub.subject)}`}
                  className="flex items-center gap-1.5 text-xs text-champagne border border-champagne/30 hover:bg-champagne/10 px-3 py-1.5 rounded-full transition-colors duration-200">
                  <FiMail size={11} /> Reply via email
                </a>
                <span className="text-xs text-dim font-light sm:hidden">{date} · {time}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SubmissionsTab() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await adminApi.get('/submissions');
      setSubmissions(res.data.data);
      setStats(res.data.stats);
    } catch { setError('Failed to load submissions.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleToggleRead = async (id) => {
    try {
      const res = await adminApi.patch(`/submissions/${id}/read`);
      setSubmissions((prev) => prev.map((s) => s._id === id ? res.data.data : s));
      setStats((prev) => {
        const wasRead = submissions.find((s) => s._id === id)?.isRead;
        return { ...prev, unread: wasRead ? prev.unread + 1 : prev.unread - 1, read: wasRead ? prev.read - 1 : prev.read + 1 };
      });
    } catch { alert('Failed to update. Try again.'); }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.delete(`/submissions/${id}`);
      const deleted = submissions.find((s) => s._id === id);
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      setStats((prev) => ({ total: prev.total - 1, unread: deleted?.isRead ? prev.unread : prev.unread - 1, read: deleted?.isRead ? prev.read - 1 : prev.read }));
    } catch { alert('Failed to delete. Try again.'); }
  };

  const filtered = submissions.filter((s) => filter === 'all' ? true : filter === 'unread' ? !s.isRead : s.isRead);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-paper tracking-tight">Submissions</h2>
        <p className="text-sm text-dim font-light mt-0.5">Contact form messages from your portfolio</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total messages" value={stats.total}  icon={FiInbox}       accent="#e8d5b0" />
        <StatCard label="Unread"         value={stats.unread} icon={FiAlertCircle} accent="#f59e0b" />
        <StatCard label="Read"           value={stats.read}   icon={FiCheck}       accent="#4ade80" />
      </div>

      <div className="flex items-center gap-2 mb-6">
        {['all', 'unread', 'read'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 capitalize font-medium ${filter === f ? 'border-champagne/50 text-champagne bg-champagne/5' : 'border-border text-dim hover:border-subtle hover:text-paper'}`}>
            {f}
          </button>
        ))}
        {filtered.length > 0 && <span className="text-xs text-dim/50 ml-1 font-light">{filtered.length} {filtered.length === 1 ? 'message' : 'messages'}</span>}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-5 h-5 border-2 border-champagne/30 border-t-champagne rounded-full animate-spin" />
          <p className="text-sm text-dim mt-3 font-light">Loading submissions...</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center border border-red-400/20 rounded-xl bg-red-400/5">
          <FiAlertCircle size={24} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchSubmissions} className="mt-4 text-xs text-dim hover:text-paper border border-border px-4 py-2 rounded-full transition-colors">Try again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-border rounded-xl">
          <FiInbox size={28} className="text-dim/40 mx-auto mb-3" />
          <p className="text-sm text-dim font-light">{filter === 'all' ? 'No submissions yet.' : `No ${filter} messages.`}</p>
        </div>
      ) : (
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((sub) => (
              <SubmissionRow key={sub._id} sub={sub} onToggleRead={handleToggleRead} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('submissions');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) navigate('/admin');
  }, [navigate]);

  const handleLogout = () => { localStorage.removeItem('admin_token'); navigate('/admin'); };

  const TABS = [
    { id: 'submissions', label: 'Submissions', icon: FiMail },
    { id: 'projects',    label: 'Projects',    icon: FiGrid },
  ];

  return (
    <div className="min-h-screen bg-ink text-paper font-sans">
      <header className="border-b border-border bg-ink/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="font-display text-lg text-paper tracking-tight hover:text-champagne transition-colors">
              SOPAN PARNATE <span className="text-champagne">.</span>
            </a>
            <span className="text-border text-sm">/</span>
            <div className="flex items-center gap-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${activeTab === id ? 'bg-mist text-paper border border-border' : 'text-dim hover:text-paper'}`}>
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-dim hover:text-red-400 border border-border hover:border-red-400/30 px-3 py-1.5 rounded-full transition-all duration-200">
            <FiLogOut size={12} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {activeTab === 'submissions' ? <SubmissionsTab /> : <ProjectsManager />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
