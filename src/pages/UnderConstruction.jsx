import React from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';

export default function UnderConstruction({ onAdminAccess }) {
  return (
    <div className="construction-container page-enter">
      <div className="construction-glow"></div>
      <div className="construction-card glass-card">
        <div className="pulse-indicator">
          <div className="pulse-dot"></div>
          <div className="pulse-ring"></div>
        </div>
        <div className="construction-header-wrap">
          <Cpu size={36} className="icon-neon construction-icon" />
          <h1 className="construction-title">System Optimizing</h1>
        </div>
        <p className="construction-text">
          Noryvex is currently upgrading our autonomous AI receptionist servers and caller model parameters. 
          Normal operations will resume shortly.
        </p>
        <div className="construction-divider"></div>
        <span className="construction-tag">Operational Updates In Progress</span>
      </div>

      <button onClick={onAdminAccess} className="construction-admin-btn" title="Admin Login">
        <ShieldAlert size={14} /> Admin Access
      </button>

      <style>{`
        .construction-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #000;
          position: relative;
          overflow: hidden;
          padding: 24px;
          color: var(--text-white);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .construction-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(199, 255, 61, 0.08) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
        }

        .construction-card {
          width: 100%;
          max-width: 480px;
          padding: 48px 32px;
          text-align: center;
          position: relative;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8) !important;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pulse-indicator {
          position: relative;
          width: 24px;
          height: 24px;
          margin-bottom: 28px;
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          background: var(--accent-neon);
          border-radius: 50%;
          position: absolute;
          top: 6px;
          left: 6px;
          z-index: 2;
          box-shadow: 0 0 12px var(--accent-neon);
        }

        .pulse-ring {
          border: 3px solid var(--accent-neon);
          border-radius: 30px;
          height: 30px;
          width: 30px;
          position: absolute;
          left: -3px;
          top: -3px;
          animation: construction-pulsate 1.8s ease-out infinite;
          opacity: 0;
          z-index: 1;
        }

        @keyframes construction-pulsate {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .construction-header-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .construction-icon {
          animation: spin-slow 12s linear infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .construction-title {
          font-size: 1.8rem;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
          background: linear-gradient(135deg, #FFF 30%, var(--accent-neon) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .construction-text {
          font-size: 0.95rem;
          color: var(--text-gray);
          line-height: 1.6;
          margin: 0 0 32px 0;
        }

        .construction-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
          margin-bottom: 24px;
        }

        .construction-tag {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-neon);
          background: rgba(199, 255, 61, 0.05);
          border: 1px solid rgba(199, 255, 61, 0.1);
          padding: 6px 16px;
          border-radius: 100px;
          font-weight: 700;
        }

        .construction-admin-btn {
          position: absolute;
          bottom: 24px;
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.25);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 100px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          z-index: 10;
        }

        .construction-admin-btn:hover {
          color: var(--text-white);
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
}
