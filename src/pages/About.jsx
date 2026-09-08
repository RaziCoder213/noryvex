import React, { useState, useEffect } from 'react';
import { Mail, ArrowUpRight, Award, Shield, Code, CheckCircle, Clock, Users } from 'lucide-react';
import MovingGrills from '../components/MovingGrills';
import { dbGetMetrics } from '../utils/dbHelper';

/* ── Inline SVG icons ── */
const Linkedin = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const DEFAULT_PROFILE = {
  founderName:    'Muhammad Razi',
  founderTitle:   'Founder & Lead AI Architect',
  founderBio:     "Muhammad Razi personally reviews, configures, and tests every clinic's AI receptionist before deployment — ensuring patient conversations feel natural, scheduling works seamlessly, and FAQs are answered accurately.",
  founderPhoto:   '',
  founderLinkedIn:'https://www.linkedin.com/in/mrazi-dev/',
  founderGitHub:  'https://github.com/RaziCoder213',
  founderEmail:   'razi@trynoryvex.com',
};

const BRAND_PROFILE_KEY = 'noryvex_brand_profile';

const values = [
  {
    icon: <Shield size={22} />,
    title: 'Transparency First',
    body: 'No black-box AI. Every voice script, FAQ doc, and configuration is fully yours — we hand it all over at the end of setup.',
  },
  {
    icon: <Clock size={22} />,
    title: '48-Hour Deployment',
    body: 'From kickoff call to live production, our proven workflow puts you live in under two days. We respect your time.',
  },
  {
    icon: <Award size={22} />,
    title: 'Founder-Reviewed',
    body: "Every AI receptionist is personally tested by Muhammad Razi before it handles a single patient call. No QA shortcuts.",
  },
  {
    icon: <Code size={22} />,
    title: 'Built for Dentistry',
    body: 'HIPAA compliance, BAA agreements, dental FAQ libraries, and appointment routing — purpose-built, not retrofitted.',
  },
];

const processSteps = [
  { num: '01', title: 'Voice Script Design', desc: 'We write natural conversational scripts tailored to your practice — greeting, FAQs, appointment capture, and emergency routing.' },
  { num: '02', title: 'FAQ & Knowledge Training', desc: 'Your services, insurance policies, hours, directions, and procedures are trained into the system with precise dental terminology.' },
  { num: '03', title: 'Integration & Testing', desc: 'We connect to your PMS, calendar, and CRM. Then we run sandbox calls to verify every flow before going live.' },
  { num: '04', title: 'Live Deployment & Monitoring', desc: 'Your Noryvex line goes live. We monitor call quality, refine responses, and provide ongoing optimization.' },
];

