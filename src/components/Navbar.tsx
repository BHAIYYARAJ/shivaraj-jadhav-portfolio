import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Lock, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SiteSettings } from '../types/portfolio.js';
import { ThemeToggle } from './ThemeToggle.js';
import { MagneticButton } from './animations/MagneticButton.js';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onGoToDashboard: () => void;
  settings?: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdminLogin,
  isAdminLoggedIn,
  onGoToDashboard,
  settings,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Photo Editing', href: '#photo-portfolio' },
    { label: 'Video Editing', href: '#video-portfolio' },
    { label: 'Contact', href: '#contact' },
  ];

  // Helper for initials fallback
  const getInitials = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (text.slice(0, 2) || 'SJ').toUpperCase();
  };

  const logoText = settings?.logoText || 'SHIVRAJ JADHAV';
  const hasImageLogo = Boolean(settings?.logoUrl && !logoError);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/90 dark:bg-zinc-950/90 light:bg-white/90 backdrop-blur-md border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200/80 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with Configurable Image Upload + Fallback */}
          <a href="#home" className="group flex items-center gap-2.5 text-left select-none">
            {hasImageLogo ? (
              <img
                src={settings!.logoUrl}
                alt={logoText}
                onError={() => setLogoError(true)}
                className="h-10 w-auto max-w-[190px] object-contain group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-extrabold text-white text-base tracking-wider shadow-[0_0_18px_rgba(249,115,22,0.45)] shrink-0"
                >
                  {getInitials(logoText)}
                </motion.span>
                <div>
                  <span className="block text-lg font-bold tracking-tight text-white dark:text-white light:text-zinc-900 group-hover:text-orange-500 transition-colors font-heading leading-tight">
                    {logoText}
                  </span>
                  <span className="block text-[10px] tracking-widest text-zinc-400 dark:text-zinc-400 light:text-zinc-500 uppercase font-semibold">
                    Video &amp; Photo Editor
                  </span>
                </div>
              </>
            )}
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-orange-500 dark:hover:text-orange-400 light:hover:text-orange-600 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions: Theme Toggle, Admin, CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Admin Keyhole */}
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-950/60 dark:bg-orange-950/60 light:bg-orange-50 text-orange-400 dark:text-orange-400 light:text-orange-700 border border-orange-500/40 hover:bg-orange-900/60 transition-colors"
                title="Open Admin Dashboard"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="p-2 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-orange-500 rounded-xl hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100 transition-colors"
                title="Administrator Login"
                aria-label="Admin Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Magnetic CTA Button */}
            <MagneticButton strength={0.25}>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-500 hover:to-amber-500 transition-all shadow-[0_0_20px_rgba(249,115,22,0.35)] active:scale-95"
              >
                <span>Hire Me</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </MagneticButton>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />

            <button
              type="button"
              onClick={isAdminLoggedIn ? onGoToDashboard : onOpenAdminLogin}
              className="p-2 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-orange-500 rounded-lg"
              aria-label="Admin Access"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-300 dark:text-zinc-300 light:text-zinc-800 hover:text-white dark:hover:text-white hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-3 pt-3 pb-5 border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-200 bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-white/95 backdrop-blur-xl rounded-2xl px-5 shadow-2xl"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-zinc-200 dark:text-zinc-200 light:text-zinc-800 hover:text-orange-500 py-1.5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2.5">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                >
                  Hire Me
                </a>
                {isAdminLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onGoToDashboard();
                    }}
                    className="w-full py-2 text-center text-xs text-orange-400 dark:text-orange-400 light:text-orange-700 border border-orange-500/40 rounded-xl"
                  >
                    Open Admin Dashboard
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminLogin();
                    }}
                    className="w-full py-2 text-center text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl"
                  >
                    Admin Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};
