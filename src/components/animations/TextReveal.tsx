import React from 'react';
import { motion, useInView } from 'motion/react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  mode?: 'word' | 'letter';
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  delay = 0,
  mode = 'word',
  as: Component = 'span',
}) => {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: mode === 'letter' ? 0.025 : 0.08,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 24,
      rotateX: 45,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const tokens = mode === 'letter' ? text.split('') : text.split(' ');

  return (
    <motion.span
      ref={ref as any}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
      style={{ perspective: 1000 }}
    >
      {tokens.map((token, index) => (
        <motion.span
          key={`${token}-${index}`}
          variants={itemVariants}
          className="inline-block transform-style-3d origin-bottom"
        >
          {token === ' ' ? '\u00A0' : token}
        </motion.span>
      ))}
    </motion.span>
  );
};
