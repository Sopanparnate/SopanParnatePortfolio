import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTypescript,
  SiTailwindcss,
  SiGit,
  SiGithub,
  SiNextdotjs,
  SiPrisma,
} from 'react-icons/si';

const SKILL_GROUPS = [
  {
    category: 'Frontend',
    skills: [
      { name: 'HTML5', icon: SiHtml5 },
      { name: 'CSS3', icon: SiCss3 },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'React', icon: SiReact },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express', icon: SiExpress },
    ],
  },
  {
    category: 'Database & DevOps',
    skills: [
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'github', icon: SiGithub },
      { name: 'Git', icon: SiGit },
    ],
  },
];

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <p className="text-xs text-champagne tracking-widest uppercase mb-14 font-medium">
            02 — Stack
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SKILL_GROUPS.map((group, gi) => (
            <FadeIn key={group.category} delay={gi * 0.1}>
              <div className="border border-border rounded-xl p-6 hover:border-subtle transition-colors duration-300 h-full">
                <p className="text-xs tracking-widest text-dim uppercase mb-6 font-medium">
                  {group.category}
                </p>
                <div className="space-y-3">
                  {group.skills.map(({ name, icon: Icon }, si) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: gi * 0.1 + si * 0.06, duration: 0.5 }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-mist border border-border flex items-center justify-center group-hover:border-champagne/30 transition-colors duration-200">
                        <Icon size={15} className="text-dim group-hover:text-champagne transition-colors duration-200" />
                      </div>
                      <span className="text-sm text-paper/70 group-hover:text-paper transition-colors duration-200 font-light">
                        {name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
