import React from 'react';

/**
 * Hero background: static radial glow + 8 decorative neon dots.
 * Zero animation, zero canvas, zero RAF. Pure CSS.
 */
const DOTS = [
  { size: 3, top: '14%', left: '9%',  opacity: 0.55 },
  { size: 2, top: '38%', left: '4%',  opacity: 0.35 },
  { size: 4, top: '65%', left: '14%', opacity: 0.45 },
  { size: 2, top: '22%', left: '58%', opacity: 0.4  },
  { size: 3, top: '48%', left: '78%', opacity: 0.5  },
  { size: 2, top: '72%', left: '88%', opacity: 0.35 },
  { size: 3, top: '10%', left: '82%', opacity: 0.45 },
  { size: 2, top: '85%', left: '45%', opacity: 0.3  },
];

export default function ParticleCanvas() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow — static, zero cost */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 65% 50% at 50% 0%, rgba(199,255,61,0.07) 0%, transparent 65%),
          radial-gradient(ellipse 30% 20% at 88% 80%, rgba(199,255,61,0.04) 0%, transparent 55%)
        `,
      }} />

      {/* Decorative neon dots */}
      {DOTS.map((d, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: '#C7FF3D',
            opacity: d.opacity,
            boxShadow: `0 0 ${d.size * 3}px rgba(199,255,61,0.5)`,
          }}
        />
      ))}
    </div>
  );
}
