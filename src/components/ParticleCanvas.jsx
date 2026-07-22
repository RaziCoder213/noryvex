import React from 'react';

/**
 * Lightweight CSS-only particle background.
 * Zero canvas, zero RAF, zero GPU thrashing.
 * Uses 12 tiny pseudo-random dots with CSS animations only.
 */
const dots = [
  { w:2, h:2, top:'12%', left:'8%',  delay:'0s',   dur:'6s'  },
  { w:3, h:3, top:'28%', left:'22%', delay:'1.2s',  dur:'8s'  },
  { w:2, h:2, top:'55%', left:'5%',  delay:'0.5s',  dur:'7s'  },
  { w:1, h:1, top:'72%', left:'35%', delay:'2s',    dur:'9s'  },
  { w:3, h:3, top:'18%', left:'60%', delay:'0.8s',  dur:'6.5s'},
  { w:2, h:2, top:'40%', left:'78%', delay:'1.5s',  dur:'7.5s'},
  { w:1, h:1, top:'65%', left:'90%', delay:'0.3s',  dur:'8.5s'},
  { w:2, h:2, top:'85%', left:'55%', delay:'1.8s',  dur:'6s'  },
  { w:3, h:3, top:'8%',  left:'45%', delay:'0.6s',  dur:'9s'  },
  { w:1, h:1, top:'50%', left:'50%', delay:'2.2s',  dur:'7s'  },
  { w:2, h:2, top:'30%', left:'92%', delay:'1s',    dur:'8s'  },
  { w:1, h:1, top:'90%', left:'15%', delay:'0.4s',  dur:'6.5s'},
];

export default function ParticleCanvas() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {/* Subtle radial glow — CSS only */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 50% 0%, rgba(199,255,61,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 40% 30% at 80% 80%, rgba(199,255,61,0.03) 0%, transparent 60%)
        `,
      }} />

      {/* CSS dot particles — no canvas, no RAF */}
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: d.top,
            left: d.left,
            width: d.w + 'px',
            height: d.h + 'px',
            borderRadius: '50%',
            background: 'rgba(199,255,61,0.55)',
            boxShadow: '0 0 6px rgba(199,255,61,0.3)',
            animation: `particle-float ${d.dur} ${d.delay} ease-in-out infinite`,
            willChange: 'transform',
          }}
        />
      ))}

      <style>{`
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) scale(1);   opacity: 0.5; }
          33%       { transform: translateY(-12px) scale(1.1); opacity: 0.8; }
          66%       { transform: translateY(6px) scale(0.9);  opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
