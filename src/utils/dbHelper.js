// Local Storage Helper to simulate SQLite Database operations on client-side

// Seed initial data if empty to make the Admin Panel look alive initially
const seedContacts = [
  {
    id: 1,
    name: 'Sarah Connor',
    company: 'Skynet Solutions',
    email: 'sarah@skynet.com',
    phone: '+1 555-0199',
    service: 'AI Voice Agents',
    message: 'We are looking to implement a conversational receptionist to handle our customer inquiries. Muhammad Razi came highly recommended.',
    status: 'unread',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
  },
  {
    id: 2,
    name: 'Bruce Wayne',
    company: 'Wayne Enterprises',
    email: 'bruce@waynecorp.com',
    phone: '+1 555-1939',
    service: 'Workflow Automation',
    message: 'Need to automate Batman logistics database sync with legacy CRM systems. High priority.',
    status: 'read',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString() // 24 hours ago
  }
];

const seedMeetings = [
  {
    id: 1,
    name: 'Tony Stark',
    email: 'tony@starkindustries.com',
    company: 'Stark Industries',
    phone: '+1 555-3000',
    date: '2026-08-05',
    time: '10:00',
    notes: 'Discussing JARVIS core architecture and pipeline automation.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

const getStoredData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
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
export const dbSaveContact = (contact) => {
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
  return { success: true, lastID: newContact.id };
};

export const dbSaveTrial = (trial) => {
  return dbSaveContact({
    name: trial.contactName,
    company: trial.businessName,
    email: trial.email,
    phone: trial.phone,
    service: `7-Day Trial (${trial.businessType || 'General'})`,
    message: `AI Tasks: ${trial.aiHandling.toUpperCase()}`
  });
};

export const dbGetContacts = () => {
  return getStoredData('noryvex_contacts', []);
};

export const dbMarkContactRead = (id) => {
  const contacts = getStoredData('noryvex_contacts', []);
  const updated = contacts.map(c => c.id === Number(id) ? { ...c, status: 'read' } : c);
  setStoredData('noryvex_contacts', updated);
  return { success: true };
};

export const dbDeleteContact = (id) => {
  const contacts = getStoredData('noryvex_contacts', []);
  const filtered = contacts.filter(c => c.id !== Number(id));
  setStoredData('noryvex_contacts', filtered);
  return { success: true };
};

// MEETING OPERATIONS
export const dbSaveMeeting = (meeting) => {
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
  // Sort meetings by date/time
  meetings.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  setStoredData('noryvex_meetings', meetings);
  return { success: true, lastID: newMeeting.id };
};

export const dbGetMeetings = () => {
  return getStoredData('noryvex_meetings', []);
};

export const dbMarkMeetingCompleted = (id) => {
  const meetings = getStoredData('noryvex_meetings', []);
  const updated = meetings.map(m => m.id === Number(id) ? { ...m, status: 'completed' } : m);
  setStoredData('noryvex_meetings', updated);
  return { success: true };
};

export const dbDeleteMeeting = (id) => {
  const meetings = getStoredData('noryvex_meetings', []);
  const filtered = meetings.filter(m => m.id !== Number(id));
  setStoredData('noryvex_meetings', filtered);
  return { success: true };
};

// SHA-256 Hashing Helper using Web Crypto API
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// ADMIN LOGIN AUTHENTICATION
export const dbAdminLogin = async (email, password) => {
  const allowedEmails = ['razi@trynoryvex.com', 'razi@noryvex.com', 'codingwithrazi@gmail.com'];
  const targetHash = '37ad83dfcd34d8dec4f9d22e67b0f396232cf7159c3b07c82df7cca325699886'; // SHA-256 hash of RaziNoryvex2026!
  
  try {
    const hashedPassword = await sha256(password);
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
