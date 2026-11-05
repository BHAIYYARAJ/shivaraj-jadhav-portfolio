import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check session or reduced motion
    const alreadySeen = sessionStorage.getItem('sj_preloader_seen');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (alreadySeen || prefersReducedMotion) {
      setIsDone(true);
      onComplete?.();
      return;
    }

    const startTime = performance.now();
    const duration = 1200; // 1.2s sleek cinematic entrance

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const currentProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(currentProgress);

      if (elapsed < duration) {
        requestAnimationFrame(updateCounter);
      } else {
        setTimeout(() => {
          sessionStorage.setItem('sj_preloader_seen', 'true');
          setIsDone(true);
          onComplete?.();
        }, 250);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('sj_preloader_seen', 'true');
    setIsDone(true);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-110 bg-[#09090b] flex flex-col justify-between p-6 sm:p-12 text-white select-none pointer-events-auto"
        >
          {/* Top header status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-zinc-400">
              <Film className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>Cinematic Portfolio</span>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-zinc-500 hover:text-orange-400 transition-colors uppercase tracking-wider px-2 py-1"
            >
              Skip Intro ↗
            </button>
          </div>

          {/* Center Brand typography reveal */}
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-orange-500 mb-2">
                Post-Production Artist
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-heading">
                SHIVRAJ JADHAV
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 tracking-wide mt-2">
                Video Editing · Cinematic Color Grading · High-End Retouching
              </p>
            </motion.div>
          </div>

          {/* Bottom Progress Bar & Large Percentage Counter */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
                INITIALIZING REELS &amp; VISUALS
              </span>
              <span className="text-4xl sm:text-6xl font-mono font-extrabold text-orange-500 tabular-nums">
                {progress}%
              </span>
            </div>

            {/* Glowing Orange Progress Line */}
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
