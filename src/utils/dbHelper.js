// dbHelper.js
// Client-side Database Helper with dynamic HTTP fetch sync, zero-cache headers, and real JSON exports

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
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultVal;
  }
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// INITIALIZE DB KEYS
getStoredData('noryvex_contacts', seedContacts);
getStoredData('noryvex_meetings', seedMeetings);
getStoredData('noryvex_trials', seedTrials);

// CONTACT OPERATIONS
export const dbSaveContact = async (contact) => {
  const contacts = getStoredData('noryvex_contacts', seedContacts);
  const newContact = {
    id: Date.now(),
    name: contact.name,
    company: contact.company || '',
    email: contact.email,
    phone: contact.phone || '',
    service: contact.service || 'AI Voice Agents',
    message: contact.message || '',
    status: 'unread',
    created_at: new Date().toISOString()
  };
  contacts.unshift(newContact);
  setStoredData('noryvex_contacts', contacts);

  // Sync to backend server with zero cache
  try {
    await fetch(`/api/contact?t=${Date.now()}`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(newContact)
    });
  } catch (e) {
    console.warn('Backend offline. Saved locally to browser storage.', e);
  }
  return { success: true, lastID: newContact.id };
};

export const dbGetContacts = async (authToken) => {
  if (authToken) {
    try {
      const data = await fetchNoCacheJSON(`/api/admin/contacts?token=${authToken}`);
      if (Array.isArray(data)) return data;
    } catch (e) {
      console.warn('Falling back to static JSON or local storage for contacts.', e);
    }
  }

  // Try static JSON endpoint fallback with zero cache
  try {
    const staticContacts = await fetchNoCacheJSON('/data/contacts.json');
    if (Array.isArray(staticContacts) && staticContacts.length > 0) {
      const local = getStoredData('noryvex_contacts', []);
      // Merge unique
      const ids = new Set(local.map(c => c.id));
      staticContacts.forEach(sc => {
        if (!ids.has(sc.id)) local.push(sc);
      });
      setStoredData('noryvex_contacts', local);
      return local;
    }
  } catch (e) {
    // Ignore static fetch error and return local storage
  }

  return getStoredData('noryvex_contacts', seedContacts);
};

