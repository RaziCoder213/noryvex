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
    { name: "Full-Stack Development", icon: <Code size={18} /> },
    { name: "AI Voice Architectures", icon: <Award size={18} /> },
    { name: "Database Systems", icon: <Server size={18} /> },
    { name: "Workflow Automations", icon: <Shield size={18} /> }
  ];

  return (
    <div className="about-page page-enter">
      <section className="about-hero">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Story</span>
            <h1 className="about-title">Automating the Future</h1>
            <p className="about-subtitle">At Noryvex, we believe companies should spend their resources on high-leverage growth, not manual workflows. We build the autonomous systems that make that possible.</p>
          </div>
        </div>
      </section>

      <section className="about-content-section">
        <div className="container about-grid">
          
          {/* Text Story */}
          <div className="story-text-container">
            <h2 className="story-heading">Bespoke Autonomous Systems</h2>
            <p className="story-paragraph">
              Noryvex was born out of a simple observation: modern businesses are weighed down by thousands of repetitive conversations and disconnected APIs. While standard SaaS templates exist, they fail to adapt to complex, custom enterprise databases.
            </p>
            <p className="story-paragraph">
              We design and construct high-performance AI layers from scratch. From voice receptionists that integrate directly with scheduling tools and qualify leads, to end-to-end database synchronizations that run completely unattended.
            </p>
            <div className="stats-strip">
              <div className="stat-item">
                <span className="stat-num">800ms</span>
                <span className="stat-label">Voice Latency</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">24/7</span>
                <span className="stat-label">Autonomous Operations</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Bespoke Integration</span>
              </div>
            </div>
          </div>

          {/* Founder Section */}
          <div className="founder-card-wrapper">
            <div className="glass-card founder-card">
              <div className="founder-avatar-wrapper">
                <svg className="founder-avatar" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="48" fill="#121215" stroke="#C7FF3D" strokeWidth="2"/>
                  <path d="M50 20C40.0589 20 32 28.0589 32 38C32 46.1248 37.4002 52.9866 44.8 55.2285C33.1557 57.6534 24 67.8732 24 80H76C76 67.8732 66.8443 57.6534 55.2 55.2285C62.5998 52.9866 68 46.1248 68 38C68 28.0589 59.9411 20 50 20Z" fill="#C7FF3D" opacity="0.85"/>
                </svg>
                <div className="avatar-glow"></div>
              </div>
              <span className="founder-label">Founder & Lead Architect</span>
              <h3 className="founder-name">Muhammad Razi</h3>
              <p className="founder-title">Founder & Full-Stack AI Developer</p>
              <p className="founder-bio">
                Razi is a full-stack engineer and automation developer. He leverages cutting-edge LLMs, backend databases, and APIs to design autonomous voice systems that save business overhead.
              </p>
              
              <div className="founder-skills">
                {skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill.icon} {skill.name}
                  </span>
                ))}
              </div>

              <div className="founder-links">
                <a href="https://www.linkedin.com/in/mrazi-dev/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary founder-link-btn">
                  <Linkedin size={18} /> LinkedIn <ArrowUpRight size={14} />
                </a>
                <a href="mailto:razi@noryvex.com" className="btn btn-outline-neon founder-link-btn">
                  <Mail size={18} /> Email
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        .about-hero {
          padding: 140px 0 40px 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(7,7,8,1) 100%);
        }
        
        .about-title {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }
        
        .about-subtitle {
          font-size: 1.2rem;
          color: var(--text-gray);
          max-width: 650px;
          margin: 0 auto;
        }

        .about-content-section {
          padding: 60px 0 120px 0;
          background-color: var(--bg-dark);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 64px;
          align-items: flex-start;
        }

        .story-text-container {
          text-align: left;
        }

        .story-heading {
          font-size: 2.2rem;
          margin-bottom: 24px;
        }

        .story-paragraph {
          font-size: 1.05rem;
          color: var(--text-gray);
          line-height: 1.7;
          margin-bottom: 24px;
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
          background: rgba(255, 255, 255, 0.03);
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
      `}</style>
    </div>
  );
}
