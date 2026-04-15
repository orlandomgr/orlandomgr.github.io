import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const SECTIONS = [
  { id: 'experience', label: 'Work Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'speaking', label: 'Mentorship' },
  { id: 'education', label: 'Education' },
  { id: 'tech', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

export default function TableOfContents() {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      const experienceSection = document.getElementById('experience');
      if (!experienceSection) return;
      
      const rect = experienceSection.getBoundingClientRect();
      // Show TOC when experience section starts coming into view
      setVisible(rect.top <= 200);
    };

    const updateActiveSection = () => {
      const threshold = window.innerHeight * 0.4;
      const scrollBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      
      if (scrollBottom) {
        setActiveId(SECTIONS[SECTIONS.length - 1].id);
        return;
      }

      let current = '';
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            current = section.id;
          }
        }
      }
      
      if (current) setActiveId(current);
    };

    const onScroll = () => {
      checkVisibility();
      updateActiveSection();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    setIsOpen(false);
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop Sidebar TOC */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden 2xl:block"
          >
            <div className="relative pl-6 py-4">
              <div className="absolute left-0 top-0 w-px h-full bg-border" />
              <ul className="space-y-6">
                {SECTIONS.map((section) => {
                  const isActive = activeId === section.id;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollTo(section.id)}
                        className={`group relative flex items-center text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className={`absolute -left-[25px] w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                          isActive ? 'bg-primary border-primary scale-125 shadow-[0_0_10px_rgba(0,163,255,0.5)]' : 'bg-background border-border group-hover:border-primary/50'
                        }`} />
                        {section.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.nav>

          {/* Mobile Floating Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 2xl:hidden"
          >
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-20 right-0 mb-2 w-64 rounded-3xl bg-card/80 backdrop-blur-xl border border-border shadow-2xl p-3 overflow-hidden"
                >
                  <div className="space-y-1">
                    {SECTIONS.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollTo(section.id)}
                        className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                          activeId === section.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
