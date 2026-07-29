// dbHelper.js
// Client-side Database Helper with dynamic HTTP fetch sync, Xano cloud database support, and local storage fallbacks.

// Helper to fetch live JSON data with zero caching
export const fetchNoCacheJSON = async (url) => {
  const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
  const response = await fetch(cacheBustUrl, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch JSON from ${url}: ${response.statusText}`);
  }
  return await response.json();
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

// Dynamic database configuration helper
export const getDbConfig = () => {
  return {
    provider: localStorage.getItem('noryvex_db_provider') || 'local',
    baseUrl: localStorage.getItem('noryvex_xano_base_url') || '',
    token: localStorage.getItem('noryvex_xano_token') || ''
  };
};

const seedContacts = [
  { id: 101, name: "Alexander Wright", company: "Apex Health Group", email: "a.wright@apexhealth.co", phone: "+1 (555) 234-5678", service: "AI Voice Agents", message: "Looking to deploy Chloe receptionists across 3 regional clinics.", status: "unread", created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 102, name: "Emily Chen", company: "Chen Legal LLC", email: "emily@chenlaw.com", phone: "+1 (555) 987-6543", service: "AI Receptionists", message: "Need an AI to screen client intake calls after business hours.", status: "read", created_at: new Date(Date.now() - 3600000 * 24).toISOString() }
];

const seedMeetings = [
  { id: 201, name: "Marcus Thorne", email: "m.thorne@apexlogistics.com", company: "Apex Logistics", phone: "+1 (555) 876-5432", date: "2026-08-05", time: "14:00", notes: "Discuss CRM workflow triggers integration with Vapi Voice backend.", status: "pending", created_at: new Date().toISOString() }
];

const seedTrials = [
  { id: 1, business_name: 'Bright Dental', contact_name: 'Sarah Jenkins', email: 'sarah@brightdental.com', phone: '+1 (555) 234-5678', business_type: 'Dental Clinic', ai_handling: 'both', trial_status: 'converted', call_duration_seconds: 980, limit_duration_seconds: 1800, created_at: new Date(Date.now() - 3600000 * 48).toISOString() },
  { id: 2, business_name: 'Fast Pizza', contact_name: 'Mario Rossi', email: 'mario@fastpizza.com', phone: '+1 (555) 987-6543', business_type: 'Restaurant', ai_handling: 'bookings', trial_status: 'active', call_duration_seconds: 1450, limit_duration_seconds: 1800, created_at: new Date(Date.now() - 3600000 * 24).toISOString() }
];

const getStoredData = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ── CONTACT OPERATIONS ─────────────────────────────────

export const dbSaveContact = async (contact) => {
  const newContact = {
    name: contact.name,
    company: contact.company || '',
    email: contact.email,
    phone: contact.phone || '',
    service: contact.service || '',
    message: contact.message || '',
    status: 'unread',
    created_at: new Date().toISOString()
  };

  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const res = await fetch(`${config.baseUrl}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        },
        body: JSON.stringify(newContact)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, lastID: data.id };
      }
    } catch (e) {
      console.warn('Xano contact save failed. Saving locally to browser.', e);
    }
  }

  // Local storage fallback
  const contacts = getStoredData('noryvex_contacts', seedContacts);
  const localContact = { id: Date.now(), ...newContact };
  contacts.unshift(localContact);
  setStoredData('noryvex_contacts', contacts);

  // Sync to local server if it is active
  try {
    await fetch(`/api/contact?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localContact)
    });
  } catch (e) {
    // Ignore server sync failure
  }
  return { success: true, lastID: localContact.id };
};

export const dbGetContacts = async (authToken) => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const res = await fetch(`${config.baseUrl}/contacts`, {
        headers: {
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }
      }
    } catch (e) {
      console.warn('Xano fetch contacts failed. Falling back to local/static database.', e);
    }
  }

  if (authToken) {
    try {
      const data = await fetchNoCacheJSON(`/api/admin/contacts?token=${authToken}`);
      if (Array.isArray(data)) return data;
    } catch (e) {
      // Ignore
    }
  }

  try {
    const staticContacts = await fetchNoCacheJSON('/data/contacts.json');
    if (Array.isArray(staticContacts) && staticContacts.length > 0) {
      const local = getStoredData('noryvex_contacts', []);
      const ids = new Set(local.map(c => c.id));
      staticContacts.forEach(sc => {
        if (!ids.has(sc.id)) local.push(sc);
      });
      setStoredData('noryvex_contacts', local);
      return local;
    }
  } catch (e) {
    // Ignore
  }

  return getStoredData('noryvex_contacts', seedContacts);
};

export const dbMarkContactRead = async (id, authToken) => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      // Try PATCH first, fallback to POST
      const res = await fetch(`${config.baseUrl}/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        },
        body: JSON.stringify({ status: 'read' })
      });
      if (!res.ok) {
        await fetch(`${config.baseUrl}/contacts/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
          },
          body: JSON.stringify({ status: 'read' })
        });
      }
    } catch (e) {
      console.warn('Xano mark contact read failed.', e);
    }
  }

  const contacts = getStoredData('noryvex_contacts', []);
  const updated = contacts.map(c => c.id === Number(id) ? { ...c, status: 'read' } : c);
  setStoredData('noryvex_contacts', updated);

  if (authToken) {
    try {
      await fetch(`/api/admin/contacts/${id}?t=${Date.now()}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (e) {
      // Ignore
    }
  }
  return { success: true };
};

