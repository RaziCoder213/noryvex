import React from 'react';

/**
 * Zero-animation hero background.
 * Pure static CSS gradients — 0ms CPU cost.
 */
export default function ParticleCanvas() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      background: `
        radial-gradient(ellipse 70% 55% at 50% -5%, rgba(199,255,61,0.07) 0%, transparent 65%),
        radial-gradient(ellipse 35% 25% at 85% 85%, rgba(199,255,61,0.04) 0%, transparent 55%)
      `,
    }} />
  );
}
