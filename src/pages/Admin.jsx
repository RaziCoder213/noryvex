import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, Calendar, LogOut, Check, Trash2, Eye } from 'lucide-react';
import { 
  dbGetContacts, 
  dbGetMeetings, 
  dbMarkContactRead, 
  dbDeleteContact, 
  dbMarkMeetingCompleted, 
  dbDeleteMeeting, 
  dbAdminLogin 
} from '../utils/dbHelper';

export default function Admin({ addToast }) {
  const [token, setToken] = useState(localStorage.getItem('noryvex_admin_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' or 'meetings'
  
  // Data lists
  const [contacts, setContacts] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch admin dashboard data
  const fetchData = async (authToken) => {
    if (!authToken) return;
    setLoadingData(true);
    try {
      const contactsData = dbGetContacts();
      const meetingsData = dbGetMeetings();
      setContacts(contactsData);
      setMeetings(meetingsData);
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
    if (email !== 'codingwithrazi@gmail.com') {
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
                <p>Enter your authorization credentials to unlock the leads dashboard.</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Admin Email</label>
                  <input
                    type="email"
                    required
                    placeholder="codingwithrazi@gmail.com"
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
                  {loggingIn ? 'Authenticating...' : 'Access Dashboard'}
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
      <section className="admin-dashboard-hero">
        <div className="container admin-hero-container">
          <div>
            <span className="section-tag">Internal Operations</span>
            <h1 className="dashboard-title">Leads Operations Hub</h1>
            <p className="dashboard-subtitle">Qualify direct inquiries and manage booked strategy call reservations.</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary logout-btn">
            Logout <LogOut size={16} />
          </button>
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
              Contact Inquiries ({contacts.length})
            </button>
            <button 
              onClick={() => setActiveTab('meetings')} 
              className={`tab-btn ${activeTab === 'meetings' ? 'active' : ''}`}
            >
              Meeting Bookings ({meetings.length})
            </button>
          </div>

          {/* Loading Indicator */}
          {loadingData ? (
            <div className="loading-box">
              <span className="loading-spinner"></span>
              <p>Fetching records from SQLite database...</p>
            </div>
          ) : (
            <>
              {/* Tab 1: Contacts Table */}
              {activeTab === 'contacts' && (
                <div className="admin-table-container">
                  {contacts.length === 0 ? (
                    <div className="empty-table-message">No contact inquiries found.</div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Inquirer</th>
                          <th>Company</th>
                          <th>Contact Details</th>
                          <th>Message Details</th>
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
                              <div className="service-tag-badge">{c.service}</div>
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
                                    <Check size={14} /> Read
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteContact(c.id)} 
                                  className="action-btn action-btn-delete"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
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
                    <div className="empty-table-message">No meeting bookings scheduled.</div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Prospect</th>
                          <th>Company</th>
                          <th>Date / Time</th>
                          <th>Meeting Notes</th>
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
                            <td>
                              <strong className="text-white">{m.name}</strong>
                              <div>{m.email}</div>
                              <div className="phone-subtext">{m.phone || '—'}</div>
                            </td>
                            <td>{m.company || '—'}</td>
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
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
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
            </>
          )}

        </div>
      </section>

      <style>{`
        .admin-dashboard-hero {
          padding: 140px 0 32px 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(7,7,8,1) 100%);
          border-bottom: 1px solid var(--border-light);
        }

        .admin-hero-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }

        .dashboard-title {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }

        .dashboard-subtitle {
          font-size: 1rem;
          color: var(--text-gray);
        }

        .logout-btn {
          font-size: 0.85rem;
          padding: 8px 16px;
        }

        .admin-content-section {
          padding: 48px 0 100px 0;
          background-color: var(--bg-dark);
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px 32px;
          text-align: left;
        }

        .stat-card-icon {
          width: 32px;
          height: 32px;
          color: var(--text-gray);
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
          font-family: var(--font-display);
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
          margin-bottom: 24px;
        }

        .tab-btn {
          background: none;
          border: none;
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-gray);
          padding: 12px 8px;
          cursor: pointer;
          position: relative;
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
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          background: rgba(199,255,61,0.08);
          color: var(--accent-neon);
          border: 1px solid var(--accent-neon-border);
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
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

        .empty-table-message {
          padding: 48px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        /* Loading Spinner */
        .loading-box {
          padding: 64px 0;
          text-align: center;
        }

        .loading-spinner {
          display: inline-block;
          width: 32px;
          height: 32px;
          border: 3px solid rgba(199,255,61,0.1);
          border-radius: 50%;
          border-top-color: var(--accent-neon);
          animation: spin-slow 1s infinite linear;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .admin-hero-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
