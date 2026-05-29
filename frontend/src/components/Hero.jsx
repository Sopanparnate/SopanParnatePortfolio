import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowDown } from 'react-icons/hi';
import { FiGithub, FiLinkedin, FiInstagram, FiDownload } from 'react-icons/fi';
const CV_URL = 'http://localhost:5000/api/admin/cv/download';
import profileImg from '../assets/profile.png';

const SOCIAL = [
  { icon: FiGithub,   href: 'https://github.com/Sopanparnate',   label: 'GitHub'   },
  { icon: FiLinkedin, href: 'https://www.linkedin.com/in/sopan-parnate',  label: 'LinkedIn' },
  { icon: FiInstagram, href: 'https://www.instagram.com/sopan_parnate_03?igsh=MWVybGp4czVqZHcyNg==', label: 'Instagram' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          opacity: 0.35,
        }}
      />

      {/* Warm glow — bottom right */}
      <div
        className="absolute -bottom-40 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(232,213,176,0.06) 0%, transparent 70%)',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 grid lg:grid-cols-2 gap-16 items-center"
      >

        {/* ── LEFT COLUMN: text content ── */}
        <div>
          {/* Availability badge */}
          <motion.div variants={item} className="mb-10 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-xs text-dim tracking-widest uppercase font-medium">
              Open to Real-World Projects & Internships
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-tightest text-paper mb-6"
          >
            B.E. Student, 
            <br />
            <em className="text-champagne not-italic">Full-Stack Developer</em>
            <br />
            & Java Enthusiast
          </motion.h1>

          {/* Sub-line */}
          <motion.p
            variants={item}
            className="text-dim text-lg font-light max-w-lg leading-relaxed mb-12"
          >
           Building scalable web applications while mastering DSA and backend engineering.
          </motion.p>

          {/* CTA row */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <button
              onClick={() =>
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="group flex items-center gap-2 bg-champagne text-ink text-sm font-semibold px-6 py-3 rounded-full hover:bg-warm transition-colors duration-300"
            >
              View my work
              <HiArrowDown
                size={14}
                className="group-hover:translate-y-0.5 transition-transform duration-200"
              />
            </button>
            <button
              onClick={() =>
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-sm font-medium text-paper/60 hover:text-paper border border-border hover:border-subtle px-6 py-3 rounded-full transition-all duration-300"
            >
              Get in touch
            </button>
            <a
              href={CV_URL}
              download
              className="group flex items-center gap-2 text-sm font-medium text-paper/60 hover:text-champagne border border-border hover:border-champagne/40 px-6 py-3 rounded-full transition-all duration-300"
            >
              <FiDownload size={14} className="group-hover:translate-y-0.5 transition-transform duration-200" />
              Download CV
            </a>
          </motion.div>

          {/* Social strip */}
          <motion.div
            variants={item}
            className="flex items-center gap-6 mt-16 pt-8 border-t border-border"
          >
            <div className="flex items-center gap-4">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-dim hover:text-champagne transition-colors duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <span className="text-border text-sm">|</span>
            <span className="text-xs text-dim tracking-widest uppercase">
              Amravati, India
            </span>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: profile photo ── */}
        <motion.div
          variants={item}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative">
            {/* Outer decorative ring */}
            <div
              className="absolute -inset-3 rounded-[2rem] pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(232,213,176,0.15) 0%, transparent 60%)',
                border: '1px solid rgba(232,213,176,0.1)',
              }}
            />

            {/* Corner accent — top left */}
            <div
              className="absolute -top-px -left-px w-12 h-12 pointer-events-none"
              style={{
                borderTop: '1.5px solid rgba(232,213,176,0.5)',
                borderLeft: '1.5px solid rgba(232,213,176,0.5)',
                borderRadius: '2rem 0 0 0',
              }}
            />
            {/* Corner accent — bottom right */}
            <div
              className="absolute -bottom-px -right-px w-12 h-12 pointer-events-none"
              style={{
                borderBottom: '1.5px solid rgba(232,213,176,0.5)',
                borderRight: '1.5px solid rgba(232,213,176,0.5)',
                borderRadius: '0 0 2rem 0',
              }}
            />

            {/* Photo */}
            <div className="relative w-[340px] h-[420px] rounded-[1.75rem] overflow-hidden border border-border">
              <img
                src={profileImg}
                alt="Profile"
                className="w-full h-full object-cover object-top"
              />

              {/* Subtle bottom fade so image blends into the dark bg */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(10,10,10,0.35) 0%, transparent 100%)',
                }}
              />
            </div>

            {/* Floating experience badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-5 -left-6 bg-mist border border-border rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-champagne/10 border border-champagne/20 flex items-center justify-center flex-shrink-0">
                <span className="text-champagne text-sm font-display">3+</span>
              </div>
              <div>
                <p className="text-xs text-paper font-medium leading-none mb-0.5">Years of</p>
                <p className="text-xs text-dim font-light leading-none">Experience</p>
              </div>
            </motion.div>

            {/* Floating projects badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-5 -right-6 bg-mist border border-border rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-champagne/10 border border-champagne/20 flex items-center justify-center flex-shrink-0">
                <span className="text-champagne text-sm font-display">20+</span>
              </div>
              <div>
                <p className="text-xs text-paper font-medium leading-none mb-0.5">Projects</p>
                <p className="text-xs text-dim font-light leading-none">Shipped</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
