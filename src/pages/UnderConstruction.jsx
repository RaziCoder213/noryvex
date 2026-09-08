import React, { useState } from 'react';
import { ShieldAlert, Mail, ArrowRight } from 'lucide-react';

export default function UnderConstruction({ onAdminAccess }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: '#08080a',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '48px',
        }}>
          <img src="/logo.png" alt="Noryvex" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <span style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>Noryvex</span>
        </div>

        {/* Status indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'rgba(199, 255, 61, 0.08)',
          border: '1px solid rgba(199, 255, 61, 0.2)',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#C7FF3D',
          marginBottom: '32px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C7FF3D', animation: 'pulse 2s infinite' }} />
          Voice systems operational
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 700,
          color: '#F8FAFC',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          marginBottom: '16px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          We'll be right back.
        </h1>

        <p style={{
          fontSize: '1rem',
          color: '#94A3B8',
          lineHeight: 1.6,
          marginBottom: '40px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          We're making improvements to serve you better. Our voice systems remain fully operational for existing clients.
        </p>

        {/* Email capture */}
        {!submitted ? (
          <form onSubmit={handleNotify} style={{
            display: 'flex',
            gap: '8px',
            maxWidth: '380px',
            margin: '0 auto 48px auto',
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#F8FAFC',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              />
            </div>
            <button type="submit" style={{
              padding: '12px 20px',
              background: '#C7FF3D',
              color: '#08080a',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              whiteSpace: 'nowrap',
            }}>
              Notify me <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          <p style={{
            fontSize: '0.95rem',
            color: '#C7FF3D',
            marginBottom: '48px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            ✓ We'll notify you when we're back.
          </p>
        )}

        {/* Admin bypass */}
        <button
          onClick={onAdminAccess}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '8px',
            color: '#64748B',
            fontSize: '0.78rem',
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <ShieldAlert size={13} /> Admin Access
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
