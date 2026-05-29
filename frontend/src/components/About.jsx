import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const STATS = [
  { value: '10+', label: 'Projects Built' },
  { value: '5+', label: 'Technologies Learned' },
  { value: '100+', label: 'DSA Problems Solved' },
  { value: '∞', label: 'Learning & Growing' },
];

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
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

export default function About() {
  return (
    <section id="about" className="py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section label */}
        <FadeIn>
          <p className="text-xs text-champagne tracking-widest uppercase mb-14 font-medium">
            01 — About
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: text */}
          <div>
            <FadeIn delay={0.05}>
              <h2 className="font-display text-[clamp(2.2rem,4vw,3.8rem)] leading-tight tracking-tightest text-paper mb-8">
                I care about creating meaningful digital experiences,
                <br />
                <em className="text-dim italic">not just the code.</em>
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-dim font-light leading-[1.85] mb-6">
               A Computer Science Engineering student passionate about modern web technologies, 
               Java, and problem solving through DSA. I enjoy building responsive and scalable 
               applications with attention to performance, usability, and clean development practices.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-dim font-light leading-[1.85]">
                Currently focused on gaining real-world experience through projects, 
                internships, hackathons, and collaborative opportunities to grow as a developer 
                and build impactful digital solutions.
              </p>
            </FadeIn>
          </div>

          {/* Right: stats grid */}
          <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
            {STATS.map(({ value, label }, i) => (
              <FadeIn key={label} delay={0.1 + i * 0.06}>
                <div className="bg-mist p-8 hover:bg-[#1e1e1e] transition-colors duration-300">
                  <p className="font-display text-4xl text-champagne mb-2 tracking-tight">
                    {value}
                  </p>
                  <p className="text-sm text-dim font-light">{label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
