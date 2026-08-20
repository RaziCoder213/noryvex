import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import useSEO from './hooks/useSEO';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ChevronUp, ChevronDown } from 'lucide-react';



// Pages
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import LiveDemo from './pages/LiveDemo';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import UnderConstruction from './pages/UnderConstruction';
import Calculator from './pages/Calculator';
import { dbGetUnderConstruction } from './utils/dbHelper';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [toasts, setToasts] = useState([]);
  const [initialContactTab, setInitialContactTab] = useState('trial');
  const [isUnderConstruction, setIsUnderConstruction] = useState(false);


  // ── Dynamic SEO per page ────────────────────────────
  useSEO(activePage);

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

  // ── Under Construction Mode Checker (Polls every 15s) ──
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await dbGetUnderConstruction();
        setIsUnderConstruction(status);
      } catch (e) {
        console.error(e);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, [activePage]);

  // ── Scroll Navigation Assistant (Top & Bottom shortcuts) ──
  const [showScrollNav, setShowScrollNav] = useState(false);

  useEffect(() => {
    const handleScrollNavVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollNav(true);
      } else {
        setShowScrollNav(false);
      }
    };
    window.addEventListener('scroll', handleScrollNavVisibility, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollNavVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

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
    }, { threshold: 0.05 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [activePage]);

  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '');
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').toLowerCase();
    const hostname = window.location.hostname;
    const all = ['solutions','live-demo','about','contact','home','privacy','terms','admin','calculator'];
    
    if (hostname.startsWith('admin.') || path === 'admin' || hash === 'admin') {
      return 'admin';
    }
    if (hash === 'trial' || hash === 'trial-form' || path === 'trial') {
      setInitialContactTab('trial');
      return 'contact';
    }
    if (hash === 'call' || hash === 'booking' || path === 'call') {
      setInitialContactTab('call');
      return 'contact';
    }
    
    if (path) {
      if (all.includes(path)) {
        return path;
      }
      return 'not-found';
    }
    
    if (hash && all.includes(hash)) {
      return hash;
    }
    return 'home';
  };

  // ── URL routing ─────────────────────────────────────────
  useEffect(() => {
    const handle = () => {
      const page = getInitialPage();
      setActivePage(page);
    };
    window.addEventListener('popstate', handle);
    window.addEventListener('hashchange', handle);
    handle();
    return () => {
      window.removeEventListener('popstate', handle);
      window.removeEventListener('hashchange', handle);
    };
  }, []);

  const changePage = (pageId, option = 'trial') => {
    if (pageId === 'contact') {
      setInitialContactTab(option);
    }
    setActivePage(pageId);
    const targetUrl = pageId === 'home' ? '/' : `/${pageId}`;
    window.history.pushState({}, '', targetUrl);
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
      case 'home':       return <Home setActivePage={changePage} />;
      case 'solutions':  return <Solutions setActivePage={changePage} />;
      case 'live-demo':  return <LiveDemo setActivePage={changePage} />;
      case 'about':      return <About />;
      case 'contact':    return <Contact addToast={addToast} initialTab={initialContactTab} />;
      case 'calculator': return <Calculator setActivePage={changePage} />;
      case 'admin':      return <Admin addToast={addToast} setActivePage={changePage} />;
      case 'privacy':    return <Privacy setActivePage={changePage} />;
      case 'terms':      return <Terms setActivePage={changePage} />;
      case 'not-found':  return <NotFound setActivePage={changePage} />;
      default:           return <Home setActivePage={changePage} />;
    }
  };

  // Decouple CMS Dashboard from website layout wrapper
  const isCmsLayout = activePage === 'admin';
  const showConstruction = isUnderConstruction && !isCmsLayout;

  return (
    <>
      {!isCmsLayout && !showConstruction && <div id="nrx-scroll-bar" />}
      {!isCmsLayout && !showConstruction && <Navbar activePage={activePage} setActivePage={changePage} />}

      <main className={showConstruction ? 'under-construction-active' : ''}>
        {showConstruction ? (
          <UnderConstruction onAdminAccess={() => changePage('admin')} />
        ) : (
          renderPage()
        )}
      </main>

      {!isCmsLayout && !showConstruction && <Footer setActivePage={changePage} addToast={addToast} />}

      {/* Cookie consent banner */}
      <CookieBanner />

      {/* Floating Scroll Navigation */}
      <div className={`nrx-scroll-nav ${showScrollNav ? 'visible' : ''}`}>
        <button onClick={scrollToTop} className="scroll-nav-btn" title="Go to Top">
          <ChevronUp size={16} />
        </button>
        <div className="scroll-nav-divider"></div>
        <button onClick={scrollToBottom} className="scroll-nav-btn" title="Go to Bottom">
          <ChevronDown size={16} />
        </button>
      </div>

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

      <style>{`
        main:not(.under-construction-active) { margin-top: var(--navbar-height); }
        main.under-construction-active { margin-top: 0; }

        /* Floating Scroll Navigation */
        .nrx-scroll-nav {
          position: fixed;
          bottom: 24px;
          right: 96px; /* offset to the left of toast messages */
          background: rgba(10, 10, 14, 0.95);
          border: 1px solid var(--border-light);
          border-radius: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4px;
          z-index: 9999;
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          transition: opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out);
          pointer-events: none;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }
        .nrx-scroll-nav.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }
        .scroll-nav-btn {
          background: none;
          border: none;
          color: var(--text-gray);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 50%;
          transition: color 0.2s, background 0.2s;
        }
        .scroll-nav-btn:hover {
          color: var(--accent-neon);
          background: rgba(255, 255, 255, 0.05);
        }
        .scroll-nav-divider {
          width: 16px;
          height: 1px;
          background: var(--border-light);
          margin: 2px 0;
        }
        @media (max-width: 600px) {
          .nrx-scroll-nav {
            bottom: 16px;
            right: 84px;
          }
        }
      `}</style>

      {/* Vercel Analytics — tracks page views */}
      <Analytics />

      {/* Vercel Speed Insights — tracks Core Web Vitals */}
      <SpeedInsights />
    </>
  );
}
