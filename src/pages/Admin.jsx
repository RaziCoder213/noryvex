import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, Calendar, LogOut, Check, Trash2, Eye, Plus, Star, Link, Image, Activity, Award, Settings, User, HelpCircle, MessageCircle, Phone, Edit3, Save, X, Slack, Globe, AlignLeft } from 'lucide-react';
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
  dbUpdateTrialStatus,
  dbGetUnderConstruction,
  dbSetUnderConstruction,
  dbGetFaqs,
  dbAdminSaveFaq,
  dbAdminDeleteFaq,
  dbGetContactConfig,
  dbAdminSetContactConfig
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
  
  // Under Construction settings states
  const [underConstruction, setUnderConstruction] = useState(false);
  const [updatingConstruction, setUpdatingConstruction] = useState(false);
  

  
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

  // FAQs state
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [savingFaq, setSavingFaq] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [loadingFaqs, setLoadingFaqs] = useState(false);

  // Contact Config state (WhatsApp / Slack)
  const [contactConfig, setContactConfig] = useState({ whatsapp_number: '', whatsapp_message: '', slack_link: '' });
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  // Brand & Founder profile (persisted to localStorage, read by About page)
  const BRAND_PROFILE_KEY = 'noryvex_brand_profile';
  const DEFAULT_BRAND_PROFILE = {
    founderName:    'Muhammad Razi',
    founderTitle:   'Founder & Full-Stack AI Developer',
    founderBio:     "Muhammad Razi is the founder of Noryvex. Razi personally reviews, configures, and tests every clinic's receptionist configuration to ensure patient conversations feel natural, clinic scheduling works seamlessly, and FAQs are answered accurately.",
    founderPhoto:   '',
    founderLinkedIn:'https://www.linkedin.com/in/mrazi-dev/',
    founderTwitter: '',
    founderGitHub:  'https://github.com/RaziCoder213',
    founderEmail:   'razi@trynoryvex.com',
    companyName:    'Noryvex',
    companyTagline: 'Never miss another dental patient call.',
    companyDescription: 'Noryvex is a managed AI receptionist agency for dental clinics. We build, train, and manage custom AI voice receptionists that answer patient calls 24/7.',
    companyLinkedIn:'',
    companyTwitter: '',
    companyWebsite: 'https://trynoryvex.com',
  };
  const [brandProfile, setBrandProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(BRAND_PROFILE_KEY);
      return saved ? { ...DEFAULT_BRAND_PROFILE, ...JSON.parse(saved) } : DEFAULT_BRAND_PROFILE;
    } catch { return DEFAULT_BRAND_PROFILE; }
  });
  const [brandSaved, setBrandSaved] = useState(false);
  const updateBrandProfile = (key, value) => setBrandProfile(prev => ({ ...prev, [key]: value }));
  const saveBrandProfile = () => {
    try {
      localStorage.setItem(BRAND_PROFILE_KEY, JSON.stringify(brandProfile));
      setBrandSaved(true);
      addToast('Brand profile saved! About page updated.', 'success');
      setTimeout(() => setBrandSaved(false), 3000);
    } catch { addToast('Failed to save brand profile.', 'error'); }
  };

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
      const ucStatus = await dbGetUnderConstruction();
      const faqsData = await dbGetFaqs();
      const configData = await dbGetContactConfig();
      
      setContacts(contactsData);
      setMeetings(meetingsData);
      setClients(clientsData);
      setPartners(partnersData);
      setTrials(trialsData);
      setUnderConstruction(ucStatus);
      setFaqs(faqsData);
      setContactConfig(prev => ({ ...prev, ...configData }));
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

  useEffect(() => {
    const handleSessionExpired = () => {
      setToken('');
      addToast('Session expired. Please log in again.', 'error');
    };
    
    window.addEventListener('admin-session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('admin-session-expired', handleSessionExpired);
    };
  }, [addToast]);

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

  const handleToggleUnderConstruction = async () => {
    setUpdatingConstruction(true);
    try {
      const nextVal = !underConstruction;
      const res = await dbSetUnderConstruction(nextVal);
      if (res.success) {
        setUnderConstruction(nextVal);
        addToast(
          nextVal 
            ? 'Under Construction Mode activated. Marketing site is now OFF.' 
            : 'Under Construction Mode deactivated. Marketing site is now LIVE.', 
          'success'
        );
      } else {
        addToast('Failed to update Under Construction status.', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Error toggling Under Construction status.', 'error');
    } finally {
      setUpdatingConstruction(false);
    }
  };



  // ── FAQ Handlers ──────────────────────────────────────────────────────────
  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      addToast('Both question and answer are required.', 'error');
      return;
    }
    setSavingFaq(true);
    try {
      const result = await dbAdminSaveFaq(newFaq.question.trim(), newFaq.answer.trim());
      if (result.success) {
        const updated = await dbGetFaqs();
        setFaqs(updated);
        setNewFaq({ question: '', answer: '' });
        addToast('FAQ added successfully!', 'success');
      } else {
        addToast(result.error || 'Failed to add FAQ.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to add FAQ.', 'error');
    } finally {
      setSavingFaq(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      const result = await dbAdminDeleteFaq(id);
      if (result.success) {
        setFaqs(prev => prev.filter(f => f.id !== id));
        addToast('FAQ removed.', 'success');
      } else {
        addToast('Failed to delete FAQ.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete FAQ.', 'error');
    }
  };

  // ── Contact Config Handlers ───────────────────────────────────────────────
  const handleSaveContactConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const result = await dbAdminSetContactConfig(contactConfig);
      if (result.success) {
        setConfigSaved(true);
        addToast('Contact configuration saved!', 'success');
        setTimeout(() => setConfigSaved(false), 3000);
      } else {
        addToast('Failed to save contact config.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to save contact config.', 'error');
    } finally {
      setSavingConfig(false);
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
    try {
      const result = await dbSaveClient(newClient);
      if (result.success) {
        const updated = await dbGetClients();
        setClients(updated);
        setNewClient({ name: '', company: '', rating: 5, quote: '' });
        addToast('Client testimonial saved successfully!', 'success');
      } else {
        addToast('Failed to save testimonial. Session may have expired.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to save testimonial.', 'error');
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Delete this client testimonial?')) return;
    try {
      const result = await dbDeleteClient(id);
      if (result.success) {
        const updated = await dbGetClients();
        setClients(updated);
        addToast('Testimonial removed.', 'success');
      } else {
        addToast('Failed to remove testimonial. Session may have expired.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to remove testimonial.', 'error');
    }
  };

  // CMS: Trusted Partners / Badges
  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.image) {
      addToast('Partner name and badge image URL are required.', 'error');
      return;
    }
    try {
      const result = await dbSavePartner(newPartner);
      if (result.success) {
        const updated = await dbGetPartners();
        setPartners(updated);
        setNewPartner({ name: '', link: '', image: '' });
        addToast('Trusted partner badge saved!', 'success');
      } else {
        addToast('Failed to save partner badge. Session may have expired.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to save partner badge.', 'error');
    }
  };

  const handleDeletePartner = async (id) => {
    if (!window.confirm('Delete this partner badge?')) return;
    try {
      const result = await dbDeletePartner(id);
      if (result.success) {
        const updated = await dbGetPartners();
        setPartners(updated);
        addToast('Partner badge removed.', 'success');
      } else {
        addToast('Failed to remove partner badge. Session may have expired.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to remove partner badge.', 'error');
    }
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

          <button 
            onClick={() => setActiveTab('faqs')} 
            className={`nav-item ${activeTab === 'faqs' ? 'active' : ''}`}
          >
            <HelpCircle size={18} />
            <span>FAQ Manager</span>
            <span className="nav-badge">{faqs.length}</span>
          </button>

          <button 
            onClick={() => setActiveTab('brand-profile')} 
            className={`nav-item ${activeTab === 'brand-profile' ? 'active' : ''}`}
          >
            <User size={18} />
            <span>Brand &amp; Profile</span>
          </button>

          <div className="nav-divider">CONNECTIONS</div>

          <button 
            onClick={() => setActiveTab('contact-config')} 
            className={`nav-item ${activeTab === 'contact-config' ? 'active' : ''}`}
          >
            <MessageCircle size={18} />
            <span>Contact Config</span>
          </button>

          <button 
            onClick={() => setActiveTab('db-settings')} 
            className={`nav-item ${activeTab === 'db-settings' ? 'active' : ''}`}
          >
            <Settings size={18} />
            <span>System Settings</span>
            <span className={`status-dot ${underConstruction ? 'red' : 'green'}`}></span>
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
              {activeTab === 'faqs' && 'FAQ Manager'}
              {activeTab === 'brand-profile' && 'Brand & Founder Profile'}
              {activeTab === 'contact-config' && 'Contact Config'}
              {activeTab === 'db-settings' && 'Cloud Database Settings'}
            </span>
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
                              <div className={`service-tag-badge ${c.service && (c.service.includes('7-Day Trial') || c.service.includes('Free Demo')) ? 'trial-badge' : ''}`}>{c.service}</div>
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

              {/* Tab 6: System & Database Settings */}
              {activeTab === 'db-settings' && (
                <div className="cms-layout" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Under Construction Card */}
                  <div className="cms-form-card">
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Settings size={20} className="icon-neon" />
                      Marketing Website Status
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '24px', lineHeight: '1.5' }}>
                      Control the visibility of the public Noryvex marketing website. When "Under Construction" mode is active, 
                      all traffic to the website is shown a maintenance screen, while the Admin panel remains fully operational.
                    </p>

                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                          <span style={{ fontSize: '0.9rem', fontWeight: '700', display: 'block', color: 'var(--text-white)' }}>
                            Under Construction Mode
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Toggle maintenance screen overlay for non-admin pages
                          </span>
                        </div>
                        <button
                          onClick={handleToggleUnderConstruction}
                          disabled={updatingConstruction}
                          className={`btn ${underConstruction ? 'btn-outline-neon' : 'btn-primary'}`}
                          style={{ minWidth: '180px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '800' }}
                        >
                          {updatingConstruction 
                            ? 'Updating...' 
                            : underConstruction 
                              ? '🔴 ACTIVE (OFFLINE)' 
                              : '🟢 INACTIVE (ONLINE)'}
                        </button>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: underConstruction ? '#ef4444' : 'var(--accent-neon)', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: underConstruction ? 'rgba(239, 68, 68, 0.05)' : 'rgba(199, 255, 61, 0.05)', borderRadius: '8px', border: `1px solid ${underConstruction ? 'rgba(239, 68, 68, 0.1)' : 'rgba(199, 255, 61, 0.1)'}` }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: underConstruction ? '#ef4444' : '#C7FF3D', boxShadow: `0 0 8px ${underConstruction ? '#ef4444' : '#C7FF3D'}` }}></span>
                        {underConstruction 
                          ? 'Marketing website is currently covered by the under construction overlay.' 
                          : 'Marketing website is live, public, and operational.'}
                    </div>
                  </div>
                </div>
              </div>
            )}


              {/* Tab 7: Brand & Founder Profile */}
              {activeTab === 'brand-profile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                    {/* Founder profile column */}
                    <div className="glass-card cms-form-card">
                      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={20} className="icon-neon" /> Founder Profile
                      </h3>

                      {/* Photo preview */}
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        {brandProfile.founderPhoto ? (
                          <img
                            src={brandProfile.founderPhoto}
                            alt="Founder"
                            style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-neon)', display: 'block', margin: '0 auto 12px auto' }}
                          />
                        ) : (
                          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--bg-charcoal)', border: '2px solid var(--accent-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                            <User size={38} style={{ color: '#C7FF3D' }} />
                          </div>
                        )}
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Enter a photo URL below to update this preview</p>
                      </div>

                      {[{ label: 'Full Name', key: 'founderName', type: 'text', placeholder: 'Muhammad Razi' },
                        { label: 'Title / Role', key: 'founderTitle', type: 'text', placeholder: 'Founder & Full-Stack AI Developer' },
                        { label: 'Photo URL', key: 'founderPhoto', type: 'url', placeholder: 'https://example.com/photo.jpg' },
                        { label: 'Email', key: 'founderEmail', type: 'email', placeholder: 'razi@trynoryvex.com' },
                      ].map(f => (
                        <div key={f.key} className="form-group">
                          <label className="form-label">{f.label}</label>
                          <input
                            type={f.type}
                            value={brandProfile[f.key] || ''}
                            placeholder={f.placeholder}
                            onChange={e => updateBrandProfile(f.key, e.target.value)}
                            className="form-control"
                          />
                        </div>
                      ))}

                      <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea
                          value={brandProfile.founderBio || ''}
                          rows={4}
                          onChange={e => updateBrandProfile('founderBio', e.target.value)}
                          className="form-control"
                          style={{ resize: 'vertical', minHeight: 90 }}
                        />
                      </div>

                      <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: '20px 0 12px 0' }}>Founder Social Links</p>
                      {[{ label: 'LinkedIn Profile URL', key: 'founderLinkedIn', placeholder: 'https://linkedin.com/in/...' },
                        { label: 'Twitter / X Profile URL', key: 'founderTwitter', placeholder: 'https://x.com/...' },
                        { label: 'GitHub Profile URL', key: 'founderGitHub', placeholder: 'https://github.com/...' },
                      ].map(f => (
                        <div key={f.key} className="form-group">
                          <label className="form-label">{f.label}</label>
                          <input
                            type="url"
                            value={brandProfile[f.key] || ''}
                            placeholder={f.placeholder}
                            onChange={e => updateBrandProfile(f.key, e.target.value)}
                            className="form-control"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Company profile column */}
                    <div className="glass-card cms-form-card">
                      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={20} className="icon-neon" /> Company Profile
                      </h3>

                      {[{ label: 'Company Name', key: 'companyName', placeholder: 'Noryvex' },
                        { label: 'Tagline', key: 'companyTagline', placeholder: 'Never miss another dental patient call.' },
                        { label: 'Website', key: 'companyWebsite', placeholder: 'https://trynoryvex.com' },
                      ].map(f => (
                        <div key={f.key} className="form-group">
                          <label className="form-label">{f.label}</label>
                          <input
                            type="text"
                            value={brandProfile[f.key] || ''}
                            placeholder={f.placeholder}
                            onChange={e => updateBrandProfile(f.key, e.target.value)}
                            className="form-control"
                          />
                        </div>
                      ))}

                      <div className="form-group">
                        <label className="form-label">Company Description</label>
                        <textarea
                          value={brandProfile.companyDescription || ''}
                          rows={4}
                          onChange={e => updateBrandProfile('companyDescription', e.target.value)}
                          className="form-control"
                          style={{ resize: 'vertical', minHeight: 90 }}
                        />
                      </div>

                      <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: '20px 0 12px 0' }}>Company Social Links</p>
                      {[{ label: 'Company LinkedIn URL', key: 'companyLinkedIn', placeholder: 'https://linkedin.com/company/noryvex' },
                        { label: 'Company Twitter / X URL', key: 'companyTwitter', placeholder: 'https://x.com/noryvex' },
                      ].map(f => (
                        <div key={f.key} className="form-group">
                          <label className="form-label">{f.label}</label>
                          <input
                            type="url"
                            value={brandProfile[f.key] || ''}
                            placeholder={f.placeholder}
                            onChange={e => updateBrandProfile(f.key, e.target.value)}
                            className="form-control"
                          />
                        </div>
                      ))}

                      {/* Preview of how About page will look */}
                      <div style={{ marginTop: '28px', padding: '18px', background: 'rgba(199,255,61,0.03)', border: '1px solid rgba(199,255,61,0.08)', borderRadius: '10px' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-neon)', marginBottom: '10px' }}>Live Preview — About Page Card</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-white)', fontWeight: 700, marginBottom: '4px' }}>{brandProfile.founderName || '—'}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-gray)', marginBottom: '6px' }}>{brandProfile.founderTitle || '—'}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{(brandProfile.founderBio || '').slice(0, 120)}{brandProfile.founderBio?.length > 120 ? '…' : ''}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                      onClick={saveBrandProfile}
                      className="btn btn-primary"
                      style={{ minWidth: '200px' }}
                    >
                      {brandSaved ? <><Check size={16} /> Saved!</> : <><User size={16} /> Save Brand Profile</>}
                    </button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Changes appear on the About page immediately after saving.</p>
                  </div>
                </div>
              )}

              {/* ── Tab: FAQ Manager ─────────────────────────────── */}
              {activeTab === 'faqs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                    {/* Add FAQ form */}
                    <div className="glass-card cms-form-card">
                      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={20} className="icon-neon" /> Add New FAQ
                      </h3>
                      <form onSubmit={handleAddFaq}>
                        <div className="form-group">
                          <label className="form-label">Question</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. How long does setup take?"
                            value={newFaq.question}
                            onChange={e => setNewFaq(p => ({ ...p, question: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Answer</label>
                          <textarea
                            className="form-control"
                            rows={5}
                            placeholder="Write a clear, concise answer..."
                            value={newFaq.answer}
                            onChange={e => setNewFaq(p => ({ ...p, answer: e.target.value }))}
                            style={{ resize: 'vertical', minHeight: 120 }}
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary w-full"
                          disabled={savingFaq}
                          style={{ marginTop: '8px' }}
                        >
                          {savingFaq ? 'Adding…' : <><Plus size={15} /> Add FAQ</>}
                        </button>
                      </form>

                      <div style={{ marginTop: '28px', padding: '14px', background: 'rgba(199,255,61,0.03)', border: '1px solid rgba(199,255,61,0.08)', borderRadius: '10px' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                          FAQs added here will appear on the <strong style={{ color: 'var(--accent-neon)' }}>Home page</strong> and <strong style={{ color: 'var(--accent-neon)' }}>Solutions page</strong> FAQ sections automatically. Changes are live immediately.
                        </p>
                      </div>
                    </div>

                    {/* FAQ list */}
                    <div className="glass-card cms-form-card" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <HelpCircle size={20} className="icon-neon" /> Live FAQs
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, background: 'rgba(199,255,61,0.08)', border: '1px solid rgba(199,255,61,0.15)', borderRadius: '100px', padding: '3px 10px' }}>
                          {faqs.length} total
                        </span>
                      </h3>
                      {faqs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <HelpCircle size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                          No FAQs yet. Add your first FAQ using the form.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {faqs.map((faq, idx) => (
                            <div
                              key={faq.id}
                              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '14px 16px', position: 'relative' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-white)', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                                    <span style={{ color: 'var(--accent-neon)', marginRight: '6px' }}>Q{idx + 1}.</span>
                                    {faq.question}
                                  </p>
                                  <p style={{ fontSize: '0.82rem', color: 'var(--text-gray)', margin: 0, lineHeight: 1.55 }}>
                                    {faq.answer.length > 140 ? faq.answer.slice(0, 140) + '…' : faq.answer}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleDeleteFaq(faq.id)}
                                  className="action-btn action-btn-delete"
                                  style={{ flexShrink: 0, marginRight: 0 }}
                                  title="Delete FAQ"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* ── Tab: Contact Config ───────────────────────────── */}
              {activeTab === 'contact-config' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '780px' }}>

                  {/* WhatsApp Config */}
                  <div className="glass-card cms-form-card">
                    <h3 style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={20} className="icon-neon" /> WhatsApp Configuration
                    </h3>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                      Controls the WhatsApp "Chat Now" button on the Contact page.
                    </p>
                    <div className="form-group">
                      <label className="form-label">WhatsApp Number <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(with country code, no spaces)</span></label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+14155552671"
                        value={contactConfig.whatsapp_number || ''}
                        onChange={e => setContactConfig(p => ({ ...p, whatsapp_number: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Default Message (pre-filled for visitors)</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Hi, I'd like to learn more about Noryvex's AI receptionist for my dental clinic."
                        value={contactConfig.whatsapp_message || ''}
                        onChange={e => setContactConfig(p => ({ ...p, whatsapp_message: e.target.value }))}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                    {contactConfig.whatsapp_number && (
                      <a
                        href={`https://wa.me/${(contactConfig.whatsapp_number || '').replace(/\D/g, '')}?text=${encodeURIComponent(contactConfig.whatsapp_message || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-neon)', textDecoration: 'none', marginTop: '4px' }}
                      >
                        <Phone size={13} /> Preview WhatsApp link ↗
                      </a>
                    )}
                  </div>

                  {/* Slack Config */}
                  <div className="glass-card cms-form-card">
                    <h3 style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Globe size={20} className="icon-neon" /> Slack & Social Config
                    </h3>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                      Direct join link for the Noryvex Slack workspace shown on the Contact page.
                    </p>
                    <div className="form-group">
                      <label className="form-label">Slack Invite / Join Link</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://join.slack.com/t/noryvex/shared_invite/..."
                        value={contactConfig.slack_link || ''}
                        onChange={e => setContactConfig(p => ({ ...p, slack_link: e.target.value }))}
                      />
                    </div>
                    {contactConfig.slack_link && (
                      <a
                        href={contactConfig.slack_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-neon)', textDecoration: 'none', marginTop: '4px' }}
                      >
                        <Globe size={13} /> Preview Slack link ↗
                      </a>
                    )}
                  </div>

                  {/* Save button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                      onClick={handleSaveContactConfig}
                      className="btn btn-primary"
                      disabled={savingConfig}
                      style={{ minWidth: '220px' }}
                    >
                      {savingConfig
                        ? 'Saving…'
                        : configSaved
                          ? <><Check size={16} /> Saved!</>
                          : <><Check size={16} /> Save Contact Config</>
                      }
                    </button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      Changes apply immediately on the Contact page.
                    </p>
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
          .brand-profile-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* ── Admin-scoped form-control overrides ──────────── */
        /* Ensures inputs look great inside the dark admin panel
           regardless of the global light/dark mode toggle */
        .admin-dashboard-layout .form-control {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          width: 100%;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .admin-dashboard-layout .form-control::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        .admin-dashboard-layout .form-control:focus {
          outline: none;
          border-color: var(--accent-neon);
          background: rgba(199, 255, 61, 0.03);
          box-shadow: 0 0 0 3px rgba(199, 255, 61, 0.08);
        }
        .admin-dashboard-layout textarea.form-control {
          resize: vertical;
          min-height: 100px;
          line-height: 1.55;
        }
        .admin-dashboard-layout select.form-control,
        .admin-dashboard-layout .select-control {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }
        .admin-dashboard-layout .form-label {
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
          display: block;
        }
        .admin-dashboard-layout .form-group {
          margin-bottom: 18px;
        }
      `}</style>
    </div>
  );
}
