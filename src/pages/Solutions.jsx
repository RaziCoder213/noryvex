import React from 'react';
import { Phone, HelpCircle, Calendar, FileText, Link2, Cpu, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Solutions({ setActivePage }) {
  const solutionsList = [
    {
      title: "1. Voice receptionist for dental clinics",
      desc: "Your AI receptionist answers calls in a natural voice, asks the right questions, and captures the details your team needs.",
      icon: <Phone size={24} />
    },
    {
      title: "2. FAQ answering",
      desc: "The AI can answer common questions about hours, location, services, insurance basics, pricing guidance, and appointment process.",
      icon: <HelpCircle size={24} />
    },
    {
      title: "3. Appointment request workflow",
      desc: "The AI collects preferred time, reason for visit, caller details, and urgency. Your staff can confirm the appointment safely.",
      icon: <Calendar size={24} />
    },
    {
      title: "4. Dashboard and handoff",
      desc: "Every call can be sent to email, Google Sheets, Airtable, calendar, CRM, or a simple dashboard depending on your workflow.",
      icon: <FileText size={24} />
    },
    {
      title: "5. CRM and calendar integrations",
      desc: "We can connect to your existing tools when possible. If direct integration is not available, we start with email notifications and a simple dashboard.",
      icon: <Link2 size={24} />,
      disclaimer: "Direct CRM or calendar integration depends on the tools your clinic uses. If direct integration is not available, we start with email notifications and a simple dashboard."
    },
    {
      title: "6. Monthly management",
      desc: "We review calls, update FAQs, improve prompts, and keep the receptionist aligned with your clinic.",
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

          {/* AI / Medical Safety Disclaimer Box */}
          <div className="safety-disclaimer-box glass-card" style={{ marginTop: '48px', background: 'rgba(199, 255, 61, 0.02)', border: '1px solid rgba(199, 255, 61, 0.15)', display: 'flex', gap: '16px', alignItems: 'start' }}>
            <ShieldAlert size={24} style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-white)', marginBottom: '4px' }}>AI Medical Safety Disclaimer</h4>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', lineHeight: '1.45', margin: 0 }}>
                The AI does not give medical advice. It collects details, answers approved clinic FAQs, and routes urgent cases according to your clinic’s instructions.
              </p>
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
