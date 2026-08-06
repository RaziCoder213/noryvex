import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { dbSaveContact } from '../utils/dbHelper';

export default function Footer({ setActivePage, addToast }) {
  const currentYear = new Date().getFullYear();
  const [emailInput, setEmailInput] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNavClick = (id, option = 'trial') => {
    setActivePage(id, option);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribing(true);
    try {
      await dbSaveContact({
        name: 'Newsletter Subscriber',
        email: emailInput,
        phone: 'N/A',
        message: 'Subscribed to mailing list from footer form.'
      });
      setEmailInput('');
      if (addToast) {
        addToast('Subscribed successfully! Welcome to Noryvex.', 'success');
      } else {
        alert('Thank you for subscribing!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        <div className="footer-brand-section">
          <div className="footer-logo-title" onClick={() => handleNavClick('home')}>
            <img src="/logo.png" alt="Noryvex Logo" className="footer-logo" />
            <span className="footer-title">NORYVE<span className="footer-title-x">X</span></span>
          </div>
          <p className="footer-tagline">Never miss another call.</p>
          <p className="footer-desc">Building custom AI receptionists for dental practices to stop losing patients from missed calls, qualify leads, and book appointments 24/7.</p>

          <div className="footer-newsletter">
            <span className="newsletter-label">Stay Automated</span>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter email for updates" 
                required 
                className="newsletter-input" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={subscribing}
              />
              <button type="submit" className="btn btn-primary btn-sm newsletter-btn" disabled={subscribing}>
                {subscribing ? '...' : 'Join'}
              </button>
            </form>
          </div>
          
          <div style={{ marginTop: '28px', opacity: 0.85 }} className="footer-badge-wrap">
            <a href="https://www.goodfirms.co/company/noryvex" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
              <img 
                src="https://www.goodfirms.co/img/badges/recognized-on-goodfirms.png" 
                alt="Recognized on Goodfirms" 
                style={{ width: '135px', height: 'auto', display: 'block', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.04)' }} 
              />
            </a>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-link-group">
            <span className="group-title">Company</span>
            <button onClick={() => handleNavClick('about')} className="footer-btn-link">About Us</button>
            <button onClick={() => handleNavClick('contact', 'trial')} className="footer-btn-link">Get Free Clinic Demo</button>
            <button onClick={() => handleNavClick('contact', 'call')} className="footer-btn-link">Book Free Strategy Call</button>
            <button onClick={() => handleNavClick('admin')} className="footer-btn-link admin-trigger">Admin Panel</button>
          </div>

          <div className="footer-link-group">
            <span className="group-title">Solutions</span>
            <button onClick={() => handleNavClick('solutions')} className="footer-btn-link">Voice Receptionists</button>
            <button onClick={() => handleNavClick('solutions')} className="footer-btn-link">FAQ Answering</button>
            <button onClick={() => handleNavClick('solutions')} className="footer-btn-link">Practice Dashboard</button>
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
          grid-template-columns: 1.2fr 2.5fr;
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
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.3rem;
          color: var(--text-white);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        
        .footer-title-x {
          color: var(--accent-neon);
          text-shadow: 0 0 12px rgba(199,255,61,0.5);
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
          grid-template-columns: repeat(4, 1fr);
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
            align-items: flex-start;
            text-align: left;
          }
          .footer-desc {
            max-width: 100%;
          }
          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
            justify-items: start;
            text-align: left;
            gap: 24px;
          }
          .footer-btn-link, .footer-link {
            text-align: left;
            margin: 0;
          }
        }
        
        @media (max-width: 600px) {
          .footer-links-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .footer-bottom-container {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
            text-align: left;
          }
          .legal-links {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }

        /* Newsletter form styling */
        .footer-newsletter {
          margin-top: 24px;
          width: 100%;
          max-width: 320px;
          text-align: left;
        }
        @media (max-width: 1024px) {
          .footer-newsletter {
            margin: 24px auto 0 auto;
          }
        }
        .newsletter-label {
          display: block;
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-white);
          margin-bottom: 8px;
        }
        .newsletter-form {
          display: flex;
          gap: 8px;
          width: 100%;
        }
        .newsletter-input {
          flex-grow: 1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          border-radius: 100px;
          padding: 8px 16px;
          font-size: 0.85rem;
          color: var(--text-white);
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 0.2s;
        }
        .newsletter-input:focus {
          border-color: var(--accent-neon);
        }
        .newsletter-btn {
          font-size: 0.75rem;
          padding: 8px 16px;
          flex-shrink: 0;
          border-radius: 100px;
        }
      `}</style>
    </footer>
  );
}