export const dbDeleteContact = async (id, authToken) => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      await fetch(`${config.baseUrl}/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        }
      });
    } catch (e) {
      console.warn('Xano delete contact failed.', e);
    }
  }

  const contacts = getStoredData('noryvex_contacts', []);
  const filtered = contacts.filter(c => c.id !== Number(id));
  setStoredData('noryvex_contacts', filtered);

  if (authToken) {
    try {
      await fetch(`/api/admin/contacts/${id}?t=${Date.now()}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (e) {
      // Ignore
    }
  }
  return { success: true };
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
    notes: meeting.notes || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };

  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const res = await fetch(`${config.baseUrl}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        },
        body: JSON.stringify(newMeeting)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, lastID: data.id };
      }
    } catch (e) {
      console.warn('Xano meeting save failed.', e);
    }
  }

  const meetings = getStoredData('noryvex_meetings', seedMeetings);
  const localMeeting = { id: Date.now(), ...newMeeting };
  meetings.push(localMeeting);
  meetings.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  setStoredData('noryvex_meetings', meetings);

  try {
    await fetch(`/api/meeting?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localMeeting)
    });
  } catch (e) {
    // Ignore
  }
  return { success: true, lastID: localMeeting.id };
};

export const dbGetMeetings = async (authToken) => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const res = await fetch(`${config.baseUrl}/meetings`, {
        headers: {
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
        }
      }
    } catch (e) {
      console.warn('Xano fetch meetings failed.', e);
    }
  }

  if (authToken) {
    try {
      const data = await fetchNoCacheJSON(`/api/admin/meetings?token=${authToken}`);
      if (Array.isArray(data)) return data;
    } catch (e) {
      // Ignore
    }
  }

  try {
    const staticMeetings = await fetchNoCacheJSON('/data/meetings.json');
    if (Array.isArray(staticMeetings) && staticMeetings.length > 0) {
      const local = getStoredData('noryvex_meetings', []);
      const ids = new Set(local.map(m => m.id));
      staticMeetings.forEach(sm => {
        if (!ids.has(sm.id)) local.push(sm);
      });
      setStoredData('noryvex_meetings', local);
      return local;
    }
  } catch (e) {
    // Ignore
  }

  return getStoredData('noryvex_meetings', seedMeetings);
};

