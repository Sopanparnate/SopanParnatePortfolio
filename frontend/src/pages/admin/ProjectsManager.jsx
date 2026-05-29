import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiUpload,
  FiExternalLink, FiGithub, FiStar, FiImage,
} from 'react-icons/fi';
import { HiCheckCircle } from 'react-icons/hi';
import adminApi from '../../adminApi';

const BASE_URL = 'http://localhost:5000';

const CATEGORIES = ['Full-Stack', 'Frontend', 'Backend', 'Tool', 'Other'];
const STATUSES   = ['Live', 'In Progress', 'Archived'];

const EMPTY_FORM = {
  title: '', tagline: '', description: '',
  stack: '', category: 'Full-Stack', status: 'Live',
  github: '', live: '', featured: false, year: new Date().getFullYear().toString(), order: '0',
};

/* ─── Status badge ───────────────────────────────────────────────────── */
const STATUS_STYLES = {
  Live:          'text-green-400 border-green-400/25 bg-green-400/5',
  'In Progress': 'text-amber-400 border-amber-400/25 bg-amber-400/5',
  Archived:      'text-dim border-border bg-mist/40',
};
function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[status] ?? STATUS_STYLES.Archived}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Live' ? 'bg-green-400' : status === 'In Progress' ? 'bg-amber-400' : 'bg-dim'}`} />
      {status}
    </span>
  );
}

/* ─── Input / Textarea helpers ───────────────────────────────────────── */
const inputCls = 'w-full bg-ink/60 border border-border rounded-xl px-3.5 py-2.5 text-sm text-paper placeholder-dim/40 font-light focus:outline-none focus:border-champagne/50 transition-colors duration-200';
const labelCls = 'block text-xs text-dim tracking-wider uppercase mb-1.5 font-medium';

/* ─── Image drop zone ────────────────────────────────────────────────── */
function ImageUploader({ preview, onChange, onClear }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    onChange(file);
  };

  return (
    <div>
      <label className={labelCls}>Project thumbnail</label>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border h-40">
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <button onClick={onClear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-ink/80 text-paper flex items-center justify-center hover:bg-red-500 transition-colors">
            <FiX size={13} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          className={`h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-200 ${
            dragging ? 'border-champagne/60 bg-champagne/5' : 'border-border hover:border-subtle'
          }`}
        >
          <FiUpload size={20} className="text-dim/50" />
          <p className="text-xs text-dim font-light">Drop image or click to upload</p>
          <p className="text-[10px] text-dim/50">PNG, JPG, WebP — max 5 MB</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      )}
    </div>
  );
}

