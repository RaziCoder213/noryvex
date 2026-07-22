import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import LiveDemo from './pages/LiveDemo';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [toasts, setToasts] = useState([]);
  const cursorDotRef  = useRef(null);
  const cursorRingRef = useRef(null);
  let ringX = 0, ringY = 0;

  // ── Premium cursor ──────────────────────────────────────
  useEffect(() => {
    const dot  = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    };
    document.addEventListener('mousemove', onMove);

    // Hover state
    const onEnter = () => document.body.classList.add('nrx-cursor-hover');
    const onLeave = () => document.body.classList.remove('nrx-cursor-hover');
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    let raf;
    const animate = () => {
      ringX += (mx - ringX) * 0.13;
      ringY += (my - ringY) * 0.13;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── Scroll progress bar ─────────────────────────────────
  useEffect(() => {
    const bar = document.getElementById('nrx-scroll-bar');
    const update = () => {
      const s = document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (h > 0 ? (s / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // ── Stats counter on scroll ─────────────────────────────
  useEffect(() => {
    const animateCount = (el, target, suffix) => {
      let start;
      const duration = 1800;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target) + (suffix || '');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCount(el, parseInt(el.dataset.count, 10), el.dataset.suffix || '');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activePage]);

  // ── Reveal on scroll ────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.nrx-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activePage]);

  // ── URL routing ─────────────────────────────────────────
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      if (path === '/admin' || hash === 'admin') {
        setActivePage('admin');
      } else if (['solutions', 'live-demo', 'about', 'contact', 'home'].includes(hash)) {
        setActivePage(hash);
      } else {
        setActivePage('home');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    handleUrlChange();
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const changePage = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':        return <Home setActivePage={changePage} />;
      case 'solutions':   return <Solutions setActivePage={changePage} />;
      case 'live-demo':   return <LiveDemo />;
      case 'about':       return <About />;
      case 'contact':     return <Contact addToast={addToast} />;
      case 'admin':       return <Admin addToast={addToast} />;
      default:            return <Home setActivePage={changePage} />;
    }
  };

  const marqueeItems = [
    'AI Voice Agents','Business Automation','CRM Integration',
    'Workflow Automation','AI Chatbots','SaaS Development',
    'API Integrations','Mobile Apps','Web Applications','24/7 Support',
  ];

  return (
    <>
      {/* ── Premium Overlays ── */}
      <div id="nrx-scroll-bar" aria-hidden="true" />
      <div id="nrx-cursor-dot"  ref={cursorDotRef}  aria-hidden="true" />
      <div id="nrx-cursor-ring" ref={cursorRingRef} aria-hidden="true" />
      <div id="nrx-noise" aria-hidden="true" />

      <Navbar activePage={activePage} setActivePage={changePage} />

      <main style={{ flexGrow: 1, paddingBottom: '60px' }}>
        {renderPage()}

        {/* ── Marquee Strip (appears on every page after hero) ── */}
        {activePage === 'home' && (
          <>
            {/* Stats */}
            <div className="nrx-stats-strip" id="nrx-stats">
              {[
                { count: 150, suffix: '+', label: 'AI Agents Deployed' },
                { count: 98,  suffix: '%', label: 'Client Retention' },
                { count: 800, suffix: 'ms', label: 'Avg. Voice Latency' },
                { count: 24,  suffix: '/7', label: 'System Uptime' },
              ].map((s, i) => (
                <div className="nrx-stat-item nrx-reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="nrx-stat-number" data-count={s.count} data-suffix={s.suffix}>0{s.suffix}</div>
                  <div className="nrx-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Marquee */}
            <div className="nrx-marquee-section" aria-hidden="true">
              <div className="nrx-marquee-track">
                {[...marqueeItems, ...marqueeItems].map((item, i) => (
                  <span className="nrx-marquee-item" key={i}>
                    <span className="nrx-dot" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer setActivePage={changePage} />

      {/* Toast Alert Portal */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast"
            style={{ borderLeftColor: toast.type === 'error' ? '#ef4444' : '#C7FF3D' }}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <style>{`
        main { margin-top: 80px; }
      `}</style>
    </>
  );
}
