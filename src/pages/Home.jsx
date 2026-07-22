import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, Phone, Cpu, Zap, MessageSquare, Globe, Smartphone, 
  Layers, Link2, Database, Shield, CheckCircle2, ChevronRight 
} from 'lucide-react';
import ParticleCanvas from '../components/ParticleCanvas';

export default function Home({ setActivePage }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  };

  const services = [
    {
      title: "AI Voice Agents",
      desc: "Futuristic human-sounding voice agents capable of conducting outbound campaigns and inbound support with realistic emotional cues.",
      icon: <Phone className="svc-icon" />
    },
    {
      title: "AI Receptionists",
      desc: "Fully autonomous 24/7 receptionists answering calls, qualifying leads, and scheduling appointments directly inside your CRM.",
      icon: <Cpu className="svc-icon" />
    },
    {
      title: "Business Automation",
      desc: "Save hundreds of hours by automating repetitive administrative processes, reporting, and operational tasks.",
      icon: <Zap className="svc-icon" />
    },
    {
      title: "Workflow Automation",
      desc: "Connect your entire software stack and orchestrate multi-step data flows that trigger automatically with zero human effort.",
      icon: <Layers className="svc-icon" />
    },
    {
      title: "AI Chatbots",
      desc: "Conversational agents that understand context, resolve customer concerns, and convert web traffic into booked sales calls.",
      icon: <MessageSquare className="svc-icon" />
    },
    {
      title: "Web Applications",
      desc: "Bespoke web applications built from scratch with modern technology, optimized for lightning performance and security.",
      icon: <Globe className="svc-icon" />
    },
    {
      title: "Mobile Apps",
      desc: "Premium iOS and Android mobile experiences engineered with native fluid feeling, integrated with AI features.",
      icon: <Smartphone className="svc-icon" />
    },
    {
      title: "SaaS Development",
      desc: "End-to-end design and coding of Software-as-a-Service platforms ready for scale, subscription logic, and user onboarding.",
      icon: <Layers className="svc-icon" />
    },
    {
      title: "API Integrations",
      desc: "Harmonize data layers by designing custom API webhooks, linking legacy databases, and enabling real-time communications.",
      icon: <Link2 className="svc-icon" />
    },
    {
      title: "CRM Automation",
      desc: "Synchronize customer leads automatically into platforms like HubSpot, Salesforce, or GoHighLevel with deep custom triggers.",
      icon: <Database className="svc-icon" />
    }
  ];

  const whyNoryvex = [
    {
      title: "Custom-built AI Solutions",
      desc: "No templates or rigid APIs. We design custom AI architectures suited to your unique operations and targets."
    },
    {
      title: "Fast Deployment",
      desc: "Get working automation pipelines live in weeks instead of months, backed by agile sprints and continuous shipping."
    },
    {
      title: "Human-like Conversations",
      desc: "Engineered voice prompts that sound completely natural, utilizing latency optimization below 800ms for smooth dialogues."
    },
    {
      title: "Modern Technology Stack",
      desc: "We leverage state-of-the-art LLMs, vector search, and cloud infrastructure to guarantee reliability and speed."
    },
    {
      title: "Business-focused Automation",
      desc: "We build for ROI. Every automation is designed to reduce overhead, eliminate human error, and boost conversions."
    },
    {
      title: "Long-term Support",
      desc: "We monitor agent performance, update prompt context tables, and scale integrations as your company expands."
    }
  ];

  const processSteps = [
    { num: "01", step: "Discovery", desc: "We deep dive into your business operations to identify bottlenecks and design the ultimate automation strategy." },
    { num: "02", step: "Planning", desc: "Our team structures custom AI architectures, user journeys, API mappings, and prompt parameters." },
    { num: "03", step: "Development", desc: "We code custom interfaces, train voice agents, write database connectors, and test workflows." },
    { num: "04", step: "Deployment", desc: "Launch Noryvex agents into your live customer channels with safe staging and full monitoring setups." },
    { num: "05", step: "Support", desc: "24/7 system health checks, optimization of agent memory, and scaling integrations as needed." }
  ];

  return (
    <div className="home-page page-enter" onMouseMove={handleMouseMove}>
      
      {/* Hero Section */}
      <section className="hero-section">
        <ParticleCanvas />
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-glow"></span>
              <span className="badge-text">NEVER SLEEPS. NEVER SLOWS.</span>
            </div>
            <h1 className="hero-title">
              Your AI Employee <br />
              <span className="text-neon-gradient">That Never Sleeps.</span>
            </h1>
            <p className="hero-subtitle">
              We build AI Voice Agents, Business Automation, and Intelligent Software that answer calls, automate workflows, and help businesses scale exponentially.
            </p>
            <div className="hero-ctas">
              <button 
                onClick={() => setActivePage('contact')} 
                className="btn btn-primary btn-lg"
              >
                Book a Free Strategy Call <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => setActivePage('live-demo')} 
                className="btn btn-secondary btn-lg"
              >
                Try Live Demo
              </button>
            </div>
          </div>
          
          <div className="hero-visualizer-container">
            <div className="visualizer-globe">
              <div className="globe-ring ring-1"></div>
              <div className="globe-ring ring-2"></div>
              <div className="globe-ring ring-3"></div>
              <div className="visualizer-core">
                <img src="/logo.png" alt="Noryvex Core" className="core-logo" />
                <div className="core-pulse"></div>
              </div>
              <div className="floating-node node-1">Voice Agent</div>
              <div className="floating-node node-2">CRM Link</div>
              <div className="floating-node node-3">Auto-Dial</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Capabilities</span>
            <h2 className="section-title">Futuristic Automated Services</h2>
            <p className="section-subtitle">We design and integrate bespoke AI layers custom-tailored to solve manual workflow friction.</p>
          </div>
          
          <div className="services-grid">
            {services.map((svc, i) => (
              <div key={i} className="glass-card service-card">
                <div className="service-icon-wrapper">
                  {svc.icon}
                  <div className="icon-glow"></div>
                </div>
                <h3 className="service-card-title">{svc.title}</h3>
                <p className="service-card-desc">{svc.desc}</p>
                <div className="service-card-footer">
                  <span className="learn-more" onClick={() => setActivePage('solutions')}>
                    Explore Solution <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Noryvex */}
      <section className="why-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Noryvex</span>
            <h2 className="section-title">Engineered For Unmatched ROI</h2>
            <p className="section-subtitle">We replace bloated legacy systems with intelligent autonomous agents designed to close deals.</p>
          </div>

          <div className="why-grid">
            {whyNoryvex.map((item, i) => (
              <div key={i} className="why-card glass-card">
                <div className="why-card-header">
                  <CheckCircle2 className="why-check" />
                  <h3 className="why-card-title">{item.title}</h3>
                </div>
                <p className="why-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Workflow</span>
            <h2 className="section-title">From Concept to Scale</h2>
            <p className="section-subtitle">A highly optimized delivery roadmap engineered to deploy high-grade AI into your stack.</p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"></div>
            {processSteps.map((step, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-node-wrapper">
                  <div className="timeline-node">
                    <span className="node-num">{step.num}</span>
                  </div>
                </div>
                <div className="timeline-content glass-card">
                  <h3 className="timeline-title">{step.step}</h3>
                  <p className="timeline-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* Hero Section Styling */
        .hero-section {
          position: relative;
          padding: 160px 0 100px 0;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(7,7,8,1) 100%);
          min-height: 85vh;
          display: flex;
          align-items: center;
        }
        
        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .hero-content {
          text-align: left;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(199, 255, 61, 0.08);
          border: 1px solid rgba(199, 255, 61, 0.2);
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        
        .badge-glow {
          position: absolute;
          top: 0;
          left: -50%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(199, 255, 61, 0.2), transparent);
          animation: float 3s infinite linear; /* custom shimmer can be used too */
        }
        
        .badge-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-neon);
          letter-spacing: 0.1em;
        }
        
        .hero-title {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 24px;
        }
        
        .text-neon-gradient {
          background: linear-gradient(135deg, var(--accent-neon) 0%, #FFFFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-gray);
          margin-bottom: 40px;
          max-width: 560px;
        }
        
        .hero-ctas {
          display: flex;
          gap: 16px;
        }
        
        /* Hero Visualizer */
        .hero-visualizer-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        
        .visualizer-globe {
          width: 380px;
          height: 380px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .globe-ring {
          position: absolute;
          border: 1px solid rgba(199, 255, 61, 0.1);
          border-radius: 50%;
        }
        
        .ring-1 {
          width: 100%;
          height: 100%;
          border-style: dashed;
          animation: spin-slow 25s infinite linear;
        }
        
        .ring-2 {
          width: 80%;
          height: 80%;
          border-color: rgba(199, 255, 61, 0.15);
          animation: spin-slow 15s infinite linear reverse;
        }
        
        .ring-3 {
          width: 60%;
          height: 60%;
          border-style: double;
          animation: spin-slow 8s infinite linear;
        }
        
        .visualizer-core {
          width: 120px;
          height: 120px;
          background: var(--bg-charcoal);
          border: 1px solid var(--accent-neon-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          box-shadow: 0 0 40px rgba(199, 255, 61, 0.15);
        }
        
        .core-logo {
          width: 64px;
          height: 64px;
          object-fit: contain;
          z-index: 3;
        }
        
        .core-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--accent-neon);
          opacity: 0.1;
          z-index: 1;
          animation: pulse-neon 2.5s infinite ease-out;
        }
        
        .floating-node {
          position: absolute;
          background: rgba(18, 18, 21, 0.85);
          border: 1px solid var(--border-light);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-white);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          animation: float 4s infinite ease-in-out;
        }
        
        .node-1 { top: 15%; left: 10%; animation-delay: 0s; border-color: var(--accent-neon-border); }
        .node-2 { bottom: 20%; right: 5%; animation-delay: 1.5s; }
        .node-3 { bottom: 10%; left: 20%; animation-delay: 0.7s; }

        /* Services Grid Styling */
        .services-section {
          padding: 100px 0;
          background-color: var(--bg-dark);
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        
        .service-card {
          text-align: left;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .service-icon-wrapper {
          width: 52px;
          height: 52px;
          background: rgba(199, 255, 61, 0.08);
          border: 1px solid var(--accent-neon-border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
          color: var(--accent-neon);
        }
        
        .icon-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--accent-neon);
          opacity: 0.15;
          filter: blur(10px);
          border-radius: 12px;
        }
        
        .svc-icon {
          width: 24px;
          height: 24px;
          position: relative;
          z-index: 1;
        }
        
        .service-card-title {
          font-size: 1.35rem;
          margin-bottom: 12px;
        }
        
        .service-card-desc {
          font-size: 0.95rem;
          color: var(--text-gray);
          margin-bottom: 24px;
          flex-grow: 1;
        }
        
        .service-card-footer {
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 16px;
        }
        
        .learn-more {
          color: var(--accent-neon);
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .learn-more:hover {
          gap: 8px;
        }

        /* Why Noryvex Section */
        .why-section {
          padding: 100px 0;
          background-color: var(--bg-pure);
        }
        
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        
        .why-card {
          text-align: left;
        }
        
        .why-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .why-check {
          color: var(--accent-neon);
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }
        
        .why-card-title {
          font-size: 1.2rem;
          color: var(--text-white);
        }
        
        .why-card-desc {
          font-size: 0.95rem;
          color: var(--text-gray);
        }

        /* Process Section */
        .process-section {
          padding: 100px 0 140px 0;
          background-color: var(--bg-dark);
        }
        
        .timeline-container {
          position: relative;
          max-width: 900px;
          margin: 64px auto 0 auto;
          padding-left: 80px;
        }
        
        .timeline-line {
          position: absolute;
          left: 110px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, var(--accent-neon) 0%, rgba(199, 255, 61, 0.1) 100%);
          z-index: 1;
        }
        
        .timeline-item {
          display: flex;
          margin-bottom: 48px;
          position: relative;
          z-index: 2;
        }
        
        .timeline-item:last-child {
          margin-bottom: 0;
        }
        
        .timeline-node-wrapper {
          width: 60px;
          display: flex;
          justify-content: center;
          margin-right: 40px;
        }
        
        .timeline-node {
          width: 44px;
          height: 44px;
          background: var(--bg-charcoal);
          border: 2px solid var(--accent-neon);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px var(--accent-neon-glow);
        }
        
        .node-num {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--accent-neon);
        }
        
        .timeline-content {
          flex-grow: 1;
          text-align: left;
          padding: 24px 32px;
        }
        
        .timeline-title {
          font-size: 1.35rem;
          margin-bottom: 8px;
        }
        
        .timeline-desc {
          font-size: 0.95rem;
        }

        /* Responsive Layouts */
        @media (max-width: 1200px) {
          .services-grid, .why-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-content {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-title {
            font-size: 3rem;
          }
          .hero-visualizer-container {
            margin-top: 40px;
          }
        }
        
        @media (max-width: 768px) {
          .services-grid, .why-grid {
            grid-template-columns: 1fr;
          }
          .timeline-container {
            padding-left: 20px;
          }
          .timeline-line {
            left: 42px;
          }
          .timeline-node-wrapper {
            margin-right: 20px;
          }
          .hero-ctas {
            flex-direction: column;
            width: 100%;
          }
          .btn-lg {
            width: 100%;
          }
          .visualizer-globe {
            width: 280px;
            height: 280px;
          }
          .visualizer-core {
            width: 90px;
            height: 90px;
          }
          .core-logo {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </div>
  );
}
