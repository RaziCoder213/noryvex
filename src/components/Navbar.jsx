import React, { useState, useEffect, useRef } from 'react';

import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [gliderStyle, setGliderStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navMenuRef = useRef(null);

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
    { name: 'Solutions',   id: 'solutions'  },
    { name: 'Live Demo',   id: 'live-demo'  },
    { name: 'Calculator',  id: 'calculator' },
    { name: 'About',       id: 'about'      },
    { name: 'Contact',     id: 'contact'    },
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
          <span className="nav-title">Noryvex</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-menu" ref={navMenuRef} aria-label="Main Navigation">
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
            <a
              key={link.id}
              href={`/${link.id}`}
              data-navid={link.id}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
              className={`nav-link ${activePage === link.id ? 'active' : ''}`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a 
            href="/contact"
            onClick={(e) => { e.preventDefault(); handleNavClick('contact', 'trial'); }} 
            className="btn btn-outline-neon btn-sm nav-cta"
          >
            Get Free Clinic Demo <ArrowUpRight size={16} />
          </a>
          
          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`/${link.id}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
              className={`mobile-link ${activePage === link.id ? 'active' : ''}`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); handleNavClick('contact', 'trial'); }}
            className="btn btn-primary mobile-cta"
            style={{ width: '100%', marginBottom: '12px', textDecoration: 'none' }}
          >
            Get Free Clinic Demo <ArrowUpRight size={16} />
          </a>
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
          background: rgba(7, 7, 9, 0.72);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .navbar-wrapper.scrolled {
          background: rgba(5, 5, 8, 0.92);
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }


        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        
        .nav-logo {
          height: 28px;
          width: 28px;
          border-radius: 6px;
          object-fit: contain;
          flex-shrink: 0;
        }
        
        .nav-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-white);
          letter-spacing: -0.02em;
        }
        
        .nav-menu {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 4px 6px;
          border-radius: 100px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .nav-glider {
          position: absolute;
          top: 3px;
          bottom: 3px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 100px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
          transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.2s ease;
          pointer-events: none;
          z-index: 0;
        }
        
        .nav-link {
          background: none;
          border: none;
          color: #94A3B8;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 0.86rem;
          cursor: pointer;
          padding: 6px 14px;
          border-radius: 100px;
          position: relative;
          z-index: 1;
          transition: color 0.2s ease;
          white-space: nowrap;
          text-decoration: none;
        }

        .nav-link:hover {
          color: #FFFFFF;
        }

        .nav-link.active {
          color: #FFFFFF;
          font-weight: 600;
          background: transparent;
        }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        
        .nav-cta {
          padding: 8px 18px;
          font-size: 0.84rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.06);
          color: #F8FAFC;
          border: 1px solid rgba(255, 255, 255, 0.16);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-family: var(--font-sans);
          transition: all 0.2s var(--ease-out);
          text-decoration: none;
        }
        .nav-cta:hover {
          background: #FFFFFF;
          color: #08080a;
          border-color: #FFFFFF;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.15);
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
          top: var(--navbar-height);
          left: 0;
          width: 100%;
          height: calc(100dvh - var(--navbar-height));
          background: rgba(7, 7, 10, 0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          z-index: 999;
          transform: translateY(-12px);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
          opacity: 0;
          pointer-events: none;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 20px 16px 32px 16px;
          overflow-y: auto;
        }
        
        .mobile-nav.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
          width: 100%;
          max-width: 440px;
        }
        
        .mobile-link {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-light);
          cursor: pointer;
          padding: 15px 18px;
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: var(--transition-fast);
          text-decoration: none;
        }
        
        .mobile-link::after {
          content: '→';
          font-size: 0.95rem;
          color: var(--text-muted);
          transition: transform 0.2s ease, color 0.2s ease;
        }
        
        .mobile-link:hover, .mobile-link.active {
          color: var(--accent-neon);
          background: rgba(199, 255, 61, 0.06);
          border-color: rgba(199, 255, 61, 0.28);
        }
        
        .mobile-link.active::after {
          color: var(--accent-neon);
          transform: translateX(3px);
        }
        
        .mobile-cta {
          width: 100%;
          margin-top: 8px;
          padding: 15px 20px;
          font-size: 0.98rem;
          border-radius: 14px;
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
