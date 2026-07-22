import React, { useState, useEffect } from 'react';
import { Cookie, X, Check, Settings } from 'lucide-react';

const STORAGE_KEY = 'nrx_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: true, preferences: true });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Small delay so it doesn't flash on page load
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ essential: true, analytics: true, preferences: true }));
    setVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ essential: true, analytics: false, preferences: false }));
    setVisible(false);
  };

  const savePrefs = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ essential: true, ...prefs }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-overlay" role="dialog" aria-label="Cookie preferences">
      <div className={`cookie-banner ${showDetails ? 'expanded' : ''}`}>

        {/* Header */}
        <div className="cookie-header">
          <div className="cookie-icon-wrap">
            <Cookie size={18} />
          </div>
          <div className="cookie-title-wrap">
            <span className="cookie-title">We use cookies</span>
            <span className="cookie-sub">To give you the best experience on our site.</span>
          </div>
          <button className="cookie-close" onClick={rejectAll} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <p className="cookie-body">
          We use essential cookies to make our site work. With your consent, we may also use analytics and preference cookies to improve your experience and remember your settings.
        </p>

        {/* Details toggle */}
        {showDetails && (
          <div className="cookie-prefs">
            <div className="cookie-pref-row">
              <div>
                <span className="pref-label">Essential</span>
                <span className="pref-desc">Required for the website to function. Cannot be disabled.</span>
              </div>
              <div className="toggle toggle-locked">
                <Check size={12} />
              </div>
            </div>
            <div className="cookie-pref-row">
              <div>
                <span className="pref-label">Analytics</span>
                <span className="pref-desc">Help us understand how visitors interact with our site.</span>
              </div>
              <button
                className={`toggle ${prefs.analytics ? 'on' : 'off'}`}
                onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                aria-label="Toggle analytics"
              >
                <span className="toggle-thumb" />
              </button>
            </div>
            <div className="cookie-pref-row">
              <div>
                <span className="pref-label">Preferences</span>
                <span className="pref-desc">Remember your settings and choices across visits.</span>
              </div>
              <button
                className={`toggle ${prefs.preferences ? 'on' : 'off'}`}
                onClick={() => setPrefs(p => ({ ...p, preferences: !p.preferences }))}
                aria-label="Toggle preferences"
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="cookie-actions">
          <button className="cookie-btn-ghost" onClick={() => setShowDetails(d => !d)}>
            <Settings size={14} />
            {showDetails ? 'Hide' : 'Customise'}
          </button>
          <div className="cookie-btn-group">
            <button className="cookie-btn-outline" onClick={rejectAll}>Reject All</button>
            {showDetails
              ? <button className="cookie-btn-primary" onClick={savePrefs}>Save Preferences</button>
              : <button className="cookie-btn-primary" onClick={acceptAll}>Accept All</button>
            }
          </div>
        </div>
      </div>

      <style>{`
        .cookie-overlay {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99999;
          width: min(560px, calc(100vw - 32px));
          animation: cookie-slide-up 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cookie-slide-up {
          from { opacity: 0; transform: translateX(-50%) translateY(24px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .cookie-banner {
          background: #0e0e12;
          border: 1px solid rgba(199,255,61,0.18);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
        }

        .cookie-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }
        .cookie-icon-wrap {
          width: 36px; height: 36px; flex-shrink: 0;
          background: rgba(199,255,61,0.08);
          border: 1px solid rgba(199,255,61,0.2);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #C7FF3D;
        }
        .cookie-title-wrap { flex: 1; }
        .cookie-title {
          display: block;
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 2px;
        }
        .cookie-sub { font-size: 0.75rem; color: var(--text-muted); }

        .cookie-close {
          background: none; border: none;
          color: var(--text-muted); cursor: pointer;
          padding: 4px; border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .cookie-close:hover { color: #fff; background: rgba(255,255,255,0.06); }

        .cookie-body {
          font-size: 0.82rem;
          color: var(--text-gray);
          line-height: 1.55;
          margin-bottom: 16px;
        }

        /* Preference rows */
        .cookie-prefs {
          border: 1px solid var(--border-light);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .cookie-pref-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          gap: 12px;
          border-bottom: 1px solid var(--border-light);
        }
        .cookie-pref-row:last-child { border-bottom: none; }
        .pref-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-white);
          margin-bottom: 2px;
        }
        .pref-desc { font-size: 0.72rem; color: var(--text-muted); }

        /* Toggle switch */
        .toggle {
          flex-shrink: 0;
          width: 38px; height: 22px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
        }
        .toggle.on  { background: #C7FF3D; }
        .toggle.off { background: rgba(255,255,255,0.1); }
        .toggle.toggle-locked {
          background: rgba(199,255,61,0.15);
          color: #C7FF3D;
          display: flex; align-items: center; justify-content: center;
          cursor: default;
        }
        .toggle-thumb {
          position: absolute;
          top: 3px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #000;
          transition: left 0.2s;
        }
        .toggle.on  .toggle-thumb { left: 19px; }
        .toggle.off .toggle-thumb { left: 3px; }

        /* Actions row */
        .cookie-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }
        .cookie-btn-ghost {
          background: none; border: none;
          color: var(--text-muted);
          font-size: 0.78rem; font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          transition: color 0.2s;
          padding: 6px 8px; border-radius: 6px;
        }
        .cookie-btn-ghost:hover { color: var(--text-white); background: rgba(255,255,255,0.04); }
        .cookie-btn-group { display: flex; gap: 8px; }
        .cookie-btn-outline {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-light);
          background: none;
          color: var(--text-gray);
          font-size: 0.8rem; font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .cookie-btn-outline:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
        .cookie-btn-primary {
          padding: 8px 18px;
          border-radius: 8px;
          border: none;
          background: #C7FF3D;
          color: #000;
          font-size: 0.8rem; font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }
        .cookie-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        @media (max-width: 480px) {
          .cookie-actions { flex-direction: column; align-items: stretch; }
          .cookie-btn-group { justify-content: stretch; }
          .cookie-btn-group button { flex: 1; }
        }
      `}</style>
    </div>
  );
}
