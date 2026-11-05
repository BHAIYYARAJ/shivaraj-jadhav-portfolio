import React, { useState } from 'react';
import {
  Lock,
  ArrowUp,
  Instagram,
  Youtube,
  Linkedin,
  MessageCircle,
  Facebook,
  Sparkles,
} from 'lucide-react';
import { SocialLink, SiteSettings } from '../types/portfolio.js';

interface FooterProps {
  socials: SocialLink[];
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onGoToDashboard: () => void;
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  socials,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onGoToDashboard,
  settings,
}) => {
  const [logoError, setLogoError] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (p.includes('youtube')) return <Youtube className="w-4 h-4" />;
    if (p.includes('whatsapp')) return <MessageCircle className="w-4 h-4" />;
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('facebook')) return <Facebook className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  const logoText = settings?.logoText || 'SHIVRAJ JADHAV';
  const hasImageLogo = Boolean(settings?.logoUrl && !logoError);

  const getInitials = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (text.slice(0, 2) || 'SJ').toUpperCase();
  };

  return (
    <footer className="bg-black dark:bg-black light:bg-zinc-100 border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-200 py-12 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 text-center md:text-left select-none">
            {hasImageLogo ? (
              <img
                src={settings!.logoUrl}
                alt={logoText}
                onError={() => setLogoError(true)}
                className="h-9 w-auto max-w-[170px] object-contain"
              />
            ) : (
              <span className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold flex items-center justify-center text-xs shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                {getInitials(logoText)}
              </span>
            )}
            <div>
              <p className="font-bold text-sm text-white dark:text-white light:text-zinc-900 tracking-wide font-heading">
                {logoText}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-zinc-500">
                Professional Video &amp; Photo Editor
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap justify-center gap-6 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 font-medium">
            <a href="#home" className="hover:text-orange-500 transition-colors">Home</a>
            <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
            <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
            <a href="#photo-portfolio" className="hover:text-orange-500 transition-colors">Photo Editing</a>
            <a href="#video-portfolio" className="hover:text-orange-500 transition-colors">Video Editing</a>
            <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>

          {/* Social Icons row */}
          <div className="flex items-center gap-2">
            {socials.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-orange-500 hover:border-orange-500/40 transition-all shadow-sm"
                aria-label={soc.platform}
                title={soc.label || soc.platform}
              >
                {getSocialIcon(soc.platform)}
              </a>
            ))}
          </div>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-900 light:bg-white text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:text-white dark:hover:text-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 shadow-sm transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-orange-500" />
          </button>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 dark:text-zinc-500 light:text-zinc-500">
            &copy; {new Date().getFullYear()} Shivaraj Jadhav. All rights reserved. Crafted for cinematic excellence.
          </p>

          <div className="flex items-center gap-4">
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-400 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Console Active</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-500 light:text-zinc-400 hover:text-orange-500 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Owner Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
