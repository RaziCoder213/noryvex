import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, Calendar, LogOut, Check, Trash2, Eye, Plus, Star, Link, Image } from 'lucide-react';
import { 
  dbGetContacts, 
  dbGetMeetings, 
  dbMarkContactRead, 
  dbDeleteContact, 
  dbMarkMeetingCompleted, 
  dbDeleteMeeting, 
  dbAdminLogin,
  dbGetClients,
  dbSaveClient,
  dbDeleteClient,
  dbGetPartners,
  dbSavePartner,
  dbDeletePartner
} from '../utils/dbHelper';

export default function Admin({ addToast }) {
  const [token, setToken] = useState(localStorage.getItem('noryvex_admin_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts', 'meetings', 'cms-clients', 'cms-partners'
  
  // Data lists
  const [contacts, setContacts] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [clients, setClients] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // CMS forms
  const [newClient, setNewClient] = useState({ name: '', company: '', rating: 5, quote: '' });
  const [newPartner, setNewPartner] = useState({ name: '', link: '', image: '' });

  // Fetch admin dashboard data
  const fetchData = async (authToken) => {
    if (!authToken) return;
    setLoadingData(true);
    try {
      const contactsData = dbGetContacts();
      const meetingsData = dbGetMeetings();
      const clientsData = dbGetClients();
      const partnersData = dbGetPartners();
      setContacts(contactsData);
      setMeetings(meetingsData);
      setClients(clientsData);
      setPartners(partnersData);
    } catch (err) {
      console.error(err);
      addToast('Error fetching dashboard records.', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const allowedEmails = ['razi@trynoryvex.com', 'razi@noryvex.com', 'codingwithrazi@gmail.com'];
    const cleanedEmail = (email || '').toLowerCase().trim();
    if (!allowedEmails.includes(cleanedEmail)) {
      addToast('Access denied: Unauthorized admin email.', 'error');
      return;
    }
    setLoggingIn(true);

    try {
      const result = await dbAdminLogin(email, password);
      if (result.success) {
        localStorage.setItem('noryvex_admin_token', result.token);
        setToken(result.token);
        addToast('Welcome back, Admin!', 'success');
      } else {
        addToast(result.error || 'Login failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Login failed.', 'error');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('noryvex_admin_token');
    setToken('');
    setContacts([]);
    setMeetings([]);
    setClients([]);
    setPartners([]);
  };

  // Contact actions
  const handleMarkContactRead = async (id) => {
    try {
      const result = dbMarkContactRead(id);
      if (result.success) {
        setContacts((prev) => 
          prev.map((c) => c.id === id ? { ...c, status: 'read' } : c)
        );
        addToast('Inquiry marked as read.', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update status.', 'error');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const result = dbDeleteContact(id);
      if (result.success) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        addToast('Inquiry deleted.', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete inquiry.', 'error');
    }
  };

  // Meeting actions
  const handleMarkMeetingCompleted = async (id) => {
    try {
      const result = dbMarkMeetingCompleted(id);
      if (result.success) {
        setMeetings((prev) => 
          prev.map((m) => m.id === id ? { ...m, status: 'completed' } : m)
        );
        addToast('Meeting marked as completed.', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update meeting.', 'error');
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting slot?')) return;
    try {
      const result = dbDeleteMeeting(id);
      if (result.success) {
        setMeetings((prev) => prev.filter((m) => m.id !== id));
        addToast('Meeting deleted.', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete meeting.', 'error');
    }
  };

  // CMS: Clients Testimonials
  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.quote) {
      addToast('Name and testimonial quote are required.', 'error');
      return;
    }
    dbSaveClient(newClient);
    setClients(dbGetClients());
    setNewClient({ name: '', company: '', rating: 5, quote: '' });
    addToast('Client testimonial saved successfully!', 'success');
  };

  const handleDeleteClient = (id) => {
    if (!window.confirm('Delete this client testimonial?')) return;
    dbDeleteClient(id);
    setClients(dbGetClients());
    addToast('Testimonial removed.', 'success');
  };

  // CMS: Trusted Partners / Badges
  const handleAddPartner = (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.image) {
      addToast('Partner name and badge image URL are required.', 'error');
      return;
    }
    dbSavePartner(newPartner);
    setPartners(dbGetPartners());
    setNewPartner({ name: '', link: '', image: '' });
    addToast('Trusted partner badge saved!', 'success');
  };

  const handleDeletePartner = (id) => {
    if (!window.confirm('Delete this partner badge?')) return;
    dbDeletePartner(id);
    setPartners(dbGetPartners());
    addToast('Partner badge removed.', 'success');
  };

  // Stats calculation
  const stats = {
    totalContacts: contacts.length,
    unreadContacts: contacts.filter(c => c.status === 'unread').length,
    totalMeetings: meetings.length,
    pendingMeetings: meetings.filter(m => m.status === 'pending').length
  };

  // Login Screen Render
  if (!token) {
    return (
      <div className="admin-page page-enter">
        <section className="login-section">
          <div className="container login-container">
            <div className="glass-card login-card">
              <div className="login-header">
                <div className="lock-icon-bg">
                  <Shield size={32} className="icon-neon" />
                </div>
                <h1>Noryvex Admin</h1>
                <p>Enter your authorization credentials to unlock the CMS operations dashboard.</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Admin Email</label>
                  <input
                    type="email"
                    required
                    placeholder="razi@trynoryvex.com"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={loggingIn} className="btn btn-primary w-full login-btn">
                  {loggingIn ? 'Authenticating...' : 'Access Operations'}
                </button>
              </form>
            </div>
          </div>
        </section>

        <style>{`
          .login-section {
            padding: 160px 0 100px 0;
            display: flex;
            justify-content: center;
          }
          .login-container {
            display: flex;
            justify-content: center;
          }
          .login-card {
            width: 100%;
            max-width: 400px;
            padding: 40px 32px;
            background: #0a0a0d;
            border: 1px solid var(--border-light);
            border-radius: 24px;
          }
          .login-header {
            text-align: center;
            margin-bottom: 32px;
          }
          .lock-icon-bg {
            width: 64px;
            height: 64px;
            background: rgba(199, 255, 61, 0.08);
            border: 1px solid var(--accent-neon-border);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px auto;
          }
          .login-header h1 {
            font-size: 1.8rem;
            margin-bottom: 8px;
            font-family: 'Outfit', sans-serif;
          }
          .login-header p {
            font-size: 0.85rem;
            color: var(--text-gray);
          }
          .login-btn {
            margin-top: 12px;
          }
        `}</style>
      </div>
    );
  }

  // Dashboard Screen Render
  return (
    <div className="admin-page page-enter">
      <header className="cms-header">
        <div className="container cms-header-container">
          <div className="cms-logo-wrap">
            <span className="cms-logo-symbol">Z</span>
            <span className="cms-logo-text">NORYVEX ADMIN</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary logout-btn">
            Logout <LogOut size={16} />
          </button>
        </div>
      </header>

      <section className="admin-dashboard-hero">
        <div className="container admin-hero-container">
          <div>
            <span className="section-tag">Internal Operations</span>
            <h1 className="dashboard-title">Leads & CMS Dashboard</h1>
            <p className="dashboard-subtitle">Manage incoming trials, calendar appointments, customer reviews, and trusted B2B brand logos.</p>
          </div>
        </div>
      </section>

      <section className="admin-content-section">
        <div className="container">
          
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="glass-card stat-card">
              <Mail className="stat-card-icon" />
              <div className="stat-card-info">
                <span className="stat-card-label">Total Inquiries</span>
                <span className="stat-card-val">{stats.totalContacts}</span>
                <span className="stat-card-subtext">{stats.unreadContacts} unread message(s)</span>
              </div>
            </div>
            <div className="glass-card stat-card border-neon-glow">
              <Calendar className="stat-card-icon icon-neon" />
              <div className="stat-card-info">
                <span className="stat-card-label">Booked Strategy Calls</span>
                <span className="stat-card-val">{stats.totalMeetings}</span>
                <span className="stat-card-subtext">{stats.pendingMeetings} pending meeting(s)</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="dashboard-tabs">
            <button 
              onClick={() => setActiveTab('contacts')} 
              className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            >
              Trials & Messages ({contacts.length})
            </button>
            <button 
              onClick={() => setActiveTab('meetings')} 
              className={`tab-btn ${activeTab === 'meetings' ? 'active' : ''}`}
            >
              Meetings ({meetings.length})
            </button>
            <button 
              onClick={() => setActiveTab('cms-clients')} 
              className={`tab-btn ${activeTab === 'cms-clients' ? 'active' : ''}`}
            >
              CMS: Testimonials ({clients.length})
            </button>
            <button 
              onClick={() => setActiveTab('cms-partners')} 
              className={`tab-btn ${activeTab === 'cms-partners' ? 'active' : ''}`}
            >
              CMS: Trusted Sites ({partners.length})
            </button>
          </div>

          {/* Loading Indicator */}
          {loadingData ? (
            <div className="loading-box">
              <span className="loading-spinner"></span>
              <p>Fetching database records...</p>
            </div>
          ) : (
            <>
              {/* Tab 1: Contacts Table */}
              {activeTab === 'contacts' && (
                <div className="admin-table-container">
                  {contacts.length === 0 ? (
                    <div className="empty-table-message">No inquiries or trial requests found.</div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Inquirer</th>
                          <th>Company</th>
                          <th>Contact Details</th>
                          <th>Trial/Message Details</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((c) => (
                          <tr key={c.id}>
                            <td>
                              <span className={`badge badge-${c.status}`}>
                                {c.status}
                              </span>
                            </td>
                            <td>
                              <strong className="text-white">{c.name}</strong>
                              <div className="date-subtext">
                                {new Date(c.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td>{c.company || '—'}</td>
                            <td>
                              <div>{c.email}</div>
                              <div className="phone-subtext">{c.phone || '—'}</div>
                            </td>
                            <td>
                              <div className={`service-tag-badge ${c.service && c.service.includes('7-Day Trial') ? 'trial-badge' : ''}`}>{c.service}</div>
                              <p className="message-content-text">{c.message}</p>
                            </td>
                            <td>
                              <div className="action-buttons-cell">
                                {c.status === 'unread' && (
                                  <button 
                                    onClick={() => handleMarkContactRead(c.id)} 
                                    className="action-btn action-btn-read"
                                    title="Mark as Read"
                                  >
                                    <Check size={14} /> Mark Read
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteContact(c.id)} 
                                  className="action-btn action-btn-delete"
                                  title="Delete Inquiry"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Tab 2: Meetings Table */}
              {activeTab === 'meetings' && (
                <div className="admin-table-container">
                  {meetings.length === 0 ? (
                    <div className="empty-table-message">No scheduled meetings found.</div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Full Name</th>
                          <th>Company Name</th>
                          <th>Contact Info</th>
                          <th>Scheduled Slot</th>
                          <th>Agenda Notes</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meetings.map((m) => (
                          <tr key={m.id}>
                            <td>
                              <span className={`badge badge-${m.status}`}>
                                {m.status}
                              </span>
                            </td>
                            <td><strong className="text-white">{m.name}</strong></td>
                            <td>{m.company || '—'}</td>
                            <td>
                              <div>{m.email}</div>
                              <div className="phone-subtext">{m.phone || '—'}</div>
                            </td>
                            <td>
                              <div className="meeting-date-val">{m.date}</div>
                              <div className="meeting-time-val">{m.time}</div>
                            </td>
                            <td>
                              <p className="message-content-text">{m.notes || '—'}</p>
                            </td>
                            <td>
                              <div className="action-buttons-cell">
                                {m.status === 'pending' && (
                                  <button 
                                    onClick={() => handleMarkMeetingCompleted(m.id)} 
                                    className="action-btn action-btn-read"
                                    title="Mark Completed"
                                  >
                                    <Check size={14} /> Complete
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteMeeting(m.id)} 
                                  className="action-btn action-btn-delete"
                                  title="Delete Booking"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Tab 3: Testimonials CMS */}
              {activeTab === 'cms-clients' && (
                <div className="cms-layout">
                  {/* Left Column: Form */}
                  <div className="cms-form-container">
                    <div className="glass-card cms-form-card">
                      <h3>Add Client Testimonial</h3>
                      <form onSubmit={handleAddClient} style={{ marginTop: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">Client Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Jane Miller"
                            className="form-control"
                            value={newClient.name}
                            onChange={e => setNewClient({...newClient, name: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Company / Role</label>
                          <input 
                            type="text" 
                            placeholder="e.g. CEO, Apex Dental"
                            className="form-control"
                            value={newClient.company}
                            onChange={e => setNewClient({...newClient, company: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Rating (1-5 Stars)</label>
                          <select 
                            className="form-control select-control"
                            value={newClient.rating}
                            onChange={e => setNewClient({...newClient, rating: e.target.value})}
                          >
                            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                            <option value="3">⭐⭐⭐ (3 Stars)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Testimonial Quote</label>
                          <textarea 
                            required 
                            placeholder="Describe client's experience or achievements..."
                            className="form-control"
                            value={newClient.quote}
                            onChange={e => setNewClient({...newClient, quote: e.target.value})}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-full">
                          <Plus size={16} /> Save Testimonial
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: Listing Table */}
                  <div className="cms-table-container">
                    {clients.length === 0 ? (
                      <div className="empty-table-message">No testimonials. Add one using the form on the left.</div>
                    ) : (
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Inquirer</th>
                            <th>Rating</th>
                            <th>Quote</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clients.map(c => (
                            <tr key={c.id}>
                              <td>
                                <strong className="text-white">{c.name}</strong>
                                <div className="date-subtext">{c.company}</div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  {[...Array(c.rating || 5)].map((_, i) => <Star key={i} size={12} fill="#C7FF3D" color="#C7FF3D" />)}
                                </div>
                              </td>
                              <td style={{ fontSize: '0.85rem', color: 'var(--text-gray)', maxWidth: '300px' }}>"{c.quote}"</td>
                              <td>
                                <button 
                                  onClick={() => handleDeleteClient(c.id)} 
                                  className="action-btn action-btn-delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Trusted Badges CMS */}
              {activeTab === 'cms-partners' && (
                <div className="cms-layout">
                  {/* Left Column: Form */}
                  <div className="cms-form-container">
                    <div className="glass-card cms-form-card">
                      <h3>Add Trust Badge / Site</h3>
                      <form onSubmit={handleAddPartner} style={{ marginTop: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">Partner/Site Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. GoodFirms, TechCrunch"
                            className="form-control"
                            value={newPartner.name}
                            onChange={e => setNewPartner({...newPartner, name: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Link URL (Redirect on Click)</label>
                          <input 
                            type="url" 
                            placeholder="e.g. https://www.goodfirms.co/company/noryvex"
                            className="form-control"
                            value={newPartner.link}
                            onChange={e => setNewPartner({...newPartner, link: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Badge Image Source URL</label>
                          <input 
                            type="url" 
                            required 
                            placeholder="e.g. https://www.goodfirms.co/img/badges/recognized-on-goodfirms.png"
                            className="form-control"
                            value={newPartner.image}
                            onChange={e => setNewPartner({...newPartner, image: e.target.value})}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-full">
                          <Plus size={16} /> Add Trust Badge
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: Listing Table */}
                  <div className="cms-table-container">
                    {partners.length === 0 ? (
                      <div className="empty-table-message">No trust badges configured.</div>
                    ) : (
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Badge/Site</th>
                            <th>Preview</th>
                            <th>Link URL</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {partners.map(p => (
                            <tr key={p.id}>
                              <td><strong className="text-white">{p.name}</strong></td>
                              <td>
                                <img src={p.image} alt={p.name} className="cms-badge-preview" />
                              </td>
                              <td style={{ fontSize: '0.8rem', color: 'var(--accent-neon)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                  {p.link}
                                </a>
                              </td>
                              <td>
                                <button 
                                  onClick={() => handleDeletePartner(p.id)} 
                                  className="action-btn action-btn-delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

            </>
          )}

        </div>
      </section>

      <style>{`
        /* Decoupled header */
        .cms-header {
          background: #070708;
          border-bottom: 1px solid var(--border-light);
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .cms-header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cms-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cms-logo-symbol {
          background: #C7FF3D;
          color: #000;
          font-weight: 900;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .cms-logo-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 0.95rem;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .logout-btn {
          font-size: 0.8rem;
          padding: 6px 14px;
        }

        /* Hero */
        .admin-dashboard-hero {
          padding: 60px 0 40px;
          background: linear-gradient(180deg, #070708 0%, #000000 100%);
          text-align: left;
        }

        .dashboard-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .dashboard-subtitle {
          color: var(--text-gray);
          font-size: 1rem;
        }

        .admin-content-section {
          padding: 40px 0 100px;
          background: var(--bg-dark);
          min-height: calc(100vh - 280px);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          text-align: left;
        }

        .stat-card-icon {
          width: 48px;
          height: 48px;
          color: var(--text-white);
          flex-shrink: 0;
        }

        .stat-card-icon.icon-neon {
          color: var(--accent-neon);
        }

        .stat-card-info {
          display: flex;
          flex-direction: column;
        }

        .stat-card-label {
          font-size: 0.85rem;
          color: var(--text-gray);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .stat-card-val {
          font-family: 'Outfit', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-white);
          line-height: 1.2;
        }

        .stat-card-subtext {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        /* Tab Navigation */
        .dashboard-tabs {
          display: flex;
          gap: 16px;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 32px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .dashboard-tabs::-webkit-scrollbar {
          display: none;
        }

        .tab-btn {
          background: none;
          border: none;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-gray);
          padding: 12px 8px;
          cursor: pointer;
          position: relative;
          white-space: nowrap;
          transition: var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--text-white);
        }

        .tab-btn.active {
          color: var(--accent-neon);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--accent-neon);
          box-shadow: 0 0 8px var(--accent-neon);
        }

        /* Data Tables */
        .admin-table-container {
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .admin-table th {
          background: rgba(255,255,255,0.02);
          padding: 16px;
          font-weight: 700;
          color: var(--text-white);
          border-bottom: 1px solid var(--border-light);
        }

        .admin-table td {
          padding: 18px 16px;
          border-bottom: 1px solid var(--border-light);
          vertical-align: top;
          color: var(--text-gray);
        }

        .admin-table tr:last-child td {
          border-bottom: none;
        }

        /* Table Details styling */
        .date-subtext {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .phone-subtext {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .service-tag-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          background: rgba(199,255,61,0.08);
          color: var(--accent-neon);
          border: 1px solid var(--accent-neon-border);
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .service-tag-badge.trial-badge {
          background: rgba(199,255,61,0.15) !important;
          border-color: var(--accent-neon) !important;
          box-shadow: 0 0 10px rgba(199, 255, 61, 0.25);
        }

        .message-content-text {
          font-size: 0.85rem;
          color: var(--text-light);
          line-height: 1.4;
          white-space: pre-line;
          max-width: 400px;
        }

        .meeting-date-val {
          font-weight: 600;
          color: var(--text-white);
        }

        .meeting-time-val {
          font-size: 0.85rem;
          color: var(--accent-neon);
        }

        .action-buttons-cell {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: background 0.2s;
        }

        .action-btn-read {
          background: rgba(199, 255, 61, 0.08);
          border: 1px solid var(--accent-neon-border);
          color: var(--accent-neon);
        }

        .action-btn-read:hover {
          background: var(--accent-neon);
          color: #000;
        }

        .action-btn-delete {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .action-btn-delete:hover {
          background: #ef4444;
          color: #fff;
        }

        /* Status Badges */
        .badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 100px;
        }

        .badge-unread {
          background: rgba(199, 255, 61, 0.15);
          color: var(--accent-neon);
        }

        .badge-read {
          background: rgba(255,255,255,0.06);
          color: var(--text-muted);
        }

        .badge-pending {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
        }

        .badge-completed {
          background: rgba(52, 211, 153, 0.15);
          color: #34d399;
        }

        .empty-table-message {
          padding: 48px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        /* Loading */
        .loading-box {
          padding: 80px;
          text-align: center;
          color: var(--text-muted);
        }

        .loading-spinner {
          display: inline-block;
          width: 32px;
          height: 32px;
          border: 2px solid rgba(255,255,255,0.05);
          border-top-color: var(--accent-neon);
          border-radius: 50%;
          animation: spin-slow 1s linear infinite;
          margin-bottom: 16px;
        }

        /* CMS Layout */
        .cms-layout {
          display: grid;
          grid-template-columns: 1fr 1.8fr;
          gap: 32px;
          align-items: start;
        }

        .cms-form-card {
          padding: 32px 24px;
          text-align: left;
          border: 1px solid var(--border-light);
          border-radius: 16px;
          background: rgba(255,255,255,0.015);
        }

        .cms-form-card h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          color: #fff;
        }

        .cms-table-container {
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          overflow-x: auto;
        }

        .cms-badge-preview {
          height: 24px;
          width: auto;
          object-fit: contain;
          background: rgba(255,255,255,0.05);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border-light);
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .cms-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