export const dbMarkContactRead = async (id, authToken) => {
  const contacts = getStoredData('noryvex_contacts', []);
  const updated = contacts.map(c => c.id === Number(id) ? { ...c, status: 'read' } : c);
  setStoredData('noryvex_contacts', updated);

  if (authToken) {
    try {
      await fetch(`/api/admin/contacts/${id}?t=${Date.now()}`, {
        method: 'PATCH',
        cache: 'no-store',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
  return { success: true };
};

export const dbDeleteContact = async (id, authToken) => {
  const contacts = getStoredData('noryvex_contacts', []);
  const filtered = contacts.filter(c => c.id !== Number(id));
  setStoredData('noryvex_contacts', filtered);

  if (authToken) {
    try {
      await fetch(`/api/admin/contacts/${id}?t=${Date.now()}`, {
        method: 'DELETE',
        cache: 'no-store',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
  return { success: true };
};

// MEETING OPERATIONS
export const dbSaveMeeting = async (meeting) => {
  const meetings = getStoredData('noryvex_meetings', seedMeetings);
  const newMeeting = {
    id: Date.now(),
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
  meetings.push(newMeeting);
  meetings.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  setStoredData('noryvex_meetings', meetings);

  // Sync to backend server with zero cache
  try {
    await fetch(`/api/meeting?t=${Date.now()}`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify(newMeeting)
    });
  } catch (e) {
    console.warn('Backend offline. Meeting saved locally.', e);
  }
  return { success: true, lastID: newMeeting.id };
};

export const dbGetMeetings = async (authToken) => {
  if (authToken) {
    try {
      const data = await fetchNoCacheJSON(`/api/admin/meetings?token=${authToken}`);
      if (Array.isArray(data)) return data;
    } catch (e) {
      console.warn('Falling back to static JSON or local storage for meetings.', e);
    }
  }

  // Try static JSON endpoint fallback with zero cache
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
    // Ignore static fetch error
  }

  return getStoredData('noryvex_meetings', seedMeetings);
};

export const dbMarkMeetingCompleted = async (id, authToken) => {
  const meetings = getStoredData('noryvex_meetings', []);
  const updated = meetings.map(m => m.id === Number(id) ? { ...m, status: 'completed' } : m);
  setStoredData('noryvex_meetings', updated);

  if (authToken) {
    try {
      await fetch(`/api/admin/meetings/${id}?t=${Date.now()}`, {
        method: 'PATCH',
        cache: 'no-store',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
  return { success: true };
};

export const dbDeleteMeeting = async (id, authToken) => {
  const meetings = getStoredData('noryvex_meetings', []);
  const filtered = meetings.filter(m => m.id !== Number(id));
  setStoredData('noryvex_meetings', filtered);

  if (authToken) {
    try {
      await fetch(`/api/admin/meetings/${id}?t=${Date.now()}`, {
        method: 'DELETE',
        cache: 'no-store',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
  return { success: true };
};

// TRIAL OPERATIONS
export const dbSaveTrial = async (trial) => {
  const trials = getStoredData('noryvex_trials', seedTrials);
  const newTrial = {
    id: Date.now(),
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
  trials.unshift(newTrial);
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
      cache: 'no-store',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify(trial)
    });
  } catch (e) {
    console.warn('Backend offline. Trial saved locally.', e);
  }
  return { success: true };
};

export const dbGetTrials = async (authToken) => {
  if (authToken) {
    try {
      const data = await fetchNoCacheJSON(`/api/admin/trials?token=${authToken}`);
      if (Array.isArray(data)) return data;
    } catch (e) {
      console.warn('Falling back to static JSON or local storage for trials.', e);
    }
  }

  // Try static JSON endpoint fallback with zero cache
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
    // Ignore static fetch error
  }

  return getStoredData('noryvex_trials', seedTrials);
};

export const dbUpdateTrialStatus = async (id, status, authToken) => {
  const trials = getStoredData('noryvex_trials', []);
  const updated = trials.map(t => t.id === Number(id) ? { ...t, trial_status: status } : t);
  setStoredData('noryvex_trials', updated);

  if (authToken) {
    try {
      await fetch(`/api/admin/trials/${id}?t=${Date.now()}`, {
        method: 'PATCH',
        cache: 'no-store',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify({ trial_status: status })
      });
    } catch (e) {
      console.error(e);
    }
  }
  return { success: true };
};

// ADMIN LOGIN AUTHENTICATION
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
    console.warn('Backend server offline. Performing local fallback hash authorization.', e);
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

// CMS OPERATIONS: TESTIMONIALS / CLIENTS
export const dbGetClients = () => {
  return getStoredData('noryvex_cms_clients', [
    { id: 1, name: "Sarah Jenkins", company: "Bright Dental", rating: 5, quote: "Chloe resolved 92% of our FAQ calls and booked 45 meetings in her first week." },
    { id: 2, name: "Marcus Thorne", company: "Apex Logistics", rating: 5, quote: "The workflow integration saves our dispatch team at least 15 hours every single week." }
  ]);
};

export const dbSaveClient = (client) => {
  const clients = dbGetClients();
  const newClient = {
    id: client.id || Date.now(),
    name: client.name,
    company: client.company,
    rating: Number(client.rating || 5),
    quote: client.quote
  };
  const filtered = clients.filter(c => c.id !== newClient.id);
  filtered.unshift(newClient);
  setStoredData('noryvex_cms_clients', filtered);
  return { success: true };
};

export const dbDeleteClient = (id) => {
  const clients = dbGetClients();
  const filtered = clients.filter(c => c.id !== Number(id));
  setStoredData('noryvex_cms_clients', filtered);
  return { success: true };
};

// CMS OPERATIONS: TRUSTED SITES / PARTNERS
export const dbGetPartners = () => {
  return getStoredData('noryvex_cms_partners', [
    { id: 1, name: "Super Launch", link: "https://www.superlaun.ch/products/2926", image: "https://www.superlaun.ch/badge.png" },
    { id: 2, name: "Twelve Tools", link: "https://twelve.tools", image: "https://twelve.tools/badge3-dark.svg" },
    { id: 3, name: "Wired Business", link: "https://wired.business", image: "https://wired.business/badge3-dark.svg" },
    { id: 4, name: "GoodFirms", link: "https://www.goodfirms.co/company/noryvex", image: "https://www.goodfirms.co/img/badges/recognized-on-goodfirms.png" }
  ]);
};

export const dbSavePartner = (partner) => {
  const partners = dbGetPartners();
  const newPartner = {
    id: partner.id || Date.now(),
    name: partner.name,
    link: partner.link,
    image: partner.image
  };
  const filtered = partners.filter(p => p.id !== newPartner.id);
  filtered.push(newPartner);
  setStoredData('noryvex_cms_partners', filtered);
  return { success: true };
};

export const dbDeletePartner = (id) => {
  const partners = dbGetPartners();
  const filtered = partners.filter(p => p.id !== Number(id));
  setStoredData('noryvex_cms_partners', filtered);
  return { success: true };
};
