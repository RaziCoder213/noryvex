import React from 'react';
import { Mail, Globe, ArrowUpRight, Award, Shield, Code, Server } from 'lucide-react';

const Linkedin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function About() {
  const skills = [
    { name: "Voice Prompts Review", icon: <Code size={18} /> },
    { name: "Dental FAQ Training", icon: <Award size={18} /> },
    { name: "Calendar Synchronization", icon: <Server size={18} /> },
    { name: "Emergency Escalation", icon: <Shield size={18} /> }
  ];

  return (
    <div className="about-page page-enter">
      <section className="about-hero" style={{ padding: 'var(--hero-padding-top-desktop) 0 var(--hero-padding-bottom-desktop) 0', background: 'linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-pure) 100%)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag txt-slide" style={{ margin: '0 auto 16px auto' }}>OUR STORY</span>
          <h1 className="about-title txt-reveal" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px' }}>Stop losing patients to missed calls</h1>
          <p className="about-subtitle txt-blur-in" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-gray)', lineHeight: '1.6' }}>
            Noryvex is a managed AI receptionist agency. We build, train, test, and monitor custom voice agents for dental clinics so your front desk never has to worry about missed calls again.
          </p>
        </div>
      </section>

      <section className="about-content-section" style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-pure)' }}>
        <div className="container about-grid">
          
          {/* Text Story */}
          <div className="story-text-container">
            <h2 className="story-heading" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '24px', color: 'var(--text-white)' }}>Our Founder's Review Process</h2>
            <p className="story-paragraph" style={{ fontSize: '1.05rem', color: 'var(--text-gray)', lineHeight: '1.7', marginBottom: '20px' }}>
              Every AI receptionist built by Noryvex undergoes a 4-step manual quality control review by our founder, Muhammad Razi, before deployment. We test for pronunciation clarity, FAQ accuracy, calendar sync reliability, and emergency escalation routing so you can launch with 100% confidence.
            </p>
            <p className="story-paragraph" style={{ fontSize: '1.05rem', color: 'var(--text-gray)', lineHeight: '1.7', marginBottom: '24px' }}>
              Our agency handles the entire lifecycle: initial design, voice prompt training, software integration, active sandbox testing, and monthly operational support. You don't have to learn new software, write AI instructions, or build dashboards.
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
            </div>
          </div>

          {/* Founder Section */}
          <div className="founder-card-wrapper" itemScope itemType="https://schema.org/Person">
            <div className="glass-card founder-card">
              <div className="founder-avatar-wrapper">
                <svg className="founder-avatar" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="48" fill="#121215" stroke="#C7FF3D" strokeWidth="2"/>
                  <path d="M50 20C40.0589 20 32 28.0589 32 38C32 46.1248 37.4002 52.9866 44.8 55.2285C33.1557 57.6534 24 67.8732 24 80H76C76 67.8732 66.8443 57.6534 55.2 55.2285C62.5998 52.9866 68 46.1248 68 38C68 28.0589 59.9411 20 50 20Z" fill="#C7FF3D" opacity="0.85"/>
                </svg>
                <div className="avatar-glow"></div>
              </div>
              <span className="founder-label" itemProp="jobTitle">Founder &amp; Agency Lead</span>
              <h3 className="founder-name" itemProp="name">Muhammad Razi</h3>
              <p className="founder-title">Founder &amp; Full-Stack AI Developer at <span itemProp="worksFor">Noryvex</span></p>
              <p className="founder-bio" itemProp="description">
                Muhammad Razi is the founder of Noryvex. Razi personally reviews, configures, and tests every clinic's receptionist configuration to ensure patient conversations feel natural, clinic scheduling works seamlessly, and FAQs are answered accurately.
              </p>
              
              <div className="founder-skills">
                {skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill.icon} {skill.name}
                  </span>
                ))}
              </div>

              <div className="founder-links">
                <a href="https://www.linkedin.com/in/mrazi-dev/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary founder-link-btn" itemProp="sameAs">
                  <Linkedin size={18} /> LinkedIn <ArrowUpRight size={14} />
                </a>
                <a href="mailto:razi@trynoryvex.com" className="btn btn-outline-neon founder-link-btn" itemProp="email">
                  <Mail size={18} /> Email
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 64px;
          align-items: flex-start;
        }

        .story-text-container {
          text-align: left;
        }

        .stats-strip {
          display: flex;
          gap: 40px;
          margin-top: 48px;
          border-top: 1px solid var(--border-light);
          padding-top: 32px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-num {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--accent-neon);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 8px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* Founder Card */
        .founder-card-wrapper {
          position: relative;
        }

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

        .founder-avatar {
          width: 100%;
          height: 100%;
          z-index: 2;
          position: relative;
        }

        .avatar-glow {
          position: absolute;
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          background: var(--accent-neon);
          opacity: 0.25;
          filter: blur(25px);
          border-radius: 50%;
          z-index: 1;
        }

        .founder-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-neon);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 8px;
        }

        .founder-name {
          font-size: 1.75rem;
          margin-bottom: 4px;
        }

        .founder-title {
          font-size: 0.95rem;
          color: var(--text-gray);
          margin-bottom: 20px;
        }

        .founder-bio {
          font-size: 0.95rem;
          color: var(--text-light);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .founder-skills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
        }

        .skill-tag {
          font-size: 0.75rem;
          background: var(--bg-preview-card);
          border: 1px solid var(--border-light);
          padding: 6px 12px;
          border-radius: 6px;
          color: var(--text-gray);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .founder-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .founder-link-btn {
          width: 100%;
          font-size: 0.85rem;
        }

        @media (max-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .founder-card {
            max-width: 500px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .about-hero {
            padding-top: var(--hero-padding-top-mobile) !important;
            padding-bottom: var(--hero-padding-bottom-mobile) !important;
          }
          .about-title {
            font-size: clamp(2rem, 8vw, 2.6rem) !important;
          }
          .about-subtitle {
            font-size: 1.05rem;
          }
          .story-heading {
            font-size: 1.75rem;
          }
          .stats-strip {
            gap: 20px;
            flex-wrap: wrap;
            margin-top: 32px;
            padding-top: 24px;
          }
          .stat-num {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .founder-links {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .stats-strip {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
