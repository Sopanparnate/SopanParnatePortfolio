import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { FiMail, FiMapPin } from 'react-icons/fi';
import api from '../api';

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const INPUT_BASE =
  'w-full bg-mist/60 border border-border rounded-xl px-4 py-3.5 text-sm text-paper placeholder-dim/50 font-light focus:outline-none focus:border-champagne/50 transition-colors duration-200';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      setStatus({ type: 'success', text: res.data.message || 'Message sent!' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.error || 'Something went wrong. Try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <p className="text-xs text-champagne tracking-widest uppercase mb-6 font-medium">
            04 — Contact
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left: heading + info */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.05}>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tightest text-paper mb-6">
                Let’s build 
                <br />
                <em className="text-champagne italic">something meaningful.</em>
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-dim text-sm font-light leading-relaxed mb-10">
                Currently open to internships, freelance projects, and collaborative opportunities
                 where I can learn, grow, and contribute to real-world development experiences.
                 
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-dim text-sm">
                  <FiMail size={15} className="text-champagne flex-shrink-0" />
                  <span className="font-light">parnatesopan6@email.com</span>
                </div>
                <div className="flex items-center gap-3 text-dim text-sm">
                  <FiMapPin size={15} className="text-champagne flex-shrink-0" />
                  <span className="font-light">Amravati, Maharashtra, India</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: form */}
          <FadeIn delay={0.08} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-dim tracking-wider uppercase mb-2 font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className={INPUT_BASE}
                  />
                </div>
                <div>
                  <label className="block text-xs text-dim tracking-wider uppercase mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className={INPUT_BASE}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-dim tracking-wider uppercase mb-2 font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                  className={INPUT_BASE}
                />
              </div>

              <div>
                <label className="block text-xs text-dim tracking-wider uppercase mb-2 font-medium">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or idea..."
                  rows={5}
                  required
                  className={INPUT_BASE + ' resize-none'}
                />
              </div>

              {/* Status message */}
              {status.text && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm font-light px-4 py-3 rounded-xl border ${
                    status.type === 'success'
                      ? 'text-green-400 border-green-400/20 bg-green-400/5'
                      : 'text-red-400 border-red-400/20 bg-red-400/5'
                  }`}
                >
                  {status.text}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex items-center gap-2 bg-champagne text-ink text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-warm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-2"
              >
                {loading ? 'Sending...' : 'Send message'}
                {!loading && (
                  <HiArrowRight
                    size={15}
                    className="group-hover:translate-x-0.5 transition-transform duration-200"
                  />
                )}
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
