import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const initialTheme = root.classList.contains('dark') ? 'dark' : 'light';
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'dark' ? 'light' : 'dark'; // explicit toggle
    const actualNewTheme = theme === 'light' ? 'dark' : 'light';
    
    const root = document.documentElement;
    if (actualNewTheme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    
    setTheme(actualNewTheme);
    localStorage.setItem('theme', actualNewTheme);
  };

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-[60] w-14 h-14 rounded-full bg-card/80 backdrop-blur-xl border border-border shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="relative w-6 h-6">
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              initial={{ y: 20, opacity: 0, rotate: 45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 text-amber-400"
            >
              <Sun className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: 20, opacity: 0, rotate: 45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 text-primary"
            >
              <Moon className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}
