import React, { useState, useEffect } from 'react';
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

  // ── Scroll progress bar (passive, minimal work) ─────────
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

  // ── Reveal on scroll (IntersectionObserver — zero scroll cost) ─
  useEffect(() => {
    const els = document.querySelectorAll('.nrx-reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
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
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target) + suffix;
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
      if (path === '/admin' || hash === 'admin') setActivePage('admin');
      else if (['solutions', 'live-demo', 'about', 'contact', 'home'].includes(hash)) setActivePage(hash);
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
    window.scrollTo({ top: 0, behavior: 'instant' }); // instant = no jank
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
      case 'live-demo': return <LiveDemo />;
      case 'about':     return <About />;
      case 'contact':   return <Contact addToast={addToast} />;
      case 'admin':     return <Admin addToast={addToast} />;
      default:          return <Home setActivePage={changePage} />;
    }
  };

  const marqueeItems = [
    'AI Voice Agents', 'Business Automation', 'CRM Integration',
    'Workflow Automation', 'AI Chatbots', 'SaaS Development',
    'API Integrations', 'Mobile Apps', 'Web Applications', '24/7 Support',
  ];

  return (
    <>
      {/* Scroll progress bar */}
      <div id="nrx-scroll-bar" />

      <Navbar activePage={activePage} setActivePage={changePage} />

      <main>
        {renderPage()}
      </main>

      <Footer setActivePage={changePage} />

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
