import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface AnimatedCounterProps {
  value: string; // e.g. "250+", "5+ Years", "120+", "15M+"
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1400,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState('0');

  // Parse numeric target and affix
  // E.g. "250+" -> num: 250, prefix: "", suffix: "+"
  // "15M+" -> num: 15, prefix: "", suffix: "M+"
  // "5+ Years" -> num: 5, prefix: "", suffix: "+ Years"
  useEffect(() => {
    if (!isInView) return;

    const match = value.match(/(\d+)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(match[0], 10);
    const startIndex = match.index || 0;
    const prefix = value.slice(0, startIndex);
    const suffix = value.slice(startIndex + match[0].length);

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quart: 1 - Math.pow(1 - progress, 4)
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.round(easedProgress * targetNumber);

      setDisplayValue(`${prefix}${currentVal}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
};
