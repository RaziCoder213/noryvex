import React from 'react';
import { Phone, Cpu, Zap, Shield, CheckCircle2, Terminal, Code, Database } from 'lucide-react';

export default function Solutions({ setActivePage }) {
  const categories = [
    {
      title: "Voice Receptionist Solutions",
      icon: <Phone size={32} className="sol-icon" />,
      highlight: "800ms Latency Response",
      description: "Our high-performance conversational speech engines bypass normal voice response delays, making Noryvex voice receptionists indistinguishable from humans.",
      features: [
        "Dynamic scheduling (integrates directly with Google Calendar/Calendly)",
        "Semantic lead qualification and automatic profiling",
        "CRM data injection (Salesforce, HubSpot, GoHighLevel, etc.)",
        "Configurable accents, speaking speeds, and emotional states",
        "Automated call transfer to human executives for hot leads"
      ]
    },
    {
      title: "Workflow & Business Automation",
      icon: <Zap size={32} className="sol-icon" />,
      highlight: "Save up to 40 Hours/Week",
      description: "We orchestrate multi-step pipelines across your application layers, replacing manual entries with autonomous data synchronizations.",
      features: [
        "Multi-app sync (Make/Zapier workflows, custom Webhook receivers)",
        "AI-assisted document parsing & PDF information extraction",
        "Automated invoice processing and financial reconciliation",
        "Internal Slack/Discord bots mapping company metrics",
        "Daily automated reporting and scraping pipelines"
      ]
    },
    {
      title: "Intelligent Software & SaaS",
      icon: <Cpu size={32} className="sol-icon" />,
      highlight: "Production Ready Code",
      description: "We construct robust React/Next.js/Node web and mobile platforms with pre-configured database layers, ready to handle thousands of concurrent users.",
      features: [
        "Custom administrative panels and metrics trackers",
        "Embedded context-aware AI chatbots inside your apps",
        "Scaleable SQLite/Postgres/MongoDB integrations",
        "Responsive, mobile-optimized UI layouts with high-fidelity styling",
        "Highly secure authentication protocols and JWT handling"
      ]
    }
  ];

  return (
    <div className="solutions-page page-enter">
      <section className="solutions-hero">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Solutions</span>
            <h1 className="solutions-title">Intelligent AI Architectures</h1>
            <p className="solutions-subtitle">High-grade autonomous infrastructure engineered to scale lead pipelines, communications, and workflows.</p>
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
                <button 
                  onClick={() => setActivePage('contact')} 
                  className="btn btn-outline-neon"
                >
                  Deploy this Solution
                </button>
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
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(7,7,8,1) 100%);
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
          background: rgba(255, 255, 255, 0.01);
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
      `}</style>
    </div>
  );
}
