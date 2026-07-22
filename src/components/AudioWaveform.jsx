import React from 'react';

export default function AudioWaveform({ active = true, barCount = 15 }) {
  const bars = Array.from({ length: barCount }, (_, i) => i);
  
  return (
    <div className="waveform-container">
      {bars.map((bar) => {
        // Calculate random height multipliers for variance
        const heightMultiplier = Math.sin((bar / barCount) * Math.PI) * 0.8 + 0.2;
        // Unique animation delays for fluid movement
        const delay = `${(bar * 0.1) - (barCount * 0.05)}s`;
        const duration = active ? `${0.5 + Math.random() * 0.4}s` : '1.8s';

        return (
          <div
            key={bar}
            className={`waveform-bar ${active ? 'active' : 'idle'}`}
            style={{
              '--height-mult': heightMultiplier,
              animationDelay: delay,
              animationDuration: duration,
            }}
          />
        );
      })}

      <style>{`
        .waveform-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          height: 60px;
          padding: 0 16px;
        }

        .waveform-bar {
          width: 4px;
          height: 8px;
          background-color: var(--accent-neon);
          border-radius: 4px;
          box-shadow: 0 0 8px var(--accent-neon-glow);
          transition: height 0.3s ease, background-color 0.3s ease;
        }

        .waveform-bar.active {
          animation: wave-active infinite ease-in-out alternate;
        }

        .waveform-bar.idle {
          animation: wave-idle infinite ease-in-out alternate;
          background-color: var(--text-muted);
          box-shadow: none;
        }

        @keyframes wave-active {
          0% {
            height: 6px;
          }
          100% {
            height: calc(50px * var(--height-mult, 1));
          }
        }

        @keyframes wave-idle {
          0% {
            height: 6px;
          }
          100% {
            height: calc(14px * var(--height-mult, 1));
          }
        }
      `}</style>
    </div>
  );
}
