import React, { useState, useEffect, useRef } from 'react';

import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [gliderStyle, setGliderStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navMenuRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('noryvex_theme');
    // Reject legacy 'auto' value — only accept 'dark' or 'light'
    return (stored === 'dark' || stored === 'light') ? stored : 'dark';
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('noryvex_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home',       id: 'home'       },
    { name: 'Solutions',  id: 'solutions'  },
    { name: 'Live Demo',  id: 'live-demo'  },
    { name: 'Calculator', id: 'calculator' },
    { name: 'About',      id: 'about'      },
    { name: 'Contact',    id: 'contact'    },
  ];

  // Move the glider to sit under the active link
  const updateGlider = (pageId) => {
    if (!navMenuRef.current) return;
    const btn = navMenuRef.current.querySelector(`[data-navid="${pageId}"]`);
    if (!btn) return;
    const menuRect = navMenuRef.current.getBoundingClientRect();
    const btnRect  = btn.getBoundingClientRect();
    setGliderStyle({
      left:    btnRect.left - menuRect.left,
      width:   btnRect.width,
      opacity: 1,
    });
  };

  useEffect(() => {
    // Slight delay so DOM is painted before we measure
    const t = setTimeout(() => updateGlider(activePage), 60);
    return () => clearTimeout(t);
  }, [activePage]);

  // Re-measure on resize (zoom changes element sizes)
  useEffect(() => {
    const onResize = () => updateGlider(activePage);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activePage]);

  const handleNavClick = (id, option = 'trial') => {
    setActivePage(id, option);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="/" className="nav-brand" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
          <img src="/logo.png" alt="Noryvex" className="nav-logo" />
          <span className="nav-title">NORYVE<span className="nav-title-x">X</span></span>
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-menu" ref={navMenuRef}>
          {/* Sliding glider pill — travels between active links */}
          <div
            className="nav-glider"
            style={{
              left:    gliderStyle.left,
              width:   gliderStyle.width,
              opacity: gliderStyle.opacity,
            }}
          />
          {navLinks.map((link) => (
            <button
              key={link.id}
              data-navid={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`nav-link ${activePage === link.id ? 'active' : ''}`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            <span className="theme-label">{theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
          </button>

          <button 
            onClick={() => handleNavClick('contact', 'trial')} 
            className="btn btn-outline-neon btn-sm nav-cta"
          >
            Get Free Clinic Demo <ArrowUpRight size={16} />
          </button>
          
          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`mobile-link ${activePage === link.id ? 'active' : ''}`}
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('contact', 'trial')}
            className="btn btn-primary mobile-cta"
            style={{ width: '100%', marginBottom: '12px' }}
          >
            Get Free Clinic Demo <ArrowUpRight size={16} />
          </button>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary mobile-cta-secondary theme-toggle-btn-mobile"
            style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-white)', padding: '12px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>
      
      <style>{`
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          height: var(--navbar-height);
          display: flex;
          align-items: center;
          transition: background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
          border-bottom: 1px solid transparent;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .navbar-wrapper.scrolled {
          background: rgba(5, 5, 8, 0.97);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 4px 32px rgba(0,0,0,0.6);
        }
        
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        
        .nav-logo {
          height: 36px;
          width: 36px;
          object-fit: contain;
          flex-shrink: 0;
        }
        
        .nav-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          color: var(--text-white);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        
        .nav-title-x {
          color: var(--accent-neon);
          text-shadow: 0 0 12px rgba(199,255,61,0.5);
        }
        
        .nav-menu {
          position: relative; /* needed for glider absolute positioning */
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(14, 14, 18, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 5px 8px;
          border-radius: 100px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        /* Sliding neon pill — moves between active nav links */
        .nav-glider {
          position: absolute;
          top: 5px;
          bottom: 5px;
          background: var(--accent-neon);
          border-radius: 100px;
          transition: left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.2s ease;
          pointer-events: none;
          z-index: 0;
        }
        
        .nav-link {
          background: none;
          border: none;
          color: rgba(161,161,170,0.9);
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 7px 14px;
          border-radius: 100px;
          position: relative;
          z-index: 1; /* sit above the glider */
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #fff;
        }

        .nav-link.active {
          color: #000;
          font-weight: 700;
          background: transparent; /* glider provides the background */
        }

        .nav-link.active::after { display: none; }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .theme-toggle-btn {
          background: var(--bg-preview-card);
          border: 1px solid var(--border-light);
          color: var(--text-light);
          padding: 6px 12px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }

        .theme-toggle-btn:hover {
          border-color: var(--accent-neon);
          background: var(--bg-glass);
          color: var(--text-white);
        }

        .theme-toggle-btn svg {
          color: var(--accent-neon);
        }

        .theme-label {
          font-weight: 700;
        }
        
        .nav-cta {
          padding: 8px 20px;
          font-size: 0.85rem;
        }
        
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-white);
          cursor: pointer;
        }
        
        .mobile-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: var(--bg-pure);
          z-index: 999;
          transform: translateY(-100%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          opacity: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .mobile-nav.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          width: 80%;
        }
        
        .mobile-link {
          background: none;
          border: none;
          font-family: var(--font-sans);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-gray);
          cursor: pointer;
          padding: 8px;
          transition: var(--transition-fast);
        }
        
        .mobile-link:hover, .mobile-link.active {
          color: var(--accent-neon);
        }
        
        .mobile-cta {
          width: 100%;
          margin-top: 16px;
        }
        
        @media (max-width: 1280px) {
          :root { --navbar-height: 62px; }
          .nav-menu { gap: 2px; }
          .nav-link { font-size: 0.85rem; padding: 6px 10px; }
          .theme-label { display: none; }
          .theme-toggle-btn { padding: 8px; }
          .nav-cta { padding: 8px 14px; font-size: 0.8rem; }
        }

        @media (max-width: 1120px) {
          :root { --navbar-height: 60px; }
          .nav-menu { display: none; }
          .mobile-toggle { display: block; }
          .mobile-nav { display: flex; }
          .nav-cta { display: none; }
          .theme-toggle-btn { display: none; }
        }

        @media (max-width: 480px) {
          :root { --navbar-height: 56px; }
          .nav-title { font-size: 1.1rem; }
          .nav-logo { height: 28px; width: 28px; }
        }
      `}</style>
    </header>
  );
}
