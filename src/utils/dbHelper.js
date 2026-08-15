// dbHelper.js
// Client-side Database Helper communicating directly with the Noryvex Express server (Neon Postgres database).

// Delays for exponential back-off: 600 ms, 1 200 ms, 2 400 ms
const RETRY_DELAYS = [600, 1200, 2400];

const isTransientNetworkError = (err) =>
  err instanceof TypeError || // ERR_NETWORK_IO_SUSPENDED, Failed to fetch, etc.
  err?.message?.includes('Network request failed') ||
  err?.message?.includes('network');

// Helper to fetch live JSON data with zero caching + retry on transient network errors
export const fetchNoCacheJSON = async (url, options = {}, _attempt = 0) => {
  const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
  try {
    const response = await fetch(cacheBustUrl, {
      cache: 'no-store',
      ...options,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...(options.headers || {})
      }
    });
    checkAuthStatus(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON from ${url}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    // Retry only on transient network-level errors, not on HTTP 4xx/5xx
    if (isTransientNetworkError(err) && _attempt < RETRY_DELAYS.length) {
      await new Promise(r => setTimeout(r, RETRY_DELAYS[_attempt]));
      return fetchNoCacheJSON(url, options, _attempt + 1);
    }
    throw err;
  }
};

// Helper to export/download live state as a JSON file
export const exportToJsonFile = (data, filename = 'export.json') => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const checkAuthStatus = (response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('noryvex_admin_token');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('admin-session-expired'));
    }
  }
  return response;
};

// Return fixed DB configuration (exclusively Postgres Neon Backend)
export const getDbConfig = () => {
  return {
    provider: 'postgres',
    baseUrl: '',
    token: ''
  };
};

const getAdminToken = () => {
  return localStorage.getItem('noryvex_admin_token') || '';
};

// ── CONTACT OPERATIONS ─────────────────────────────────

