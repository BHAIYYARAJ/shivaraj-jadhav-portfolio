import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext.js';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl border transition-colors flex items-center justify-center overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
        isDark
          ? 'bg-zinc-900/90 border-zinc-800 text-amber-400 hover:bg-zinc-800 hover:border-zinc-700'
          : 'bg-white border-zinc-200 text-orange-600 hover:bg-zinc-100 hover:border-zinc-300 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-orange-600 transition-transform group-hover:-rotate-12" />
        )}
      </motion.div>
    </button>
  );
};
