import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let raf;
    let particles = [];
    // ── Reduced count & connection distance for perf ──
    const COUNT = 35;
    const CONNECT_DIST = 100;
    const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;

    const mouse = { x: -9999, y: -9999, radius: 120 };

    const resize = () => {
      canvas.width  = canvas.parentElement.clientWidth  || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || 600;
    };

    const onMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    window.addEventListener('resize', resize, { passive: true });
    canvas.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', onMouseLeave, { passive: true });
    resize();

    // ── Particle factory (plain object — faster than class) ──
    const makeParticle = () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r:  Math.random() * 1.5 + 0.6,
    });

    for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

    // ── Pre-build a reusable gradient for glow (drawn once) ──
    let dotGrad = null;
    const buildGrad = () => {
      dotGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 3);
      dotGrad.addColorStop(0,   'rgba(199,255,61,0.9)');
      dotGrad.addColorStop(1,   'rgba(199,255,61,0)');
    };
    buildGrad();

    // ── Main loop — NO shadowBlur, NO grid, NO sqrt ──
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const W = canvas.width, H = canvas.height;

      // Draw connections first (back layer)
      ctx.lineWidth = 0.7;
      for (let i = 0; i < COUNT - 1; i++) {
        const a = particles[i];
        for (let j = i + 1; j < COUNT; j++) {
          const b  = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < CONNECT_DIST_SQ) {
            const alpha = (1 - dSq / CONNECT_DIST_SQ) * 0.18;
            ctx.strokeStyle = `rgba(199,255,61,${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles + update
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx = -p.vx;
        if (p.y < 0 || p.y > H) p.vy = -p.vy;

        // Mouse repel (use squared distance — no sqrt)
        const mx = p.x - mouse.x, my = p.y - mouse.y;
        const mSq = mx * mx + my * my;
        if (mSq < mouse.radius * mouse.radius) {
          const force = (1 - mSq / (mouse.radius * mouse.radius)) * 1.2;
          const len = Math.sqrt(mSq) || 1;
          p.x += (mx / len) * force;
          p.y += (my / len) * force;
        }

        // Draw — simple filled arc, NO shadowBlur
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(199,255,61,0.75)';
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
        willChange: 'transform', // promotes to compositor layer
      }}
    />
  );
}
