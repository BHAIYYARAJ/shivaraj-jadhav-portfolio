import React from 'react';
import {
  ArrowRight,
  Play,
  Film,
  Sparkles,
  Camera,
  CheckCircle2,
  Instagram,
  Youtube,
  Linkedin,
  MessageCircle,
  Facebook,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ProfileData, SocialLink } from '../types/portfolio.js';
import { TextReveal } from './animations/TextReveal.js';
import { AnimatedCounter } from './animations/AnimatedCounter.js';
import { MagneticButton } from './animations/MagneticButton.js';
import { TiltCard } from './animations/TiltCard.js';

interface HeroProps {
  profile: ProfileData;
  socials: SocialLink[];
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, socials, onExploreWork }) => {
  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (p.includes('youtube')) return <Youtube className="w-4 h-4" />;
    if (p.includes('whatsapp')) return <MessageCircle className="w-4 h-4" />;
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('facebook')) return <Facebook className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-orange-600/15 dark:bg-orange-600/15 light:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-orange-500/10 dark:bg-orange-500/10 light:bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] light:bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Introduction & Pitch */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Status Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-xs text-zinc-300 dark:text-zinc-300 light:text-zinc-700 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for freelance &amp; commercial bookings</span>
            </motion.div>

            {/* Headline with cinematic TextReveal */}
            <div className="space-y-3">
              <p className="text-orange-500 dark:text-orange-400 light:text-orange-600 font-semibold tracking-wide text-lg sm:text-xl">
                {profile.heroHeading || "Hi, I'm Shivaraj Jadhav"}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white dark:text-white light:text-zinc-900 leading-[1.1] font-heading">
                <TextReveal
                  text={profile.heroSubheading || 'Creative Video & Photo Editor'}
                  delay={0.15}
                  mode="word"
                />
              </h1>
            </div>

            {/* Short Introduction */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-base sm:text-lg text-zinc-300 dark:text-zinc-300 light:text-zinc-600 max-w-2xl leading-relaxed"
            >
              {profile.introText}
            </motion.p>

            {/* Call To Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <MagneticButton strength={0.3}>
                <a
                  href={profile.buttons.hireMeLink || '#contact'}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-500 hover:to-amber-500 shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{profile.buttons.hireMeText || 'Hire Me'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </MagneticButton>

              <MagneticButton strength={0.25}>
                <a
                  href={profile.buttons.viewWorkLink || '#video-portfolio'}
                  onClick={onExploreWork}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-zinc-200 dark:text-zinc-200 light:text-zinc-800 bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 shadow-sm transition-all hover:text-white dark:hover:text-white light:hover:text-black"
                >
                  <Play className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span>{profile.buttons.viewWorkText || 'View My Work'}</span>
                </a>
              </MagneticButton>
            </motion.div>

            {/* Social Media Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-4 flex items-center gap-3"
            >
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-zinc-500 tracking-wider uppercase mr-1">
                Connect:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {socials.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-orange-500 hover:border-orange-500/40 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-50 transition-all shadow-sm"
                    title={soc.label || soc.platform}
                    aria-label={soc.platform}
                  >
                    {getSocialIcon(soc.platform)}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Profile Picture with 3D Tilt Card & Cinematic Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              {/* Outer glow ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 pointer-events-none" />

              {/* 3D Tilt Card Container */}
              <TiltCard maxTilt={6} glare={true} className="w-full">
                <div className="relative rounded-3xl overflow-hidden bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 shadow-2xl">
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img
                      src={profile.profilePhotoUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    />
                    {/* Subtle gradient overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent dark:from-zinc-950 dark:via-zinc-950/20 light:from-black/70 light:via-transparent light:to-transparent" />

                    {/* Badges on profile image */}
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                      <div className="bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-800/80 flex items-center gap-2">
                        <Film className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-semibold text-white">Video Specialist</span>
                      </div>
                      <div className="bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-800/80 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-semibold text-white">High-End Retouch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Floating experience badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute -bottom-4 -left-4 sm:-left-6 bg-zinc-900/95 dark:bg-zinc-900/95 light:bg-white border border-orange-500/30 dark:border-orange-500/30 light:border-orange-300 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 z-30"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-500">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-white dark:text-white light:text-zinc-900 leading-none">
                    <AnimatedCounter value={profile.stats.yearsExperience} />
                  </p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-zinc-500 font-medium mt-0.5">
                    Post-Production Craft
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Statistics Bar with Animated Number Counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 pt-8 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="p-4 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-white border border-zinc-800/60 dark:border-zinc-800/60 light:border-zinc-200 hover:border-orange-500/40 transition-all shadow-sm">
            <span className="block text-3xl sm:text-4xl font-extrabold text-orange-500 dark:text-orange-500 light:text-orange-600 font-heading">
              <AnimatedCounter value={profile.stats.projectsCompleted} />
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 light:text-zinc-600 font-medium mt-1 block">
              Completed Projects
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-white border border-zinc-800/60 dark:border-zinc-800/60 light:border-zinc-200 hover:border-orange-500/40 transition-all shadow-sm">
            <span className="block text-3xl sm:text-4xl font-extrabold text-orange-500 dark:text-orange-500 light:text-orange-600 font-heading">
              <AnimatedCounter value={profile.stats.yearsExperience} />
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 light:text-zinc-600 font-medium mt-1 block">
              Years Experience
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-white border border-zinc-800/60 dark:border-zinc-800/60 light:border-zinc-200 hover:border-orange-500/40 transition-all shadow-sm">
            <span className="block text-3xl sm:text-4xl font-extrabold text-orange-500 dark:text-orange-500 light:text-orange-600 font-heading">
              <AnimatedCounter value={profile.stats.happyClients} />
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 light:text-zinc-600 font-medium mt-1 block">
              Happy Clients
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-white border border-zinc-800/60 dark:border-zinc-800/60 light:border-zinc-200 hover:border-orange-500/40 transition-all shadow-sm">
            <span className="block text-3xl sm:text-4xl font-extrabold text-orange-500 dark:text-orange-500 light:text-orange-600 font-heading">
              <AnimatedCounter value={profile.stats.viewsGenerated} />
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 light:text-zinc-600 font-medium mt-1 block">
              Views Generated
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
