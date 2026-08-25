import React from 'react';
import { Phone, HelpCircle, Calendar, FileText, Link2, Cpu, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Solutions({ setActivePage }) {
  const solutionsList = [
    {
      title: "CH.01: AI Voice Receptionists",
      desc: "Our flagship conversational voice agents. We build custom-trained receptionists that handle patient inbound calls, capture caller details, qualify leads, and schedule appointments 24/7. Includes phone provisioning in any US state.",
      icon: <Phone size={24} />
    },
    {
      title: "CH.02: Clinic FAQ Answering",
      desc: "Instant patient help. The voice agent answers common questions about opening hours, location/parking directions, insurance options, dental services, and pricing ranges, keeping your front desk free.",
      icon: <HelpCircle size={24} />
    },
    {
      title: "CH.03: Booking & Appointment Intake",
      desc: "Seamless calendar integration. The AI captures preferred dates and times, reasons for the visit, and client contact details, pushing scheduling requests instantly to your team.",
      icon: <Calendar size={24} />
    },
    {
      title: "CH.04: CRM & Workflow Automation",
      desc: "Fully automated handoffs. We sync call transcripts, lead records, and client booking requests directly to your existing EHR, CRM, Google Sheets, or dashboard email triggers.",
      icon: <FileText size={24} />
    },
    {
      title: "CH.05: Websites & Web Applications",
      desc: "Modern web experiences. From lightning-fast marketing landing pages to interactive patient portals, intake forms, and clinic admin dashboards built to convert traffic and scale operations.",
      icon: <Link2 size={24} />
    },
    {
      title: "CH.06: Custom Software & Apps",
      desc: "Bespoke digital architecture. We build specialized database tools, internal client management panels, API integrations, and customized software systems mapped to your exact practice workflows.",
      icon: <Cpu size={24} />
    }
  ];

  return (
    <div className="solutions-page page-enter">
      {/* Solutions Hero */}
      <section className="solutions-hero" style={{ padding: 'var(--hero-padding-top-desktop) 0 var(--hero-padding-bottom-desktop) 0', background: 'linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-pure) 100%)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag txt-slide" style={{ margin: '0 auto 16px auto' }}>SOLUTIONS</span>
          <h1 className="solutions-title txt-reveal" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px' }}>Dental AI Receptionist Solutions</h1>
          <p className="solutions-subtitle txt-blur-in" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-gray)', lineHeight: '1.6' }}>
            Done-for-you AI call handling for dental clinics. We help answer missed calls, capture patient details, handle FAQs, and send appointment requests to your team.
          </p>
        </div>
      </section>

      {/* Solutions Details Grid */}
      <section className="solutions-details" style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-pure)' }}>
        <div className="container">
          <div className="sol-grid">
            {solutionsList.map((sol, index) => (
              <div key={index} className="glass-card sol-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="sol-icon-bg" style={{ width: '48px', height: '48px', background: 'rgba(199, 255, 61, 0.08)', border: '1px solid var(--accent-neon-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-neon)', marginBottom: '20px' }}>
                  {sol.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-white)', marginBottom: '12px' }}>{sol.title}</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', lineHeight: '1.5', flexGrow: 1, margin: 0 }}>{sol.desc}</p>
                
                {sol.disclaimer && (
                  <div style={{ marginTop: '16px', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', borderLeft: '3px solid var(--accent-neon)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                      <strong>Disclaimer:</strong> {sol.disclaimer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* HIPAA & Patient Data Security Section */}
          <div className="security-compliance-box glass-card" style={{ marginTop: '48px', padding: '32px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-white)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert style={{ color: 'var(--accent-neon)' }} size={26} /> HIPAA Compliance &amp; Patient Data Security
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-white)', marginBottom: '8px' }}>🔐 HIPAA Compliance &amp; BAAs</h4>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: '1.55', margin: 0 }}>
                  We understand the importance of patient privacy. Noryvex signs standard Business Associate Agreements (BAAs) and ensures all call logs, transcripts, and patient details are handled through secure, HIPAA-compliant speech and database pipelines.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-white)', marginBottom: '8px' }}>🛡️ AI Safety &amp; Medical Disclaimer</h4>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: '1.55', margin: 0 }}>
                  Our AI receptionists do not give clinical or medical advice. They are strictly configured to answer pre-approved practice FAQs, collect contact details, schedule appointment slots, and route emergency calls directly to your live clinical staff.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-white)', marginBottom: '8px' }}>💻 Secure US Infrastructure</h4>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: '1.55', margin: 0 }}>
                  All customer telephone line routing, speech synthesis services, and database servers run on highly secure, encrypted US-based cloud infrastructure (TLS 1.3 in-transit and AES-256 at-rest encryption).
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div style={{ textAlign: 'center', marginTop: '64px' }}>
            <button 
              onClick={() => setActivePage('contact', 'trial')} 
              className="btn btn-primary btn-lg"
            >
              Get Free Clinic Demo <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .sol-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--card-gap-desktop);
        }
        @media (max-width: 992px) {
          .sol-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .sol-grid {
            grid-template-columns: 1fr;
            gap: var(--card-gap-mobile);
          }
          .solutions-hero {
            padding-top: var(--hero-padding-top-mobile) !important;
            padding-bottom: var(--hero-padding-bottom-mobile) !important;
          }
          .solutions-title {
            font-size: clamp(2rem, 8vw, 2.6rem) !important;
          }
        }
      `}</style>
    </div>
  );
}
