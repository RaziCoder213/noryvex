// dbHelper.js
// Client-side Database Helper with dynamic HTTP fetch sync and local storage fallbacks

const seedContacts = [];
const seedMeetings = [];

// Clean up existing local cache from old seeds
const filterMockData = () => {
  try {
    const contacts = localStorage.getItem('noryvex_contacts');
    if (contacts) {
      const filtered = JSON.parse(contacts).filter(c => c.id !== 101 && c.id !== 102);
      localStorage.setItem('noryvex_contacts', JSON.stringify(filtered));
    }
    const meetings = localStorage.getItem('noryvex_meetings');
    if (meetings) {
      const filtered = JSON.parse(meetings).filter(m => m.id !== 201);
      localStorage.setItem('noryvex_meetings', JSON.stringify(filtered));
    }
    const trials = localStorage.getItem('noryvex_trials');
    if (trials) {
      const filtered = JSON.parse(trials).filter(t => t.id !== 1 && t.id !== 2);
      localStorage.setItem('noryvex_trials', JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('purging seeds failed', e);
  }
};
filterMockData();

const getStoredData = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  return JSON.parse(data);
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// INITIALIZE DB KEYS
getStoredData('noryvex_contacts', seedContacts);
getStoredData('noryvex_meetings', seedMeetings);

// CONTACT OPERATIONS
export const dbSaveContact = async (contact) => {
  const contacts = getStoredData('noryvex_contacts', []);
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

  // Sync to backend server
  try {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact)
    });
  } catch (e) {
    console.warn('Server offline. Contact saved locally in browser storage.', e);
  }
  return { success: true, lastID: newContact.id };
};

export const dbGetContacts = async (authToken) => {
  if (authToken) {
    try {
      const res = await fetch('/api/admin/contacts', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch contacts from server, falling back to local storage.', e);
    }
  }
  return getStoredData('noryvex_contacts', []);
};

export const dbMarkContactRead = async (id, authToken) => {
  const contacts = getStoredData('noryvex_contacts', []);
  const updated = contacts.map(c => c.id === Number(id) ? { ...c, status: 'read' } : c);
  setStoredData('noryvex_contacts', updated);

  if (authToken) {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${authToken}` }
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
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (e) {
      console.error(e);
    }
  }
  return { success: true };
};

// MEETING OPERATIONS
export const dbSaveMeeting = async (meeting) => {
  const meetings = getStoredData('noryvex_meetings', []);
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

  // Sync to backend server
  try {
    await fetch('/api/meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMeeting)
    });
  } catch (e) {
    console.warn('Server offline. Meeting saved locally in browser storage.', e);
  }
  return { success: true, lastID: newMeeting.id };
};

export const dbGetMeetings = async (authToken) => {
  if (authToken) {
    try {
      const res = await fetch('/api/admin/meetings', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch meetings from server, falling back to local storage.', e);
    }
  }
  return getStoredData('noryvex_meetings', []);
};

export const dbMarkMeetingCompleted = async (id, authToken) => {
  const meetings = getStoredData('noryvex_meetings', []);
  const updated = meetings.map(m => m.id === Number(id) ? { ...m, status: 'completed' } : m);
  setStoredData('noryvex_meetings', updated);

  if (authToken) {
    try {
      await fetch(`/api/admin/meetings/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${authToken}` }
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
      await fetch(`/api/admin/meetings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (e) {
      console.error(e);
    }
  }
  return { success: true };
};

// TRIAL OPERATIONS
export const dbSaveTrial = async (trial) => {
  // Save locally as trial entity
  const trials = getStoredData('noryvex_trials', []);
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

  // Save locally as general contact log too
  await dbSaveContact({
    name: trial.contactName,
    company: trial.businessName,
    email: trial.email,
    phone: trial.phone || '',
    service: `7-Day Trial (${trial.businessType || 'General'})`,
    message: `AI Tasks: ${trial.aiHandling.toUpperCase()}`
  });

  // Sync to backend server
  try {
    await fetch('/api/trial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trial)
    });
  } catch (e) {
    console.warn('Server offline. Trial saved locally in browser storage.', e);
  }
  return { success: true };
};

export const dbGetTrials = async (authToken) => {
  if (authToken) {
    try {
      const res = await fetch('/api/admin/trials', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch trials from server, using local storage fallback.', e);
    }
  }
  return getStoredData('noryvex_trials', []);
};

export const dbUpdateTrialStatus = async (id, status, authToken) => {
  const trials = getStoredData('noryvex_trials', []);
  const updated = trials.map(t => t.id === Number(id) ? { ...t, trial_status: status } : t);
  setStoredData('noryvex_trials', updated);

  if (authToken) {
    try {
      await fetch(`/api/admin/trials/${id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
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
  // Keep same SHA-256 validation for mock local login
  const targetHash = '37ad83dfcd34d8dec4f9d22e67b0f396232cf7159c3b07c82df7cca325699886'; // SHA-256 of RaziNoryvex2026!
  
  // Try authenticating with backend Express API
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, token: data.token };
    }
  } catch (e) {
    console.warn('Backend server offline. Performing local fallback hash authorization.', e);
  }

  // Fallback to local storage hash verification
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
