import React, { useMemo } from 'react';

/**
 * AudioWaveform — CSS-only animated waveform visual
 * inspired by the Framer reference site's hero and CTA sections.
 *
 * @param {number}  bars      Number of bars (default 60)
 * @param {string}  variant   'hero' | 'cta' (controls layout class)
 * @param {string}  className Extra classes
 */
export default function AudioWaveform({ bars = 60, variant = 'hero', className = '' }) {
  const barData = useMemo(() => {
    return Array.from({ length: bars }, (_, i) => {
      // Create a wave pattern — taller in the middle, shorter at edges
      const center = bars / 2;
      const dist = Math.abs(i - center) / center; // 0 at center, 1 at edges
      const baseHeight = 30 + (1 - dist) * 70; // 30% to 100%
      const randomOffset = Math.random() * 20 - 10;
      const height = Math.max(15, Math.min(100, baseHeight + randomOffset));
      const delay = (i * 0.04) + (Math.random() * 0.3);
      const duration = 1.4 + Math.random() * 1.2;
      return { height, delay, duration };
    });
  }, [bars]);

  const cls = `nrx-waveform ${variant === 'cta' ? 'nrx-waveform--cta' : 'nrx-waveform--hero'} ${className}`;

  return (
    <div className={cls}>
      {barData.map((bar, i) => (
        <div
          key={i}
          className="nrx-waveform-bar"
          style={{
            height: `${bar.height}%`,
            animationDelay: `${bar.delay}s`,
            animationDuration: `${bar.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
