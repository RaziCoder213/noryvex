import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  ArrowRight, Phone, Cpu, Zap, MessageSquare, Globe, Smartphone, 
  Layers, Link2, Database, Shield, CheckCircle2, ChevronRight, ChevronLeft
} from 'lucide-react';
import ParticleCanvas from '../components/ParticleCanvas';

export default function Home({ setActivePage }) {
  const [mousePos, setMousePos]       = useState({ x: 0.5, y: 0.5 });
  const [translateX, setTranslateX] = useState(0);
  const [taglineProgress, setTaglineProgress] = useState(0);
  const heroRef    = useRef(null);
  const sliderRef  = useRef(null);
  const servicesSectionRef = useRef(null);
  const taglineSectionRef = useRef(null);
  const CARDS_PER_VIEW = 3;

  // Mouse parallax for hero (normalised 0–1)
  const handleMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    });
  }, []);

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

  // Scroll-driven horizontal translation with sticky pinning for the capabilities track
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        setTranslateX(0);
        return;
      }
      const parent = servicesSectionRef.current;
      const track = sliderRef.current;
      if (!parent || !track) return;
      
      const rect = parent.getBoundingClientRect();
      const winHeight = window.innerHeight;
      
      // Calculate how far we have scrolled within the sticky parent container
      // offset by 100px due to sticky offset below navbar
      const totalDist = rect.height - (winHeight - 100);
      const scrolled = -rect.top;
      const pct = Math.max(0, Math.min(1, scrolled / totalDist));
      
      // Calculate the maximum horizontal translation needed to see all cards
      // Math.max(0, ...) handles zoomed-out browser margins (minus page percentages)
      const maxScroll = Math.max(0, track.scrollWidth - parent.clientWidth);
      setTranslateX(pct * maxScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Scroll-driven tagline word-by-word reveal progress
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        setTaglineProgress(1.0);
        return;
      }
      const parent = taglineSectionRef.current;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      const winHeight = window.innerHeight;
      
      const totalDist = rect.height - winHeight;
      const scrolled = -rect.top;
      const pct = Math.max(0, Math.min(1, scrolled / totalDist));
      setTaglineProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Parallax deltas from normalised mouse pos
  const px = (mousePos.x - 0.5) * 22;   // -11 to +11px
  const py = (mousePos.y - 0.5) * 14;   // -7  to +7px

  const fadeOutFactor = taglineProgress > 0.78 ? Math.max(0.15, 1 - (taglineProgress - 0.78) * 5) : 1.0;

  return (
    <div className="home-page page-enter">

      {/* Hero Section */}
      <section className="hero-section" ref={heroRef} onMouseMove={handleMouseMove}>
        <ParticleCanvas />
        {/* Mouse-tracking ambient glow */}
        <div className="hero-mouse-glow" style={{
          left: `${mousePos.x * 100}%`,
          top:  `${mousePos.y * 100}%`,
        }} />
        <div className="container hero-container">
          {/* Content tilts slightly against mouse */}
          <div
            className="hero-content"
            style={{ transform: `translate(${-px * 0.3}px, ${-py * 0.3}px)` }}
          >
            <div className="hero-badge txt-slide">
              <span className="badge-glow"></span>
              <span className="badge-text">NEVER SLEEPS. NEVER SLOWS.</span>
            </div>
            <h1 className="hero-title txt-reveal">
              Your AI Employee <br />
              <span className="text-neon-gradient txt-gradient-animate">That Never Sleeps.</span>
            </h1>
            <p className="hero-subtitle txt-blur-in">
              Noryvex is a leading AI Automation Agency. We build custom AI Voice Calling Agents, Autonomous Receptionist AI systems, and Intelligent Software that answer calls, automate workflows, and help businesses scale exponentially.
            </p>
            <div className="hero-ctas">
              <button onClick={() => setActivePage('contact')} className="btn btn-primary btn-lg">
                Book a Free Strategy Call <ArrowRight size={18} />
              </button>
              <button onClick={() => setActivePage('live-demo')} className="btn btn-secondary btn-lg">
                Try Live Demo
              </button>
            </div>
            <div className="hero-featured-badges nrx-reveal" style={{ transitionDelay: '0.15s' }}>
              <a href="https://www.superlaun.ch/products/2926" target="_blank" rel="noopener noreferrer">
                <img src="https://www.superlaun.ch/badge.png" alt="Featured on Super Launch" className="featured-badge-img" />
              </a>
              <a href="https://twelve.tools" target="_blank" rel="noopener noreferrer">
                <img src="https://twelve.tools/badge3-dark.svg" alt="Featured on Twelve Tools" className="featured-badge-img" />
              </a>
              <a href="https://wired.business" target="_blank" rel="noopener noreferrer">
                <img src="https://wired.business/badge3-dark.svg" alt="Featured on Wired Business" className="featured-badge-img" />
              </a>
            </div>
          </div>

          {/* Globe tilts with mouse — stronger parallax */}
          <div
            className="hero-visualizer-container"
            style={{ transform: `translate(${px * 0.6}px, ${py * 0.6}px)` }}
          >
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



      {/* ── Marquee ── */}
      <div className="nrx-marquee-section" aria-hidden="true">
        <div className="nrx-marquee-track">
          {[
            'AI Voice Agents','Business Automation','CRM Integration',
            'Workflow Automation','AI Chatbots','SaaS Development',
            'API Integrations','Mobile Apps','Web Applications','24/7 Support',
            'AI Voice Agents','Business Automation','CRM Integration',
            'Workflow Automation','AI Chatbots','SaaS Development',
            'API Integrations','Mobile Apps','Web Applications','24/7 Support',
          ].map((item, i) => (
            <span className="nrx-marquee-item" key={i}>
              <span className="nrx-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Services STICKY SCROLL SECTION ── */}
      <section className="services-sticky-parent" ref={servicesSectionRef}>
        <div className="services-sticky-wrapper">
          <div className="container">
            <div className="section-header">
              <span className="section-tag txt-slide">Capabilities</span>
              <h2 className="section-title txt-reveal-2">Futuristic Automated Services</h2>
              <p className="section-subtitle txt-blur-in">We design and integrate bespoke AI layers custom-tailored to solve manual workflow friction.</p>
            </div>

            {/* Slider viewport */}
            <div className="svc-slider-wrap">
              {/* Track - translated horizontally on page scroll */}
              <div
                className="svc-slider-track"
                ref={sliderRef}
                style={{ transform: `translateX(-${translateX}px)` }}
              >
                {services.map((svc, i) => (
                  <div
                    key={i}
                    className="glass-card service-card svc-slide-card in-view"
                  >
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
          </div>
        </div>
      </section>

      {/* Why Noryvex */}
      <section className="why-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">Why Noryvex</span>
            <h2 className="section-title txt-reveal-2">Engineered For Unmatched ROI</h2>
            <p className="section-subtitle txt-blur-in">We replace bloated legacy systems with intelligent autonomous agents designed to close deals.</p>
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

      {/* ── Tech Stack Section ── */}
      <section className="nrx-tech-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">The Technology Engine</span>
            <h2 className="section-title txt-reveal-2">Futuristic Voice &amp; Automation Stack</h2>
            <p className="section-subtitle txt-blur-in">We integrate world-class AI models, speech synthesis, and custom backend APIs to power your receptionist.</p>
          </div>
          
          <div className="tech-stack-grid">
            <div className="tech-group glass-card nrx-reveal">
              <span className="group-label">Conversational AI Voice</span>
              <div className="tech-logos-row">
                <div className="tech-badge-item">
                  <span className="tech-badge-dot"></span>
                  <strong>Vapi</strong>
                </div>
                <div className="tech-badge-item">
                  <span className="tech-badge-dot"></span>
                  <strong>Retell AI</strong>
                </div>
              </div>
              <p className="group-desc">Custom latency-optimized speech pipelines bypassing normal voice response lag under 800ms.</p>
            </div>

            <div className="tech-group glass-card nrx-reveal" style={{ transitionDelay: '0.1s' }}>
              <span className="group-label">Realistic Speech Synthesis</span>
              <div className="tech-logos-row">
                <div className="tech-badge-item">
                  <span className="tech-badge-dot"></span>
                  <strong>ElevenLabs</strong>
                </div>
                <div className="tech-badge-item">
                  <span className="tech-badge-dot"></span>
                  <strong>Play.ht</strong>
                </div>
              </div>
              <p className="group-desc">Human-sounding speech engines with custom accents, native dialects, and realistic emotional cues.</p>
            </div>

            <div className="tech-group glass-card nrx-reveal" style={{ transitionDelay: '0.2s' }}>
              <span className="group-label">Intelligence Engines</span>
              <div className="tech-logos-row">
                <div className="tech-badge-item">
                  <span className="tech-badge-dot"></span>
                  <strong>OpenAI GPT-4o</strong>
                </div>
                <div className="tech-badge-item">
                  <span className="tech-badge-dot"></span>
                  <strong>Claude 3.5 Sonnet</strong>
                </div>
              </div>
              <p className="group-desc">Deep semantic understanding for lead qualification, customer profile mapping, and CRM entries.</p>
            </div>

            <div className="tech-group glass-card nrx-reveal" style={{ transitionDelay: '0.3s' }}>
              <span className="group-label">Backend &amp; Databases</span>
              <div className="tech-logos-row">
                <div className="tech-badge-item">
                  <span className="tech-badge-dot"></span>
                  <strong>Next.js / Node</strong>
                </div>
                <div className="tech-badge-item">
                  <span className="tech-badge-dot"></span>
                  <strong>Pinecone / PG</strong>
                </div>
              </div>
              <p className="group-desc">Secure, high-volume server platforms with pre-configured vector databases and API integrations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">Our Workflow</span>
            <h2 className="section-title txt-reveal-2">From Concept to Scale</h2>
            <p className="section-subtitle txt-blur-in">A highly optimized delivery roadmap engineered to deploy high-grade AI into your stack.</p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"><div className="timeline-line-fill"></div></div>
            {processSteps.map((step, i) => (
              <div key={i} className="timeline-item nrx-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
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

      {/* ── Big Kinetic Tagline (Sticky Pin & Scroll Reveal) ── */}
      <section className="nrx-tagline-sticky-parent" ref={taglineSectionRef}>
        <div className="nrx-tagline-sticky-wrapper">
          <div className="nrx-kinetic-inner">
            <span 
              className={`nrx-kinetic-line nrx-kinetic-word ${taglineProgress > 0.15 ? 'active' : ''}`}
              style={{ 
                opacity: taglineProgress >= 0.95 ? 0.15 : Math.max(0.1, Math.min(1.0, (taglineProgress - 0.05) * 5)) * fadeOutFactor,
                transform: taglineProgress >= 0.95 ? 'none' : `scale(${Math.max(0.95, Math.min(1.0, 0.95 + (taglineProgress - 0.05) * 0.25))})`
              }}
            >
              AUTOMATE.
            </span>
            <span 
              className={`nrx-kinetic-line nrx-kinetic-word ${taglineProgress > 0.45 ? 'active' : ''}`}
              style={{ 
                opacity: taglineProgress >= 0.95 ? 0.15 : Math.max(0.1, Math.min(1.0, (taglineProgress - 0.35) * 5)) * fadeOutFactor,
                transform: taglineProgress >= 0.95 ? 'none' : `scale(${Math.max(0.95, Math.min(1.0, 0.95 + (taglineProgress - 0.35) * 0.25))})`
              }}
            >
              COMMUNICATE.
            </span>
            <span 
              className={`nrx-kinetic-line nrx-kinetic-word nrx-kinetic-accent ${taglineProgress > 0.75 ? 'active' : ''}`}
              style={{ 
                opacity: taglineProgress >= 0.95 ? 0.15 : Math.max(0.1, Math.min(1.0, (taglineProgress - 0.65) * 5)) * fadeOutFactor,
                transform: taglineProgress >= 0.95 ? 'none' : `scale(${Math.max(0.95, Math.min(1.0, 0.95 + (taglineProgress - 0.65) * 0.25))})`
              }}
            >
              GROW.
            </span>
          </div>

          <div 
            className="nrx-kinetic-sub" 
            style={{ 
              opacity: taglineProgress >= 0.95 ? 1.0 : Math.max(0, Math.min(1, (taglineProgress - 0.85) * 8)),
              transform: taglineProgress >= 0.95 ? 'none' : `translateY(${Math.max(0, 15 - (taglineProgress - 0.85) * 120)}px)`
            }}
          >
            <span>Noryvex</span>
            <span className="nrx-kinetic-dot">·</span>
            <span>AI-Powered Business Automation</span>
            <span className="nrx-kinetic-dot">·</span>
            <span>Built for Scale</span>
          </div>

          <div 
            className="nrx-tagline-btn-wrap"
            style={{ 
              opacity: taglineProgress >= 0.95 ? 1.0 : Math.max(0, Math.min(1, (taglineProgress - 0.88) * 8)),
              transform: taglineProgress >= 0.95 ? 'none' : `translateY(${Math.max(0, 15 - (taglineProgress - 0.88) * 120)}px)`
            }}
          >
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setActivePage('contact')}
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero mouse-follow glow */
        .hero-mouse-glow {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(199,255,61,0.07) 0%, transparent 65%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
          transition: left 0.12s ease, top 0.12s ease;
        }
        .hero-content, .hero-visualizer-container {
          will-change: transform;
          transition: transform 0.1s linear;
        }

        /* ── Services Sticky Scroll ──────────────── */
        .services-sticky-parent {
          position: relative;
          height: 250vh; /* scrollable distance for the pinning effect */
          background-color: var(--bg-pure);
          border-top: 1px solid var(--border-light);
          margin-top: 80px; /* Generous top margin to prevent overlapping hero/marquee */
          padding-top: 40px;
          z-index: 5;
        }
        .services-sticky-wrapper {
          position: sticky;
          top: 100px; /* align below the 80px navbar with 20px clearance */
          height: calc(100vh - 100px); /* remaining viewport height */
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          padding-top: 10px;
        }
        .svc-slider-wrap {
          position: relative;
          overflow: visible; /* let cards scale and hover extend nicely */
          padding: 30px 0;
          width: 100%;
        }
        .svc-slider-track {
          display: flex;
          gap: 28px;
          transition: transform 0.1s ease-out;
          will-change: transform;
          width: max-content;
        }
        .svc-slide-card {
          width: 360px;
          flex-shrink: 0;
          opacity: 0.85;
          transform: scale(0.98);
          transition: opacity 0.3s, transform 0.3s, border-color 0.25s;
        }
        .svc-slide-card:hover {
          opacity: 1;
          border-color: rgba(199,255,61,0.35) !important;
          transform: scale(1.02) translateY(-4px) !important;
        }

        @media (max-width: 768px) {
          .services-sticky-parent {
            height: auto !important;
            margin-top: 40px !important;
            padding-top: 0 !important;
          }
          .services-sticky-wrapper {
            position: relative !important;
            height: auto !important;
            padding: 60px 0 !important;
            top: 0 !important;
          }
          .svc-slider-wrap {
            overflow-x: auto;
            padding-bottom: 12px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Hide scrollbar Firefox */
          }
          .svc-slider-wrap::-webkit-scrollbar {
            display: none; /* Hide scrollbar Chrome/Safari */
          }
          .svc-slider-track {
            transform: none !important;
            padding: 0 24px; /* offset alignment on swipe */
          }
          .svc-slide-card {
            width: 280px !important;
            max-width: 85vw !important; /* visual hint showing next card */
          }
        }

        /* ── Kinetic tagline hover per word ─────── */
        .nrx-kinetic-word {
          cursor: default;
          transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out),
                      letter-spacing 0.35s ease, text-shadow 0.35s ease,
                      color 0.35s ease, -webkit-text-stroke-color 0.35s ease;
        }
        .nrx-kinetic-word:hover {
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.85) !important;
          -webkit-text-stroke-color: rgba(255, 255, 255, 0.85) !important;
          text-shadow: 0 0 60px rgba(199,255,61,0.2), 0 0 120px rgba(199,255,61,0.08);
        }
        .nrx-kinetic-accent.nrx-kinetic-word:hover {
          filter: brightness(1.15);
          letter-spacing: 0.04em;
        }
        .hero-section {
          position: relative;
          padding: 80px 0 80px 0; /* reduced top spacing from header */
          overflow: hidden;
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(7,7,8,1) 100%);
          min-height: 75vh;
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
          display: none;
        }
        
        .badge-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-neon);
          letter-spacing: 0.1em;
        }
        
        .hero-title {
          font-size: 4.2rem;
          line-height: 1.05;
          margin-bottom: 24px;
          letter-spacing: -0.035em;
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
          margin-bottom: 24px;
        }
        .hero-featured-badges {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        @media (max-width: 1024px) {
          .hero-featured-badges {
            justify-content: center;
          }
        }
        .featured-badge-img {
          height: 44px;
          width: auto;
          opacity: 0.85;
          filter: drop-shadow(0 0 15px rgba(199, 255, 61, 0.08));
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .featured-badge-img:hover {
          opacity: 1;
          transform: translateY(-2px) scale(1.02);
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
          width: 100%; height: 100%;
          border-style: dashed;
        }
        
        .ring-2 {
          width: 80%; height: 80%;
          border-color: rgba(199, 255, 61, 0.15);
        }
        
        .ring-3 {
          width: 60%; height: 60%;
          border-style: double;
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
          width: 100%; height: 100%;
          border-radius: 50%;
          background: var(--accent-neon);
          opacity: 0.06;
          z-index: 1;
        }
        
        .floating-node {
          position: absolute;
          background: rgba(18, 18, 21, 0.95);
          border: 1px solid var(--border-light);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-white);
        }
        
        .node-1 { top: 15%; left: 10%; border-color: var(--accent-neon-border); }
        .node-2 { bottom: 20%; right: 5%; }
        .node-3 { bottom: 10%; left: 20%; }

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
          display: none;
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
          /* Tablet: show 2 cards */
          .svc-slide-card {
            flex: 0 0 calc((100% - 24px) / 2);
          }
          .svc-prev { left: -16px; }
          .svc-next { right: -16px; }
        }

        @media (max-width: 640px) {
          /* Mobile: show 1 card */
          .svc-slide-card {
            flex: 0 0 100%;
          }
          .svc-prev { left: 0; }
          .svc-next { right: 0; }
          .svc-slider-wrap { padding: 12px 36px 24px; }
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

        /* ── Timeline scroll reveal ─────────────────────── */
        .timeline-line {
          position: absolute;
          left: 24px;
          top: 0; bottom: 0;
          width: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }
        .timeline-line-fill {
          width: 100%;
          height: 0%;
          background: linear-gradient(to bottom, var(--accent-neon), rgba(199,255,61,0.3));
          transition: height 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 2px;
        }

        /* Timeline items slide in from left on scroll */
        .timeline-item.nrx-reveal {
          opacity: 0;
          transform: translateX(-28px);
          transition: opacity 0.55s var(--ease-out), transform 0.55s var(--ease-out);
        }
        .timeline-item.nrx-reveal.visible {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── Kinetic Tagline Sticky Scroll ──────────────── */
        .nrx-tagline-sticky-parent {
          position: relative;
          height: 200vh; /* scrollable distance for locking */
          background: linear-gradient(180deg, var(--bg-dark) 0%, #000 100%);
          border-top: 1px solid var(--border-light);
        }
        .nrx-tagline-sticky-wrapper {
          position: sticky;
          top: 80px; /* align below the 80px navbar */
          height: calc(100vh - 80px); /* remaining viewport height */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
        }
        .nrx-tagline-sticky-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 100%, rgba(199,255,61,0.05) 0%, transparent 65%);
          pointer-events: none;
        }
        .nrx-kinetic-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          margin-bottom: 30px;
          z-index: 1;
        }
        .nrx-kinetic-line {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(2rem, 7.2vw, 8.5rem);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: rgba(255, 255, 255, 0.1);
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          user-select: none;
          transition: opacity 0.15s ease-out, transform 0.15s ease-out, text-shadow 0.3s ease;
          will-change: opacity, transform;
        }
        @media (max-width: 600px) {
          .nrx-kinetic-line {
            font-size: clamp(1.5rem, 8.2vw, 2.8rem) !important;
          }
          .hero-title {
            font-size: clamp(2rem, 9vw, 2.4rem) !important;
            line-height: 1.15;
          }
          .hero-subtitle {
            font-size: 1.05rem !important;
            margin-bottom: 30px;
          }
          .timeline-container {
            padding-left: 12px;
          }
          .timeline-content {
            padding: 16px 20px;
          }
        }
        .nrx-kinetic-line.active {
          color: rgba(255, 255, 255, 0.95);
          -webkit-text-stroke: 0px transparent;
          text-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
        }
        .nrx-kinetic-accent {
          background: linear-gradient(135deg, var(--accent-neon) 0%, #fff 60%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          -webkit-text-stroke: 0px transparent;
          color: transparent !important;
        }
        .nrx-kinetic-accent.active {
          text-shadow: 0 0 50px rgba(199, 255, 61, 0.4);
        }
        .nrx-kinetic-sub {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 24px;
          flex-wrap: wrap;
          justify-content: center;
          z-index: 1;
          transition: opacity 0.2s ease-out, transform 0.2s ease-out;
          will-change: opacity, transform;
        }
        .nrx-kinetic-dot {
          color: var(--accent-neon);
          font-size: 1.2rem;
        }
        .nrx-tagline-btn-wrap {
          z-index: 1;
          transition: opacity 0.2s ease-out, transform 0.2s ease-out;
          will-change: opacity, transform;
        }

        @media (max-width: 768px) {
          .nrx-tagline-sticky-parent {
            height: auto !important;
            padding: 100px 0;
          }
          .nrx-tagline-sticky-wrapper {
            position: relative !important;
            height: auto !important;
          }
          .nrx-kinetic-line {
            opacity: 1 !important;
            transform: none !important;
            color: rgba(255, 255, 255, 0.95);
            -webkit-text-stroke: 0px transparent;
          }
          .nrx-kinetic-accent {
            color: transparent !important;
          }
          .nrx-kinetic-sub {
            opacity: 1 !important;
            transform: none !important;
            margin-top: 24px;
          }
          .nrx-tagline-btn-wrap {
            opacity: 1 !important;
            transform: none !important;
            margin-top: 16px;
          }
        }

        /* ── Tech Section ──────────────────────── */
        .nrx-tech-section {
          padding: 100px 0;
          background-color: var(--bg-pure);
          border-top: 1px solid var(--border-light);
        }
        .tech-stack-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-top: 48px;
        }
        @media (max-width: 768px) {
          .tech-stack-grid {
            grid-template-columns: 1fr;
          }
        }
        .tech-group {
          padding: 32px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .group-label {
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--accent-neon);
          text-transform: uppercase;
        }
        .tech-logos-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .tech-badge-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          padding: 8px 18px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-white);
        }
        .tech-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-neon);
          box-shadow: 0 0 6px var(--accent-neon);
        }
        .group-desc {
          font-size: 0.95rem;
          color: var(--text-gray);
          line-height: 1.5;
        }
      `}</style>

    </div>
  );
}
