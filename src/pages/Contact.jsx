import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Clock, Send, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { dbSaveContact, dbSaveMeeting, dbSaveTrial } from '../utils/dbHelper';

export default function Contact({ addToast, initialTab = 'trial' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const [contactData, setContactData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'AI Voice Agents',
    message: ''
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

  const [trialData, setTrialData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    aiHandling: 'both' // both, bookings, faqs
  });

  const [submittingContact, setSubmittingContact] = useState(false);
  const [submittingMeeting, setSubmittingMeeting] = useState(false);
  const [submittingTrial, setSubmittingTrial] = useState(false);
  
  const [meetingSuccess, setMeetingSuccess] = useState(false);
  const [trialSuccess, setTrialSuccess] = useState(false);


  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const services = [
    "AI Voice Agents",
    "AI Receptionists",
    "Business Automation",
    "Workflow Automation",
    "AI Chatbots",
    "Web Applications",
    "Mobile Apps",
    "SaaS Development",
    "API Integrations",
    "CRM Automation"
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email) {
      addToast('Name and Email are required.', 'error');
      return;
    }
    setSubmittingContact(true);

    try {
      const result = await dbSaveContact(contactData);
      if (result.success) {
        addToast('Contact inquiry submitted successfully!', 'success');
        setContactData({ name: '', company: '', email: '', phone: '', service: 'AI Voice Agents', message: '' });
      } else {
        addToast('Submission failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Submission failed.', 'error');
    } finally {
      setSubmittingContact(false);
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

  const handleTrialSubmit = async (e) => {
    e.preventDefault();
    if (!trialData.contactName || !trialData.email || !trialData.businessName) {
      addToast('Business Name, Contact Name, and Email are required.', 'error');
      return;
    }
    setSubmittingTrial(true);

    try {
      const result = await dbSaveTrial(trialData);
      if (result) {
        addToast('Checking warranty request submitted successfully!', 'success');
        setTrialSuccess(true);
        setTrialData({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          businessType: '',
          aiHandling: 'both'
        });
      } else {
        addToast('Request submission failed.', 'error');
      }
    } catch (err) {
      addToast('Request submission failed.', 'error');
    } finally {
      setSubmittingTrial(false);
    }
  };

  return (
    <div className="contact-page page-enter">
      <section className="contact-hero">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Get in Touch</span>
            <h1 className="contact-title">Start Automating Today</h1>
            <p className="contact-subtitle">Get a custom AI voice calling receptionist running under a 7-day checking warranty or sync directly for an operational audit.</p>
          </div>
        </div>
      </section>

      <section className="contact-forms-section">
        <div className="container forms-container">
          
          {/* Column 1: Info & Trial Terms */}
          <div className="form-column">
            <div className="glass-card contact-info-card">
              <div className="card-header-icon-title">
                <Sparkles className="title-icon icon-neon" />
                <h2>7-Day Checking Warranty</h2>
              </div>
              <p className="card-desc" style={{ marginBottom: '24px' }}>
                Experience the power of Chloe, our advanced human-sounding AI Voice Receptionist, custom-configured for your business workflow.
              </p>

              {/* Trial terms list */}
              <div className="trial-terms-box" style={{ background: 'rgba(199, 255, 61, 0.04)', border: '1px dashed rgba(199, 255, 61, 0.2)', padding: '20px', borderRadius: '12px', marginBottom: '28px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-white)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '800' }}>Warranty Parameters:</h3>
                <ul className="trial-terms-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--text-gray)' }}>
                    <CheckCircle2 size={16} color="#C7FF3D" style={{ flexShrink: 0 }} />
                    <span>7 days or 30 minutes of call time, whichever comes first</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--text-gray)' }}>
                    <CheckCircle2 size={16} color="#C7FF3D" style={{ flexShrink: 0 }} />
                    <span>No credit card required</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--text-gray)' }}>
                    <CheckCircle2 size={16} color="#C7FF3D" style={{ flexShrink: 0 }} />
                    <span>No obligation to continue</span>
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
                    <h4 style={{ color: 'var(--text-white)', fontSize: '0.95rem', marginBottom: '4px', fontWeight: '700' }}>Under 24-Hour Turnaround</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.45' }}>After submitting, we'll build your prototype and reach out within 24 hours to guide you through the activation process.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Tab Switcher & Dynamic Form */}
          <div className="form-column">
            <div className="glass-card form-card border-neon-glow">
              
              {/* Tab Selector */}
              <div className="contact-tabs">
                <button 
                  className={`contact-tab-btn ${activeTab === 'trial' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('trial'); setTrialSuccess(false); }}
                >
                  7-Day Checking Warranty
                </button>
                <button 
                  className={`contact-tab-btn ${activeTab === 'call' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('call'); setMeetingSuccess(false); }}
                >
                  Book a Call
                </button>
                <button 
                  className={`contact-tab-btn ${activeTab === 'inquiry' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inquiry')}
                >
                  General Inquiry
                </button>
              </div>

              {/* TAB 1: 7-DAY FREE TRIAL */}
              {activeTab === 'trial' && (
                trialSuccess ? (
                  <div className="success-screen-box">
                    <CheckCircle2 size={48} className="success-check" />
                    <h3>Request Submitted!</h3>
                    <p>We'll set up your custom agent and reach out within 24 hours to activate your checking phase.</p>
                    <button onClick={() => setTrialSuccess(false)} className="btn btn-outline-neon">
                      Request Another Setup
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTrialSubmit}>
                    <p className="card-desc" style={{ marginBottom: '20px' }}>Request your custom AI voice receptionist setup under a 7-day checking warranty. No technical setup or credit cards needed.</p>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Business Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Dental Clinic, Auto Shop"
                          className="form-control" 
                          value={trialData.businessName} 
                          onChange={(e) => setTrialData({...trialData, businessName: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Jane Smith"
                          className="form-control" 
                          value={trialData.contactName} 
                          onChange={(e) => setTrialData({...trialData, contactName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="jane@company.com"
                          className="form-control" 
                          value={trialData.email} 
                          onChange={(e) => setTrialData({...trialData, email: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+1 (555) 000-0000"
                          className="form-control" 
                          value={trialData.phone} 
                          onChange={(e) => setTrialData({...trialData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Business Niche / Industry</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Dental, Real Estate, Law Firm"
                          className="form-control" 
                          value={trialData.businessType} 
                          onChange={(e) => setTrialData({...trialData, businessType: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">What should the AI handle?</label>
                        <select 
                          className="form-control select-control"
                          value={trialData.aiHandling}
                          onChange={(e) => setTrialData({...trialData, aiHandling: e.target.value})}
                        >
                          <option value="both">Both (FAQs & Bookings)</option>
                          <option value="bookings">Bookings Only</option>
                          <option value="faqs">FAQs / Information Only</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" disabled={submittingTrial} className="btn btn-primary w-full">
                      {submittingTrial ? 'Submitting request...' : 'Activate 7-Day Checking Warranty'}
                    </button>
                  </form>
                )
              )}

              {/* TAB 2: BOOK A STRATEGY CALL */}
              {activeTab === 'call' && (
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
                    <p className="card-desc" style={{ marginBottom: '20px' }}>Select a date and time slot to sync with our calendar for a 30-minute operational audit.</p>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                          type="text" 
                          required
                          className="form-control" 
                          value={meetingData.name} 
                          onChange={(e) => setMeetingData({...meetingData, name: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
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
                        <label className="form-label">Company Name</label>
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
                        <label className="form-label">Preferred Date</label>
                        <input 
                          type="date" 
                          required
                          className="form-control" 
                          value={meetingData.date} 
                          onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Preferred Time</label>
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

              {/* TAB 3: GENERAL INQUIRY */}
              {activeTab === 'inquiry' && (
                <form onSubmit={handleContactSubmit}>
                  <p className="card-desc" style={{ marginBottom: '20px' }}>Have a general question or custom API integration challenge? Shoot us a message.</p>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input 
                        type="text" 
                        required
                        className="form-control" 
                        value={contactData.name} 
                        onChange={(e) => setContactData({...contactData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={contactData.company} 
                        onChange={(e) => setContactData({...contactData, company: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        required
                        className="form-control" 
                        value={contactData.email} 
                        onChange={(e) => setContactData({...contactData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={contactData.phone} 
                        onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Interested In</label>
                    <select 
                      className="form-control select-control"
                      value={contactData.service}
                      onChange={(e) => setContactData({...contactData, service: e.target.value})}
                    >
                      {services.map((svc, i) => (
                        <option key={i} value={svc}>{svc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message Details</label>
                    <textarea 
                      placeholder="Describe your current operations and what you're hoping to automate..."
                      required
                      className="form-control" 
                      value={contactData.message} 
                      onChange={(e) => setContactData({...contactData, message: e.target.value})}
                    />
                  </div>

                  <button type="submit" disabled={submittingContact} className="btn btn-secondary w-full">
                    {submittingContact ? 'Sending...' : 'Send Message'} <Send size={16} />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      <style>{`
        .contact-hero {
          padding: 140px 0 40px 0;
          background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-pure) 100%);
        }
        
        .contact-title {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }
        
        .contact-subtitle {
          font-size: 1.2rem;
          color: var(--text-gray);
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-forms-section {
          padding: 60px 0 120px 0;
          background-color: var(--bg-dark);
        }

        .forms-container {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
          align-items: start;
        }

        .contact-info-card {
          padding: 40px 32px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          text-align: left;
        }

        .form-card {
          padding: 40px 32px;
          text-align: left;
          height: 100%;
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

        .select-control {
          background-color: var(--bg-charcoal);
          color: var(--text-white);
        }

        .select-control option {
          background-color: var(--bg-charcoal);
          color: var(--text-white);
        }

        .w-full {
          width: 100%;
        }

        /* Tabs styling */
        .contact-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 28px;
          padding-bottom: 8px;
          flex-wrap: wrap;
        }

        .contact-tab-btn {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-gray);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.25s ease;
        }

        .contact-tab-btn:hover {
          color: var(--text-white);
          background: var(--bg-preview-card);
        }

        .contact-tab-btn.active {
          color: var(--accent-neon);
          background: rgba(199, 255, 61, 0.08);
          box-shadow: inset 0 0 0 1px rgba(199, 255, 61, 0.15);
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
            padding: 100px 0 30px 0;
          }
          .contact-title {
            font-size: clamp(2rem, 8vw, 2.6rem);
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