export default function About({ setActivePage }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [metrics, setMetrics] = useState({
    stat1_value: '24/7',
    stat1_label: 'Call Coverage',
    stat2_value: '<500ms',
    stat2_label: 'Voice response time',
    stat3_value: '48 hrs',
    stat3_label: 'Setup Time',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BRAND_PROFILE_KEY);
      if (saved) setProfile(prev => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}

    dbGetMetrics()
      .then(data => {
        if (data && data.stat1_value) setMetrics(data);
      })
      .catch(() => {});
  }, []);

  const founderLinks = [
    profile.founderLinkedIn && { href: profile.founderLinkedIn, icon: <Linkedin size={16} />, label: 'LinkedIn' },
    profile.founderGitHub && { href: profile.founderGitHub, icon: <Github size={16} />, label: 'GitHub' },
    profile.founderEmail && { href: `mailto:${profile.founderEmail}`, icon: <Mail size={16} />, label: 'Email', isEmail: true },
  ].filter(Boolean);

  return (
    <div className="home-page-container">

      {/* Hero */}
      <section className="framer-hero">
        <div className="framer-hero-glow" />
        <div className="container framer-hero-content">
          <div className="framer-pill-badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-neon)', boxShadow: '0 0 8px var(--accent-neon)' }} />
            <span>About Noryvex</span>
          </div>
          <h1 className="framer-hero-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            Your practice deserves more<br />than voicemail.
          </h1>
          <p className="framer-hero-desc" style={{ maxWidth: '620px' }}>
            Noryvex builds and manages custom AI voice receptionists for dental clinics. We handle the entire lifecycle — from voice design to deployment to ongoing optimization.
          </p>
        </div>
      </section>

      {/* Story + Founder — Two column */}
      <section className="container" style={{ padding: 'var(--section-padding) 0' }}>
        <div className="about-layout">

          {/* Left: Story */}
          <div>
            <div className="framer-eyebrow" style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
              <span className="dot" />
              <span>Our Approach</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700,
              color: 'var(--text-white)', letterSpacing: '-0.03em', lineHeight: 1.2,
              marginBottom: '24px',
            }}>
              Every receptionist is founder-reviewed before it touches a patient call.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-gray)', lineHeight: 1.65, marginBottom: '16px' }}>
              We test for pronunciation clarity, FAQ accuracy, calendar sync reliability, and emergency escalation routing — so you can launch with 100% confidence.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-gray)', lineHeight: 1.65, marginBottom: '32px' }}>
              Our team handles the entire lifecycle: voice prompt design, software integration, active sandbox testing, and monthly operational support. You don't have to learn new software or write AI instructions — that's our job.
            </p>

            {/* Stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '28px',
            }}>
              {[
                { num: '100%', label: 'Done-For-You' },
                { num: '0', label: 'Software to Learn' },
                { num: metrics.stat3_value || '48h', label: 'Setup Time' },
                { num: metrics.stat1_value || '24/7', label: metrics.stat1_label || 'Call Coverage' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 800, color: 'var(--accent-neon)', lineHeight: 1,
                  }}>{s.num}</span>
                  <span style={{
                    fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px',
                    textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em',
                  }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Founder card */}
          <div style={{
            background: 'var(--bg-dark)', border: '1px solid var(--border-light)',
            borderRadius: '20px', padding: '36px 28px', textAlign: 'center',
          }} itemScope itemType="https://schema.org/Person">

            {/* Avatar */}
            <div style={{ width: '120px', height: '120px', margin: '0 auto 24px auto', position: 'relative' }}>
              {profile.founderPhoto ? (
                <img src={profile.founderPhoto} alt={profile.founderName}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-neon)', position: 'relative', zIndex: 2 }}
                  itemProp="image"
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: 'var(--bg-charcoal)', border: '2px solid var(--accent-neon)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', fontWeight: 800, color: 'var(--accent-neon)',
                  position: 'relative', zIndex: 2,
                }}>
                  MR
                </div>
              )}
              <div style={{
                position: 'absolute', width: '80%', height: '80%', top: '10%', left: '10%',
                background: 'var(--accent-neon)', opacity: 0.15, filter: 'blur(25px)',
                borderRadius: '50%', zIndex: 1,
              }} />
            </div>

            <span style={{
              fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-neon)',
              textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px',
            }} itemProp="jobTitle">Founder & Agency Lead</span>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '4px' }} itemProp="name">
              {profile.founderName}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-gray)', marginBottom: '18px' }}>
              {profile.founderTitle} at <span itemProp="worksFor">Noryvex</span>
            </p>
            <p style={{
              fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.65,
              marginBottom: '24px', textAlign: 'left',
            }} itemProp="description">
              {profile.founderBio}
            </p>

            {/* Social links */}
            {founderLinks.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {founderLinks.map((link, i) => (
                  <a key={i} href={link.href}
                    target={link.isEmail ? undefined : '_blank'}
                    rel={link.isEmail ? undefined : 'noopener noreferrer'}
                    itemProp="sameAs"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-light)', borderRadius: '10px',
                      color: 'var(--text-gray)', fontSize: '0.82rem', fontWeight: 500,
                      textDecoration: 'none', fontFamily: 'var(--font-sans)',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(199,255,61,0.35)'; e.currentTarget.style.color = 'var(--text-white)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-gray)'; }}
                  >
                    {link.icon} {link.label} {!link.isEmail && <ArrowUpRight size={13} />}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section style={{ padding: 'var(--section-padding) 0', background: 'transparent' }}>
        <div className="container">
          <div className="framer-section-header">
            <div className="framer-eyebrow">
              <span className="dot" />
              <span>Our Process</span>
            </div>
            <h2 className="framer-section-title">How we build your AI receptionist.</h2>
            <p className="framer-section-desc">
              Every deployment follows our 4-step quality control process, personally overseen by our founder.
            </p>
          </div>

          <div className="framer-phases-grid">
            {processSteps.map((step, i) => (
              <div key={i} className="framer-phase-card">
                <span className="framer-phase-badge">Step {step.num}</span>
                <h3 className="framer-phase-title">{step.title}</h3>
                <p className="framer-phase-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container" style={{ padding: 'var(--section-padding) 0' }}>
        <div className="framer-section-header">
          <div className="framer-eyebrow">
            <span className="dot" />
            <span>Our Values</span>
          </div>
          <h2 className="framer-section-title">Built on principles that protect your patients.</h2>
        </div>

        <div className="framer-capability-grid">
          {values.map((v, i) => (
            <div key={i} className="framer-cap-card">
              <div className="framer-cap-icon">{v.icon}</div>
              <h4 className="framer-cap-title">{v.title}</h4>
              <p className="framer-cap-desc">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container nrx-reveal" style={{ paddingBottom: 'var(--section-padding)' }}>
        <div className="framer-cta-banner">
          <div className="framer-cta-inner">
            <h2>Let's build your practice's AI receptionist.</h2>
            <p>We'll create a free custom demo using your real clinic info. Call it, test it, then decide.</p>
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

      <style>{`
        .about-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 56px;
          align-items: flex-start;
        }
        @media (max-width: 1024px) {
          .about-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        @media (max-width: 768px) {
          .about-layout > div:last-child {
            max-width: 480px;
            margin: 0 auto;
          }
        }
        @media (max-width: 600px) {
          .about-layout > div:first-child > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
