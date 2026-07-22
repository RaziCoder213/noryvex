import React from 'react';

/**
 * Hero background:
 * - Neon ambient glow (static)
 * - Fixed green dots (properly sized with px units)
 * - White decorative animations: scan line, corner accents, floating orbs
 * All CSS-only. Zero canvas. Zero RAF. Zero perf cost.
 */

const DOTS = [
  { size: '4px', top: '15%',  left: '8%',  opacity: 0.6 },
  { size: '3px', top: '42%',  left: '3%',  opacity: 0.4 },
  { size: '5px', top: '68%',  left: '12%', opacity: 0.5 },
  { size: '3px', top: '20%',  left: '55%', opacity: 0.45 },
  { size: '4px', top: '50%',  left: '80%', opacity: 0.55 },
  { size: '3px', top: '75%',  left: '90%', opacity: 0.38 },
  { size: '4px', top: '8%',   left: '78%', opacity: 0.5 },
  { size: '3px', top: '88%',  left: '42%', opacity: 0.35 },
  { size: '2px', top: '30%',  left: '32%', opacity: 0.3 },
  { size: '3px', top: '58%',  left: '62%', opacity: 0.4 },
];

export default function ParticleCanvas() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
    >
      {/* ── Neon ambient glow ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 70% 55% at 50% -5%, rgba(199,255,61,0.08) 0%, transparent 65%),
          radial-gradient(ellipse 35% 25% at 90% 85%, rgba(199,255,61,0.04) 0%, transparent 55%)
        `,
      }} />

      {/* ── Green neon dots ── */}
      {DOTS.map((d, i) => (
        <span key={i} style={{
          position: 'absolute',
          top: d.top, left: d.left,
          width: d.size, height: d.size,
          borderRadius: '50%',
          background: '#C7FF3D',
          opacity: d.opacity,
          boxShadow: `0 0 8px 2px rgba(199,255,61,0.45)`,
          display: 'block',
        }} />
      ))}

      {/* ── White scan line (moves top → bottom slowly) ── */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)',
        animation: 'hero-scan 8s ease-in-out infinite',
      }} />

      {/* ── White corner accents ── */}
      {/* Top-left */}
      <div style={{
        position: 'absolute', top: 32, left: 32,
        width: 40, height: 40,
        borderTop: '1px solid rgba(255,255,255,0.12)',
        borderLeft: '1px solid rgba(255,255,255,0.12)',
        animation: 'hero-corner-in 1s 0.3s cubic-bezier(0.16,1,0.3,1) both',
      }} />
      {/* Top-right */}
      <div style={{
        position: 'absolute', top: 32, right: 32,
        width: 40, height: 40,
        borderTop: '1px solid rgba(255,255,255,0.12)',
        borderRight: '1px solid rgba(255,255,255,0.12)',
        animation: 'hero-corner-in 1s 0.4s cubic-bezier(0.16,1,0.3,1) both',
      }} />
      {/* Bottom-left */}
      <div style={{
        position: 'absolute', bottom: 32, left: 32,
        width: 40, height: 40,
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        borderLeft: '1px solid rgba(255,255,255,0.12)',
        animation: 'hero-corner-in 1s 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }} />
      {/* Bottom-right */}
      <div style={{
        position: 'absolute', bottom: 32, right: 32,
        width: 40, height: 40,
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        borderRight: '1px solid rgba(255,255,255,0.12)',
        animation: 'hero-corner-in 1s 0.6s cubic-bezier(0.16,1,0.3,1) both',
      }} />

      {/* ── Floating white orbs ── */}
      <div style={{
        position: 'absolute', top: '25%', left: '15%',
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)',
        animation: 'hero-orb-drift 12s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: '45%', right: '10%',
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.018) 0%, transparent 70%)',
        animation: 'hero-orb-drift 15s 4s ease-in-out infinite reverse',
      }} />

      {/* ── Thin white horizontal grid lines ── */}
      {[20, 45, 70].map((pct, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${pct}%`, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.04) 80%, transparent 100%)',
          animation: `hero-line-fade 4s ${i * 0.6}s ease-in-out infinite alternate`,
        }} />
      ))}

      <style>{`
        @keyframes hero-scan {
          0%   { transform: translateY(0vh); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(85vh); opacity: 0; }
        }
        @keyframes hero-corner-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes hero-orb-drift {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(20px, -20px); }
        }
        @keyframes hero-line-fade {
          from { opacity: 0.4; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
