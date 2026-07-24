import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  ArrowRight, Phone, Cpu, Zap, MessageSquare, Globe, Smartphone, 
  Layers, Link2, Database, Shield, CheckCircle2, ChevronRight, ChevronLeft
} from 'lucide-react';
import ParticleCanvas from '../components/ParticleCanvas';

export default function Home({ setActivePage }) {
  const [mousePos, setMousePos]       = useState({ x: 0.5, y: 0.5 });
  const [activeSlide, setActiveSlide] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);
  const heroRef    = useRef(null);
  const sliderRef  = useRef(null);
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

  // Auto-advance slider
  useEffect(() => {
    if (sliderPaused) return;
    const maxSlide = services.length - CARDS_PER_VIEW;
    const t = setInterval(() => {
      setActiveSlide(s => (s >= maxSlide ? 0 : s + 1));
    }, 3000);
    return () => clearInterval(t);
  }, [sliderPaused, services.length]);

  const slideNext = () => setActiveSlide(s => Math.min(s + 1, services.length - CARDS_PER_VIEW));
  const slidePrev = () => setActiveSlide(s => Math.max(s - 1, 0));

  // Parallax deltas from normalised mouse pos
  const px = (mousePos.x - 0.5) * 22;   // -11 to +11px
  const py = (mousePos.y - 0.5) * 14;   // -7  to +7px

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

      {/* ── Featured On / Partners Section ── */}
      <section className="nrx-featured-section">
        <div className="container">
          <div className="featured-header">
            <span className="featured-title">Featured Listings &amp; Global Partners</span>
          </div>
          <div className="featured-logos-wrap">
            <div className="featured-logos-track">
              {/* Set 1 */}
              <div className="featured-logo-item">
                <a href="https://www.superlaun.ch/products/2926" target="_blank" rel="noopener noreferrer">
                  <svg className="partner-svg" viewBox="0 0 160 30" fill="currentColor">
                    <path d="M12 5l-7 12h14l-7-12zM5 22h14v-2H5v2z" fill="var(--accent-neon)" />
                    <text x="28" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">SUPERLAUNCH</text>
                  </svg>
                </a>
              </div>
              <div className="featured-logo-item">
                <a href="https://www.producthunt.com" target="_blank" rel="noopener noreferrer">
                  <svg className="partner-svg" viewBox="0 0 160 30" fill="currentColor">
                    <circle cx="15" cy="15" r="10" fill="#FF5330" />
                    <path d="M13 10h4a2.5 2.5 0 0 1 0 5h-4zm0 7v3h-2V8h6a4.5 4.5 0 0 1 0 9h-4z" fill="#FFF" />
                    <text x="34" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">PRODUCT HUNT</text>
                  </svg>
                </a>
              </div>
              <div className="featured-logo-item">
                <svg className="partner-svg" viewBox="0 0 150 30" fill="currentColor">
                  <rect x="5" y="5" width="20" height="20" rx="3" fill="#F06529" />
                  <text x="11" y="20" fontFamily="var(--font-sans)" fontWeight="800" fontSize="15" fill="#FFF">Y</text>
                  <text x="32" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">COMBINATOR</text>
                </svg>
              </div>
              <div className="featured-logo-item">
                <svg className="partner-svg" viewBox="0 0 120 30" fill="currentColor">
                  <polygon points="5,5 25,5 15,25" fill="#FFF" />
                  <text x="32" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">VERCEL</text>
                </svg>
              </div>
              <div className="featured-logo-item">
                <svg className="partner-svg" viewBox="0 0 130 30" fill="currentColor">
                  <circle cx="15" cy="15" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M12 11h4a2 2 0 0 1 0 4h-4v-4zm0 4h4a2 2 0 0 1 0 4h-4v-4z" />
                  <text x="30" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">BETALIST</text>
                </svg>
              </div>
              <div className="featured-logo-item">
                <svg className="partner-svg" viewBox="0 0 140 30" fill="currentColor">
                  <rect x="5" y="6" width="18" height="18" rx="2" fill="#0288D1" />
                  <circle cx="14" cy="15" r="4" fill="#FFF" />
                  <text x="30" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">CRUNCHBASE</text>
                </svg>
              </div>

              {/* Set 2 (Duplicate for loop) */}
              <div className="featured-logo-item">
                <a href="https://www.superlaun.ch/products/2926" target="_blank" rel="noopener noreferrer">
                  <svg className="partner-svg" viewBox="0 0 160 30" fill="currentColor">
                    <path d="M12 5l-7 12h14l-7-12zM5 22h14v-2H5v2z" fill="var(--accent-neon)" />
                    <text x="28" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">SUPERLAUNCH</text>
                  </svg>
                </a>
              </div>
              <div className="featured-logo-item">
                <a href="https://www.producthunt.com" target="_blank" rel="noopener noreferrer">
                  <svg className="partner-svg" viewBox="0 0 160 30" fill="currentColor">
                    <circle cx="15" cy="15" r="10" fill="#FF5330" />
                    <path d="M13 10h4a2.5 2.5 0 0 1 0 5h-4zm0 7v3h-2V8h6a4.5 4.5 0 0 1 0 9h-4z" fill="#FFF" />
                    <text x="34" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">PRODUCT HUNT</text>
                  </svg>
                </a>
              </div>
              <div className="featured-logo-item">
                <svg className="partner-svg" viewBox="0 0 150 30" fill="currentColor">
                  <rect x="5" y="5" width="20" height="20" rx="3" fill="#F06529" />
                  <text x="11" y="20" fontFamily="var(--font-sans)" fontWeight="800" fontSize="15" fill="#FFF">Y</text>
                  <text x="32" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">COMBINATOR</text>
                </svg>
              </div>
              <div className="featured-logo-item">
                <svg className="partner-svg" viewBox="0 0 120 30" fill="currentColor">
                  <polygon points="5,5 25,5 15,25" fill="#FFF" />
                  <text x="32" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">VERCEL</text>
                </svg>
              </div>
              <div className="featured-logo-item">
                <svg className="partner-svg" viewBox="0 0 130 30" fill="currentColor">
                  <circle cx="15" cy="15" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M12 11h4a2 2 0 0 1 0 4h-4v-4zm0 4h4a2 2 0 0 1 0 4h-4v-4z" />
                  <text x="30" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">BETALIST</text>
                </svg>
              </div>
              <div className="featured-logo-item">
                <svg className="partner-svg" viewBox="0 0 140 30" fill="currentColor">
                  <rect x="5" y="6" width="18" height="18" rx="2" fill="#0288D1" />
                  <circle cx="14" cy="15" r="4" fill="#FFF" />
                  <text x="30" y="20" fontFamily="var(--font-display)" fontWeight="800" fontSize="13" letterSpacing="0.04em">CRUNCHBASE</text>
                </svg>
              </div>
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

      {/* ── Services SLIDER ── */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">Capabilities</span>
            <h2 className="section-title txt-reveal-2">Futuristic Automated Services</h2>
            <p className="section-subtitle txt-blur-in">We design and integrate bespoke AI layers custom-tailored to solve manual workflow friction.</p>
          </div>

          {/* Slider viewport */}
          <div
            className="svc-slider-wrap"
            onMouseEnter={() => setSliderPaused(true)}
            onMouseLeave={() => setSliderPaused(false)}
          >
            {/* Track */}
            <div
              className="svc-slider-track"
              ref={sliderRef}
              style={{ transform: `translateX(calc(-${activeSlide} * (100% / ${CARDS_PER_VIEW}) - ${activeSlide} * 24px))` }}
            >
              {services.map((svc, i) => (
                <div
                  key={i}
                  className={`glass-card service-card svc-slide-card ${i === activeSlide || i === activeSlide+1 || i === activeSlide+2 ? 'in-view' : ''}`}
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

            {/* Prev / Next */}
            <button className="svc-arrow svc-prev" onClick={slidePrev} disabled={activeSlide === 0}>
              <ChevronLeft size={20} />
            </button>
            <button className="svc-arrow svc-next" onClick={slideNext} disabled={activeSlide >= services.length - CARDS_PER_VIEW}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="svc-dots">
            {Array.from({ length: services.length - CARDS_PER_VIEW + 1 }).map((_, i) => (
              <button
                key={i}
                className={`svc-dot ${i === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(i)}
              />
            ))}
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

      {/* ── Big Kinetic Tagline ── */}
      <div className="nrx-kinetic-tagline">
        <div className="nrx-kinetic-inner">
          <span className="nrx-kinetic-line nrx-reveal nrx-kinetic-word">AUTOMATE.</span>
          <span className="nrx-kinetic-line nrx-reveal nrx-kinetic-word" style={{ transitionDelay: '0.1s' }}>COMMUNICATE.</span>
          <span className="nrx-kinetic-line nrx-reveal nrx-kinetic-accent nrx-kinetic-word" style={{ transitionDelay: '0.2s' }}>GROW.</span>
        </div>
        <div className="nrx-kinetic-sub nrx-reveal" style={{ transitionDelay: '0.35s' }}>
          <span>Noryvex</span>
          <span className="nrx-kinetic-dot">·</span>
          <span>AI-Powered Business Automation</span>
          <span className="nrx-kinetic-dot">·</span>
          <span>Built for Scale</span>
        </div>
        <button
          className="btn btn-primary btn-lg nrx-reveal"
          style={{ transitionDelay: '0.45s' }}
          onClick={() => setActivePage('contact')}
        >
          Start Your Journey
        </button>
      </div>

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

        /* ── Services Slider ─────────────────────── */
        .svc-slider-wrap {
          position: relative;
          overflow: hidden;
          padding: 12px 0 24px;
        }
        .svc-slider-track {
          display: flex;
          gap: 24px;
          transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
          will-change: transform;
        }
        .svc-slide-card {
          flex: 0 0 calc((100% - 48px) / 3);
          min-width: 0;
          opacity: 0.45;
          transform: scale(0.97) translateY(10px);
          transition: opacity 0.4s ease, transform 0.4s ease, border-color 0.25s;
        }
        .svc-slide-card.in-view {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .svc-slide-card:hover {
          border-color: rgba(199,255,61,0.3) !important;
          transform: scale(1.02) translateY(-4px) !important;
        }

        /* Arrows */
        .svc-arrow {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 1px solid var(--border-light);
          background: rgba(10,10,14,0.9);
          color: var(--text-white);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10;
          transition: border-color 0.2s, background 0.2s, opacity 0.2s;
        }
        .svc-arrow:hover:not(:disabled) {
          border-color: var(--accent-neon);
          background: rgba(199,255,61,0.08);
        }
        .svc-arrow:disabled { opacity: 0.2; cursor: not-allowed; }
        .svc-prev { left: -22px; }
        .svc-next { right: -22px; }

        /* Dots */
        .svc-dots { display: flex; justify-content: center; gap: 8px; margin-top: 28px; }
        .svc-dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: none; cursor: pointer;
          background: rgba(255,255,255,0.15);
          transition: background 0.25s, transform 0.25s, width 0.25s;
          padding: 0;
        }
        .svc-dot.active {
          background: var(--accent-neon);
          width: 24px; border-radius: 4px;
          box-shadow: 0 0 8px rgba(199,255,61,0.4);
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

        /* ── Kinetic Tagline ────────────────────────────── */
        .nrx-kinetic-tagline {
          padding: 120px 0 140px;
          text-align: center;
          background: linear-gradient(180deg, var(--bg-dark) 0%, #000 100%);
          border-top: 1px solid var(--border-light);
          overflow: hidden;
          position: relative;
        }
        .nrx-kinetic-tagline::before {
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
          margin-bottom: 40px;
        }
        .nrx-kinetic-line {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(2rem, 7.2vw, 8.5rem);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: rgba(255, 255, 255, 0.12);
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.25);
          transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
          text-transform: uppercase;
          user-select: none;
        }
        @media (max-width: 600px) {
          .nrx-kinetic-line {
            font-size: clamp(1.5rem, 8.2vw, 2.8rem) !important;
          }
        }
        .nrx-kinetic-line.nrx-reveal {
          opacity: 0;
          transform: translateY(40px);
        }
        .nrx-kinetic-line.nrx-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .nrx-kinetic-accent {
          background: linear-gradient(135deg, var(--accent-neon) 0%, #fff 60%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          -webkit-text-stroke: 0px transparent;
          color: transparent !important;
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
          margin-bottom: 40px;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
        }
        .nrx-kinetic-sub.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .nrx-kinetic-dot {
          color: var(--accent-neon);
          font-size: 1.2rem;
        }
        .nrx-kinetic-tagline .btn.nrx-reveal {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out), background 0.2s, box-shadow 0.2s;
        }
        .nrx-kinetic-tagline .btn.nrx-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

    </div>
  );
}
