import React, { useEffect, useRef } from 'react';

/**
 * MovingGrills — Animated audio wave / vertical equalizer bars
 * Replicates the exact Framer "moving grills" visual from the reference site.
 * 
 * @param {string} color - Bar accent color (default green #C7FF3D)
 * @param {string} mode - 'hero' | 'cta'
 * @param {string} className - Extra CSS class
 */
export default function MovingGrills({ color = '#C7FF3D', mode = 'hero', className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.022;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      const barWidth = 2.5;
      const gap = 3.5;
      const totalBarSpace = barWidth + gap;
      const barCount = Math.floor(width / totalBarSpace);
      const startX = (width - (barCount * totalBarSpace)) / 2;

      for (let i = 0; i < barCount; i++) {
        const x = startX + i * totalBarSpace;
        const normX = i / barCount; // 0 to 1

        // Multi-frequency wave calculation for natural fluid motion
        const wave1 = Math.sin(normX * 6 + time * 1.5);
        const wave2 = Math.cos(normX * 12 - time * 2.2);
        const wave3 = Math.sin(normX * 20 + time * 0.8);
        const wave4 = Math.sin(time * 3 + i * 0.15);

        // Amplitude envelope: keep active presence across full width from both sides
        let envelope;
        if (mode === 'cta') {
          // In CTA mode, emphasize right side
          envelope = Math.pow(normX, 0.65) * 1.1;
        } else {
          // Hero mode: bars cover full hero from both edges so it never feels empty
          envelope = 0.55 + 0.45 * Math.sin(normX * Math.PI);
        }

        const rawHeight = (wave1 * 0.35 + wave2 * 0.25 + wave3 * 0.2 + wave4 * 0.2 + 1) * 0.5;
        const maxH = height * 0.82;
        const minH = height * 0.16;
        const barHeight = Math.max(minH, rawHeight * maxH * envelope);

        const y = height - barHeight;

        // Gradient for each bar (bright at top, subtle fade at bottom)
        const grad = ctx.createLinearGradient(0, y, 0, height);
        grad.addColorStop(0, color);
        grad.addColorStop(0.35, 'rgba(199, 255, 61, 0.65)');
        grad.addColorStop(0.85, 'rgba(199, 255, 61, 0.15)');
        grad.addColorStop(1, 'rgba(199, 255, 61, 0.02)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Rounded bar caps
        const r = barWidth / 2;
        ctx.roundRect(x, y, barWidth, barHeight, [r, r, 0, 0]);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [color, mode]);

  return (
    <div className={`moving-grills-wrap moving-grills-${mode} ${className}`}>
      <canvas ref={canvasRef} className="moving-grills-canvas" />
    </div>
  );
}