export const dbMarkMeetingCompleted = async (id, authToken) => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const res = await fetch(`${config.baseUrl}/meetings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        },
        body: JSON.stringify({ status: 'completed' })
      });
      if (!res.ok) {
        await fetch(`${config.baseUrl}/meetings/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
          },
          body: JSON.stringify({ status: 'completed' })
        });
      }
    } catch (e) {
      console.warn('Xano mark meeting completed failed.', e);
    }
  }

  const meetings = getStoredData('noryvex_meetings', []);
  const updated = meetings.map(m => m.id === Number(id) ? { ...m, status: 'completed' } : m);
  setStoredData('noryvex_meetings', updated);

  if (authToken) {
    try {
      await fetch(`/api/admin/meetings/${id}?t=${Date.now()}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (e) {
      // Ignore
    }
  }
  return { success: true };
};

export const dbDeleteMeeting = async (id, authToken) => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      await fetch(`${config.baseUrl}/meetings/${id}`, {
        method: 'DELETE',
        headers: {
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        }
      });
    } catch (e) {
      console.warn('Xano delete meeting failed.', e);
    }
  }

  const meetings = getStoredData('noryvex_meetings', []);
  const filtered = meetings.filter(m => m.id !== Number(id));
  setStoredData('noryvex_meetings', filtered);

  if (authToken) {
    try {
      await fetch(`/api/admin/meetings/${id}?t=${Date.now()}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (e) {
      // Ignore
    }
  }
  return { success: true };
};

// ── TRIAL OPERATIONS ───────────────────────────────────

export const dbSaveTrial = async (trial) => {
  const newTrial = {
    business_name: trial.businessName,
    contact_name: trial.contactName,
    email: trial.email,
    phone: trial.phone || '',
    business_type: trial.businessType || 'General',
    ai_handling: trial.aiHandling || 'both',
    trial_status: 'requested',
    call_duration_seconds: 0,
    limit_duration_seconds: 1800,
    created_at: new Date().toISOString()
  };

  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const res = await fetch(`${config.baseUrl}/trials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        },
        body: JSON.stringify(newTrial)
      });
      if (res.ok) {
        // Also save to contacts
        await dbSaveContact({
          name: trial.contactName,
          company: trial.businessName,
          email: trial.email,
          phone: trial.phone || '',
          service: `7-Day Trial (${trial.businessType || 'General'})`,
          message: `AI Tasks: ${trial.aiHandling.toUpperCase()}`
        });
        const data = await res.json();
        return { success: true, lastID: data.id };
      }
    } catch (e) {
      console.warn('Xano trial save failed. Falling back to local storage.', e);
    }
  }

  const trials = getStoredData('noryvex_trials', seedTrials);
  const localTrial = { id: Date.now(), ...newTrial };
  trials.unshift(localTrial);
  setStoredData('noryvex_trials', trials);

  await dbSaveContact({
    name: trial.contactName,
    company: trial.businessName,
    email: trial.email,
    phone: trial.phone || '',
    service: `7-Day Trial (${trial.businessType || 'General'})`,
    message: `AI Tasks: ${trial.aiHandling.toUpperCase()}`
  });

  try {
    await fetch(`/api/trial?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localTrial)
    });
  } catch (e) {
    // Ignore
  }
  return { success: true };
};

export const dbGetTrials = async (authToken) => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const res = await fetch(`${config.baseUrl}/trials`, {
        headers: {
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }
      }
    } catch (e) {
      console.warn('Xano fetch trials failed.', e);
    }
  }

  if (authToken) {
    try {
      const data = await fetchNoCacheJSON(`/api/admin/trials?token=${authToken}`);
      if (Array.isArray(data)) return data;
    } catch (e) {
      // Ignore
    }
  }

  try {
    const staticTrials = await fetchNoCacheJSON('/data/trials.json');
    if (Array.isArray(staticTrials) && staticTrials.length > 0) {
      const local = getStoredData('noryvex_trials', []);
      const ids = new Set(local.map(t => t.id));
      staticTrials.forEach(st => {
        if (!ids.has(st.id)) local.push(st);
      });
      setStoredData('noryvex_trials', local);
      return local;
    }
  } catch (e) {
    // Ignore
  }

  return getStoredData('noryvex_trials', seedTrials);
};

export const dbUpdateTrialStatus = async (id, status, authToken) => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const res = await fetch(`${config.baseUrl}/trials/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        },
        body: JSON.stringify({ trial_status: status })
      });
      if (!res.ok) {
        await fetch(`${config.baseUrl}/trials/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
          },
          body: JSON.stringify({ trial_status: status })
        });
      }
    } catch (e) {
      console.warn('Xano update trial status failed.', e);
    }
  }

  const trials = getStoredData('noryvex_trials', []);
  const updated = trials.map(t => t.id === Number(id) ? { ...t, trial_status: status } : t);
  setStoredData('noryvex_trials', updated);

  if (authToken) {
    try {
      await fetch(`/api/admin/trials/${id}?t=${Date.now()}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ trial_status: status })
      });
    } catch (e) {
      // Ignore
    }
  }
  return { success: true };
};

// ── ADMIN LOGIN AUTHENTICATION ─────────────────────────

export const dbAdminLogin = async (email, password) => {
  const allowedEmails = ['razi@trynoryvex.com', 'razi@noryvex.com', 'codingwithrazi@gmail.com'];
  const targetHash = '37ad83dfcd34d8dec4f9d22e67b0f396232cf7159c3b07c82df7cca325699886'; // SHA-256 of RaziNoryvex2026!
  
  try {
    const res = await fetch(`/api/admin/login?t=${Date.now()}`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, token: data.token };
    }
  } catch (e) {
    // Ignore backend server offline
  }

  try {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const cleanedEmail = (email || '').toLowerCase().trim();
    if (allowedEmails.includes(cleanedEmail) && hashedPassword === targetHash) {
      const token = 'mock-jwt-token-' + Date.now();
      return { success: true, token };
    }
  } catch (e) {
    console.error('Hashing failed:', e);
  }
  return { success: false, error: 'Invalid admin credentials.' };
};

// ── CMS OPERATIONS: TESTIMONIALS / CLIENTS ───────────────

export const dbGetClients = async () => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const res = await fetch(`${config.baseUrl}/clients`, {
        headers: {
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Xano get clients failed. Falling back to local storage.', e);
    }
  }

  return getStoredData('noryvex_cms_clients', [
    { id: 1, name: "Sarah Jenkins", company: "Bright Dental", rating: 5, quote: "Chloe resolved 92% of our FAQ calls and booked 45 meetings in her first week." },
    { id: 2, name: "Marcus Thorne", company: "Apex Logistics", rating: 5, quote: "The workflow integration saves our dispatch team at least 15 hours every single week." }
  ]);
};

export const dbSaveClient = async (client) => {
  const newClient = {
    name: client.name,
    company: client.company,
    rating: Number(client.rating || 5),
    quote: client.quote
  };

  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const url = client.id ? `${config.baseUrl}/clients/${client.id}` : `${config.baseUrl}/clients`;
      const method = client.id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        },
        body: JSON.stringify(newClient)
      });
      if (!res.ok && client.id) {
        // Fallback POST for edit if PATCH fails
        await fetch(`${config.baseUrl}/clients/${client.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
          },
          body: JSON.stringify(newClient)
        });
      }
      if (res.ok) return { success: true };
    } catch (e) {
      console.warn('Xano save client failed.', e);
    }
  }

  const clients = await dbGetClients();
  const localClient = {
    id: client.id || Date.now(),
    ...newClient
  };
  const filtered = clients.filter(c => c.id !== localClient.id);
  filtered.unshift(localClient);
  setStoredData('noryvex_cms_clients', filtered);
  return { success: true };
};

