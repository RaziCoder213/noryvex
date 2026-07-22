import React, { useState } from 'react';
import { Mail, Phone, Calendar, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contact({ addToast }) {
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

  const [submittingContact, setSubmittingContact] = useState(false);
  const [submittingMeeting, setSubmittingMeeting] = useState(false);
  const [meetingSuccess, setMeetingSuccess] = useState(false);

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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      const data = await res.json();
      
      if (res.ok) {
        addToast('Contact inquiry submitted successfully!', 'success');
        setContactData({ name: '', company: '', email: '', phone: '', service: 'AI Voice Agents', message: '' });
      } else {
        addToast(data.error || 'Submission failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Server connection failed.', 'error');
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
      const res = await fetch('/api/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData)
      });
      const data = await res.json();

      if (res.ok) {
        addToast('Meeting scheduled successfully!', 'success');
        setMeetingSuccess(true);
        setMeetingData({ name: '', email: '', company: '', phone: '', date: '', time: '', notes: '' });
      } else {
        addToast(data.error || 'Meeting scheduling failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Server connection failed.', 'error');
    } finally {
      setSubmittingMeeting(false);
    }
  };

  return (
    <div className="contact-page page-enter">
      <section className="contact-hero">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Get in Touch</span>
            <h1 className="contact-title">Start Automating Today</h1>
            <p className="contact-subtitle">Submit an inquiry or schedule a free strategy call directly with Muhammad Razi to qualify automation workflows.</p>
          </div>
        </div>
      </section>

      <section className="contact-forms-section">
        <div className="container forms-container">
          
          {/* Column 1: Book a Meeting */}
          <div className="form-column">
            <div className="glass-card form-card border-neon-glow">
              <div className="card-header-icon-title">
                <Calendar className="title-icon icon-neon" />
                <h2>Book a Strategy Call</h2>
              </div>
              <p className="card-desc">Select a date and time slot to sync with our calendar for a 30-minute operational audit.</p>
              
              {meetingSuccess ? (
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
                      <div className="input-with-icon">
                        <input 
                          type="date" 
                          required
                          className="form-control" 
                          value={meetingData.date} 
                          onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Preferred Time</label>
                      <div className="input-with-icon">
                        <input 
                          type="time" 
                          required
                          className="form-control" 
                          value={meetingData.time} 
                          onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                        />
                      </div>
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
              )}
            </div>
          </div>

          {/* Column 2: Send Message */}
          <div className="form-column">
            <div className="glass-card form-card">
              <div className="card-header-icon-title">
                <Mail className="title-icon" />
                <h2>Send Us a Message</h2>
              </div>
              <p className="card-desc">Have a general question or custom API integration challenge? Shoot us a message below and we'll reply within 24 hours.</p>

              <form onSubmit={handleContactSubmit}>
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
            </div>
          </div>

        </div>
      </section>

      <style>{`
        .contact-hero {
          padding: 140px 0 40px 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(7,7,8,1) 100%);
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
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
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
          margin-bottom: 8px;
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
          background-color: #121215;
          color: var(--text-white);
        }

        .select-control option {
          background-color: #121215;
          color: var(--text-white);
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
