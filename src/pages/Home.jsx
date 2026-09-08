import React, { useEffect, useState, useMemo } from 'react';
import { 
  ArrowRight, ArrowUpRight, Volume2, 
  CheckCircle2, XCircle, Check, 
  Phone, Clock, RefreshCw, Sparkles, MessageSquare, Shield,
  ChevronDown, Headphones, CalendarCheck, Plug
} from 'lucide-react';
import { dbGetPartners, dbGetFaqs, dbGetMetrics } from '../utils/dbHelper';
import AudioWaveform from '../components/AudioWaveform';
import MovingGrills from '../components/MovingGrills';
import ToolsTicker from '../components/ToolsTicker';

export default function Home({ setActivePage }) {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [partners, setPartners] = useState([]);
  const [metrics, setMetrics] = useState({
    stat1_value: '24/7',
    stat1_label: 'Call coverage',
    stat2_value: '<500ms',
    stat2_label: 'Voice response time',
    stat3_value: '48 hrs',
    stat3_label: 'Setup to live',
  });
  const [faqs, setFaqs] = useState([
    {
      question: 'How is Noryvex different from a general AI chatbot?',
      answer: 'General AI tools only generate text when prompted. Noryvex is a dedicated voice-first infrastructure designed for clinical operations — it speaks in a natural human voice, integrates directly with your practice management software, handles phone routing, schedules appointments, and operates 24/7 autonomously.'
    },
    {
      question: 'Will patients know they are speaking with AI?',
      answer: 'Our custom voice models use natural conversational cadence, pause appropriately, and understand complex dental inquiries. Patients experience a warm, professional conversation with zero delay. When specifically asked, the system transparently identifies as the clinic\'s AI assistant.'
    },
    {
      question: 'How long does setup take?',
      answer: 'Standard deployment is under 48 hours. Our team handles everything — voice scripting, FAQ training, clinic calendar integration, and sandbox testing. You simply forward after-hours or overflow calls to your provisioned Noryvex line.'
    },
    {
      question: 'Do we need to change our clinic phone number?',
      answer: 'No. Your patients continue calling your published clinic number. We provide conditional or after-hours call forwarding so Noryvex answers whenever your front desk is busy, on lunch, or closed.'
    },
    {
      question: 'What happens during a dental emergency?',
      answer: 'Noryvex is trained to immediately identify clinical emergency keywords — severe pain, swelling, knocked-out tooth, heavy bleeding — and routes the caller directly to your on-call emergency doctor or provides tailored emergency instructions based on your protocols.'
    },
    {
      question: 'Is Noryvex HIPAA compliant?',
      answer: 'Yes. All call audio, transcripts, and patient records are transmitted across enterprise-grade 256-bit encrypted pipelines with strict access controls. We sign a Business Associate Agreement (BAA) with all healthcare clients.'
    },
    {
      question: 'Can I try before committing?',
      answer: 'Absolutely. We build a free, custom AI receptionist demo using your real clinic name, treatments, hours, and FAQs. You can call and test it with your team before making any commitment.'
    }
  ]);

  useEffect(() => {
    dbGetPartners()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPartners(data.map(p => typeof p === 'string' ? p : p.name));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    dbGetFaqs()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setFaqs(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    dbGetMetrics()
      .then(data => {
        if (data && data.stat1_value) setMetrics(data);
      })
      .catch(() => {});
  }, []);

  const defaultPartners = partners.length > 0 
    ? partners 
    : ['Dentrix', 'Eaglesoft', 'Open Dental', 'Vapi', 'Twilio', 'ElevenLabs', 'Groq', 'OpenAI'];

  const useCases = [
    {
      id: 'overflow',
      title: 'Overflow calls',
      headline: 'Never send a patient to voicemail again',
      desc: 'When your front desk is on another line or at lunch, Noryvex picks up instantly — answers questions, captures details, and logs everything for your team.',
      features: [
        'Instant pickup with zero hold time',
        'Natural conversation about services, hours, and insurance',
        'Detailed call summary sent to your team immediately'
      ],
    },
    {
      id: 'afterhours',
      title: 'After-hours',
      headline: 'Book patients while your office sleeps',
      desc: 'Evenings, weekends, and holidays — Noryvex keeps working. Patients get answers and appointment requests flow in for morning review.',
      features: [
        'Full 24/7 coverage including holidays',
        'Appointment requests captured with preferred date and time',
        'Emergency calls triaged and escalated to on-call staff'
      ],
    },
    {
      id: 'faq',
      title: 'Patient FAQs',
      headline: 'Handle the questions your team answers 50 times a day',
      desc: 'Insurance accepted? What are your hours? Do you do Invisalign? Noryvex answers all of them naturally, so your staff can focus on patients in the chair.',
      features: [
        'Custom-trained on your exact services and policies',
        'Handles insurance, directions, parking, and procedure questions',
        'Updates instantly when your practice info changes'
      ],
    },
    {
      id: 'sync',
      title: 'PMS sync',
      headline: 'Every call flows into your existing systems',
      desc: 'Patient details, appointment requests, and call summaries sync directly to Dentrix, Eaglesoft, Open Dental, or your preferred practice management system.',
      features: [
        'Direct integration with major dental PMS platforms',
        'Structured data: patient name, phone, reason for visit',
        'Daily call summaries and recordings delivered to your inbox'
      ],
    }
  ];

  return (
    <div className="home-page-container">

      {/* ── 1. HERO ────────────────────────────────────────────── */}
      <section className="framer-hero" style={{ background: 'radial-gradient(50% 50% at 50% 85%, rgba(199, 255, 61, 0.12) 0%, rgba(13, 13, 15, 0) 65%)' }}>
        <div className="framer-hero-glow" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(199, 255, 61, 0.10) 0%, transparent 65%)' }} />
        
        {/* Exact Framer Moving Grills visual */}
        <div className="hero-moving-grills">
          <MovingGrills color="#C7FF3D" mode="hero" />
        </div>

        <div className="container framer-hero-content">
          
          <div className="framer-pill-badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C7FF3D', boxShadow: '0 0 8px #C7FF3D' }} />
            <span>HIPAA-Compliant AI Receptionist</span>
          </div>

          <h1 className="framer-hero-title">
            Never miss another<br />dental patient call.
          </h1>

          <p className="framer-hero-desc">
            Noryvex builds and manages custom AI receptionists that answer calls, capture patient details, handle clinic FAQs, and collect appointment requests.
          </p>

          <div className="framer-hero-actions">
            <button 
              onClick={() => setActivePage('contact')} 
              className="btn-framer-primary"
            >
              Get Free Clinic Demo <ArrowUpRight size={17} />
            </button>
            <button 
              onClick={() => setActivePage('live-demo')} 
              className="btn-framer-secondary"
            >
              <Volume2 size={17} style={{ color: '#C7FF3D' }} /> Hear Live Demo
            </button>
          </div>

          {/* Trust microcopy */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginTop: '20px', 
            fontSize: '0.82rem', 
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span>✓ No credit card</span>
            <span>✓ Custom demo in 48 hrs</span>
            <span>✓ Zero phone number changes</span>
          </div>

        </div>
      </section>

      {/* ── 2. COMPATIBILITY / PARTNERS ────────────────────────── */}
      <section style={{ padding: '36px 0', overflow: 'hidden' }} className="nrx-reveal">
        <div className="container">
          <p className="framer-partner-label" style={{ textAlign: 'center', letterSpacing: '0.06em', fontSize: '0.78rem' }}>
            Powering automation for modern dental teams
          </p>
        </div>
        <div className="framer-marquee" style={{ marginTop: '16px' }}>
          <div className="framer-marquee-track">
            {[...defaultPartners, ...defaultPartners, ...defaultPartners].map((p, idx) => (
              <div key={idx} className="framer-partner-item">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C7FF3D' }} />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. CORE FEATURES (3 CARDS) ─────────────────────────── */}
      <section className="container" style={{ padding: 'var(--section-padding) 0' }}>
        <div className="framer-section-header">
          <div className="framer-eyebrow">
            <span className="dot" />
            <span>What Noryvex Does</span>
          </div>
          <h2 className="framer-section-title">
            Your front desk, upgraded.
          </h2>
          <p className="framer-section-desc">
            Replace missed calls and voicemail backlogs with an intelligent receptionist built specifically for your practice.
          </p>
        </div>

        <div className="framer-bento-grid">
          <div className="framer-bento-card">
            <div className="framer-bento-content">
              <div className="framer-bento-icon-wrap">
                <Headphones size={24} />
              </div>
              <h3 className="framer-bento-title">Answers patient calls 24/7</h3>
              <p className="framer-bento-desc">
                A custom voice receptionist answers calls day and night — no hold music, no voicemail, no missed opportunities.
              </p>
            </div>
          </div>

          <div className="framer-bento-card">
            <div className="framer-bento-content">
              <div className="framer-bento-icon-wrap">
                <CalendarCheck size={24} />
              </div>
              <h3 className="framer-bento-title">Captures appointment requests</h3>
              <p className="framer-bento-desc">
                Collects preferred date, time, and reason for visit — then sends structured details to your team for easy confirmation.
              </p>
            </div>
          </div>

          <div className="framer-bento-card">
            <div className="framer-bento-content">
              <div className="framer-bento-icon-wrap">
                <Plug size={24} />
              </div>
              <h3 className="framer-bento-title">Syncs with your systems</h3>
              <p className="framer-bento-desc">
                Patient details and appointment requests flow directly into Dentrix, Eaglesoft, Open Dental, or your workflow tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS (3 STEPS) ──────────────────────────── */}
      <section className="container" style={{ padding: 'var(--section-padding) 0' }}>
        <div className="framer-section-header">
          <div className="framer-eyebrow">
            <span className="dot" />
            <span>How It Works</span>
          </div>
          <h2 className="framer-section-title">
            Live in 48 hours. Managed forever.
          </h2>
          <p className="framer-section-desc">
            We handle 100% of the setup, scripting, integration, and ongoing optimization.
          </p>
        </div>

        <div className="framer-phases-grid">
          <div className="framer-phase-card">
            <span className="framer-phase-badge">Step 01</span>
            <h3 className="framer-phase-title">Share your clinic details</h3>
            <p className="framer-phase-desc">
              Tell us your hours, services, FAQs, insurance policies, and practice management system. We handle the rest.
            </p>
          </div>

          <div className="framer-phase-card">
            <span className="framer-phase-badge">Step 02</span>
            <h3 className="framer-phase-title">Test your custom prototype</h3>
            <p className="framer-phase-desc">
              We build a free AI receptionist demo using your real clinic info. Call it, test it with your team, and hear the difference.
            </p>
          </div>

          <div className="framer-phase-card">
            <span className="framer-phase-badge">Step 03</span>
            <h3 className="framer-phase-title">Go live with full support</h3>
            <p className="framer-phase-desc">
              Enable call forwarding to your Noryvex line. We monitor, refine, and manage your system continuously.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. USE CASES (TABS) ────────────────────────────────── */}
      <section className="container framer-tabs-section">
        <div className="framer-section-header">
          <div className="framer-eyebrow">
            <span className="dot" />
            <span>Use Cases</span>
          </div>
          <h2 className="framer-section-title">
            Built for how dental clinics actually work.
          </h2>
          <p className="framer-section-desc">
            See how Noryvex handles the situations your front desk deals with every day.
          </p>
        </div>

        <div className="framer-tabs-nav">
          {useCases.map((uc, index) => (
            <button
              key={uc.id}
              onClick={() => setActiveTab(index)}
              className={`framer-tab-btn ${activeTab === index ? 'active' : ''}`}
            >
              {uc.title}
            </button>
          ))}
        </div>

        <div className="framer-tab-panel">
          <div className="framer-tab-info">
            <h3>{useCases[activeTab].headline}</h3>
            <p>{useCases[activeTab].desc}</p>
            <div className="framer-tab-list">
              {useCases[activeTab].features.map((feat, idx) => (
                <div key={idx} className="framer-tab-list-item">
                  <CheckCircle2 size={18} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 32px',
            background: 'rgba(199, 255, 61, 0.04)',
            border: '1px solid rgba(199, 255, 61, 0.12)',
            borderRadius: '16px',
            textAlign: 'center',
          }}>
            <Phone size={40} style={{ color: 'var(--accent-neon)', marginBottom: '16px' }} />
            <p style={{ fontSize: '1rem', color: 'var(--text-gray)', lineHeight: 1.6, maxWidth: '280px' }}>
              Want to hear this in action? Try our live demo and experience the call yourself.
            </p>
            <button 
              onClick={() => setActivePage('live-demo')} 
              className="btn-framer-secondary"
              style={{ marginTop: '20px' }}
            >
              <Volume2 size={16} /> Try Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. CAPABILITIES GRID ───────────────────────────────── */}
      <section className="container" style={{ padding: 'var(--section-padding) 0' }}>
        <div className="framer-section-header">
          <div className="framer-eyebrow">
            <span className="dot" />
            <span>Built for Dental Practices</span>
          </div>
          <h2 className="framer-section-title">
            Everything your practice needs. Nothing it doesn't.
          </h2>
        </div>

        <div className="framer-capability-grid">
          <div className="framer-cap-card">
            <div className="framer-cap-icon"><Phone size={24} /></div>
            <h4 className="framer-cap-title">Custom to your practice</h4>
            <p className="framer-cap-desc">Configured around your hours, services, FAQs, treatments, insurance policies, and booking preferences.</p>
          </div>
          <div className="framer-cap-card">
            <div className="framer-cap-icon"><Clock size={24} /></div>
            <h4 className="framer-cap-title">Always available</h4>
            <p className="framer-cap-desc">Handles calls during lunch, after hours, weekends, holidays, and peak overflow periods.</p>
          </div>
          <div className="framer-cap-card">
            <div className="framer-cap-icon"><RefreshCw size={24} /></div>
            <h4 className="framer-cap-title">PMS integration</h4>
            <p className="framer-cap-desc">Syncs directly with Dentrix, Eaglesoft, Open Dental, Google Calendar, and your CRM.</p>
          </div>
          <div className="framer-cap-card">
            <div className="framer-cap-icon"><Sparkles size={24} /></div>
            <h4 className="framer-cap-title">Free custom demo</h4>
            <p className="framer-cap-desc">Hear your practice-specific receptionist before committing. Built in 48 hours, no obligation.</p>
          </div>
          <div className="framer-cap-card">
            <div className="framer-cap-icon"><MessageSquare size={24} /></div>
            <h4 className="framer-cap-title">Call recordings & transcripts</h4>
            <p className="framer-cap-desc">Every call logged with audio recording, full transcript, and structured patient summary.</p>
          </div>
          <div className="framer-cap-card">
            <div className="framer-cap-icon"><Shield size={24} /></div>
            <h4 className="framer-cap-title">HIPAA compliant</h4>
            <p className="framer-cap-desc">Enterprise-grade encryption, signed BAAs, and strict access controls protect patient data.</p>
          </div>
        </div>
      </section>

      {/* ── 7. COMPARISON ──────────────────────────────────────── */}
      <section className="container" style={{ padding: 'var(--section-padding) 0' }}>
        <div className="framer-section-header">
          <div className="framer-eyebrow">
            <span className="dot" />
            <span>Why Noryvex</span>
          </div>
          <h2 className="framer-section-title">
            The old way vs. the Noryvex way.
          </h2>
        </div>

        <div className="framer-comparison-grid">
          <div className="framer-comp-col other">
            <div className="framer-comp-col-header">
              <span className="framer-comp-col-title" style={{ color: 'var(--text-gray)' }}>Traditional</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Manual Approach</span>
            </div>
            <div className="framer-comp-list">
              {[
                'Missed calls go to voicemail',
                'Patients hang up and call competitors',
                'Front desk overwhelmed during peak hours',
                'No after-hours coverage',
                'Manual appointment logging',
                'No call tracking or analytics'
              ].map((item, i) => (
                <div key={i} className="framer-comp-row">
                  <XCircle size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="framer-comp-col noryvex">
            <div className="framer-comp-col-header">
              <span className="framer-comp-col-title">Noryvex</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-neon)', fontWeight: 600 }}>AI-Powered</span>
            </div>
            <div className="framer-comp-list">
              {[
                'Every call answered instantly',
                'Patients get immediate, helpful responses',
                'Unlimited concurrent call capacity',
                'Full 24/7/365 coverage',
                'Automatic PMS sync and logging',
                'Full call recordings, transcripts, and analytics'
              ].map((item, i) => (
                <div key={i} className="framer-comp-row">
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. RESULTS & TESTIMONIALS ──────────────────────────── */}
      <section className="container" style={{ padding: 'var(--section-padding) 0' }}>
        <div className="framer-section-header">
          <div className="framer-eyebrow">
            <span className="dot" />
            <span>Results</span>
          </div>
          <h2 className="framer-section-title">
            Trusted by dental practices.
          </h2>
        </div>

        <div className="framer-metrics-row">
          <div className="framer-metric-box">
            <div className="framer-metric-number">{metrics.stat1_value || '24/7'}</div>
            <div className="framer-metric-label">{metrics.stat1_label || 'Call coverage'}</div>
          </div>
          <div className="framer-metric-box">
            <div className="framer-metric-number">{metrics.stat2_value || '<500ms'}</div>
            <div className="framer-metric-label">{metrics.stat2_label || 'Voice response time'}</div>
          </div>
          <div className="framer-metric-box">
            <div className="framer-metric-number">{metrics.stat3_value || '48 hrs'}</div>
            <div className="framer-metric-label">{metrics.stat3_label || 'Setup to live'}</div>
          </div>
        </div>

        <div className="framer-testimonials-grid">
          <div className="framer-testimonial-card">
            <p className="framer-quote-text">
              "Noryvex turned our missed calls into a reliable, always-on booking flow. We're capturing patients we used to lose to voicemail."
            </p>
            <div className="framer-author-info">
              <div className="framer-author-avatar">CL</div>
              <div>
                <div className="framer-author-name">Clinic Operations Lead</div>
                <div className="framer-author-role">Multi-location dental group</div>
              </div>
            </div>
          </div>

          <div className="framer-testimonial-card">
            <p className="framer-quote-text">
              "The team understood our workflow quickly and delivered a system that feels completely custom to our practice."
            </p>
            <div className="framer-author-info">
              <div className="framer-author-avatar">PO</div>
              <div>
                <div className="framer-author-name">Practice Owner</div>
                <div className="framer-author-role">Private dental clinic</div>
              </div>
            </div>
          </div>

          <div className="framer-testimonial-card">
            <p className="framer-quote-text">
              "We finally have one partner for voice, automation, and patient communication. Setup was painless."
            </p>
            <div className="framer-author-info">
              <div className="framer-author-avatar">FN</div>
              <div>
                <div className="framer-author-name">Founder</div>
                <div className="framer-author-role">Healthcare services business</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. INTEGRATIONS (TOOLS TICKER) ────────────────────── */}
      <ToolsTicker setActivePage={setActivePage} />

      {/* ── 10. FAQ ─────────────────────────────────────────────── */}
      <section className="container" style={{ padding: 'var(--section-padding) 0' }}>
        <div className="framer-section-header">
          <div className="framer-eyebrow">
            <span className="dot" />
            <span>FAQ</span>
          </div>
          <h2 className="framer-section-title">
            Common questions, clear answers.
          </h2>
        </div>

        <div className="framer-faq-container">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className={`framer-faq-item ${isOpen ? 'open' : ''}`}>
                <button 
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)} 
                  className="framer-faq-trigger"
                >
                  <span style={{ color: 'var(--text-white)' }}>{faq.question}</span>
                  <span className="framer-faq-icon">+</span>
                </button>
                {isOpen && (
                  <div className="framer-faq-body">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 10. FINAL CTA ──────────────────────────────────────── */}
      <section className="container nrx-reveal" style={{ paddingBottom: 'var(--section-padding)' }}>
        <div className="framer-cta-banner">
          <div className="framer-cta-inner">
            <h2>Make your most valuable work run itself.</h2>
            <p>
              Bring us the bottleneck. Noryvex will design and manage the custom AI voice receptionist system that removes it.
            </p>
            <div className="framer-cta-actions">
              <button onClick={() => setActivePage('contact')} className="btn-framer-primary">
                Claim Your Free Clinic Demo <ArrowUpRight size={17} />
              </button>
              <button onClick={() => setActivePage('live-demo')} className="btn-framer-secondary">
                Hear Live Demo
              </button>
            </div>
            <div className="framer-cta-perks">
              <span>✓ HIPAA BAA Signed</span>
              <span>✓ 48-Hour Setup</span>
              <span>✓ No Long-Term Contracts</span>
            </div>
          </div>

          <div className="cta-moving-grills">
            <MovingGrills color="#C7FF3D" mode="cta" />
          </div>
        </div>
      </section>
    </div>
  );
}
