import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { HiArrowUpRight, HiArrowRight } from 'react-icons/hi2';
import { useProjects } from '../hooks/useProjects';

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={index * 0.08}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="group relative border border-border rounded-2xl overflow-hidden hover:border-subtle transition-all duration-300 bg-mist/30 hover:bg-mist/60 flex flex-col h-full"
      >
        {/* Thumbnail */}
        {project.image && (
          <div className="w-full h-44 overflow-hidden bg-mist border-b border-border">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="p-7 flex flex-col flex-1">
          {/* Top row */}
          <div className="flex items-start justify-between mb-5">
            <span className="text-xs text-dim font-mono tracking-wider">{project.number}</span>
            <div className="flex items-center gap-3">
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer"
                  className="text-dim hover:text-paper transition-colors duration-200" aria-label="GitHub">
                  <FiGithub size={16} />
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer"
                  className="text-dim hover:text-champagne transition-colors duration-200" aria-label="Live">
                  <FiExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          <h3 className="font-display text-xl text-paper mb-1 tracking-tight group-hover:text-champagne transition-colors duration-300">
            {project.title}
            <motion.span
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}
              transition={{ duration: 0.2 }}
              className="inline-block ml-2"
            >
              <HiArrowUpRight size={16} className="inline text-champagne" />
            </motion.span>
          </h3>
          <p className="text-xs text-champagne/60 italic mb-4">{project.tagline}</p>
          <p className="text-sm text-dim font-light leading-relaxed mb-6 flex-1">{project.description}</p>

          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className="text-xs px-2.5 py-1 rounded-full border border-border text-dim/80 font-light">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export default function Projects() {
  const { projects, loading } = useProjects();
  const featured = projects.filter((p) => p.featured);
  const displayProjects = featured.length > 0 ? featured : projects.slice(0, 4);

  return (
    <section id="projects" className="py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <p className="text-xs text-champagne tracking-widest uppercase mb-6 font-medium">
            03 — Work
          </p>
        </FadeIn>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <FadeIn delay={0.05}>
            <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-tight tracking-tightest text-paper max-w-xl">
              Things I’ve created,<br />built, and continuously improved.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link to="/projects"
              className="group flex items-center gap-2 text-sm text-dim hover:text-champagne transition-colors duration-200 flex-shrink-0">
              View all projects
              <HiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </FadeIn>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-border rounded-2xl h-64 bg-mist/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        <FadeIn delay={0.1}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/projects"
              className="flex items-center gap-2 text-sm bg-champagne text-ink font-semibold px-6 py-3 rounded-full hover:bg-warm transition-colors duration-300">
              See all projects <HiArrowRight size={14} />
            </Link>
            <a href="https://github.com/Sopanparnate" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm text-dim hover:text-paper border border-border hover:border-subtle px-6 py-3 rounded-full transition-all duration-300">
              <FiGithub size={15} /> GitHub profile
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
