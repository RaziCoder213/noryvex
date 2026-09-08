import React from 'react';
import { 
  Phone, Clock, RefreshCw, MessageSquare, Shield, ShieldAlert,
  ArrowUpRight, CheckCircle2, UserCheck, Stethoscope, HelpCircle, Calendar, FileText, Link2, Cpu
} from 'lucide-react';
import MovingGrills from '../components/MovingGrills';
import ToolsTicker from '../components/ToolsTicker';

export default function Solutions({ setActivePage }) {
  const services = [
    {
      title: 'AI Voice Receptionists',
      desc: 'Custom-trained voice agents that handle patient inbound calls, capture caller details, qualify leads, and schedule appointments 24/7. Includes phone provisioning in any US state.',
      icon: <Phone size={24} />,
    },
    {
      title: 'Clinic FAQ Answering',
      desc: 'Instant patient help — the voice agent answers common questions about hours, location, insurance options, dental services, and pricing, keeping your front desk free.',
      icon: <HelpCircle size={24} />,
    },
    {
      title: 'Booking & Appointment Intake',
      desc: 'Seamless calendar integration. The AI captures preferred dates, times, reasons for the visit, and contact details, pushing scheduling requests instantly to your team.',
      icon: <Calendar size={24} />,
    },
    {
      title: 'CRM & Workflow Automation',
      desc: 'Automated handoffs — call transcripts, lead records, and booking requests sync directly to your EHR, CRM, Google Sheets, or dashboard.',
      icon: <FileText size={24} />,
    },
    {
      title: 'Websites & Web Applications',
      desc: 'Modern web experiences — from marketing landing pages to patient portals, intake forms, and clinic admin dashboards built to convert and scale.',
      icon: <Link2 size={24} />,
    },
    {
      title: 'Custom Software & Apps',
      desc: 'Bespoke digital tools — internal management panels, API integrations, and customized software systems mapped to your exact practice workflows.',
      icon: <Cpu size={24} />,
    },
  ];

  const securityPoints = [
    {
      title: 'HIPAA Compliance & BAAs',
      desc: 'All call logs, transcripts, and patient details are handled through secure, HIPAA-compliant pipelines. We sign Business Associate Agreements (BAAs) with all healthcare clients.',
    },
    {
      title: 'AI Safety & Medical Disclaimer',
      desc: 'Our AI receptionists do not give clinical or medical advice. They are configured to answer pre-approved FAQs, collect contact details, schedule appointments, and route emergency calls to your live staff.',
    },
    {
      title: 'Secure US Infrastructure',
      desc: 'All telephone routing, speech synthesis, and database servers run on encrypted US-based cloud infrastructure with TLS 1.3 in-transit and AES-256 at-rest encryption.',
    },
  ];

  return (
    <div className="home-page-container">

      {/* Hero */}
      <section className="framer-hero">
        <div className="framer-hero-glow" />
        <div className="container framer-hero-content">
          <div className="framer-pill-badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-neon)', boxShadow: '0 0 8px var(--accent-neon)' }} />
            <span>Solutions</span>
          </div>
          <h1 className="framer-hero-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            Everything your practice needs.<br />Nothing it doesn't.
          </h1>
          <p className="framer-hero-desc">
            Done-for-you AI call handling, workflow automation, and custom software for dental clinics. We manage the entire process end-to-end.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container" style={{ padding: 'var(--section-padding) 0' }}>
        <div className="framer-section-header">
          <div className="framer-eyebrow">
            <span className="dot" />
            <span>Our Services</span>
          </div>
          <h2 className="framer-section-title">What we build and manage for you.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--card-gap)' }}>
          {services.map((svc, i) => (
            <div key={i} className="framer-bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="framer-bento-content">
                <div className="framer-bento-icon-wrap">
                  {svc.icon}
                </div>
                <h3 className="framer-bento-title">{svc.title}</h3>
                <p className="framer-bento-desc">{svc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Compliance */}
      <section style={{ padding: 'var(--section-padding) 0', background: 'transparent' }}>
        <div className="container">
          <div className="framer-section-header">
            <div className="framer-eyebrow">
              <span className="dot" />
              <span>Security</span>
            </div>
            <h2 className="framer-section-title">
              <ShieldAlert size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '10px', color: 'var(--accent-neon)' }} />
              HIPAA Compliance & Patient Data Security
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {securityPoints.map((sp, i) => (
              <div key={i} style={{
                background: 'var(--bg-charcoal)',
                border: '1px solid var(--border-light)',
                borderRadius: '16px',
                padding: 'var(--card-padding)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px'
                }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-neon)', flexShrink: 0 }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-white)', margin: 0 }}>{sp.title}</h4>
                </div>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  {sp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <ToolsTicker setActivePage={setActivePage} />

      {/* CTA */}
      <section className="container nrx-reveal" style={{ padding: 'var(--section-padding) 0' }}>
        <div className="framer-cta-banner">
          <div className="framer-cta-inner">
            <h2>Ready to upgrade your front desk?</h2>
            <p>We'll build a free AI receptionist demo customized to your practice — hear it before you commit.</p>
            <div className="framer-cta-actions">
              <button onClick={() => setActivePage('contact')} className="btn-framer-primary">
                Claim Your Free Clinic Demo <ArrowUpRight size={17} />
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
