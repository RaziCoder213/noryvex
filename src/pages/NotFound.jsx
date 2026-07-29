import React from 'react';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFound({ setActivePage }) {
  return (
    <div className="nrx-404-container">
      <div className="nrx-404-glow"></div>
      
      <div className="nrx-404-content">
        <div className="nrx-404-icon-wrapper">
          <ShieldAlert size={48} className="nrx-404-icon" />
        </div>
        
        <h1 className="nrx-404-code">404</h1>
        <h2 className="nrx-404-title">Agent Connection Lost</h2>
        
        <p className="nrx-404-desc">
          The requested system node or AI calling agent is currently offline or does not exist. 
          Let's get you back to headquarters.
        </p>

        <div className="nrx-404-actions">
          <button onClick={() => setActivePage('home')} className="nrx-404-btn primary">
            <Home size={18} />
            <span>Return to Home</span>
          </button>
          
          <button onClick={() => setActivePage('contact')} className="nrx-404-btn secondary">
            <ArrowLeft size={18} />
            <span>Book a Strategy Call</span>
          </button>
        </div>
      </div>

      <style>{`
        .nrx-404-container {
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 40px 24px;
          background: radial-gradient(circle at 50% 50%, rgba(199,255,61,0.02) 0%, rgba(7,7,8,1) 80%);
        }

        .nrx-404-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: var(--accent-neon);
          filter: blur(150px);
          opacity: 0.08;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .nrx-404-content {
          position: relative;
          z-index: 2;
          max-width: 480px;
          text-align: center;
          background: rgba(10, 10, 14, 0.6);
          border: 1px solid var(--border-light);
          padding: 48px 32px;
          border-radius: 24px;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          animation: floatCard 6s ease-in-out infinite;
        }

        .nrx-404-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(199, 255, 61, 0.05);
          border: 1px dashed rgba(199, 255, 61, 0.2);
          margin-bottom: 24px;
          color: var(--accent-neon);
        }

        .nrx-404-icon {
          animation: iconPulse 2s infinite ease-in-out;
        }

        .nrx-404-code {
          font-family: var(--font-display);
          font-size: 72px;
          font-weight: 800;
          color: var(--accent-neon);
          margin: 0;
          line-height: 1;
          letter-spacing: -0.02em;
          text-shadow: 0 0 20px rgba(199, 255, 61, 0.2);
        }

        .nrx-404-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 600;
          color: var(--text-white);
          margin: 12px 0 16px 0;
        }

        .nrx-404-desc {
          font-size: 15px;
          color: var(--text-gray);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .nrx-404-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nrx-404-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s var(--ease-out);
        }

        .nrx-404-btn.primary {
          background: var(--accent-neon);
          border: 1px solid var(--accent-neon);
          color: var(--bg-pure);
        }

        .nrx-404-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(199, 255, 61, 0.25);
        }

        .nrx-404-btn.secondary {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          color: var(--text-white);
        }

        .nrx-404-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--text-gray);
          transform: translateY(-2px);
        }

        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes iconPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }

        @media (max-width: 480px) {
          .nrx-404-content {
            padding: 32px 20px;
          }
          .nrx-404-code {
            font-size: 60px;
          }
          .nrx-404-title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
