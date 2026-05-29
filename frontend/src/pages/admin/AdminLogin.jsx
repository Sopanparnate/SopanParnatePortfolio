import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import adminApi from '../../adminApi';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.post('/login', form);
      localStorage.setItem('admin_token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          opacity: 0.25,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-mist border border-border rounded-2xl p-8">
          {/* Logo */}
          <div className="mb-8 text-center">
            <p className="font-display text-2xl text-paper tracking-tight mb-1">
              YN<span className="text-champagne">.</span>
            </p>
            <p className="text-xs text-dim tracking-widest uppercase font-medium">
              Admin Panel
            </p>
          </div>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-champagne/10 border border-champagne/20 flex items-center justify-center mx-auto mb-8">
            <FiLock size={20} className="text-champagne" />
          </div>

          <h1 className="font-display text-2xl text-paper text-center mb-1 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-dim text-center font-light mb-8">
            Sign in to manage your portfolio
          </p>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-xl px-4 py-3 mb-6 text-center font-light"
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs text-dim tracking-wider uppercase mb-2 font-medium">
                Username
              </label>
              <div className="relative">
                <FiUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim/50" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="admin"
                  required
                  className="w-full bg-ink/60 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-paper placeholder-dim/40 font-light focus:outline-none focus:border-champagne/50 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-dim tracking-wider uppercase mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim/50" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full bg-ink/60 border border-border rounded-xl pl-10 pr-11 py-3 text-sm text-paper placeholder-dim/40 font-light focus:outline-none focus:border-champagne/50 transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dim/50 hover:text-dim transition-colors"
                >
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-champagne text-ink text-sm font-semibold py-3 rounded-xl hover:bg-warm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-5">
          <a href="/" className="text-xs text-dim hover:text-paper transition-colors duration-200">
            ← Back to portfolio
          </a>
        </p>
      </motion.div>
    </div>
  );
}
