import React from 'react';
import { Phone, Cpu, Zap, Shield, CheckCircle2, Terminal, Code, Database, Globe } from 'lucide-react';

export default function Solutions({ setActivePage }) {
  const categories = [
    {
      title: "Dental AI Receptionist Features",
      icon: <Phone size={32} className="sol-icon" />,
      highlight: "800ms Latency Response",
      description: "Our high-performance conversational speech engines bypass normal voice response delays, making Noryvex voice receptionists indistinguishable from humans.",
      features: [
        "Answers new patient calls 24/7",
        "Books appointments directly into your practice calendar",
        "Answers treatment, pricing, insurance, and directions FAQs",
        "Collects and profiles patient details before bookings",
        "Intelligently routes emergency dental inquiries to human staff"
      ]
    }
  ];

  const secondaryCapabilities = [
    {
      title: "Workflow & CRM Automation",
      desc: "Connect your voice receptionists to custom HubSpot, Salesforce, GoHighLevel, or custom REST APIs to auto-log call data and lead notes."
    },
    {
      title: "Websites & Web Apps",
      desc: "High-performance marketing websites and interactive booking portals built from scratch and fully maintained by Noryvex."
    },
    {
      title: "Custom Software Development",
      desc: "Full product engineering — tailored internal business apps, mobile applications, and cloud-native databases built specifically around your operations."
    }
  ];

  return (
    <div className="solutions-page page-enter">
      <section className="solutions-hero">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Solutions</span>
            <h1 className="solutions-title">Dental AI Receptionist Solutions</h1>
            <p className="solutions-subtitle">Autonomous clinical communication engines custom-built to qualify leads, handle FAQs, and book patient appointments 24/7.</p>
          </div>
        </div>
      </section>

      <section className="solutions-details">
        <div className="container sol-container">
          {categories.map((cat, i) => (
            <div key={i} className="solution-row glass-card">
              <div className="sol-info-block">
                <div className="sol-icon-header">
                  <div className="sol-icon-bg">{cat.icon}</div>
                  <span className="sol-highlight-tag">{cat.highlight}</span>
                </div>
                <h2 className="sol-row-title">{cat.title}</h2>
                <p className="sol-row-desc">{cat.description}</p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setActivePage('contact', 'trial')} 
                    className="btn btn-primary"
                  >
                    Get Free Clinic Demo
                  </button>
                  <button 
                    onClick={() => setActivePage('contact', 'call')} 
                    className="btn btn-outline-neon"
                  >
                    Book Free Strategy Call
                  </button>
                </div>
              </div>

              <div className="sol-features-block">
                <h3 className="features-title">Technical Capabilities</h3>
                <ul className="features-list">
                  {cat.features.map((feat, index) => (
                    <li key={index} className="feature-item">
                      <CheckCircle2 size={18} className="feat-check" />
                      <span className="feat-text">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="solutions-secondary" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)', background: 'var(--bg-pure)' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span className="section-tag" style={{ margin: '0 auto 16px auto' }}>Expanding Roadmap</span>
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Additional Custom Automation Capabilities</h2>
          <p style={{ color: 'var(--text-gray)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '40px' }}>
            We focus primarily on dental AI receptionists to ensure absolute reliability. However, we also design and support secondary automation infrastructure on demand.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', textAlign: 'left' }}>
            {secondaryCapabilities.map((cap, index) => (
              <div key={index} className="glass-card" style={{ padding: '24px 32px', border: '1px solid var(--border-light)', borderRadius: '16px', background: 'var(--bg-glass)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-white)', marginBottom: '8px' }}>{cap.title}</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack section */}
      <section className="tech-stack-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Engine</span>
            <h2 className="section-title">The Noryvex Core Stack</h2>
            <p className="section-subtitle">We employ state-of-the-art framework technologies to build fast, robust, and reliable automations.</p>
          </div>

          <div className="tech-grid">
            <div className="tech-card glass-card">
              <Code size={28} className="tech-icon" />
              <h3>Languages & Frameworks</h3>
              <p>Node.js, Express, React, Vite, Python, WebSockets, Next.js</p>
            </div>
            <div className="tech-card glass-card">
              <Database size={28} className="tech-icon" />
              <h3>Database & Storage</h3>
              <p>SQLite, PostgreSQL, MongoDB, Redis, Pinecone Vector Databases</p>
            </div>
            <div className="tech-card glass-card">
              <Terminal size={28} className="tech-icon" />
              <h3>AI & LLM Services</h3>
              <p>OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Vapi, Retell AI, ElevenLabs</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .solutions-hero {
          padding: 140px 0 40px 0;
          background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-pure) 100%);
        }
        
        .solutions-title {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }
        
        .solutions-subtitle {
          font-size: 1.2rem;
          color: var(--text-gray);
          max-width: 600px;
          margin: 0 auto;
        }

        .solutions-details {
          padding: 60px 0;
          background-color: var(--bg-dark);
        }

        .sol-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .solution-row {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 48px;
          align-items: center;
          padding: 48px;
          text-align: left;
        }

        .sol-icon-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .sol-icon-bg {
          width: 64px;
          height: 64px;
          background: rgba(199, 255, 61, 0.08);
          border: 1px solid var(--accent-neon-border);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-neon);
        }

        .sol-highlight-tag {
          background: rgba(199, 255, 61, 0.05);
          border: 1px solid var(--accent-neon-border);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-neon);
          text-transform: uppercase;
        }

        .sol-row-title {
          font-size: 1.8rem;
          margin-bottom: 16px;
        }

        .sol-row-desc {
          font-size: 1rem;
          color: var(--text-gray);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .sol-features-block {
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          padding: 32px;
          border-radius: 12px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .features-title {
          font-size: 1.1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-white);
          margin-bottom: 24px;
        }

        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .feat-check {
          color: var(--accent-neon);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .feat-text {
          font-size: 0.95rem;
          color: var(--text-light);
        }

        /* Tech Stack Grid */
        .tech-stack-section {
          padding: 100px 0;
          background-color: var(--bg-pure);
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .tech-card {
          text-align: left;
          padding: 32px;
        }

        .tech-icon {
          color: var(--accent-neon);
          margin-bottom: 20px;
        }

        .tech-card h3 {
          font-size: 1.25rem;
          margin-bottom: 12px;
        }

        .tech-card p {
          font-size: 0.95rem;
          color: var(--text-gray);
        }

        @media (max-width: 1024px) {
          .solution-row {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 32px;
          }
          .tech-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .solutions-hero {
            padding: 100px 0 30px 0;
          }
          .solutions-title {
            font-size: clamp(2rem, 8vw, 2.6rem);
          }
          .solutions-subtitle {
            font-size: 1.05rem;
          }
          .solution-row {
            padding: 24px;
          }
          .sol-row-title {
            font-size: 1.5rem;
          }
          .sol-features-block {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
