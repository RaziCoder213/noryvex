import React, { useState, useEffect } from 'react';
import { Mail, ArrowUpRight, Award, Shield, Code, Server, CheckCircle } from 'lucide-react';

/* ── Inline SVG icon components ── */
const Linkedin = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterX = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ── Default profile (used when Admin hasn't saved a custom profile yet) ── */
const DEFAULT_PROFILE = {
  founderName:    'Muhammad Razi',
  founderTitle:   'Founder & Full-Stack AI Developer',
  founderBio:     "Muhammad Razi is the founder of Noryvex. Razi personally reviews, configures, and tests every clinic's receptionist configuration to ensure patient conversations feel natural, clinic scheduling works seamlessly, and FAQs are answered accurately.",
  founderPhoto:   '',
  founderLinkedIn:'https://www.linkedin.com/in/mrazi-dev/',
  founderTwitter: '',
  founderGitHub:  'https://github.com/RaziCoder213',
  founderEmail:   'razi@trynoryvex.com',
  companyLinkedIn:'',
  companyTwitter: '',
};

const BRAND_PROFILE_KEY = 'noryvex_brand_profile';

const values = [
  {
    icon: <Shield size={22} />,
    title: 'Transparency First',
    body: 'No black-box AI. Every prompt, voice script, and FAQ training doc is yours — we hand it all over at the end of setup.',
  },
  {
    icon: <CheckCircle size={22} />,
    title: '48-Hour Deployment',
    body: 'We respect your time. From kickoff call to live production, our proven workflow puts you live in under two days.',
  },
  {
    icon: <Award size={22} />,
    title: 'Founder-Reviewed',
    body: "Every AI receptionist is personally tested by Muhammad Razi before it touches a single patient call. No QA shortcuts.",
  },
  {
    icon: <Code size={22} />,
    title: 'Built for Dentistry',
    body: 'HIPAA compliance, BAA agreements, dental FAQ libraries, and appointment routing logic — purpose-built, not retrofitted.',
  },
];

export default function About() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  /* Load admin-saved brand profile from localStorage */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BRAND_PROFILE_KEY);
      if (saved) setProfile(prev => ({ ...prev, ...JSON.parse(saved) }));
    } catch (_) { /* fallback to defaults */ }
  }, []);

  const skills = [
    { name: 'Voice Prompts Review',      icon: <Code size={16} /> },
    { name: 'Dental FAQ Training',        icon: <Award size={16} /> },
    { name: 'Calendar Synchronization',   icon: <Server size={16} /> },
    { name: 'Emergency Escalation Setup', icon: <Shield size={16} /> },
  ];

  const founderLinks = [
    profile.founderLinkedIn && { href: profile.founderLinkedIn, icon: <Linkedin size={16} />, label: 'LinkedIn',   cls: 'btn-secondary' },
    profile.founderGitHub   && { href: profile.founderGitHub,   icon: <Github   size={16} />, label: 'GitHub',     cls: 'btn-secondary' },
    profile.founderTwitter  && { href: profile.founderTwitter,  icon: <TwitterX size={16} />, label: 'Twitter / X', cls: 'btn-secondary' },
    profile.founderEmail    && { href: `mailto:${profile.founderEmail}`, icon: <Mail size={16} />, label: 'Email', cls: 'btn-outline-neon', isEmail: true },
    profile.companyLinkedIn && { href: profile.companyLinkedIn, icon: <Linkedin size={16} />, label: 'Company LinkedIn', cls: 'btn-secondary' },
    profile.companyTwitter  && { href: profile.companyTwitter,  icon: <TwitterX size={16} />, label: 'Company Twitter',  cls: 'btn-secondary' },
  ].filter(Boolean);

  return (
    <div className="about-page page-enter">

      {/* ── Hero ── */}
      <section className="about-hero" style={{
        padding: 'var(--hero-padding-top-desktop) 0 var(--hero-padding-bottom-desktop) 0',
        background: 'linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-pure) 100%)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag txt-slide" style={{ margin: '0 auto 16px auto' }}>OUR STORY</span>
          <h1 className="about-title txt-reveal" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px' }}>
            Stop losing patients to missed calls
          </h1>
          <p className="about-subtitle txt-blur-in" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-gray)', lineHeight: '1.6' }}>
            Noryvex is a managed AI receptionist agency built specifically for US dental clinics. We build, train, test, and monitor custom voice agents so your front desk never loses another patient call.
          </p>
        </div>
      </section>

      {/* ── Story + Founder ── */}
      <section className="about-content-section" style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-pure)' }}>
        <div className="container about-grid">

          {/* Left: Story text */}
          <div className="story-text-container">
            <h2 className="story-heading" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '24px', color: 'var(--text-white)' }}>
              Our Founder's Review Process
            </h2>
            <p className="story-paragraph" style={{ fontSize: '1.05rem', color: 'var(--text-gray)', lineHeight: '1.7', marginBottom: '20px' }}>
              Every AI receptionist built by Noryvex undergoes a 4-step manual quality control review by our founder before deployment. We test for pronunciation clarity, FAQ accuracy, calendar sync reliability, and emergency escalation routing — so you can launch with 100% confidence.
            </p>
            <p className="story-paragraph" style={{ fontSize: '1.05rem', color: 'var(--text-gray)', lineHeight: '1.7', marginBottom: '24px' }}>
              Our agency handles the entire lifecycle: initial design, voice prompt training, software integration, active sandbox testing, and monthly operational support. You don't have to learn new software, write AI instructions, or build dashboards — that's our job.
            </p>

            <div className="stats-strip">
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Built For You</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">0</span>
                <span className="stat-label">Software to Learn</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">48h</span>
                <span className="stat-label">Live Deployment</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">24/7</span>
                <span className="stat-label">Call Coverage</span>
              </div>
            </div>
          </div>

          {/* Right: Founder card — driven by Admin brand profile */}
          <div className="founder-card-wrapper" itemScope itemType="https://schema.org/Person">
            <div className="glass-card founder-card">

              {/* Photo */}
              <div className="founder-avatar-wrapper">
                {profile.founderPhoto ? (
                  <img
                    src={profile.founderPhoto}
                    alt={`${profile.founderName} — Founder of Noryvex`}
                    className="founder-photo-img"
                    itemProp="image"
                  />
                ) : (
                  <svg className="founder-avatar" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" fill="#121215" stroke="#C7FF3D" strokeWidth="2"/>
                    <path d="M50 20C40.0589 20 32 28.0589 32 38C32 46.1248 37.4002 52.9866 44.8 55.2285C33.1557 57.6534 24 67.8732 24 80H76C76 67.8732 66.8443 57.6534 55.2 55.2285C62.5998 52.9866 68 46.1248 68 38C68 28.0589 59.9411 20 50 20Z" fill="#C7FF3D" opacity="0.85"/>
                  </svg>
                )}
                <div className="avatar-glow"></div>
              </div>

              <span className="founder-label" itemProp="jobTitle">Founder &amp; Agency Lead</span>
              <h3 className="founder-name" itemProp="name">{profile.founderName}</h3>
              <p className="founder-title">
                {profile.founderTitle} at <span itemProp="worksFor">Noryvex</span>
              </p>
              <p className="founder-bio" itemProp="description">{profile.founderBio}</p>

              {/* Skill tags */}
              <div className="founder-skills">
                {skills.map((s, i) => (
                  <span key={i} className="skill-tag">{s.icon} {s.name}</span>
                ))}
              </div>

              {/* Social links — rendered dynamically from saved profile */}
              {founderLinks.length > 0 && (
                <div className="founder-links">
                  {founderLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target={link.isEmail ? undefined : '_blank'}
                      rel={link.isEmail ? undefined : 'noopener noreferrer'}
                      className={`btn ${link.cls} founder-link-btn`}
                      itemProp="sameAs"
                    >
                      {link.icon} {link.label} {!link.isEmail && <ArrowUpRight size={13} />}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Company Values ── */}
      <section style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="section-tag" style={{ margin: '0 auto 16px auto' }}>HOW WE OPERATE</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-white)', margin: '0 auto', maxWidth: 600 }}>
              Built on principles that protect your patients
            </h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="glass-card values-card">
                <div className="values-icon-wrap">{v.icon}</div>
                <h3 className="values-title">{v.title}</h3>
                <p className="values-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ── Layout ── */
        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 64px;
          align-items: flex-start;
        }
        .story-text-container { text-align: left; }

        /* ── Stats strip ── */
        .stats-strip {
          display: flex;
          gap: 32px;
          margin-top: 48px;
          border-top: 1px solid var(--border-light);
          padding-top: 32px;
          flex-wrap: wrap;
        }
        .stat-item { display: flex; flex-direction: column; }
        .stat-num {
          font-family: var(--font-display);
          font-size: 2.3rem;
          font-weight: 800;
          color: var(--accent-neon);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 6px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* ── Founder card ── */
        .founder-card-wrapper { position: relative; }
        .founder-card {
          text-align: center;
          padding: 40px 32px;
          border-color: var(--border-light);
        }
        .founder-avatar-wrapper {
          width: 140px;
          height: 140px;
          margin: 0 auto 24px auto;
          position: relative;
        }
        .founder-photo-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          position: relative;
          z-index: 2;
          border: 2px solid #C7FF3D;
        }
        .founder-avatar {
          width: 100%;
          height: 100%;
          z-index: 2;
          position: relative;
        }
        .avatar-glow {
          position: absolute;
          width: 80%; height: 80%;
          top: 10%; left: 10%;
          background: var(--accent-neon);
          opacity: 0.22;
          filter: blur(25px);
          border-radius: 50%;
          z-index: 1;
        }
        .founder-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--accent-neon);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 8px;
        }
        .founder-name  { font-size: 1.75rem; margin-bottom: 4px; }
        .founder-title { font-size: 0.9rem; color: var(--text-gray); margin-bottom: 18px; }
        .founder-bio   { font-size: 0.92rem; color: var(--text-light); line-height: 1.65; margin-bottom: 22px; text-align: left; }
        .founder-skills {
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: 8px; margin-bottom: 28px;
        }
        .skill-tag {
          font-size: 0.73rem;
          background: var(--bg-preview-card);
          border: 1px solid var(--border-light);
          padding: 5px 11px; border-radius: 6px;
          color: var(--text-gray);
          display: flex; align-items: center; gap: 5px;
        }
        .founder-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .founder-link-btn { width: 100%; font-size: 0.82rem; gap: 6px; }

        /* ── Values grid ── */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .values-card { padding: 28px 24px; }
        .values-icon-wrap {
          width: 44px; height: 44px;
          background: rgba(199,255,61,0.08);
          border: 1px solid rgba(199,255,61,0.15);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-neon);
          margin-bottom: 18px;
        }
        .values-title { font-size: 1rem; font-weight: 700; color: var(--text-white); margin-bottom: 10px; }
        .values-body  { font-size: 0.87rem; color: var(--text-gray); line-height: 1.6; margin: 0; }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .values-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 1024px) {
          .about-grid { grid-template-columns: 1fr; gap: 48px; }
          .founder-card { max-width: 500px; margin: 0 auto; }
        }
        @media (max-width: 768px) {
          .about-hero { padding-top: var(--hero-padding-top-mobile) !important; padding-bottom: var(--hero-padding-bottom-mobile) !important; }
          .about-title { font-size: clamp(2rem, 8vw, 2.6rem) !important; }
          .about-subtitle { font-size: 1rem; }
          .story-heading { font-size: 1.75rem; }
          .stats-strip { gap: 20px; margin-top: 32px; padding-top: 24px; }
          .stat-num { font-size: 2rem; }
          .values-grid { grid-template-columns: 1fr; gap: 16px; }
        }
        @media (max-width: 480px) {
          .founder-links { grid-template-columns: 1fr; gap: 10px; }
        }
      `}</style>
    </div>
  );
}
