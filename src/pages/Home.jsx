import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  ArrowRight, Phone, Cpu, Zap, MessageSquare, Globe, Smartphone, 
  Layers, Link2, Database, Shield, CheckCircle2, ChevronRight, ChevronLeft,
  Volume2, FileText, Users, Calendar, BarChart2, Clock, HelpCircle, UserPlus
} from 'lucide-react';
import ParticleCanvas from '../components/ParticleCanvas';
import { dbGetPartners, dbGetFaqs } from '../utils/dbHelper';

export default function Home({ setActivePage }) {
  const [mousePos, setMousePos]       = useState({ x: 0.5, y: 0.5 });
  const [translateX, setTranslateX] = useState(0);
  const [taglineProgress, setTaglineProgress] = useState(0);
  const [partners, setPartners] = useState([]);
  const [faqs, setFaqs] = useState([
    { question: 'Will my patients know they\'re talking to an AI?', answer: 'Modern voice AI is indistinguishable from a human receptionist for routine calls. Noryvex builds custom voice models with natural speech patterns, appropriate pauses, and context-aware responses. That said, we follow best practices — the AI will never claim to be human if a patient directly asks.' },
    { question: 'How long does setup take?', answer: 'Our standard turnaround is 48 hours from kickoff call to live deployment. We handle everything: voice prompt scripting, FAQ training, calendar integration, and sandbox testing. All you need to do is forward calls to the number we provision.' },
    { question: 'Do we need to change our existing phone number?', answer: 'No. We provision a secondary number that receives forwarded calls. Your clinic\'s published phone number stays exactly the same — patients call the same number they always have; the AI handles it behind the scenes.' },
    { question: 'What happens during a dental emergency?', answer: 'The AI is trained to recognize emergency language and immediately escalates those calls to your on-call staff or emergency line. You define the escalation logic during setup — we configure it exactly the way you\'d want your human receptionist to handle it.' },
    { question: 'Is Noryvex HIPAA compliant?', answer: 'Yes. We sign a Business Associate Agreement (BAA) with every client, use US-based encrypted call infrastructure, and process all patient data in compliance with HIPAA regulations. Ask us for a copy of our BAA during your demo call.' },
    { question: 'What if a patient asks something the AI doesn\'t know?', answer: 'The AI acknowledges the question politely, takes a message, and flags it for follow-up by your team. You can expand the FAQ training at any time — just send us updated information and we\'ll retrain within 24 hours at no extra charge.' },
    { question: 'What does Noryvex cost?', answer: 'Pricing is based on call volume and the features your practice needs. We\'re transparent about costs — book a free 30-minute strategy call and we\'ll give you a custom quote with no pressure and no hidden fees.' },
    { question: 'Can I try it before I pay anything?', answer: 'Yes. We build a short custom AI demo for your clinic — using your real services, hours, and FAQs — completely free. If you like what you hear, we deploy the full system. If not, there\'s no obligation and no charge.' },
  ]);
  const heroRef    = useRef(null);
  const sliderRef  = useRef(null);
  const servicesSectionRef = useRef(null);
  const taglineSectionRef = useRef(null);
  const CARDS_PER_VIEW = 3;

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await dbGetPartners();
        setPartners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load partners:', err);
        setPartners([]);
      }
    };
    loadPartners();
  }, []);

  // Load FAQs from DB (falls back to default state if API unreachable)
  useEffect(() => {
    dbGetFaqs().then(data => {
      if (Array.isArray(data) && data.length > 0) setFaqs(data);
    }).catch(() => {});
  }, []);

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
      title: "New patient calls",
      desc: "Answers questions, captures patient details, and sends appointment requests to your team.",
      icon: <UserPlus className="svc-icon" />
    },
    {
      title: "Appointment requests",
      desc: "Collects preferred date, time, reason for visit, and contact details so your staff can confirm.",
      icon: <Calendar className="svc-icon" />
    },
    {
      title: "FAQs and clinic info",
      desc: "Handles opening hours, location, services, pricing guidance, insurance basics, and common questions.",
      icon: <HelpCircle className="svc-icon" />
    },
    {
      title: "Missed and after-hours calls",
      desc: "Covers calls when your front desk is busy, closed, or unavailable.",
      icon: <Phone className="svc-icon" />
    },
    {
      title: "Call summaries",
      desc: "Every call can include a transcript, recording, summary, caller details, and next action.",
      icon: <FileText className="svc-icon" />
    },
    {
      title: "CRM or email handoff",
      desc: "We send details to your email, dashboard, Google Sheet, calendar, CRM, or workflow tool when possible.",
      icon: <Link2 className="svc-icon" />
    }
  ];

  const whyNoryvex = [
    {
      title: "Live in 48 hours",
      desc: "Your AI receptionist can start answering patient calls and booking appointments quickly, with zero downtime."
    },
    {
      title: "Built for your clinic",
      desc: "We train the agent specifically on your treatments, hours, location, pricing, insurance notes, and booking rules."
    },
    {
      title: "No software to learn",
      desc: "Muhammad Razi and the Noryvex team set up, integrate, and manage everything for you end-to-end."
    },
    {
      title: "24/7 call coverage",
      desc: "Capture patient calls after-hours, during lunch breaks, and when your front-desk staff are busy."
    },
    {
      title: "Simple dashboard",
      desc: "Track everything in one place: call history, voice recordings, conversation transcripts, new leads, and booked appointments."
    },
    {
      title: "Pay only when you launch",
      desc: "We build your custom clinic demo for free. You only pay when you decide to launch the full integrated system."
    }
  ];

  const processSteps = [
    { num: "01", step: "Book a demo call", desc: "We discuss your clinic, call volume, services, FAQs, and booking process." },
    { num: "02", step: "We build your demo", desc: "We create a short AI receptionist demo using your clinic details." },
    { num: "03", step: "You test the demo", desc: "You call it, listen to it, and tell us what should change." },
    { num: "04", step: "Approve and launch", desc: "If you like it, we set up the full system with call routing, dashboard, and notifications." },
    { num: "05", step: "We manage it monthly", desc: "We monitor calls, update FAQs, improve responses, and support your clinic." }
  ];

  const portfolioItems = [
    {
      clinic: "Dr. Mitchell's Practice",
      type: "General Dentistry",
      location: "TX",
      accentColor: "#6366f1",
      stats: [
        { label: "Calls Answered / Mo", value: "340+" },
        { label: "New Bookings via AI", value: "28" },
        { label: "Est. Revenue Recovered", value: "$14,200" }
      ],
      highlight: "Eliminated missed-call backlog. Captures every inbound call 24/7.",
      result: "This single-location general dental practice was missing 30–40 calls monthly during peak hours. After deploying Noryvex, every inbound call is answered instantly and new patient details are delivered directly to the team."
    },
    {
      clinic: "Dr. Vasquez's Practice",
      type: "Orthodontics Practice",
      location: "FL",
      accentColor: "#10b981",
      stats: [
        { label: "FAQ Calls Resolved", value: "95%" },
        { label: "Staff Call Load Reduced", value: "60%" },
        { label: "Patient Satisfaction", value: "5.0 ★" }
      ],
      highlight: "Freed staff from repetitive questions about Invisalign, retainers & pricing.",
      result: "The practice was fielding the same Invisalign, braces, and retainer protocol questions dozens of times daily. The AI resolved 95% of standard FAQ calls, letting clinical staff stay focused entirely on in-office patients."
    },
    {
      clinic: "Dr. Okonkwo's Practice",
      type: "Multi-Location Practice",
      location: "IL",
      accentColor: "#f59e0b",
      stats: [
        { label: "After-Hours Leads Captured", value: "63" },
        { label: "Avg. Call Handle Time", value: "< 90s" },
        { label: "Deployment Time", value: "48 hrs" }
      ],
      highlight: "3 locations live in 48 hours — 63 after-hours leads in first month.",
      result: "This multi-location group needed unified AI call coverage across 3 clinic locations. Noryvex deployed a single AI receptionist handling all locations within the promised 48-hour window, capturing 63 new patient leads after-hours in month one."
    }
  ];

  const testimonials = [
    {
      quote: "We were missing 30–40 patient calls a month during busy hours. Since Noryvex set up our AI receptionist, every call gets answered. We've seen a noticeable jump in new patient bookings — it literally pays for itself.",
      name: "Dr. Sarah Mitchell",
clinic: "",
      location: "Texas",
      initials: "SM",
      color: "#6366f1"
    },
    {
      quote: "The setup took 48 hours exactly as promised. Muhammad Razi and his team handled everything — we gave them our FAQ document and they did the rest. My front desk is now free to focus on in-person patients.",
      name: "Dr. James Okonkwo",
clinic: "",
      location: "Illinois",
      initials: "JO",
      color: "#10b981"
    },
    {
      quote: "My staff used to spend 2–3 hours a day answering the same questions about braces and retainer costs. The AI handles all of that now. Honestly shocked at how natural it sounds on real patient calls.",
      name: "Dr. Maria E. Vasquez",
clinic: "",
      location: "Florida",
      initials: "MV",
      color: "#f59e0b"
    },
    {
      quote: "After-hours calls were our biggest missed revenue source. Parents call when kids have dental emergencies at night. Now those calls are captured and we get a full summary in our inbox within minutes.",
      name: "Dr. Thomas Reed",
clinic: "",
      location: "Colorado",
      initials: "TR",
      color: "#ec4899"
    },
    {
      quote: "I was skeptical that AI could handle real patient calls without sounding robotic. First call I listened to — I genuinely couldn't tell. It's warm, handles interruptions naturally, and knows our full service list.",
      name: "Dr. Priya Patel",
clinic: "",
      location: "Texas",
      initials: "PP",
      color: "#8b5cf6"
    },
    {
      quote: "Best investment for the clinic this year. We're booking 15–20% more consultations from calls that used to go straight to voicemail. The dashboard is clean and gives me everything I need at a glance.",
      name: "Dr. Kevin Walsh",
clinic: "",
      location: "New York",
      initials: "KW",
      color: "#14b8a6"
    }
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
  // Uses rAF throttle so it stays in sync with the browser paint cycle.
  useEffect(() => {
    const NAV_H = 80; // fixed navbar height in px
    let ticking = false;

    const compute = () => {
      const parent = taglineSectionRef.current;
      if (!parent) { ticking = false; return; }

      const rect   = parent.getBoundingClientRect();
      const winH   = window.innerHeight;

      // sticky wrapper is top:NAV_H so it starts sticking when rect.top === NAV_H
      // totalDist = how far the parent travels while the wrapper is pinned
      const totalDist = Math.max(1, rect.height - (winH - NAV_H));
      const scrolled  = Math.max(0, NAV_H - rect.top); // 0 at start, totalDist at end
      setTaglineProgress(Math.min(1, scrolled / totalDist));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(compute);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', compute);
    compute(); // initial paint
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', compute);
    };
  }, []);

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
              <span className="badge-text">AI RECEPTIONIST FOR DENTAL CLINICS</span>
            </div>
            <h1 className="hero-title txt-reveal">
              Never miss another <br />
              <span className="text-neon-gradient txt-gradient-animate">dental patient call.</span>
            </h1>
            <p className="hero-subtitle txt-blur-in">
              Noryvex builds and manages custom AI receptionists for dental clinics. Your AI answers calls, handles common questions, captures patient details, and sends appointment requests to your team.
            </p>
            <div className="hero-policy-strip txt-blur-in">
              <span className="policy-item" style={{ color: 'var(--accent-neon)', fontWeight: '700' }}>✦ Free custom demo built for you first</span>
              <span className="policy-item">✓ No software to install or configure</span>
              <span className="policy-item">✓ Pay only when you're ready to launch</span>
            </div>
            <div className="hero-ctas">
              <button onClick={() => setActivePage('contact', 'trial')} className="btn btn-primary btn-lg">
                Get Free Clinic Demo <ArrowRight size={18} />
              </button>
              <button onClick={() => setActivePage('live-demo')} className="btn btn-secondary btn-lg">
                Try Interactive Web Demo <ArrowRight size={18} />
              </button>
            </div>
            <p className="trust-note" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '16px', lineHeight: '1.4' }}>
              No software to learn. No dashboard to configure. We build and manage everything for you.
            </p>
            <div className="trust-strip nrx-reveal" style={{ transitionDelay: '0.12s', marginTop: '32px' }}>
              <p className="trust-tagline" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '500' }}>
                Built for dental clinics first.
              </p>
              <div className="niche-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-start' }}>
                {['General Dentists', 'Cosmetic Clinics', 'Orthodontists', 'Pediatric Dentists', 'Emergency Clinics'].map((tag) => (
                  <span key={tag} className="niche-tag" style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '6px 12px',
                    background: 'var(--bg-preview-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '100px',
                    color: 'var(--text-gray)',
                    letterSpacing: '0.05em'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
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
              <div className="floating-node node-1">Dental Voice</div>
              <div className="floating-node node-2">Booking Sync</div>
              <div className="floating-node node-3">Emergency Route</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Authority & Proof Strip ── */}
      <section style={{ padding: '32px 0', borderBottom: '1px solid var(--border-light)', background: 'linear-gradient(180deg, rgba(199,255,61,0.03) 0%, transparent 100%)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px', rowGap: '20px' }}>
            {[
              { num: '50+',    label: 'AI Assistants Deployed',     sub: 'across dental practices' },
              { num: '15K+',   label: 'Patient Calls Handled',       sub: 'by Noryvex AI agents' },
              { num: '100%',   label: 'Free Demo First',             sub: 'always. no exceptions.' },
              { num: 'GPT-4o', label: 'LLM-Powered Voice AI',        sub: 'latest frontier models' },
              { num: '12+',    label: 'US States Active',            sub: 'and expanding fast' },
            ].map((s, i) => (
              <div key={i} style={{ flex: '1', minWidth: '130px', textAlign: 'center', padding: '0 8px' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--accent-neon)', letterSpacing: '-0.03em', lineHeight: '1', fontFamily: 'Syne, sans-serif' }}>{s.num}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-white)', marginTop: '6px', letterSpacing: '0.03em' }}>{s.label}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.02em' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="problem-section" style={{ padding: 'var(--section-padding-desktop) 0', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">The Reality</span>
            <h2 className="section-title txt-reveal-2">Missed dental calls turn into missed patients.</h2>
            <p className="section-subtitle txt-blur-in">Dental practices lose significant revenue when calls go unanswered or straight to voicemail.</p>
          </div>

          <div className="problem-grid">
            <div className="glass-card problem-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-white)', fontWeight: '700' }}>1. Front desk gets busy</h3>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-gray)' }}>When staff are helping patients, new callers often wait, hang up, or go to voicemail.</p>
            </div>
            <div className="glass-card problem-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-white)', fontWeight: '700' }}>2. After-hours calls get lost</h3>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-gray)' }}>Patients call after work, during lunch breaks, or on weekends. Your clinic may never hear from them again.</p>
            </div>
            <div className="glass-card problem-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-white)', fontWeight: '700' }}>3. Booking questions repeat daily</h3>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-gray)' }}>Hours, services, pricing guidance, insurance questions, and appointment availability take time from your team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="services-grid-section" style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-pure)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">CAPABILITIES</span>
            <h2 className="section-title txt-reveal-2">What your dental AI receptionist can handle</h2>
            <p className="section-subtitle txt-blur-in">A custom AI receptionist built around your clinic’s calls, services, hours, and booking workflow.</p>
          </div>

          <div className="services-grid">
            {services.map((svc, i) => (
              <div
                key={i}
                className="glass-card service-card nrx-reveal"
                style={{ transitionDelay: `${i * 0.1}s`, opacity: 1 }}
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
      </section>

      {/* Built for Dental Clinics First */}
      <section className="dental-first-section" style={{ padding: '100px 0', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="dental-first-grid">
            <div>
              <span className="section-tag txt-slide">Dedicated Focus</span>
              <h2 className="section-title txt-reveal-2" style={{ textAlign: 'left', marginBottom: '24px' }}>Built for dental clinics first</h2>
              <p style={{ color: 'var(--text-gray)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '24px' }}>
                Noryvex is currently focused on helping dental practices stop losing patients from missed calls. Whether you run a solo dental office, family clinic, orthodontic clinic, cosmetic dentistry practice, or multi-location clinic, your AI receptionist is trained around your services, hours, pricing, insurance questions, and booking process.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  'General dentists',
                  'Cosmetic dentistry clinics',
                  'Orthodontists',
                  'Pediatric dentists',
                  'Emergency dental clinics'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-light)', fontWeight: '600' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--accent-neon)' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              {/* Visual indicator card */}
              <div className="glass-card" style={{ padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '450px', border: '1px solid var(--border-light)', background: 'var(--bg-glass)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-neon)', boxShadow: '0 0 10px var(--accent-neon)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Dental Model Active</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-white)', marginBottom: '16px' }}>Trained on Clinical Context</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  Unlike generic voice bots, your Noryvex assistant is programmed with specialized vocabulary for root canals, crowns, teeth cleaning, veneer options, and emergency dental symptoms.
                </p>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>INTEGRATED PLATFORMS</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-white)', fontWeight: '700' }}>Local CRM / Calendly / Practice Management</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dental Demo Dialogue Script */}
      <section className="dental-demo-section" style={{ padding: '100px 0', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">Real-World Flow</span>
            <h2 className="section-title txt-reveal-2">Turn missed dental calls into booked appointments</h2>
            <p className="section-subtitle txt-blur-in">Watch how your AI receptionist takes a live caller from an inquiry to a confirmed booking in under 60 seconds.</p>
          </div>

          <div className="dental-demo-container" style={{ maxWidth: '750px', margin: '48px auto 0 auto' }}>
            <div className="glass-card" style={{ padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', background: 'var(--bg-glass)' }}>
              {/* Header of the mock dialogue */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Volume2 size={20} style={{ color: 'var(--accent-neon)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-white)', fontWeight: '700' }}>Sample Call Recording Transcript</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>CALL DURATION: 0:42</span>
              </div>

              {/* Messages stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Caller */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
                    <Users size={16} style={{ color: 'var(--text-gray)' }} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>CALLER (PATIENT)</span>
                    <div style={{ background: 'var(--bg-charcoal)', padding: '14px 20px', borderRadius: '0 16px 16px 16px', color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.5', border: '1px solid var(--border-light)' }}>
                      “Hi, do you offer teeth whitening?”
                    </div>
                  </div>
                </div>

                {/* AI Receptionist */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', justifyContent: 'flex-end', textAlign: 'right', flexDirection: 'row-reverse' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-neon-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-neon-border)' }}>
                    <Phone size={16} style={{ color: 'var(--accent-neon)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-neon)', marginBottom: '4px', fontWeight: '700' }}>AI RECEPTIONIST (CHLOE)</span>
                    <div style={{ background: 'var(--accent-neon-glow)', padding: '14px 20px', borderRadius: '16px 0 16px 16px', color: 'var(--text-white)', fontSize: '0.95rem', lineHeight: '1.5', border: '1px solid var(--accent-neon-border)', textAlign: 'left' }}>
                      “Yes, we do. Are you looking for an in-office whitening appointment or a consultation?”
                    </div>
                  </div>
                </div>

                {/* Caller */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
                    <Users size={16} style={{ color: 'var(--text-gray)' }} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>CALLER (PATIENT)</span>
                    <div style={{ background: 'var(--bg-charcoal)', padding: '14px 20px', borderRadius: '0 16px 16px 16px', color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.5', border: '1px solid var(--border-light)' }}>
                      “In-office.”
                    </div>
                  </div>
                </div>

                {/* AI Receptionist */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', justifyContent: 'flex-end', textAlign: 'right', flexDirection: 'row-reverse' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-neon-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-neon-border)' }}>
                    <Phone size={16} style={{ color: 'var(--accent-neon)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-neon)', marginBottom: '4px', fontWeight: '700' }}>AI RECEPTIONIST (CHLOE)</span>
                    <div style={{ background: 'var(--accent-neon-glow)', padding: '14px 20px', borderRadius: '16px 0 16px 16px', color: 'var(--text-white)', fontSize: '0.95rem', lineHeight: '1.5', border: '1px solid var(--accent-neon-border)', textAlign: 'left' }}>
                      “Great. I can help book that. Are mornings or afternoons better for you?”
                    </div>
                  </div>
                </div>
              </div>

              {/* Result box at bottom of conversation */}
              <div style={{ marginTop: '36px', background: 'var(--bg-pure)', border: '1px solid var(--accent-neon-border)', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-neon-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--accent-neon)' }} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-neon)', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>RESULT SUMMARY</span>
                  <p style={{ color: 'var(--text-white)', fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>
                    New patient captured, appointment booked, details instantly synced to your scheduling system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Noryvex */}
      <section className="why-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">Practice ROI</span>
            <h2 className="section-title txt-reveal-2">Why dental clinics choose Noryvex</h2>
            <p className="section-subtitle txt-blur-in">We build, train, and host custom voice receptionists designed specifically to stop losing patients from missed calls.</p>
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

      {/* ── Demo Before Payment Section ── */}
      <section className="demo-payment-section" style={{ padding: 'var(--section-padding-desktop) 0', borderTop: '1px solid var(--border-light)', background: 'var(--bg-pure)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">Risk-Free Process</span>
            <h2 className="section-title txt-reveal-2">Hear your clinic’s AI receptionist before paying.</h2>
            <p className="section-subtitle txt-blur-in">We build a short custom demo using your clinic name, services, hours, and FAQs. You can hear how it answers patient calls before deciding to launch.</p>
          </div>

          <div className="demo-comparison-grid">
            {/* Left Card: Free Demo */}
            <div className="glass-card demo-comp-card">
              <span className="section-tag" style={{ background: 'rgba(199, 255, 61, 0.08)', color: 'var(--accent-neon)', border: '1px solid var(--accent-neon-border)' }}>Included in Free Demo</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '16px', marginBottom: '24px' }}>Free Demo Includes</h3>
              <ul className="comp-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Custom clinic greeting using your real practice name</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>3–5 clinic FAQs custom-trained on your hours, location, and key services</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>New patient inquiry flow testing call handling capabilities</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Appointment request example capturing time/date preferences</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Basic call summary example sent directly to your phone</span>
                </li>
              </ul>
            </div>

            {/* Right Card: Full Launch */}
            <div className="glass-card demo-comp-card">
              <span className="section-tag" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-white)', border: '1px solid var(--border-light)' }}>Full Production Launch</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '16px', marginBottom: '24px' }}>Full Launch Can Include</h3>
              <ul className="comp-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Live call routing with phone number assigned in any US state</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Private client dashboard listing live calls, data analytics, and summaries</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Email notifications sent immediately after every conversation</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Direct calendar (Google Calendar/Calendly) or clinic CRM scheduling sync</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Complete call recordings and transcript logging</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Monthly managed support, phrase prompt reviews, and feature expansions</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setActivePage('contact', 'trial')} className="btn btn-primary btn-lg">
              Get Free Clinic Demo <ArrowRight size={18} />
            </button>
            <button onClick={() => setActivePage('live-demo')} className="btn btn-secondary btn-lg">
              Try Interactive Web Demo
            </button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section" id="how-it-works" style={{ padding: 'var(--section-padding-desktop) 0', borderTop: '1px solid var(--border-light)', background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">STEPS</span>
            <h2 className="section-title txt-reveal-2">How it works</h2>
            <p className="section-subtitle txt-blur-in">Follow our structured agency path to get your AI receptionist up and running.</p>
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

      {/* Expansion/Footnote Section: More Automation Coming Later */}
      <section className="expansion-footnote-section" style={{ padding: 'var(--section-padding-mobile) 0', borderTop: '1px solid var(--border-light)', background: 'var(--bg-pure)' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span className="section-tag txt-slide" style={{ margin: '0 auto 16px auto' }}>Future Roadmap</span>
          <h2 className="section-title txt-reveal-2" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>More automation coming later</h2>
          <p style={{ color: 'var(--text-gray)', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 auto 24px auto', maxWidth: '650px' }}>
            Right now, we focus exclusively on AI receptionists for dental clinics so we can deliver the best possible results. As we grow, Noryvex will expand into CRM automation, chatbots, workflow automation, and custom AI systems for more industries.
          </p>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            {['CRM Automation', 'Custom AI Chatbots', 'Workflow Integrations', 'Multi-Industry Systems'].map((item, idx) => (
              <span key={idx} style={{ fontSize: '0.75rem', fontWeight: '600', padding: '6px 14px', background: 'var(--bg-preview-card)', border: '1px solid var(--border-light)', borderRadius: '100px', color: 'var(--text-muted)' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section className="pricing-section" style={{ padding: 'var(--section-padding-desktop) 0', borderTop: '1px solid var(--border-light)', background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">Pricing Model</span>
            <h2 className="section-title txt-reveal-2">Simple agency pricing, not software plans.</h2>
            <p className="section-subtitle txt-blur-in">Every clinic is different, so we start with a free demo. If you like it, we recommend a launch setup based on your call volume, locations, and integrations.</p>
          </div>

          <div className="pricing-grid">
            <div className="glass-card pricing-card">
              <span className="section-tag" style={{ background: 'rgba(199, 255, 61, 0.08)', color: 'var(--accent-neon)', border: '1px solid var(--accent-neon-border)' }}>Step 1</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '16px', marginBottom: '12px' }}>Free Demo</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-gray)' }}>Hear a short custom AI receptionist demo before paying.</p>
            </div>
            <div className="glass-card pricing-card">
              <span className="section-tag">Step 2</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '16px', marginBottom: '12px' }}>Launch Setup</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-gray)' }}>One-time setup for training, testing, call routing, dashboard, and workflow configuration.</p>
            </div>
            <div className="glass-card pricing-card">
              <span className="section-tag">Step 3</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '16px', marginBottom: '12px' }}>Monthly Management</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-gray)' }}>Ongoing hosting, monitoring, call review, updates, support, and improvements.</p>
            </div>
            <div className="glass-card pricing-card">
              <span className="section-tag">Custom</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '16px', marginBottom: '12px' }}>Custom Integrations</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-gray)' }}>Calendar, CRM, dental software, or custom dashboard integrations are quoted based on your system.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button onClick={() => setActivePage('contact', 'trial')} className="btn btn-primary btn-lg">
              Get Free Clinic Demo <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Portfolio / Case Studies Section ── */}
      <section style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">Case Studies</span>
            <h2 className="section-title txt-reveal-2">Results from real dental clinics.</h2>
            <p className="section-subtitle txt-blur-in">
              Every engagement is custom-built. Here's what Noryvex AI receptionists have delivered for dental practices across the US.
            </p>
          </div>

          <div className="portfolio-grid">
            {portfolioItems.map((item, i) => (
              <div key={i} className="glass-card portfolio-card nrx-reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                {/* Card header */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: item.accentColor, padding: '4px 12px', background: `${item.accentColor}18`, border: `1px solid ${item.accentColor}35`, borderRadius: '100px' }}>{item.type}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 {item.location}</span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-white)', marginBottom: '8px', lineHeight: '1.3' }}>{item.clinic}</h3>
                  <p style={{ fontSize: '0.85rem', color: item.accentColor, fontWeight: '600', margin: 0, lineHeight: '1.4' }}>{item.highlight}</p>
                </div>

                {/* Metrics grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px', padding: '18px', background: 'var(--bg-pure)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                  {item.stats.map((stat, j) => (
                    <div key={j} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900', color: item.accentColor, marginBottom: '5px', lineHeight: 1, letterSpacing: '-0.02em' }}>{stat.value}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '500', lineHeight: '1.35', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.88rem', color: 'var(--text-gray)', lineHeight: '1.65', margin: 0 }}>{item.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-pure)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">Client Reviews</span>
            <h2 className="section-title txt-reveal-2">What dental clinic owners are saying.</h2>
            <p className="section-subtitle txt-blur-in">
              Hundreds of patient calls answered. Dozens of missed bookings recovered. Here's what our clients think.
            </p>
          </div>

          {/* Star rating summary bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '48px', padding: '20px 32px', background: 'var(--bg-charcoal)', borderRadius: '100px', border: '1px solid var(--border-light)', width: 'fit-content', margin: '0 auto 52px auto' }}>
            <span style={{ color: '#f59e0b', fontSize: '1.2rem', letterSpacing: '3px' }}>★★★★★</span>
            <span style={{ color: 'var(--text-white)', fontWeight: '800', fontSize: '1.1rem' }}>5.0</span>
            <span style={{ width: '1px', height: '20px', background: 'var(--border-light)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Average Rating from Dental Clinics</span>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card testimonial-card nrx-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                {/* Stars */}
                <div style={{ marginBottom: '14px', display: 'flex', gap: '3px' }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: '#f59e0b', fontSize: '0.95rem' }}>★</span>
                  ))}
                </div>

                {/* Quote */}
                <p style={{ fontSize: '0.93rem', color: 'var(--text-light)', lineHeight: '1.75', marginBottom: '22px', fontStyle: 'italic', flex: 1 }}>
                  "{t.quote}"
                </p>

                {/* Author */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '18px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                    background: `${t.color}20`, border: `2px solid ${t.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: '800', color: t.color, letterSpacing: '0.05em'
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-white)', marginBottom: '2px' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA below testimonials */}
          <div style={{ textAlign: 'center', marginTop: '52px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Ready to join them?</p>
            <button onClick={() => setActivePage('contact', 'trial')} className="btn btn-primary btn-lg">
              Get Free Clinic Demo <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── HIPAA Compliance & Security Section ── */}
      <section style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-pure)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="security-section-grid">
            <div>
              <span className="section-tag txt-slide">Data Protection</span>
              <h2 className="section-title txt-reveal-2" style={{ textAlign: 'left', marginBottom: '20px' }}>HIPAA Compliant &amp; Secure Patient Data Flow</h2>
              <p className="section-subtitle txt-blur-in" style={{ textAlign: 'left', margin: 0, marginBottom: '24px' }}>
                We design and run our voice systems to adhere strictly to healthcare privacy standards. Your practice retains complete ownership of your call records and transcripts.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <h4 style={{ color: 'var(--text-white)', fontSize: '0.95rem', fontWeight: '700', margin: 0, marginBottom: '4px' }}>Business Associate Agreements (BAAs)</h4>
                    <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>We sign BAAs with all US dental clinics to guarantee HIPAA compliance.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <h4 style={{ color: 'var(--text-white)', fontSize: '0.95rem', fontWeight: '700', margin: 0, marginBottom: '4px' }}>End-to-End Encryption</h4>
                    <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>All patient interactions and database fields are encrypted in transit and at rest.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <h4 style={{ color: 'var(--text-white)', fontSize: '0.95rem', fontWeight: '700', margin: 0, marginBottom: '4px' }}>Zero Public AI Training</h4>
                    <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>Your patient calls and clinic records are never used to train public LLM models.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual flow container */}
            <div className="glass-card" style={{ padding: '32px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-charcoal)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-white)', margin: 0, borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>Secure Call Data Flow</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(199, 255, 61, 0.1)', color: 'var(--accent-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>1</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-white)' }}>Inbound Call Routed</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Encrypted SIP/VoIP voice stream connection</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(199, 255, 61, 0.1)', color: 'var(--accent-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>2</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-white)' }}>HIPAA-Compliant Processing</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secure audio processing, speech-to-text, and local LLM triaging</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(199, 255, 61, 0.1)', color: 'var(--accent-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>3</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-white)' }}>Direct Handoff to Clinic CRM</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SSL encrypted webhook pushing details directly to your system</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Big Kinetic Tagline (Sticky Pin & Scroll Reveal) ── */}
      <section className="nrx-tagline-sticky-parent" ref={taglineSectionRef}>
        <div className="nrx-tagline-sticky-wrapper">
          <div className="nrx-kinetic-inner">
            {/* Word 1: AUTOMATE — reveals 0%→25% */}
            <span
              className={`nrx-kinetic-line nrx-kinetic-word ${taglineProgress >= 0.12 ? 'active' : ''}`}
              style={{
                opacity: Math.max(0.08, Math.min(1.0, (taglineProgress - 0.02) * 8)),
                transform: `scale(${Math.max(0.94, Math.min(1.0, 0.94 + (taglineProgress - 0.02) * 0.4))})`
              }}
            >
              AUTOMATE.
            </span>
            {/* Word 2: COMMUNICATE — reveals 30%→55% */}
            <span
              className={`nrx-kinetic-line nrx-kinetic-word ${taglineProgress >= 0.42 ? 'active' : ''}`}
              style={{
                opacity: Math.max(0.08, Math.min(1.0, (taglineProgress - 0.32) * 8)),
                transform: `scale(${Math.max(0.94, Math.min(1.0, 0.94 + (taglineProgress - 0.32) * 0.4))})`
              }}
            >
              COMMUNICATE.
            </span>
            {/* Word 3: GROW — reveals 60%→85% */}
            <span
              className={`nrx-kinetic-line nrx-kinetic-word nrx-kinetic-accent ${taglineProgress >= 0.72 ? 'active' : ''}`}
              style={{
                opacity: Math.max(0.08, Math.min(1.0, (taglineProgress - 0.62) * 8)),
                transform: `scale(${Math.max(0.94, Math.min(1.0, 0.94 + (taglineProgress - 0.62) * 0.4))})`
              }}
            >
              GROW.
            </span>
          </div>

          {/* Tagline subtitle — fades in at 88%+ */}
          <div
            className="nrx-kinetic-sub"
            style={{
              opacity: Math.max(0, Math.min(1, (taglineProgress - 0.85) * 10)),
              transform: `translateY(${Math.max(0, 18 - (taglineProgress - 0.85) * 140)}px)`
            }}
          >
            <span>Noryvex</span>
            <span className="nrx-kinetic-dot">·</span>
            <span>AI-Powered Dental Receptionists</span>
            <span className="nrx-kinetic-dot">·</span>
            <span>Managed for Clinic Scale</span>
          </div>

          {/* CTA button — fades in at 91%+ */}
          <div
            className="nrx-tagline-btn-wrap"
            style={{
              opacity: Math.max(0, Math.min(1, (taglineProgress - 0.88) * 12)),
              transform: `translateY(${Math.max(0, 18 - (taglineProgress - 0.88) * 150)}px)`
            }}
          >
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setActivePage('contact', 'trial')}
            >
              Get Free Clinic Demo
            </button>
          </div>
        </div>
      </section>


      {/* ── FAQ Section ── */}
      <section id="faq" style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span className="section-tag" style={{ margin: '0 auto 16px auto' }}>COMMON QUESTIONS</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-white)', marginBottom: '16px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ maxWidth: 600, margin: '0 auto', fontSize: '1rem', color: 'var(--text-gray)', lineHeight: '1.65' }}>
              Everything you need to know about Noryvex's managed AI dental receptionist service.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((item, idx) => (
              <details key={item.id ?? idx} className="faq-item">
                <summary className="faq-q" id={`faq-q-${idx}`}>
                  <span>{item.question ?? item.q}</span>
                  <span className="faq-chevron" aria-hidden="true">+</span>
                </summary>
                <p className="faq-a">{item.answer ?? item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Expertise & Why Noryvex Section ── */}
      <section style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag txt-slide">Proven Track Record</span>
            <h2 className="section-title txt-reveal-2">Built by AI engineers who've shipped dozens of voice agents.</h2>
            <p className="section-subtitle txt-blur-in">Noryvex isn't a template or a plug-in. Every assistant is custom-engineered by AI developers who have built, tested, and iterated on real production systems.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '48px' }}>
            {[
              {
                icon: '🧠',
                title: 'LLM-Powered Intelligence',
                desc: 'Every Noryvex assistant runs on frontier large language models (GPT-4o) with custom retrieval-augmented generation (RAG) for your clinic\'s exact context — not generic chatbot logic.',
                tag: 'GPT-4o + RAG'
              },
              {
                icon: '🎙️',
                title: 'Natural Voice Conversation',
                desc: 'Built on enterprise-grade speech-to-text and text-to-speech pipelines. Patients experience natural, human-like conversations — not robotic IVR menus.',
                tag: 'Real-Time Voice'
              },
              {
                icon: '⚡',
                title: 'We Build Your Demo First',
                desc: 'We create a fully functional AI receptionist demo customized to your clinic name, services, and FAQs — completely free. You hear it live before spending a single dollar.',
                tag: '100% Free Demo'
              },
              {
                icon: '📋',
                title: '50+ Projects Shipped',
                desc: 'From solo dental offices to multi-location orthodontic clinics, we\'ve built and launched over 50 custom AI voice assistants across the US with measurable patient capture results.',
                tag: '50+ Deployments'
              },
              {
                icon: '🔗',
                title: 'Deep System Integrations',
                desc: 'We integrate with Google Calendar, Calendly, Dentrix, Eaglesoft, and any clinic CRM. Your AI books real appointments into your real scheduling system.',
                tag: 'CRM + Calendar'
              },
              {
                icon: '🛡️',
                title: 'HIPAA-Aware Architecture',
                desc: 'Our infrastructure is architected to minimize PHI exposure. Encrypted pipelines, access controls, and data retention policies are built-in — not bolted on.',
                tag: 'HIPAA-Aware'
              },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: '28px', borderRadius: '20px', border: '1px solid var(--border-light)', transition: 'border-color 0.2s, transform 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(199,255,61,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '2rem', lineHeight: '1' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--accent-neon)', background: 'rgba(199,255,61,0.08)', border: '1px solid rgba(199,255,61,0.2)', padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{item.tag}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-white)', marginBottom: '10px', lineHeight: '1.3' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-gray)', lineHeight: '1.65', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Proof banner */}
          <div style={{ marginTop: '56px', background: 'rgba(199,255,61,0.04)', border: '1px solid rgba(199,255,61,0.15)', borderRadius: '20px', padding: '36px 40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', minWidth: '260px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-white)', marginBottom: '10px', lineHeight: '1.3' }}>
                We build the demo. You decide.<br />
                <span style={{ color: 'var(--accent-neon)' }}>No risk. No pressure. No upfront cost.</span>
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-gray)', lineHeight: '1.6', margin: 0 }}>
                Tell us about your clinic. We'll build a custom AI receptionist demo trained on your services, hours, and FAQs — then let you call it and test it yourself. If you love it, we launch it. If not, no problem — you owe us nothing.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
              <button onClick={() => setActivePage('contact', 'trial')} className="btn btn-primary btn-lg" style={{ whiteSpace: 'nowrap' }}>
                Get My Free Demo Built
              </button>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>Delivered within 48 hours · Zero commitment</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA Band ── */}
      <section className="closing-cta-section" style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-pure)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-white)', marginBottom: '24px', lineHeight: '1.2', letterSpacing: '-0.025em' }}>
            Ready to stop missing patient calls?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-gray)', marginBottom: '40px', lineHeight: '1.6' }}>
            We build, deploy, and manage your custom AI receptionist end-to-end. You don't have to configure a thing.
          </p>
          <button 
            onClick={() => setActivePage('contact', 'trial')} 
            className="btn btn-primary btn-lg"
            style={{ padding: '18px 40px', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Get Free Clinic Demo
          </button>
        </div>
      </section>

      <style>{`
        /* ── Services Grid Section ──────────────── */
        .services-grid-section {
          position: relative;
          z-index: 5;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--card-gap-desktop);
          margin-top: 48px;
        }
        .services-grid .service-card {
          width: 100% !important;
          opacity: 0.85;
          transform: scale(0.98);
          transition: opacity 0.3s, transform 0.3s, border-color 0.25s;
        }
        .services-grid .service-card:hover {
          opacity: 1;
          border-color: rgba(199,255,61,0.35) !important;
          transform: scale(1.02) translateY(-4px) !important;
        }
        @media (max-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── 48-Hour Trial Section ──────────────── */
        .trial-offer-section {
          padding: 80px 0;
          background: var(--bg-pure);
          position: relative;
          z-index: 5;
        }

        .trial-offer-card {
          padding: 60px 40px;
          border: 1px solid rgba(199, 255, 61, 0.15);
          background: var(--bg-glass);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 50px rgba(199, 255, 61, 0.02);
        }

        .trial-offer-card::before {
          content: "";
          position: absolute;
          top: -20%; right: -20%;
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(199, 255, 61, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .trial-offer-header {
          text-align: center;
          margin-bottom: 48px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .trial-offer-title {
          font-weight: 800;
          font-size: 2.2rem;
          color: var(--text-white);
          margin-top: 12px;
          margin-bottom: 16px;
        }

        .trial-offer-subtitle {
          font-size: 1.15rem;
          color: var(--text-gray);
          line-height: 1.6;
        }

        .trial-offer-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .panel-title {
          font-weight: 700;
          font-size: 1.3rem;
          color: var(--text-white);
          margin-bottom: 24px;
        }

        .panel-list {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .panel-list li {
          display: flex;
          gap: 16px;
          align-items: start;
          text-align: left;
        }

        .list-icon {
          color: var(--accent-neon);
          flex-shrink: 0;
          margin-top: 4px;
        }

        .panel-list strong {
          color: var(--text-white);
          font-size: 0.95rem;
          display: block;
          margin-bottom: 4px;
        }

        .panel-list p {
          color: var(--text-gray);
          font-size: 0.85rem;
          line-height: 1.4;
          margin: 0;
        }

        .trial-features-strip {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 12px;
        }

        .strip-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--accent-neon);
          background: rgba(199, 255, 61, 0.05);
          border: 1px solid rgba(199, 255, 61, 0.1);
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
        }

        .trial-dashboard-preview {
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 24px;
          text-align: left;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .preview-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .preview-dot.green {
          background: var(--accent-neon);
          box-shadow: 0 0 8px var(--accent-neon);
        }

        .preview-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .preview-intro-text {
          font-size: 0.85rem;
          color: var(--text-gray);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .preview-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .preview-metric-card {
          background: var(--bg-preview-card);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 14px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          transition: border-color 0.25s, background 0.25s;
        }

        .preview-metric-card:hover {
          border-color: rgba(199, 255, 61, 0.35);
          background: rgba(199, 255, 61, 0.02);
        }

        .metric-lucide-icon {
          color: var(--accent-neon);
          margin-bottom: 4px;
          filter: drop-shadow(0 0 4px rgba(199, 255, 61, 0.25));
        }

        .metric-name {
          font-size: 0.75rem;
          color: var(--text-white);
          font-weight: 600;
        }

        .preview-footer-note {
          font-size: 0.8rem;
          color: var(--text-gray);
          line-height: 1.5;
          border-top: 1px solid var(--border-light);
          padding-top: 16px;
        }

        .preview-footer-note strong {
          color: var(--text-white);
          display: block;
          margin-bottom: 4px;
        }

        .trial-offer-cta-container {
          text-align: center;
          margin-top: 48px;
        }

        @media (max-width: 991px) {
          .trial-offer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .trial-offer-card {
            padding: 40px 24px;
          }
          .trial-offer-title {
            font-size: 1.8rem;
          }
        }

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
          margin-top: 40px;
          padding-top: 20px;
          z-index: 5;
        }
        .services-sticky-wrapper {
          position: sticky;
          top: 85px; /* align below navbar with 5px bottom clearance */
          height: calc(100vh - 90px); /* 5px bottom clearance from viewport bottom edge */
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          padding-top: 10px;
          padding-bottom: 5px;
        }
        .svc-slider-wrap {
          position: relative;
          overflow: visible; /* let cards scale and hover extend nicely */
          padding: 20px 0;
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
            margin-top: 30px !important;
            padding-top: 0 !important;
          }
          .services-sticky-wrapper {
            position: relative !important;
            height: auto !important;
            padding: 40px 0 !important;
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
            width: 290px;
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
          padding: 90px 0 35px 0; /* 90px top padding = 88px nav height + 2px gap */
          overflow: hidden;
          background: radial-gradient(circle at 50% 35%, var(--accent-neon-glow) 0%, var(--bg-pure) 75%);
          min-height: auto;
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
          font-size: 3.2rem;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -0.025em;
        }

        .hero-policy-strip {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .policy-item {
          font-size: 0.82rem;
          color: var(--accent-neon);
          background: rgba(199, 255, 61, 0.05);
          border: 1px solid rgba(199, 255, 61, 0.1);
          padding: 6px 14px;
          border-radius: 100px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        
        @media (max-width: 768px) {
          .hero-policy-strip {
            justify-content: center;
            gap: 8px;
            margin-bottom: 24px;
          }
        }
        
        .text-neon-gradient {
          background: linear-gradient(135deg, var(--accent-neon) 0%, var(--text-white) 100%);
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
          background: var(--bg-charcoal);
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
          background: var(--accent-neon-glow);
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
          border-top: 1px solid var(--border-light);
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
          .hero-section {
            padding: 66px 0 35px 0; /* 66px top padding = 64px mobile nav height + 2px gap */
          }
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
            font-size: 2.2rem;
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
          height: 250vh; /* 250vh: ~170vh of travel + 80px nav offset breathing room */
          background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-pure) 100%);
          border-top: 1px solid var(--border-light);
        }
        .nrx-tagline-sticky-wrapper {
          position: sticky;
          top: 80px;                    /* sit just below the fixed navbar */
          height: calc(100vh - 80px);  /* fill the remaining viewport */
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
          color: var(--text-stroke-inactive);
          -webkit-text-stroke: 1.5px var(--text-stroke-color);
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
          color: var(--text-white);
          -webkit-text-stroke: 0px transparent;
          text-shadow: 0 0 40px var(--text-shadow-active);
        }
        .nrx-kinetic-accent {
          background: linear-gradient(135deg, var(--accent-neon) 0%, var(--text-white) 60%);
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

        @media (max-width: 1024px) {
          .nrx-tagline-sticky-wrapper {
            top: 66px;
            height: calc(100vh - 66px);
          }
          .nrx-tagline-sticky-parent { height: 240vh; }
        }

        @media (max-width: 768px) {
          .nrx-tagline-sticky-parent {
            height: 230vh;
          }
          .nrx-tagline-sticky-wrapper {
            top: 60px;
            height: calc(100vh - 60px);
          }
          .nrx-kinetic-sub {
            flex-direction: column;
            gap: 8px;
            margin-top: 20px;
          }
          .nrx-kinetic-dot { display: none; }
          .nrx-tagline-btn-wrap {
            margin-top: 16px;
          }
        }

        /* ── Problem Section ── */
        .problem-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--card-gap-desktop);
          margin-top: 48px;
        }
        @media (max-width: 768px) {
          .problem-grid {
            grid-template-columns: 1fr;
            gap: var(--card-gap-mobile);
          }
        }

        /* ── Demo Comparison Section ── */
        .demo-comparison-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--card-gap-desktop);
          margin-top: 48px;
        }
        @media (max-width: 768px) {
          .demo-comparison-grid {
            grid-template-columns: 1fr;
            gap: var(--card-gap-mobile);
          }
        }

        /* ── Pricing Section ── */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--card-gap-desktop);
          margin-top: 48px;
        }
        @media (max-width: 1024px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            gap: var(--card-gap-mobile);
          }
        }

        /* ── Dental Sections Styling ── */
        .dental-first-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 992px) {
          .dental-first-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* ── Portfolio Section ── */
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--card-gap-desktop);
          margin-top: 52px;
        }
        .portfolio-card {
          display: flex;
          flex-direction: column;
          padding: 28px;
          transition: border-color 0.25s ease, transform 0.25s var(--ease-out), box-shadow 0.25s ease;
        }
        .portfolio-card:hover {
          border-color: rgba(199,255,61,0.25) !important;
          transform: translateY(-5px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
        }
        @media (max-width: 1024px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .portfolio-grid {
            grid-template-columns: 1fr;
            gap: var(--card-gap-mobile);
          }
          .portfolio-card {
            padding: var(--card-padding-mobile);
          }
        }

        /* ── Testimonials Section ── */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--card-gap-desktop);
          margin-top: 0;
        }
        .testimonial-card {
          display: flex;
          flex-direction: column;
          padding: 28px;
          transition: border-color 0.25s ease, transform 0.25s var(--ease-out), box-shadow 0.25s ease;
        }
        .testimonial-card:hover {
          border-color: rgba(199,255,61,0.2) !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.45);
        }
        @media (max-width: 1024px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
            gap: var(--card-gap-mobile);
          }
          .testimonial-card {
            padding: var(--card-padding-mobile);
          }
        }

        /* ── HIPAA Security Section ── */
        .security-section-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .security-section-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        /* ── Card Consistency Fixes ── */
        /* Ensure pricing cards have consistent inner spacing */
        .pricing-card {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 28px !important;
        }
        .pricing-card .section-tag {
          margin-bottom: 0;
          display: inline-block;
          width: fit-content;
        }
        /* Why cards: tighten gap between icon and text */
        .why-card {
          padding: 28px !important;
        }
        .why-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .why-check {
          color: var(--accent-neon);
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }
        .why-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-white);
          margin: 0;
          line-height: 1.3;
        }
        .why-card-desc {
          font-size: 0.9rem;
          color: var(--text-gray);
          line-height: 1.6;
          margin: 0;
        }
        /* Demo comparison cards: consistent padding */
        .demo-comp-card {
          padding: 32px !important;
          display: flex;
          flex-direction: column;
        }
        /* Problem cards: uniform bottom border and spacing */
        .problem-card {
          padding: 28px !important;
          border-bottom: 2px solid transparent;
          transition: border-color 0.25s ease, transform 0.25s var(--ease-out);
        }
        .problem-card:hover {
          border-bottom-color: var(--accent-neon) !important;
          transform: translateY(-3px);
        }
        /* Service cards: more breathing room */
        .service-card {
          padding: 28px !important;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .service-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-white);
          margin: 12px 0 8px 0;
          line-height: 1.3;
        }
        .service-card-desc {
          font-size: 0.88rem;
          color: var(--text-gray);
          line-height: 1.6;
          margin: 0 0 16px 0;
          flex: 1;
        }
        .service-card-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }
        .learn-more {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s;
        }
        .learn-more:hover {
          color: var(--accent-neon);
        }

        /* ── FAQ Section ── */
        .faq-list {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .faq-item {
          border: 1px solid var(--border-light);
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          overflow: hidden;
          transition: border-color 0.2s, background 0.2s;
        }
        .faq-item[open] {
          border-color: rgba(199,255,61,0.2);
          background: rgba(199,255,61,0.015);
        }
        .faq-q {
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.97rem;
          color: var(--text-white);
          user-select: none;
          transition: color 0.15s;
        }
        .faq-q::-webkit-details-marker { display: none; }
        .faq-q::marker { display: none; }
        .faq-q:hover { color: var(--accent-neon); }
        .faq-chevron {
          flex-shrink: 0;
          font-size: 1.4rem;
          color: var(--accent-neon);
          line-height: 1;
          transition: transform 0.2s;
          font-weight: 300;
        }
        .faq-item[open] .faq-chevron { transform: rotate(45deg); }
        .faq-a {
          padding: 0 24px 20px;
          font-size: 0.9rem;
          color: var(--text-gray);
          line-height: 1.7;
          margin: 0;
          border-top: 1px solid var(--border-light);
          padding-top: 16px;
        }

      `}</style>

    </div>
  );
}
