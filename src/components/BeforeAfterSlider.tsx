import React, { useState, useRef, useCallback } from 'react';
import { Sliders } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'RAW / BEFORE',
  afterLabel = 'RETOUCHED / AFTER',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleStart = () => setIsDragging(true);
  const handleEnd = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onMouseMove={handleMouseMove}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden cursor-ew-resize bg-zinc-950 rounded-xl ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* After image (underneath, full width) */}
      <img
        src={afterImage}
        alt="After retouching"
        className="w-full h-full object-cover block pointer-events-none"
      />
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-semibold tracking-wider text-orange-400 border border-orange-500/30 rounded">
        {afterLabel}
      </div>

      {/* Before image (clipped overlay) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before retouching"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
        />
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-semibold tracking-wider text-zinc-300 border border-zinc-700 rounded">
          {beforeLabel}
        </div>
      </div>

      {/* Vertical divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-orange-500 shadow-[0_0_12px_rgba(255,107,0,0.8)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Grab Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg border-2 border-white/80 transition-transform hover:scale-110 active:scale-95">
          <Sliders className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
