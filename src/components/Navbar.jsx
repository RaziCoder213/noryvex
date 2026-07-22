import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Solutions', id: 'solutions' },
    { name: 'Live Demo', id: 'live-demo' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#home" className="nav-brand" onClick={() => handleNavClick('home')}>
          <img src="/logo.png" alt="Noryvex" className="nav-logo" />
          <span className="nav-title">Noryvex</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-menu">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`nav-link ${activePage === link.id ? 'active' : ''}`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <button 
            onClick={() => handleNavClick('contact')} 
            className="btn btn-outline-neon btn-sm nav-cta"
          >
            Book Strategy Call <ArrowUpRight size={16} />
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
            onClick={() => handleNavClick('contact')}
            className="btn btn-primary mobile-cta"
          >
            Book Strategy Call <ArrowUpRight size={16} />
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
          padding: 24px 0;
          transition: var(--transition-smooth);
          border-bottom: 1px solid transparent;
        }
        
        .navbar-wrapper.scrolled {
          padding: 16px 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
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
          height: 40px;
          width: 40px;
          object-fit: contain;
        }
        
        .nav-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--text-white);
          letter-spacing: 0.05em;
        }
        
        .nav-menu {
          display: flex;
          gap: 32px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          padding: 6px 24px;
          border-radius: 100px;
          backdrop-filter: blur(10px);
        }
        
        .nav-link {
          background: none;
          border: none;
          color: var(--text-gray);
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          padding: 8px 4px;
          position: relative;
          transition: var(--transition-fast);
        }
        
        .nav-link:hover {
          color: var(--text-white);
        }
        
        .nav-link.active {
          color: var(--accent-neon);
        }
        
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 4px;
          right: 4px;
          height: 2px;
          background-color: var(--accent-neon);
          border-radius: 2px;
          box-shadow: 0 0 8px var(--accent-neon);
        }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
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
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: var(--bg-pure);
          z-index: 999;
          transform: translateY(-100%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .mobile-nav.open {
          transform: translateY(0);
          display: flex;
          align-items: center;
          justify-content: center;
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
        
        @media (max-width: 1024px) {
          .nav-menu {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
          .mobile-nav {
            display: flex;
          }
          .nav-cta {
            display: none; /* Hide on small screens to save space */
          }
        }
      `}</style>
    </header>
  );
}
