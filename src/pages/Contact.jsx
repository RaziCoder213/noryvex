import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Clock, Send, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { dbSaveContact, dbSaveMeeting } from '../utils/dbHelper';

export default function Contact({ addToast, initialTab = 'trial' }) {
  const [mode, setMode] = useState('demo'); // 'demo' or 'call'

  const [demoData, setDemoData] = useState({
    clinicName: '',
    clinicWebsite: '',
    clinicLocation: '',
    mainServices: '',
    handling: {
      newPatient: false,
      faqAnswering: false,
      afterHours: false,
      emergencyRouting: false
    },
    integrations: {
      googleCalendar: false,
      calendly: false,
      dentrix: false,
      openDental: false,
      otherCrm: false,
      emailOnly: false
    },
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [meetingData, setMeetingData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });

  const [submittingDemo, setSubmittingDemo] = useState(false);
  const [submittingMeeting, setSubmittingMeeting] = useState(false);
  
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [meetingSuccess, setMeetingSuccess] = useState(false);

  useEffect(() => {
    if (initialTab === 'call') {
      setMode('call');
    } else {
      setMode('demo');
    }
  }, [initialTab]);

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    if (!demoData.clinicName || !demoData.contactName || !demoData.contactEmail) {
      addToast('Clinic Name, Contact Name, and Contact Email are required.', 'error');
      return;
    }
    setSubmittingDemo(true);

    const handlingList = [];
    if (demoData.handling.newPatient) handlingList.push("New Patient Intake");
    if (demoData.handling.faqAnswering) handlingList.push("FAQ Answering");
    if (demoData.handling.afterHours) handlingList.push("After-Hours Calls");
    if (demoData.handling.emergencyRouting) handlingList.push("Emergency Routing");

    const integrationList = [];
    if (demoData.integrations.googleCalendar) integrationList.push("Google Calendar");
    if (demoData.integrations.calendly) integrationList.push("Calendly");
    if (demoData.integrations.dentrix) integrationList.push("Dentrix");
    if (demoData.integrations.openDental) integrationList.push("Open Dental");
    if (demoData.integrations.otherCrm) integrationList.push("Other CRM");
    if (demoData.integrations.emailOnly) integrationList.push("Email Summaries Only");

    const formattedMessage = `
Clinic Website: ${demoData.clinicWebsite || '—'}
Clinic Location: ${demoData.clinicLocation || '—'}
Main Dental Services: ${demoData.mainServices || '—'}

What the AI should handle:
${handlingList.length > 0 ? handlingList.join(', ') : 'None selected'}

Tools to integrate:
${integrationList.length > 0 ? integrationList.join(', ') : 'None selected'}
    `.trim();

    // Map to contacts endpoint payload to bypass the trials unique constraint on emails
    const payload = {
      name: demoData.contactName,
      company: demoData.clinicName,
      email: demoData.contactEmail,
      phone: demoData.contactPhone,
      service: 'AI Receptionist Free Demo Request',
      message: formattedMessage
    };

    try {
      const result = await dbSaveContact(payload);
      if (result.success) {
        addToast('Free clinic demo requested successfully!', 'success');
        setDemoSuccess(true);
        setDemoData({
          clinicName: '',
          clinicWebsite: '',
          clinicLocation: '',
          mainServices: '',
          handling: { newPatient: false, faqAnswering: false, afterHours: false, emergencyRouting: false },
          integrations: { googleCalendar: false, calendly: false, dentrix: false, openDental: false, otherCrm: false, emailOnly: false },
          contactName: '',
          contactEmail: '',
          contactPhone: ''
        });
      } else {
        addToast('Submission failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Submission failed.', 'error');
    } finally {
      setSubmittingDemo(false);
    }
  };

  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    if (!meetingData.name || !meetingData.email || !meetingData.date || !meetingData.time) {
      addToast('Name, Email, Date, and Time are required.', 'error');
      return;
    }
    setSubmittingMeeting(true);

    try {
      const result = await dbSaveMeeting(meetingData);
      if (result.success) {
        addToast('Meeting scheduled successfully!', 'success');
        setMeetingSuccess(true);
        setMeetingData({ name: '', email: '', company: '', phone: '', date: '', time: '', notes: '' });
      } else {
        addToast('Meeting scheduling failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Meeting scheduling failed.', 'error');
    } finally {
      setSubmittingMeeting(false);
    }
  };

  return (
    <div className="contact-page page-enter">
      <section className="contact-hero" style={{ padding: 'var(--hero-padding-top-desktop) 0 var(--hero-padding-bottom-desktop) 0', background: 'linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-pure) 100%)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag txt-slide" style={{ margin: '0 auto 16px auto' }}>GET IN TOUCH</span>
          <h1 className="contact-title txt-reveal" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px' }}>Start Automating Today</h1>
          <p className="contact-subtitle txt-blur-in" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-gray)', lineHeight: '1.6' }}>
            Get a custom AI receptionist demo built specifically for your clinic. Pay only when you decide to launch the full system.
          </p>
        </div>
      </section>

      <section className="contact-forms-section" style={{ padding: 'var(--section-padding-desktop) 0', background: 'var(--bg-pure)' }}>
        <div className="container forms-container">
          
          {/* Column 1: Info & Trial Terms */}
          <div className="form-column">
            <div className="glass-card contact-info-card">
              <div className="card-header-icon-title">
                <Sparkles className="title-icon icon-neon" />
                <h2>Get Your Free Clinic Demo</h2>
              </div>
              <p className="card-desc" style={{ marginBottom: '24px' }}>
                We build a short AI receptionist demo for your dental clinic using your real services, hours, and FAQs. If you like it, we launch the full system and connect it to your workflow.
              </p>

              {/* Trial terms list */}
              <div className="trial-terms-box" style={{ background: 'rgba(199, 255, 61, 0.04)', border: '1px dashed rgba(199, 255, 61, 0.2)', padding: '20px', borderRadius: '12px', marginBottom: '28px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-white)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '800' }}>Demo Process:</h3>
                <ul className="trial-terms-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--text-gray)' }}>
                    <CheckCircle2 size={16} color="#C7FF3D" style={{ flexShrink: 0 }} />
                    <span>No software to learn. No dashboard to configure. We build and manage everything for you.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--text-gray)' }}>
                    <CheckCircle2 size={16} color="#C7FF3D" style={{ flexShrink: 0 }} />
                    <span>We assign a phone number in any US state for your clinic's demo.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--text-gray)' }}>
                    <CheckCircle2 size={16} color="#C7FF3D" style={{ flexShrink: 0 }} />
                    <span>You only pay when you decide to launch the full system.</span>
                  </li>
                </ul>
              </div>

              <div className="contact-details-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="contact-detail-item" style={{ display: 'flex', gap: '14px' }}>
                  <ShieldCheck size={22} className="icon-neon" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: 'var(--text-white)', fontSize: '0.95rem', marginBottom: '4px', fontWeight: '700' }}>Manual Setup & Integration</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.45' }}>Muhammad Razi personally configures, tests, and deploys your custom voice model parameters to guarantee elite conversational performance.</p>
                  </div>
                </div>
                <div className="contact-detail-item" style={{ display: 'flex', gap: '14px' }}>
                  <Clock size={22} className="icon-neon" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: 'var(--text-white)', fontSize: '0.95rem', marginBottom: '4px', fontWeight: '700' }}>Under 48-Hour Setup</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.45' }}>After submitting, we'll build your prototype and reach out within 48 hours to let you test it.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Dynamic Form */}
          <div className="form-column">
            <div className="glass-card form-card border-neon-glow">
              
              {/* MODE 1: FREE DEMO */}
              {mode === 'demo' && (
                demoSuccess ? (
                  <div className="success-screen-box">
                    <CheckCircle2 size={48} className="success-check" />
                    <h3>Demo Request Submitted!</h3>
                    <p>We'll build your custom receptionist demo and reach out within 48 hours to let you test it.</p>
                    <button onClick={() => setDemoSuccess(false)} className="btn btn-outline-neon">
                      Request Another Demo
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDemoSubmit}>
                    <p className="card-desc" style={{ marginBottom: '20px' }}>Request your custom AI voice receptionist demo. No credit card required.</p>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Clinic Name *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Bright Dental"
                          className="form-control" 
                          value={demoData.clinicName} 
                          onChange={(e) => setDemoData({...demoData, clinicName: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Clinic Website</label>
                        <input 
                          type="url" 
                          placeholder="e.g. https://brightdental.com"
                          className="form-control" 
                          value={demoData.clinicWebsite} 
                          onChange={(e) => setDemoData({...demoData, clinicWebsite: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Clinic Location</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Dallas, TX"
                          className="form-control" 
                          value={demoData.clinicLocation} 
                          onChange={(e) => setDemoData({...demoData, clinicLocation: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Main Dental Services</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Cleanings, Crowns, Implants"
                          className="form-control" 
                          value={demoData.mainServices} 
                          onChange={(e) => setDemoData({...demoData, mainServices: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>What should the AI handle?</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={demoData.handling.newPatient} 
                            onChange={(e) => setDemoData({...demoData, handling: {...demoData.handling, newPatient: e.target.checked}})}
                          />
                          New Patient Intake
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={demoData.handling.faqAnswering} 
                            onChange={(e) => setDemoData({...demoData, handling: {...demoData.handling, faqAnswering: e.target.checked}})}
                          />
                          FAQ Answering
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={demoData.handling.afterHours} 
                            onChange={(e) => setDemoData({...demoData, handling: {...demoData.handling, afterHours: e.target.checked}})}
                          />
                          After-Hours Calls
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={demoData.handling.emergencyRouting} 
                            onChange={(e) => setDemoData({...demoData, handling: {...demoData.handling, emergencyRouting: e.target.checked}})}
                          />
                          Emergency Routing
                        </label>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Tools to integrate</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={demoData.integrations.googleCalendar} 
                            onChange={(e) => setDemoData({...demoData, integrations: {...demoData.integrations, googleCalendar: e.target.checked}})}
                          />
                          Google Calendar
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={demoData.integrations.calendly} 
                            onChange={(e) => setDemoData({...demoData, integrations: {...demoData.integrations, calendly: e.target.checked}})}
                          />
                          Calendly
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={demoData.integrations.dentrix} 
                            onChange={(e) => setDemoData({...demoData, integrations: {...demoData.integrations, dentrix: e.target.checked}})}
                          />
                          Dentrix
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={demoData.integrations.openDental} 
                            onChange={(e) => setDemoData({...demoData, integrations: {...demoData.integrations, openDental: e.target.checked}})}
                          />
                          Open Dental
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={demoData.integrations.otherCrm} 
                            onChange={(e) => setDemoData({...demoData, integrations: {...demoData.integrations, otherCrm: e.target.checked}})}
                          />
                          Other CRM
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={demoData.integrations.emailOnly} 
                            onChange={(e) => setDemoData({...demoData, integrations: {...demoData.integrations, emailOnly: e.target.checked}})}
                          />
                          Email Summaries Only
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contact Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Dr. Jane Smith"
                        className="form-control" 
                        value={demoData.contactName} 
                        onChange={(e) => setDemoData({...demoData, contactName: e.target.value})}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Contact Email *</label>
                        <input 
                          type="email" 
                          required
                          placeholder="jane@company.com"
                          className="form-control" 
                          value={demoData.contactEmail} 
                          onChange={(e) => setDemoData({...demoData, contactEmail: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact Phone</label>
                        <input 
                          type="tel" 
                          placeholder="+1 (555) 000-0000"
                          className="form-control" 
                          value={demoData.contactPhone} 
                          onChange={(e) => setDemoData({...demoData, contactPhone: e.target.value})}
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={submittingDemo} className="btn btn-primary w-full" style={{ marginTop: '12px' }}>
                      {submittingDemo ? 'Submitting request...' : 'Get Free Clinic Demo'}
                    </button>
                  </form>
                )
              )}

              {/* MODE 2: BOOK A STRATEGY CALL */}
              {mode === 'call' && (
                meetingSuccess ? (
                  <div className="success-screen-box">
                    <CheckCircle2 size={48} className="success-check" />
                    <h3>Meeting Confirmed!</h3>
                    <p>Your calendar request is saved. Our system will send email details to confirm your meeting.</p>
                    <button onClick={() => setMeetingSuccess(false)} className="btn btn-outline-neon">
                      Schedule Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleMeetingSubmit}>
                    <p className="card-desc" style={{ marginBottom: '20px' }}>
                      First, we build a small custom demo for your clinic so you can hear exactly how your AI receptionist answers calls. If you decide to go live, we launch the full system.
                    </p>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input 
                          type="text" 
                          required
                          className="form-control" 
                          value={meetingData.name} 
                          onChange={(e) => setMeetingData({...meetingData, name: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input 
                          type="email" 
                          required
                          className="form-control" 
                          value={meetingData.email} 
                          onChange={(e) => setMeetingData({...meetingData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Clinic Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={meetingData.company} 
                          onChange={(e) => setMeetingData({...meetingData, company: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          value={meetingData.phone} 
                          onChange={(e) => setMeetingData({...meetingData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Preferred Date *</label>
                        <input 
                          type="date" 
                          required
                          className="form-control" 
                          value={meetingData.date} 
                          onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Preferred Time *</label>
                        <input 
                          type="time" 
                          required
                          className="form-control" 
                          value={meetingData.time} 
                          onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Meeting Notes</label>
                      <textarea 
                        placeholder="Outline any challenges or current tools you'd like to integrate..."
                        className="form-control" 
                        value={meetingData.notes} 
                        onChange={(e) => setMeetingData({...meetingData, notes: e.target.value})}
                      />
                    </div>

                    <button type="submit" disabled={submittingMeeting} className="btn btn-primary w-full">
                      {submittingMeeting ? 'Scheduling...' : 'Lock in Strategy Call'}
                    </button>
                  </form>
                )
              )}

              {/* Mode Toggles */}
              {mode === 'demo' ? (
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                  Prefer to talk first? <span onClick={() => { setMode('call'); setMeetingSuccess(false); }} style={{ color: 'var(--accent-neon)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}>Book a Call</span>
                </p>
              ) : (
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                  Want your free demo prototype first? <span onClick={() => { setMode('demo'); setDemoSuccess(false); }} style={{ color: 'var(--accent-neon)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}>Request Free Demo</span>
                </p>
              )}

            </div>
          </div>

        </div>
      </section>

      <style>{`
        .forms-container {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .border-neon-glow {
          border-color: var(--accent-neon-border);
          box-shadow: 0 0 30px rgba(199, 255, 61, 0.04);
        }

        .card-header-icon-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .title-icon {
          color: var(--text-white);
        }

        .icon-neon {
          color: var(--accent-neon);
        }

        .card-desc {
          font-size: 0.9rem;
          color: var(--text-gray);
          margin-bottom: 32px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .w-full {
          width: 100%;
        }

        /* Success screen inside scheduler */
        .success-screen-box {
          text-align: center;
          padding: 48px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .success-check {
          color: var(--accent-neon);
          animation: float 3s infinite ease-in-out;
        }

        .success-screen-box h3 {
          font-size: 1.5rem;
        }

        .success-screen-box p {
          font-size: 0.95rem;
          color: var(--text-gray);
          margin-bottom: 16px;
        }

        @media (max-width: 1024px) {
          .forms-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .contact-hero {
            padding-top: var(--hero-padding-top-mobile) !important;
            padding-bottom: var(--hero-padding-bottom-mobile) !important;
          }
          .contact-title {
            font-size: clamp(2rem, 8vw, 2.6rem) !important;
          }
          .contact-subtitle {
            font-size: 1.05rem;
          }
          .form-card, .contact-info-card {
            padding: 28px 20px;
          }
        }

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