export const dbDeleteClient = async (id) => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      await fetch(`${config.baseUrl}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        }
      });
    } catch (e) {
      console.warn('Xano delete client failed.', e);
    }
  }

  const clients = await dbGetClients();
  const filtered = clients.filter(c => c.id !== Number(id));
  setStoredData('noryvex_cms_clients', filtered);
  return { success: true };
};

// ── CMS OPERATIONS: TRUSTED SITES / PARTNERS ─────────────

export const dbGetPartners = async () => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const res = await fetch(`${config.baseUrl}/partners`, {
        headers: {
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Xano get partners failed.', e);
    }
  }

  return getStoredData('noryvex_cms_partners', [
    { id: 1, name: "Super Launch", link: "https://www.superlaun.ch/products/2926", image: "https://www.superlaun.ch/badge.png" },
    { id: 2, name: "Twelve Tools", link: "https://twelve.tools", image: "https://twelve.tools/badge3-dark.svg" },
    { id: 3, name: "Wired Business", link: "https://wired.business", image: "https://wired.business/badge3-dark.svg" },
    { id: 4, name: "GoodFirms", link: "https://www.goodfirms.co/company/noryvex", image: "https://www.goodfirms.co/img/badges/recognized-on-goodfirms.png" }
  ]);
};

export const dbSavePartner = async (partner) => {
  const newPartner = {
    name: partner.name,
    link: partner.link,
    image: partner.image
  };

  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      const url = partner.id ? `${config.baseUrl}/partners/${partner.id}` : `${config.baseUrl}/partners`;
      const method = partner.id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        },
        body: JSON.stringify(newPartner)
      });
      if (!res.ok && partner.id) {
        await fetch(`${config.baseUrl}/partners/${partner.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
          },
          body: JSON.stringify(newPartner)
        });
      }
      if (res.ok) return { success: true };
    } catch (e) {
      console.warn('Xano save partner failed.', e);
    }
  }

  const partners = await dbGetPartners();
  const localPartner = {
    id: partner.id || Date.now(),
    ...newPartner
  };
  const filtered = partners.filter(p => p.id !== localPartner.id);
  filtered.push(localPartner);
  setStoredData('noryvex_cms_partners', filtered);
  return { success: true };
};

export const dbDeletePartner = async (id) => {
  const config = getDbConfig();
  if (config.provider === 'xano' && config.baseUrl) {
    try {
      await fetch(`${config.baseUrl}/partners/${id}`, {
        method: 'DELETE',
        headers: {
          ...(config.token ? { 'Authorization': `Bearer ${config.token}` } : {})
        }
      });
    } catch (e) {
      console.warn('Xano delete partner failed.', e);
    }
  }

  const partners = await dbGetPartners();
  const filtered = partners.filter(p => p.id !== Number(id));
  setStoredData('noryvex_cms_partners', filtered);
  return { success: true };
};