export const dbSaveContact = async (contact) => {
  const newContact = {
    name: contact.name,
    company: contact.company || '',
    email: contact.email,
    phone: contact.phone || '',
    service: contact.service || '',
    message: contact.message || ''
  };

  try {
    const res = await fetch(`/api/contact?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact)
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, lastID: data.lastID };
    }
    const err = await res.json();
    return { success: false, error: err.error || 'Failed to save contact.' };
  } catch (e) {
    console.error('Failed to save contact:', e);
    return { success: false, error: 'Network error connecting to database' };
  }
};

export const dbGetContacts = async (authToken) => {
  const token = authToken || getAdminToken();
  try {
    return await fetchNoCacheJSON(`/api/admin/contacts?token=${token}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch (e) {
    console.error('Failed to fetch contacts:', e);
    return [];
  }
};

export const dbMarkContactRead = async (id, authToken) => {
  const token = authToken || getAdminToken();
  try {
    const res = await fetch(`/api/admin/contacts/${id}?t=${Date.now()}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to mark contact as read:', e);
    return { success: false };
  }
};

export const dbDeleteContact = async (id, authToken) => {
  const token = authToken || getAdminToken();
  try {
    const res = await fetch(`/api/admin/contacts/${Number(id)}?t=${Date.now()}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to delete contact:', e);
    return { success: false };
  }
};

// ── MEETING OPERATIONS ─────────────────────────────────

export const dbSaveMeeting = async (meeting) => {
  const newMeeting = {
    name: meeting.name,
    email: meeting.email,
    company: meeting.company || '',
    phone: meeting.phone || '',
    date: meeting.date,
    time: meeting.time,
    notes: meeting.notes || ''
  };

  try {
    const res = await fetch(`/api/meeting?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMeeting)
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, lastID: data.lastID };
    }
    const err = await res.json();
    return { success: false, error: err.error || 'Failed to save meeting.' };
  } catch (e) {
    console.error('Failed to save meeting:', e);
    return { success: false, error: 'Network error connecting to database' };
  }
};

export const dbGetMeetings = async (authToken) => {
  const token = authToken || getAdminToken();
  try {
    return await fetchNoCacheJSON(`/api/admin/meetings?token=${token}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch (e) {
    console.error('Failed to fetch meetings:', e);
    return [];
  }
};

export const dbMarkMeetingCompleted = async (id, authToken) => {
  const token = authToken || getAdminToken();
  try {
    const res = await fetch(`/api/admin/meetings/${id}?t=${Date.now()}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to mark meeting as completed:', e);
    return { success: false };
  }
};

export const dbDeleteMeeting = async (id, authToken) => {
  const token = authToken || getAdminToken();
  try {
    const res = await fetch(`/api/admin/meetings/${Number(id)}?t=${Date.now()}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to delete meeting:', e);
    return { success: false };
  }
};

// ── TRIAL OPERATIONS ─────────────────────────────────

export const dbSaveTrial = async (trial) => {
  const newTrial = {
    businessName: trial.businessName,
    contactName: trial.contactName,
    email: trial.email,
    phone: trial.phone || '',
    businessType: trial.businessType || 'General',
    aiHandling: trial.aiHandling || 'both'
  };

  try {
    const res = await fetch(`/api/trial?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrial)
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, lastID: data.lastID };
    }
    const err = await res.json();
    return { success: false, error: err.error || 'Failed to save trial.' };
  } catch (e) {
    console.error('Failed to save trial:', e);
    return { success: false, error: 'Network error connecting to database' };
  }
};

export const dbGetTrials = async (authToken) => {
  const token = authToken || getAdminToken();
  try {
    return await fetchNoCacheJSON(`/api/admin/trials?token=${token}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch (e) {
    console.error('Failed to fetch trials:', e);
    return [];
  }
};

export const dbUpdateTrialStatus = async (id, status, authToken) => {
  const token = authToken || getAdminToken();
  try {
    const res = await fetch(`/api/admin/trials/${Number(id)}?t=${Date.now()}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ trial_status: status })
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to update trial status:', e);
    return { success: false };
  }
};

// ── ADMIN LOGIN ─────────────────────────────────

export const dbAdminLogin = async (email, password) => {
  try {
    const res = await fetch(`/api/admin/login?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, token: data.token };
    }
    const err = await res.json();
    return { success: false, error: err.error || 'Login failed.' };
  } catch (e) {
    console.error('Admin login failed:', e);
    return { success: false, error: 'Network error connecting to server.' };
  }
};

// ── CMS OPERATIONS: TESTIMONIALS / CLIENTS ───────────────

export const dbGetClients = async () => {
  try {
    return await fetchNoCacheJSON('/api/clients');
  } catch (e) {
    console.error('Failed to get clients from server:', e);
    return [];
  }
};

export const dbSaveClient = async (client) => {
  const token = getAdminToken();
  const newClient = {
    id: client.id ? Number(client.id) : null,
    name: client.name,
    company: client.company,
    rating: Number(client.rating || 5),
    quote: client.quote
  };

  try {
    const res = await fetch('/api/admin/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newClient)
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to save client:', e);
    return { success: false };
  }
};

export const dbDeleteClient = async (id) => {
  const token = getAdminToken();
  try {
    const res = await fetch(`/api/admin/clients/${Number(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to delete client:', e);
    return { success: false };
  }
};

// ── CMS OPERATIONS: TRUSTED SITES / PARTNERS ─────────────

export const dbGetPartners = async () => {
  try {
    return await fetchNoCacheJSON('/api/partners');
  } catch (e) {
    console.error('Failed to get partners from server:', e);
    return [];
  }
};

export const dbSavePartner = async (partner) => {
  const token = getAdminToken();
  const newPartner = {
    id: partner.id ? Number(partner.id) : null,
    name: partner.name,
    link: partner.link,
    image: partner.image
  };

  try {
    const res = await fetch('/api/admin/partners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newPartner)
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to save partner:', e);
    return { success: false };
  }
};

export const dbDeletePartner = async (id) => {
  const token = getAdminToken();
  try {
    const res = await fetch(`/api/admin/partners/${Number(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to delete partner:', e);
    return { success: false };
  }
};

export const dbGetUnderConstruction = async () => {
  try {
    const data = await fetchNoCacheJSON('/api/settings/under-construction');
    return data.underConstruction;
  } catch (e) {
    console.error('Failed to get under construction setting:', e);
    return false;
  }
};

export const dbSetUnderConstruction = async (enabled) => {
  const token = getAdminToken();
  try {
    const res = await fetch('/api/admin/settings/under-construction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ underConstruction: enabled })
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to set under construction setting:', e);
    return { success: false };
  }
};

export const dbGetBookingRedirectUrl = async () => {
  try {
    const data = await fetchNoCacheJSON('/api/settings/booking-redirect');
    return data.bookingRedirectUrl;
  } catch (e) {
    console.error('Failed to get booking redirect URL:', e);
    return 'https://calendly.com/noryvex';
  }
};

export const dbSetBookingRedirectUrl = async (url) => {
  const token = getAdminToken();
  try {
    const res = await fetch('/api/admin/settings/booking-redirect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookingRedirectUrl: url })
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to set booking redirect URL:', e);
    return { success: false };
  }
};

// ── FAQ Helpers ────────────────────────────────────────────────────────────

/** Public: fetch all FAQ items */
export const dbGetFaqs = async () => {
  try {
    const data = await fetchNoCacheJSON('/api/faqs');
    return data.faqs || [];
  } catch (e) {
    console.error('Failed to fetch FAQs:', e);
    return [];
  }
};

/** Admin: add a new FAQ */
export const dbAdminSaveFaq = async (question, answer) => {
  const token = getAdminToken();
  try {
    const res = await fetch(`/api/admin/faqs?t=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ question, answer })
    });
    checkAuthStatus(res);
    if (res.ok) return { success: true };
    const err = await res.json();
    return { success: false, error: err.error };
  } catch (e) {
    console.error('Failed to save FAQ:', e);
    return { success: false, error: 'Network error' };
  }
};

/** Admin: delete a FAQ by id */
export const dbAdminDeleteFaq = async (id) => {
  const token = getAdminToken();
  try {
    const res = await fetch(`/api/admin/faqs/${Number(id)}?t=${Date.now()}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to delete FAQ:', e);
    return { success: false };
  }
};

// ── Contact Config Helpers ─────────────────────────────────────────────────

/** Public: get WhatsApp/Slack configuration */
export const dbGetContactConfig = async () => {
  try {
    const data = await fetchNoCacheJSON('/api/settings/contact-config');
    return data;
  } catch (e) {
    console.error('Failed to fetch contact config:', e);
    return { whatsapp_number: '', whatsapp_message: '', slack_link: '' };
  }
};

/** Admin: save WhatsApp/Slack configuration */
export const dbAdminSetContactConfig = async (config) => {
  const token = getAdminToken();
  try {
    const res = await fetch(`/api/admin/settings/contact-config?t=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(config)
    });
    checkAuthStatus(res);
    return { success: res.ok };
  } catch (e) {
    console.error('Failed to save contact config:', e);
    return { success: false };
  }
};

