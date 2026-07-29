import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, Calendar, LogOut, Check, Trash2, Eye, Plus, Star, Link, Image, Activity, Award } from 'lucide-react';
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
  dbDeletePartner,
  dbGetTrials,
  dbUpdateTrialStatus
} from '../utils/dbHelper';

export default function Admin({ addToast, setActivePage }) {
  const [token, setToken] = useState(localStorage.getItem('noryvex_admin_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts', 'meetings', 'trials-tracker', 'cms-clients', 'cms-partners'
  
  // Xano database settings states
  const [dbProvider, setDbProvider] = useState(localStorage.getItem('noryvex_db_provider') || 'local');
  const [xanoBaseUrl, setXanoBaseUrl] = useState(localStorage.getItem('noryvex_xano_base_url') || '');
  const [xanoToken, setXanoToken] = useState(localStorage.getItem('noryvex_xano_token') || '');
  const [testingConnection, setTestingConnection] = useState(false);
  
  // Data lists
  const [contacts, setContacts] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [clients, setClients] = useState([]);
  const [partners, setPartners] = useState([]);
  const [trials, setTrials] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // CMS forms
  const [newClient, setNewClient] = useState({ name: '', company: '', rating: 5, quote: '' });
  const [newPartner, setNewPartner] = useState({ name: '', link: '', image: '' });

  // Fetch admin dashboard data
  const fetchData = async (authToken) => {
    if (!authToken) return;
    setLoadingData(true);
    try {
      const contactsData = await dbGetContacts(authToken);
      const meetingsData = await dbGetMeetings(authToken);
      const clientsData = await dbGetClients();
      const partnersData = await dbGetPartners();
      const trialsData = await dbGetTrials(authToken);
      
      setContacts(contactsData);
      setMeetings(meetingsData);
      setClients(clientsData);
      setPartners(partnersData);
      setTrials(trialsData);
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
    setTrials([]);
    if (setActivePage) {
      setActivePage('home');
    }
  };

  const handleSaveDbSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('noryvex_db_provider', dbProvider);
    localStorage.setItem('noryvex_xano_base_url', xanoBaseUrl.trim());
    localStorage.setItem('noryvex_xano_token', xanoToken.trim());
    addToast('Database settings saved successfully!', 'success');
    fetchData(token);
  };

  const handleTestConnection = async () => {
    if (!xanoBaseUrl.trim()) {
      addToast('Please enter a Xano API Base URL to test.', 'error');
      return;
    }
    setTestingConnection(true);
    try {
      const baseUrlClean = xanoBaseUrl.trim().replace(/\/$/, '');
      const testUrl = `${baseUrlClean}/contacts`;
      const res = await fetch(testUrl, {
        headers: xanoToken.trim() ? { 'Authorization': `Bearer ${xanoToken.trim()}` } : {}
      });
      if (res.ok) {
        addToast('Connection successful! Validated contacts endpoint.', 'success');
      } else {
        addToast(`Endpoint returned status ${res.status}. Make sure the contacts table is set up in Xano.`, 'warning');
      }
    } catch (err) {
      console.error(err);
      addToast('Connection failed. Verify your Base URL and internet connection.', 'error');
    } finally {
      setTestingConnection(false);
    }
  };

  // Contact actions
  const handleMarkContactRead = async (id) => {
    try {
      const result = await dbMarkContactRead(id, token);
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
      const result = await dbDeleteContact(id, token);
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
      const result = await dbMarkMeetingCompleted(id, token);
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
      const result = await dbDeleteMeeting(id, token);
      if (result.success) {
        setMeetings((prev) => prev.filter((m) => m.id !== id));
        addToast('Meeting deleted.', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete meeting.', 'error');
    }
  };

  // Trial actions
  const handleUpdateTrialStatus = async (id, status) => {
    try {
      const result = await dbUpdateTrialStatus(id, status, token);
      if (result.success) {
        setTrials((prev) => 
          prev.map((t) => t.id === id ? { ...t, trial_status: status } : t)
        );
        addToast(`Trial campaign status updated to ${status.toUpperCase()}!`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update trial campaign status.', 'error');
    }
  };

  // CMS: Clients Testimonials
  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.quote) {
      addToast('Name and testimonial quote are required.', 'error');
      return;
    }
    await dbSaveClient(newClient);
    const updated = await dbGetClients();
    setClients(updated);
    setNewClient({ name: '', company: '', rating: 5, quote: '' });
    addToast('Client testimonial saved successfully!', 'success');
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Delete this client testimonial?')) return;
    await dbDeleteClient(id);
    const updated = await dbGetClients();
    setClients(updated);
    addToast('Testimonial removed.', 'success');
  };

  // CMS: Trusted Partners / Badges
  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.image) {
      addToast('Partner name and badge image URL are required.', 'error');
      return;
    }
    await dbSavePartner(newPartner);
    const updated = await dbGetPartners();
    setPartners(updated);
    setNewPartner({ name: '', link: '', image: '' });
    addToast('Trusted partner badge saved!', 'success');
  };

  const handleDeletePartner = async (id) => {
    if (!window.confirm('Delete this partner badge?')) return;
    await dbDeletePartner(id);
    const updated = await dbGetPartners();
    setPartners(updated);
    addToast('Partner badge removed.', 'success');
  };

  // Stats calculation
  const stats = {
    totalContacts: contacts.length,
    unreadContacts: contacts.filter(c => c.status === 'unread').length,
    totalMeetings: meetings.length,
    pendingMeetings: meetings.filter(m => m.status === 'pending').length
  };

  // Trial analytics calculations
  const totalTrials = trials.length;
  const convertedTrials = trials.filter(t => t.trial_status === 'converted').length;
  const activeTrials = trials.filter(t => t.trial_status === 'active').length;
  const expiredTrials = trials.filter(t => t.trial_status === 'expired').length;
  const conversionRate = totalTrials > 0 ? ((convertedTrials / totalTrials) * 100).toFixed(1) + '%' : '0.0%';

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

              {setActivePage && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button 
                    onClick={() => setActivePage('home')} 
                    style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.target.style.color = '#C7FF3D'}
                    onMouseLeave={(e) => e.target.style.color = '#777'}
                  >
                    ← Back to Website
                  </button>
                </div>
              )}
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
    <div className="admin-dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo-symbol">Z</span>
          <span className="sidebar-logo-text">NORYVEX ADMIN</span>
        </div>
        
        <div className="sidebar-profile">
          <div className="profile-avatar">RC</div>
          <div className="profile-info">
            <span className="profile-name">Operations Control</span>
            <span className="profile-role">codingwithrazi@gmail.com</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            onClick={() => setActiveTab('contacts')} 
            className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
          >
            <Mail size={18} />
            <span>Trials & Messages</span>
            <span className="nav-badge">{contacts.length}</span>
          </button>

          <button 
            onClick={() => setActiveTab('meetings')} 
            className={`nav-item ${activeTab === 'meetings' ? 'active' : ''}`}
          >
            <Calendar size={18} />
            <span>Strategy Calls</span>
            <span className="nav-badge">{meetings.length}</span>
          </button>

          <button 
            onClick={() => setActiveTab('trials-tracker')} 
            className={`nav-item ${activeTab === 'trials-tracker' ? 'active' : ''}`}
          >
            <Activity size={18} />
            <span>Trial Tracker</span>
            <span className="nav-badge">{trials.length}</span>
          </button>

          <div className="nav-divider">CMS MANAGEMENT</div>

          <button 
            onClick={() => setActiveTab('cms-clients')} 
            className={`nav-item ${activeTab === 'cms-clients' ? 'active' : ''}`}
          >
            <Star size={18} />
            <span>Testimonials</span>
          </button>

          <button 
            onClick={() => setActiveTab('cms-partners')} 
            className={`nav-item ${activeTab === 'cms-partners' ? 'active' : ''}`}
          >
            <Award size={18} />
            <span>B2B Trust Badges</span>
          </button>

          <div className="nav-divider">CONNECTIONS</div>

          <button 
            onClick={() => setActiveTab('db-settings')} 
            className={`nav-item ${activeTab === 'db-settings' ? 'active' : ''}`}
          >
            <Link size={18} />
            <span>Xano Database</span>
            <span className={`status-dot ${dbProvider === 'xano' ? 'green' : 'gray'}`}></span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <LogOut size={16} />
            <span>System Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-pane">
        <header className="main-pane-header">
          <div className="header-breadcrumbs">
            <span className="breadcrumb-parent">Console</span>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-current">
              {activeTab === 'contacts' && 'Inquiries & Leads'}
              {activeTab === 'meetings' && 'Booked Meetings'}
              {activeTab === 'trials-tracker' && 'Active Campaigns'}
              {activeTab === 'cms-clients' && 'CMS Testimonials'}
              {activeTab === 'cms-partners' && 'CMS Trust Badges'}
              {activeTab === 'db-settings' && 'Cloud Database Settings'}
            </span>
          </div>
          
          <div className="header-status">
            <span className="status-label">Database Provider:</span>
            {dbProvider === 'xano' ? (
              <span className="status-tag xano">
                <span className="glowing-dot green"></span> Xano Cloud
              </span>
            ) : (
              <span className="status-tag local">
                <span className="glowing-dot yellow"></span> Local browser
              </span>
            )}
          </div>
        </header>

        <div className="pane-body">
          {/* Stats Cards - Display on overview tabs */}
          {(activeTab === 'contacts' || activeTab === 'meetings' || activeTab === 'trials-tracker') && (
            <div className="stats-grid" style={{ marginBottom: '32px' }}>
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
          )}

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

              {/* Tab 3: Trial Campaigns CRM Tracker */}
              {activeTab === 'trials-tracker' && (
                <div>
                  {/* Campaign analytics metrics row */}
                  <div className="analytics-metrics-strip">
                    <div className="glass-card metric-pill">
                      <span className="metric-pill-label">Total Requests</span>
                      <span className="metric-pill-val">{totalTrials}</span>
                    </div>
                    <div className="glass-card metric-pill highlight-green">
                      <span className="metric-pill-label">Conversion Rate</span>
                      <span className="metric-pill-val">{conversionRate}</span>
                      <span className="metric-pill-subtext">{convertedTrials} converted</span>
                    </div>
                    <div className="glass-card metric-pill">
                      <span className="metric-pill-label">Active Agents</span>
                      <span className="metric-pill-val">{activeTrials}</span>
                    </div>
                    <div className="glass-card metric-pill">
                      <span className="metric-pill-label">Expired Caps</span>
                      <span className="metric-pill-val">{expiredTrials}</span>
                    </div>
                  </div>

                  <div className="admin-table-container">
                    {trials.length === 0 ? (
                      <div className="empty-table-message">No trial campaigns found.</div>
                    ) : (
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Status Checklist</th>
                            <th>Business / Client Name</th>
                            <th>Niche</th>
                            <th>Vapi Call Duration Cap</th>
                            <th>Operational Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trials.map((t) => {
                            const minutesUsed = (t.call_duration_seconds / 60).toFixed(1);
                            const minutesLimit = (t.limit_duration_seconds / 60);
                            const progressPercentage = Math.min((t.call_duration_seconds / t.limit_duration_seconds) * 100, 100);
                            
                            return (
                              <tr key={t.id}>
                                <td>
                                  <span className={`badge-status-pill status-${t.trial_status}`}>
                                    {t.trial_status}
                                  </span>
                                </td>
                                <td>
                                  <strong className="text-white">{t.business_name}</strong>
                                  <div className="date-subtext">Contact: {t.contact_name}</div>
                                  <div className="date-subtext">Email: {t.email}</div>
                                </td>
                                <td>
                                  <div className="service-tag-badge">{t.business_type}</div>
                                  <div className="date-subtext">Tasks: {t.ai_handling?.toUpperCase()}</div>
                                </td>
                                <td>
                                  <div style={{ minWidth: '150px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                                      <span className="text-white">{minutesUsed} mins</span>
                                      <span className="text-muted">/ {minutesLimit} mins</span>
                                    </div>
                                    <div className="trial-progress-bg">
                                      <div 
                                        className={`trial-progress-bar ${progressPercentage >= 100 ? 'cap-expired' : ''}`}
                                        style={{ width: `${progressPercentage}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="action-buttons-cell">
                                    {t.trial_status === 'requested' && (
                                      <button 
                                        onClick={() => handleUpdateTrialStatus(t.id, 'active')}
                                        className="action-btn action-btn-read"
                                      >
                                        Activate Agent
                                      </button>
                                    )}
                                    {t.trial_status === 'active' && (
                                      <button 
                                        onClick={() => handleUpdateTrialStatus(t.id, 'expired')}
                                        className="action-btn action-btn-delete"
                                      >
                                        Deactivate/Expire
                                      </button>
                                    )}
                                    {t.trial_status !== 'converted' && (
                                      <button 
                                        onClick={() => handleUpdateTrialStatus(t.id, 'converted')}
                                        className="action-btn action-btn-convert"
                                      >
                                        <Award size={12} /> Convert Client
                                      </button>
                                    )}
                                    {t.trial_status === 'converted' && (
                                      <span className="success-badge"><Check size={12} /> Partner Signed</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Testimonials CMS */}
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

              {/* Tab 5: Trusted Badges CMS */}
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

              {/* Tab 6: Database Connection Settings */}
              {activeTab === 'db-settings' && (
                <div className="cms-layout">
                  <div className="cms-form-card">
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Link size={20} className="icon-neon" />
                      Configure Xano Database
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '24px', lineHeight: '1.5' }}>
                      Connect your Noryvex admin panel to a cloud database hosted on Xano.
                    </p>

                    <form onSubmit={handleSaveDbSettings}>
                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Database Provider</label>
                        <select 
                          className="form-control" 
                          value={dbProvider}
                          onChange={(e) => setDbProvider(e.target.value)}
                          style={{ width: '100%', background: '#0a0a0d', color: '#fff', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '10px' }}
                        >
                          <option value="local">Local Storage (Browser-only Fallback)</option>
                          <option value="xano">Xano Cloud Database</option>
                        </select>
                      </div>

                      {dbProvider === 'xano' && (
                        <>
                          <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Xano API Base Group URL</label>
                            <input 
                              type="text" 
                              required 
                              placeholder="https://x8ki-letl-twmt.n7.xano.io/api:Tl7OK6wd" 
                              className="form-control"
                              value={xanoBaseUrl}
                              onChange={(e) => setXanoBaseUrl(e.target.value)}
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Developer Token (API Key / Auth)</label>
                            <input 
                              type="password" 
                              placeholder="Paste developer access token..." 
                              className="form-control"
                              value={xanoToken}
                              onChange={(e) => setXanoToken(e.target.value)}
                            />
                          </div>
                        </>
                      )}

                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                          Save Settings
                        </button>
                        
                        {dbProvider === 'xano' && (
                          <button 
                            type="button" 
                            onClick={handleTestConnection}
                            disabled={testingConnection}
                            className="btn btn-secondary" 
                            style={{ flex: 1 }}
                          >
                            {testingConnection ? 'Testing...' : 'Test Connection'}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="glass-card" style={{ padding: '32px 24px', border: '1px solid var(--border-light)', borderRadius: '16px', background: 'rgba(255,255,255,0.015)' }}>
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={20} className="icon-neon" />
                      Schema Setup Guide (JSON Import)
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '16px', lineHeight: '1.5' }}>
                      Create your database tables instantly in Xano (ID: <code>166176-0</code>):
                    </p>
                    <ol style={{ fontSize: '0.85rem', color: 'var(--text-gray)', paddingLeft: '20px', marginBottom: '20px', lineHeight: '1.6' }}>
                      <li>Click the links below to download the schema templates.</li>
                      <li>In your Xano Workspace, click <strong>Add Table</strong> (top right of the Database view).</li>
                      <li>Select <strong>Import File</strong> &gt; <strong>JSON</strong> and upload the matching file.</li>
                      <li>Xano will automatically set up the table and create all columns with the correct data types!</li>
                    </ol>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                      <a href="/data/xano_schemas/contacts.json" download="contacts.json" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px', textDecoration: 'none' }}>
                        ↓ contacts.json
                      </a>
                      <a href="/data/xano_schemas/meetings.json" download="meetings.json" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px', textDecoration: 'none' }}>
                        ↓ meetings.json
                      </a>
                      <a href="/data/xano_schemas/trials.json" download="trials.json" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px', textDecoration: 'none' }}>
                        ↓ trials.json
                      </a>
                      <a href="/data/xano_schemas/clients.json" download="clients.json" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px', textDecoration: 'none' }}>
                        ↓ clients.json
                      </a>
                      <a href="/data/xano_schemas/partners.json" download="partners.json" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px', textDecoration: 'none' }}>
                        ↓ partners.json
                      </a>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                      <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                        <strong>contacts</strong> (Inquiries)
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                          Fields: <code>name</code>, <code>company</code>, <code>email</code>, <code>phone</code>, <code>service</code>, <code>message</code>, <code>status</code>, <code>created_at</code>
                        </div>
                      </div>
                      <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                        <strong>meetings</strong> (Appointments)
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                          Fields: <code>name</code>, <code>email</code>, <code>company</code>, <code>phone</code>, <code>date</code>, <code>time</code>, <code>notes</code>, <code>status</code>, <code>created_at</code>
                        </div>
                      </div>
                      <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                        <strong>trials</strong> (Active Demos)
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                          Fields: <code>business_name</code>, <code>contact_name</code>, <code>email</code>, <code>phone</code>, <code>business_type</code>, <code>ai_handling</code>, <code>trial_status</code>, <code>call_duration_seconds</code>, <code>limit_duration_seconds</code>, <code>created_at</code>
                        </div>
                      </div>
                      <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                        <strong>clients</strong> (Testimonials CMS)
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                          Fields: <code>name</code>, <code>company</code>, <code>rating</code>, <code>quote</code>
                        </div>
                      </div>
                      <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                        <strong>partners</strong> (Trust Badges CMS)
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                          Fields: <code>name</code>, <code>link</code>, <code>image</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}

        </div>
      </main>

    <style>{`
        /* Sidebar Layout Structure */
        .admin-dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: #070708;
          color: #fff;
          font-family: 'Inter', sans-serif;
        }

        .admin-sidebar {
          width: 260px;
          background: #0a0a0d;
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
        }

        .sidebar-brand {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--border-light);
        }

        .sidebar-logo-symbol {
          width: 32px;
          height: 32px;
          background: var(--accent-neon);
          color: #000;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .sidebar-logo-text {
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          color: #fff;
        }

        .sidebar-profile {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--border-light);
          background: rgba(255,255,255,0.005);
        }

        .profile-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(199, 255, 61, 0.08);
          border: 1px solid var(--accent-neon-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--accent-neon);
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .profile-name {
          font-weight: 600;
          font-size: 0.85rem;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-role {
          font-size: 0.75rem;
          color: var(--text-gray);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-nav {
          flex: 1;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
        }

        .nav-divider {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin: 20px 8px 8px 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: var(--text-gray);
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          text-align: left;
          width: 100%;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.02);
          color: #fff;
        }

        .nav-item.active {
          background: rgba(199, 255, 61, 0.05);
          border: 1px solid rgba(199, 255, 61, 0.1);
          color: var(--accent-neon);
          font-weight: 600;
        }

        .nav-badge {
          margin-left: auto;
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-gray);
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 600;
        }

        .nav-item.active .nav-badge {
          background: rgba(199, 255, 61, 0.1);
          color: var(--accent-neon);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-left: auto;
        }
        .status-dot.green {
          background: var(--accent-neon);
          box-shadow: 0 0 8px var(--accent-neon);
        }
        .status-dot.gray {
          background: #555;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border-light);
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,0,0,0.02);
          border: 1px solid rgba(255,0,0,0.05);
          color: #ff4a4a;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .sidebar-logout-btn:hover {
          background: rgba(255,0,0,0.06);
          border-color: rgba(255,0,0,0.15);
        }

        /* Main Pane Layout */
        .admin-main-pane {
          flex: 1;
          margin-left: 260px;
          min-width: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .main-pane-header {
          height: 72px;
          border-bottom: 1px solid var(--border-light);
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(10,10,13,0.4);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .breadcrumb-parent {
          color: var(--text-gray);
        }

        .breadcrumb-divider {
          color: #444;
        }

        .breadcrumb-current {
          color: #fff;
          font-weight: 600;
        }

        .header-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
        }

        .status-label {
          color: var(--text-gray);
        }

        .status-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .status-tag.xano {
          background: rgba(199, 255, 61, 0.06);
          border: 1px solid rgba(199, 255, 61, 0.15);
          color: var(--accent-neon);
        }

        .status-tag.local {
          background: rgba(255, 180, 0, 0.06);
          border: 1px solid rgba(255, 180, 0, 0.15);
          color: #ffb400;
        }

        .glowing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .glowing-dot.green {
          background: var(--accent-neon);
          box-shadow: 0 0 6px var(--accent-neon);
        }

        .glowing-dot.yellow {
          background: #ffb400;
          box-shadow: 0 0 6px #ffb400;
        }

        .pane-body {
          flex: 1;
          padding: 40px;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .admin-dashboard-layout {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            position: relative;
            height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border-light);
          }
          .admin-main-pane {
            margin-left: 0;
            padding-top: 0;
          }
          .main-pane-header {
            padding: 0 20px;
          }
          .pane-body {
            padding: 24px 16px;
          }
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

        /* Analytics metrics strip */
        .analytics-metrics-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .metric-pill {
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          border: 1px solid var(--border-light);
        }

        .metric-pill.highlight-green {
          border-color: var(--accent-neon-border);
          background: rgba(199, 255, 61, 0.02);
        }

        .metric-pill-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .metric-pill-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-white);
          margin-top: 4px;
        }

        .metric-pill-subtext {
          font-size: 0.75rem;
          color: var(--text-gray);
          margin-top: 2px;
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
          align-items: center;
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

        .action-btn-convert {
          background: rgba(199, 255, 61, 0.2);
          border: 1px solid var(--accent-neon);
          color: var(--text-white);
        }

        .action-btn-convert:hover {
          background: var(--accent-neon);
          color: #000;
          box-shadow: 0 0 10px var(--accent-neon-glow);
        }

        .success-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-neon);
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

        /* Trial status checklist badges */
        .badge-status-pill {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.05em;
        }

        .badge-status-pill.status-requested {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .badge-status-pill.status-active {
          background: rgba(199, 255, 61, 0.1);
          color: var(--accent-neon);
          border: 1px solid var(--accent-neon-border);
          box-shadow: 0 0 10px rgba(199, 255, 61, 0.1);
        }

        .badge-status-pill.status-expired {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .badge-status-pill.status-converted {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        /* Trial progress bar */
        .trial-progress-bg {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.06);
          border-radius: 100px;
          overflow: hidden;
          margin-top: 4px;
        }

        .trial-progress-bar {
          height: 100%;
          background: var(--accent-neon);
          box-shadow: 0 0 8px var(--accent-neon);
          border-radius: 100px;
          transition: width 0.4s ease;
        }

        .trial-progress-bar.cap-expired {
          background: #ef4444;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
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
          .analytics-metrics-strip {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
