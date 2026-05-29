import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';

// On the home page, these are scroll anchors.
// On other pages, they navigate home then scroll.
const NAV_LINKS = [
  { label: 'About',    anchor: '#about' },
  { label: 'Skills',   anchor: '#skills' },
  { label: 'Work',     href: '/projects' },   // ← dedicated page
  { label: 'Contact',  anchor: '#contact' },
];

export default function Navbar({ minimal = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleAnchor = (anchor) => {
    setMobileOpen(false);
    if (isHome) {
      document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/' + anchor);          // navigate home, hash will scroll
    }
  };

  const handleHireMe = () => {
    setMobileOpen(false);
    if (isHome) {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#contact');
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? 'bg-ink/90 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => isHome && window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-xl text-paper tracking-tight hover:text-champagne transition-colors duration-300"
          >
            SOPAN PARNATE <span className="text-champagne">.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              if (link.href) {
                // Route link — highlight when active
                const active = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-sm transition-colors duration-200 tracking-wide font-light ${
                      active ? 'text-paper' : 'text-dim hover:text-paper'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              }
              // Anchor scroll link
              return (
                <button
                  key={link.anchor}
                  onClick={() => handleAnchor(link.anchor)}
                  className="text-sm text-dim hover:text-paper transition-colors duration-200 tracking-wide font-light"
                >
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={handleHireMe}
              className="text-sm px-4 py-1.5 border border-champagne/40 text-champagne rounded-full hover:bg-champagne hover:text-ink transition-all duration-300 font-medium"
            >
              Hire me
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-paper p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={22} /> : <HiOutlineMenuAlt3 size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-ink/96 backdrop-blur-lg flex flex-col items-center justify-center gap-7 md:hidden"
          >
            {NAV_LINKS.map((link, i) => {
              const content = (
                <motion.span
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="font-display text-3xl text-paper/80 hover:text-champagne transition-colors italic"
                >
                  {link.label}
                </motion.span>
              );

              if (link.href) {
                return (
                  <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}>
                    {content}
                  </Link>
                );
              }
              return (
                <button key={link.anchor} onClick={() => handleAnchor(link.anchor)}>
                  {content}
                </button>
              );
            })}
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.07 }}
              onClick={handleHireMe}
              className="mt-2 text-sm px-6 py-2.5 border border-champagne/40 text-champagne rounded-full"
            >
              Hire me
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
