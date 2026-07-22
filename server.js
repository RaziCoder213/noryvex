import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  initDb, 
  saveContact, 
  getContacts, 
  markContactRead, 
  deleteContact,
  saveMeeting, 
  getMeetings, 
  markMeetingCompleted, 
  deleteMeeting 
} from './database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'noryvex-jwt-fallback-secret-2026';

app.use(cors());
app.use(express.json());

// Initialize Database
initDb().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// PUBLIC ENDPOINTS

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, company, email, phone, service, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required fields.' });
    }
    
    await saveContact(name, company, email, phone, service, message);
    res.status(201).json({ message: 'Contact inquiry received successfully.' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Book a meeting
app.post('/api/meeting', async (req, res) => {
  try {
    const { name, email, company, phone, date, time, notes } = req.body;
    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: 'Name, Email, Date, and Time are required fields.' });
    }
    
    await saveMeeting(name, email, company, phone, date, time, notes);
    res.status(201).json({ message: 'Meeting scheduled successfully.' });
  } catch (error) {
    console.error('Error saving meeting:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Admin Authentication Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = 'codingwithrazi@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'RaziNoryvex2026!';
  
  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token });
  }
  
  res.status(401).json({ error: 'Invalid admin email or password.' });
});

// PROTECTED ADMIN ENDPOINTS

// Get all contact inquiries
app.get('/api/admin/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await getContacts();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts.' });
  }
});

// Mark contact as read
app.patch('/api/admin/contacts/:id', authenticateToken, async (req, res) => {
  try {
    await markContactRead(req.params.id);
    res.json({ message: 'Contact marked as read.' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact.' });
  }
});

// Delete contact inquiry
app.delete('/api/admin/contacts/:id', authenticateToken, async (req, res) => {
  try {
    await deleteContact(req.params.id);
    res.json({ message: 'Contact inquiry deleted.' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact.' });
  }
});

// Get all meetings
app.get('/api/admin/meetings', authenticateToken, async (req, res) => {
  try {
    const meetings = await getMeetings();
    res.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ error: 'Failed to fetch meetings.' });
  }
});

// Mark meeting as completed
app.patch('/api/admin/meetings/:id', authenticateToken, async (req, res) => {
  try {
    await markMeetingCompleted(req.params.id);
    res.json({ message: 'Meeting marked as completed.' });
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({ error: 'Failed to update meeting.' });
  }
});

// Delete meeting request
app.delete('/api/admin/meetings/:id', authenticateToken, async (req, res) => {
  try {
    await deleteMeeting(req.params.id);
    res.json({ message: 'Meeting request deleted.' });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({ error: 'Failed to delete meeting.' });
  }
});

// Serve frontend assets in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
