import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

// Pages
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import LiveDemo from './pages/LiveDemo';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [toasts, setToasts] = useState([]);

  // ── Scroll progress bar ─────────────────────────────────
  useEffect(() => {
    const bar = document.getElementById('nrx-scroll-bar');
    if (!bar) return;
    const update = () => {
      const s = document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (s / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // ── Reveal on scroll (toggles both ways) ──────────────
  useEffect(() => {
    const els = document.querySelectorAll('.nrx-reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        // Add on enter, REMOVE on exit — fully reversible
        e.target.classList.toggle('visible', e.isIntersecting);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [activePage]);

  // ── Timeline line fill (reversible) ────────────────────
  useEffect(() => {
    const fill = document.querySelector('.timeline-line-fill');
    if (!fill) return;
    const container = fill.closest('.timeline-container');
    if (!container) return;
    const io = new IntersectionObserver(([entry]) => {
      fill.style.height = entry.isIntersecting ? '100%' : '0%';
    }, { threshold: 0.1 });
    io.observe(container);
    return () => io.disconnect();
  }, [activePage]);


  // ── Stats counter ────────────────────────────────────────
  useEffect(() => {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let start; const dur = 1600;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [activePage]);

  // ── URL routing ─────────────────────────────────────────
  useEffect(() => {
    const handle = () => {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname;
      const all = ['solutions','live-demo','about','contact','home','privacy','terms','admin'];
      if (path === '/admin' || hash === 'admin') setActivePage('admin');
      else if (all.includes(hash)) setActivePage(hash);
      else setActivePage('home');
    };
    window.addEventListener('popstate', handle);
    window.addEventListener('hashchange', handle);
    handle();
    return () => {
      window.removeEventListener('popstate', handle);
      window.removeEventListener('hashchange', handle);
    };
  }, []);

  const changePage = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const renderPage = () => {
    switch (activePage) {
      case 'home':      return <Home setActivePage={changePage} />;
      case 'solutions': return <Solutions setActivePage={changePage} />;
      case 'live-demo': return <LiveDemo setActivePage={changePage} />;
      case 'about':     return <About />;
      case 'contact':   return <Contact addToast={addToast} />;
      case 'admin':     return <Admin addToast={addToast} />;
      case 'privacy':   return <Privacy setActivePage={changePage} />;
      case 'terms':     return <Terms setActivePage={changePage} />;
      default:          return <Home setActivePage={changePage} />;
    }
  };

  // Hide navbar on legal pages (clean reading experience)
  const showNavbar = !['privacy', 'terms'].includes(activePage) || true;

  return (
    <>
      <div id="nrx-scroll-bar" />
      <Navbar activePage={activePage} setActivePage={changePage} />

      <main>{renderPage()}</main>

      <Footer setActivePage={changePage} />

      {/* Cookie consent banner */}
      <CookieBanner />

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
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

      <style>{`main { margin-top: 80px; }`}</style>
    </>
  );
}