/* ─── Add / Edit Modal ───────────────────────────────────────────────── */
function ProjectModal({ project, onClose, onSaved }) {
  const isEdit = !!project;
  const [form, setForm] = useState(
    isEdit
      ? {
          ...project,
          stack: Array.isArray(project.stack) ? project.stack.join(', ') : project.stack,
          order: String(project.order ?? 0),
        }
      : EMPTY_FORM
  );
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setPreview]  = useState(
    isEdit && project.image
      ? (project.image.startsWith('http') ? project.image : `${BASE_URL}${project.image}`)
      : null
  );
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImageChange = (file) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const clearImage = () => { setImageFile(null); setPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (isEdit) {
        await adminApi.put(`/projects/${project._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await adminApi.post('/projects', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-mist border border-border rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-mist z-10">
          <h2 className="font-display text-lg text-paper tracking-tight">
            {isEdit ? 'Edit project' : 'Add new project'}
          </h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-dim hover:text-paper hover:bg-border transition-all">
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <p className="text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-xl px-4 py-3 font-light">
              {error}
            </p>
          )}

          {/* Image */}
          <ImageUploader preview={imagePreview} onChange={handleImageChange} onClear={clearImage} />

          {/* Title + Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input className={inputCls} placeholder="Project name" value={form.title}
                onChange={(e) => set('title', e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>Tagline *</label>
              <input className={inputCls} placeholder="One-line pitch" value={form.tagline}
                onChange={(e) => set('tagline', e.target.value)} required />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description *</label>
            <textarea className={inputCls + ' resize-none'} rows={4}
              placeholder="2–3 sentences about what it does and how you built it"
              value={form.description} onChange={(e) => set('description', e.target.value)} required />
          </div>

          {/* Stack */}
          <div>
            <label className={labelCls}>Tech stack</label>
            <input className={inputCls} placeholder="React, Node.js, MongoDB  (comma separated)"
              value={form.stack} onChange={(e) => set('stack', e.target.value)} />
          </div>

          {/* Category + Status + Year */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls + ' cursor-pointer'} value={form.category}
                onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls + ' cursor-pointer'} value={form.status}
                onChange={(e) => set('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input className={inputCls} placeholder="2024" value={form.year}
                onChange={(e) => set('year', e.target.value)} />
            </div>
          </div>

          {/* GitHub + Live */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>GitHub URL</label>
              <input className={inputCls} placeholder="https://github.com/..." value={form.github}
                onChange={(e) => set('github', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Live URL</label>
              <input className={inputCls} placeholder="https://..." value={form.live}
                onChange={(e) => set('live', e.target.value)} />
            </div>
          </div>

          {/* Order + Featured */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelCls}>Display order</label>
              <input type="number" className={inputCls} placeholder="0" value={form.order}
                onChange={(e) => set('order', e.target.value)} />
              <p className="text-[10px] text-dim/50 mt-1">Lower number = shown first</p>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div onClick={() => set('featured', !form.featured)}
                  className={`w-10 h-5 rounded-full border transition-all duration-200 relative flex-shrink-0 ${
                    form.featured ? 'bg-champagne/20 border-champagne/50' : 'bg-mist border-border'
                  }`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
                    form.featured ? 'left-[calc(100%-18px)] bg-champagne' : 'left-0.5 bg-dim/50'
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-paper font-light">Featured</p>
                  <p className="text-[10px] text-dim/60">Shows on homepage</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose}
              className="text-sm text-dim hover:text-paper border border-border hover:border-subtle px-4 py-2.5 rounded-xl transition-all duration-200">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 text-sm bg-champagne text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-warm disabled:opacity-50 transition-colors duration-200">
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add project'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── Project row ────────────────────────────────────────────────────── */
function ProjectRow({ project, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const imgSrc = project.image
    ? (project.image.startsWith('http') ? project.image : `${BASE_URL}${project.image}`)
    : null;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${project.title}"?`)) return;
    setDeleting(true);
    await onDelete(project._id);
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}
      className="flex items-center gap-4 border border-border rounded-xl p-4 hover:border-subtle transition-colors duration-200 bg-mist/20">

      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-mist border border-border flex-shrink-0 flex items-center justify-center">
        {imgSrc
          ? <img src={imgSrc} alt={project.title} className="w-full h-full object-cover" />
          : <FiImage size={18} className="text-dim/40" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-medium text-paper">{project.title}</h3>
          {project.featured && <FiStar size={11} className="text-champagne flex-shrink-0" title="Featured" />}
          <StatusBadge status={project.status} />
        </div>
        <p className="text-xs text-dim font-light mt-0.5 truncate">{project.tagline}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[10px] text-dim/60 border border-border rounded-full px-2 py-0.5">{project.category}</span>
          {project.stack?.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] text-dim/50">{t}</span>
          ))}
          {project.stack?.length > 3 && <span className="text-[10px] text-dim/40">+{project.stack.length - 3}</span>}
        </div>
      </div>

      {/* Links */}
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-dim hover:text-paper hover:bg-border transition-all">
            <FiGithub size={13} />
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-dim hover:text-champagne hover:bg-border transition-all">
            <FiExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => onEdit(project)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-dim hover:text-paper hover:bg-border transition-all duration-200">
          <FiEdit2 size={13} />
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-dim hover:text-red-400 hover:bg-red-400/10 disabled:opacity-40 transition-all duration-200">
          <FiTrash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [modal, setModal]       = useState(null); // null | 'add' | project object
  const [saved, setSaved]       = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get('/projects');
      setProjects(res.data.data);
    } catch {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSaved = () => {
    setModal(null);
    fetchProjects();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete. Try again.');
    }
  };

  const featured = projects.filter((p) => p.featured).length;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-paper tracking-tight">Projects</h2>
          <p className="text-sm text-dim font-light mt-0.5">
            {projects.length} total · {featured} featured on homepage
          </p>
        </div>
        <button onClick={() => setModal('add')}
          className="flex items-center gap-2 bg-champagne text-ink text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-warm transition-colors duration-200">
          <FiPlus size={15} /> Add project
        </button>
      </div>

      {/* Saved toast */}
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-green-400 bg-green-400/5 border border-green-400/20 rounded-xl px-4 py-3 mb-5">
            <HiCheckCircle size={16} /> Project saved successfully.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 border border-border rounded-xl bg-mist/20 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center border border-red-400/20 rounded-xl bg-red-400/5">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchProjects} className="mt-3 text-xs text-dim border border-border px-4 py-2 rounded-full hover:text-paper transition-colors">
            Retry
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-border rounded-xl">
          <FiImage size={28} className="text-dim/30 mx-auto mb-3" />
          <p className="text-sm text-dim font-light mb-4">No projects yet.</p>
          <button onClick={() => setModal('add')}
            className="flex items-center gap-2 text-sm bg-champagne text-ink font-semibold px-4 py-2.5 rounded-xl hover:bg-warm transition-colors mx-auto">
            <FiPlus size={14} /> Add your first project
          </button>
        </div>
      ) : (
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {projects.map((p) => (
              <ProjectRow key={p._id} project={p} onEdit={(proj) => setModal(proj)} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <ProjectModal
            project={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
