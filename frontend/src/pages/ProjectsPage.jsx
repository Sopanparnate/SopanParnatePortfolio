import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGithub, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import { HiArrowUpRight } from 'react-icons/hi2';
import { useProjects } from '../hooks/useProjects';

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

const STATUS_STYLES = {
  Live:          'text-green-400 border-green-400/25 bg-green-400/5',
  'In Progress': 'text-amber-400 border-amber-400/25 bg-amber-400/5',
  Archived:      'text-dim border-border bg-mist/40',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${STATUS_STYLES[status] ?? STATUS_STYLES.Archived}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Live' ? 'bg-green-400 animate-pulse' : status === 'In Progress' ? 'bg-amber-400' : 'bg-dim'}`} />
      {status}
    </span>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={index * 0.06}>
      <motion.article
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="group relative flex flex-col border border-border rounded-2xl hover:border-subtle transition-all duration-300 bg-mist/20 hover:bg-mist/50 h-full overflow-hidden"
      >
        {/* Thumbnail */}
        {project.image && (
          <div className="w-full h-48 overflow-hidden bg-mist border-b border-border flex-shrink-0">
            <img src={project.image} alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}

        <div className="p-7 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs text-dim/60 font-mono tracking-widest">{project.number}</span>
            <div className="flex items-center gap-3">
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer"
                  className="text-dim hover:text-paper transition-colors duration-200" onClick={(e) => e.stopPropagation()}>
                  <FiGithub size={15} />
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer"
                  className="text-dim hover:text-champagne transition-colors duration-200" onClick={(e) => e.stopPropagation()}>
                  <FiExternalLink size={15} />
                </a>
              )}
            </div>
          </div>

          <h3 className="font-display text-[1.35rem] leading-tight tracking-tight text-paper mb-1.5 group-hover:text-champagne transition-colors duration-300">
            {project.title}
            <motion.span animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -5 }} transition={{ duration: 0.18 }} className="inline-block ml-1.5">
              <HiArrowUpRight size={15} className="inline text-champagne" />
            </motion.span>
          </h3>
          <p className="text-xs text-champagne/70 font-light mb-4 italic">{project.tagline}</p>
          <p className="text-sm text-dim font-light leading-[1.8] mb-6 flex-1">{project.description}</p>

          <div className="space-y-4 mt-auto">
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <span key={tech} className="text-[11px] px-2.5 py-0.5 rounded-full border border-border text-dim/70 font-light tracking-wide">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <StatusBadge status={project.status} />
              <span className="text-xs text-dim/50 font-light">{project.year}</span>
            </div>
          </div>
        </div>
      </motion.article>
    </FadeIn>
  );
}

function FilterTab({ label, active, count, onClick }) {
  return (
    <button onClick={onClick}
      className={`relative text-sm px-4 py-1.5 rounded-full border transition-all duration-200 font-light ${
        active ? 'border-champagne/50 text-champagne bg-champagne/5' : 'border-border text-dim hover:border-subtle hover:text-paper'
      }`}>
      {label}
      {count !== undefined && (
        <span className={`ml-1.5 text-xs ${active ? 'text-champagne/60' : 'text-dim/50'}`}>{count}</span>
      )}
      {active && (
        <motion.div layoutId="filter-pill"
          className="absolute inset-0 rounded-full border border-champagne/50 bg-champagne/5"
          style={{ zIndex: -1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
      )}
    </button>
  );
}

export default function ProjectsPage() {
  const { projects, loading } = useProjects();
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);
  const countFor = (cat) => cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length;

  return (
    <div className="min-h-screen bg-ink text-paper font-sans">
      {/* Hero */}
      <div className="relative pt-36 pb-20 border-b border-border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '72px 72px', opacity: 0.3 }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(232,213,176,0.07) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-dim hover:text-paper transition-colors duration-200 tracking-wider uppercase mb-10 group">
              <FiArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back home
            </Link>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
            className="text-xs text-champagne tracking-widest uppercase mb-5 font-medium">
            Selected work
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.95] tracking-tightest text-paper mb-6 max-w-3xl">
            Projects That Showcase <br /><em className="text-champagne">My Skills.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.18 }}
            className="text-dim font-light text-base max-w-xl leading-relaxed">
A collection of projects showcasing my skills in software development, problem-solving, and real-world application building.
As a Computer Science student, I’m actively looking for internship and freelance opportunities to contribute, learn, and grow in the tech industry.          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26 }}
            className="flex flex-wrap items-center gap-8 mt-10">
            {[
              { value: projects.length, label: 'total projects' },
              { value: projects.filter((p) => p.status === 'Live').length, label: 'live' },
              { value: projects.filter((p) => p.featured).length, label: 'featured' },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="font-display text-2xl text-champagne">{value}</span>
                <span className="text-xs text-dim font-light uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <FadeIn>
          <div className="flex flex-wrap items-center gap-2 mb-14">
            {categories.map((cat) => (
              <FilterTab key={cat} label={cat} active={activeCategory === cat}
                count={countFor(cat)} onClick={() => setActiveCategory(cat)} />
            ))}
          </div>
        </FadeIn>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-border rounded-2xl h-72 bg-mist/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center text-dim font-light">No projects in this category yet.</div>
        )}

        <FadeIn delay={0.15}>
          <div className="mt-16 pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-dim font-light">More experiments and open-source work on GitHub.</p>
            <a href="https://github.com/Sopanparnate" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm text-dim hover:text-paper border border-border hover:border-subtle px-5 py-2.5 rounded-full transition-all duration-300 flex-shrink-0">
              <FiGithub size={14} /> View GitHub profile
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
