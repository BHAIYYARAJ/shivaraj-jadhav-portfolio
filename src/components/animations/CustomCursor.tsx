import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for fluid, luxury trailing effect
  const springConfig = { damping: 28, stiffness: 220, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop with fine pointer and no reduced-motion preference
    const mediaHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!mediaHover.matches || mediaReduced.matches) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('a, button, input, textarea, select, [role="button"], .cursor-interactive, .tilt-card');
      setIsHovered(Boolean(interactive));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isEnabled || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-100 overflow-hidden" aria-hidden="true">
      {/* Outer trailing ambient ring with dynamic scaling */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.75 : isHovered ? 1.8 : 1,
          opacity: isVisible ? (isHovered ? 0.9 : 0.6) : 0,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-orange-500/80 bg-orange-500/10 backdrop-blur-[1px] pointer-events-none"
      />

      {/* Center sharp laser dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.6 : isHovered ? 0.3 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316] pointer-events-none"
      />
    </div>
  );
};
