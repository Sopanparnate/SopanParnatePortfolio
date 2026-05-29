import React from 'react';
import { FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';

const LINKS = [
  { icon: FiGithub,   href: 'https://github.com/Sopanparnate',   label: 'GitHub'   },
  { icon: FiLinkedin, href: 'https://www.linkedin.com/in/sopan-parnate',  label: 'LinkedIn' },
  { icon: FiInstagram, href: 'https://www.instagram.com/sopan_parnate_03?igsh=MWVybGp4czVqZHcyNg==', label: 'Instagram' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display text-lg text-paper/40 tracking-tight">
          SOPAN PARNATE <span className="text-champagne/40">.</span>
        </span>
       
        <div className="flex items-center gap-5">
          {LINKS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-dim/50 hover:text-champagne transition-colors duration-200"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
