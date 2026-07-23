import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (id) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        <div className="footer-brand-section">
          <div className="footer-logo-title" onClick={() => handleNavClick('home')}>
            <img src="/logo.png" alt="Noryvex Logo" className="footer-logo" />
            <span className="footer-title">Noryvex</span>
          </div>
          <p className="footer-tagline">Automate. Communicate. Grow.</p>
          <p className="footer-desc">Building futuristic AI Voice Agents, Business Automation, and Intelligent Software to scale enterprises.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-link-group">
            <span className="group-title">Company</span>
            <button onClick={() => handleNavClick('about')} className="footer-btn-link">About Us</button>
            <button onClick={() => handleNavClick('contact')} className="footer-btn-link">Book Meeting</button>
            <button onClick={() => handleNavClick('admin')} className="footer-btn-link admin-trigger">Admin Panel</button>
          </div>

          <div className="footer-link-group">
            <span className="group-title">Solutions</span>
            <button onClick={() => handleNavClick('solutions')} className="footer-btn-link">Voice Receptionists</button>
            <button onClick={() => handleNavClick('solutions')} className="footer-btn-link">Workflow Automation</button>
            <button onClick={() => handleNavClick('solutions')} className="footer-btn-link">Intelligent Software</button>
          </div>

          <div className="footer-link-group">
            <span className="group-title">Contact & Socials</span>
            <a href="mailto:hello@trynoryvex.com" className="footer-link">
              Email <ArrowUpRight size={14} />
            </a>
            <a href="https://www.linkedin.com/company/noryvex" target="_blank" rel="noopener noreferrer" className="footer-link">
              Company LinkedIn <ArrowUpRight size={14} />
            </a>
            <a href="https://www.linkedin.com/in/mrazi-dev/" target="_blank" rel="noopener noreferrer" className="footer-link">
              Founder LinkedIn <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="footer-link-group">
            <span className="group-title">Legal</span>
            <button onClick={() => handleNavClick('privacy')} className="footer-btn-link">Privacy Policy</button>
            <button onClick={() => handleNavClick('terms')} className="footer-btn-link">Terms of Service</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <span className="copyright">© {currentYear} Noryvex. All rights reserved.</span>
          <div className="legal-links">
            <button className="legal-link" onClick={() => handleNavClick('privacy')}>Privacy Policy</button>
            <button className="legal-link" onClick={() => handleNavClick('terms')}>Terms of Service</button>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          border-top: 1px solid var(--border-light);
          background-color: var(--bg-pure);
          padding: 80px 0 40px 0;
          position: relative;
          z-index: 10;
        }
        
        .footer-container {
          display: grid;
          grid-template-columns: 1.5fr 2fr;
          gap: 64px;
          margin-bottom: 64px;
        }
        
        .footer-brand-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        
        .footer-logo-title {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          margin-bottom: 16px;
        }
        
        .footer-logo {
          height: 36px;
          width: 36px;
        }
        
        .footer-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.3rem;
          color: var(--text-white);
        }
        
        .footer-tagline {
          color: var(--accent-neon);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        
        .footer-desc {
          font-size: 0.95rem;
          max-width: 360px;
        }
        
        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          text-align: left;
        }
        
        .footer-link-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .group-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-white);
          margin-bottom: 8px;
        }
        
        .footer-btn-link {
          background: none;
          border: none;
          color: var(--text-gray);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          cursor: pointer;
          text-align: left;
          width: fit-content;
          transition: var(--transition-fast);
        }
        
        .footer-btn-link:hover {
          color: var(--accent-neon);
        }
        
        .admin-trigger {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        
        .footer-link {
          color: var(--text-gray);
          text-decoration: none;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          width: fit-content;
          transition: var(--transition-fast);
        }
        
        .footer-link:hover {
          color: var(--accent-neon);
        }
        
        .footer-bottom {
          border-top: 1px solid var(--border-light);
          padding-top: 32px;
        }
        
        .footer-bottom-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        
        .legal-links {
          display: flex;
          gap: 24px;
        }
        
        .legal-link {
          background: none;
          border: none;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s ease;
          cursor: pointer;
          font-size: 0.85rem;
          font-family: var(--font-sans);
          padding: 0;
        }
        
        .legal-link:hover {
          color: var(--text-gray);
        }
        
        @media (max-width: 1024px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .footer-brand-section {
            align-items: center;
            text-align: center;
          }
          .footer-desc {
            max-width: 100%;
          }
          .footer-links-grid {
            grid-template-columns: repeat(3, 1fr);
            justify-items: center;
            text-align: center;
          }
          .footer-btn-link, .footer-link {
            text-align: center;
            margin: 0 auto;
          }
        }
        
        @media (max-width: 600px) {
          .footer-links-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer-bottom-container {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
