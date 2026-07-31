import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { 
  initDb, 
  saveContact, 
  getContacts, 
  markContactRead, 
  deleteContact,
  saveMeeting, 
  getMeetings, 
  markMeetingCompleted, 
  deleteMeeting,
  saveTrial,
  getTrials,
  updateTrialStatus,
  updateTrialDuration,
  getClients,
  saveClient,
  deleteClient,
  getPartners,
  savePartner,
  deletePartner,
  getSetting,
  setSetting
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

// EMAIL SENDER HELPER
async function sendEmailNotification(subject, htmlContent) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  
  if (!smtpUser || !smtpPass) {
    console.log('--------------------------------------------------');
    console.log('EMAIL NOTIFICATION SIMULATION (Set SMTP_USER & SMTP_PASS in .env to send real emails)');
    console.log('To: codingwithrazi@gmail.com, razi@trynoryvex.com');
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${htmlContent}`);
    console.log('--------------------------------------------------');
    return;
  }
  
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
    
    const info = await transporter.sendMail({
      from: `"Noryvex Notifications" <${smtpUser}>`,
      to: 'codingwithrazi@gmail.com, razi@trynoryvex.com',
      subject: subject,
      html: htmlContent
    });
    
    console.log('Email notification sent successfully:', info.messageId);
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
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

    // Trigger email notification
    const subject = `[Noryvex Lead] New Inquiry/Trial from ${name}`;
    const htmlContent = `
      <h2>New Lead Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company || '—'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || '—'}</p>
      <p><strong>Service/Campaign:</strong> ${service}</p>
      <p><strong>Details:</strong></p>
      <div style="background: #f4f5f7; padding: 16px; border-radius: 8px; border-left: 4px solid #C7FF3D; color: #111;">
        ${(message || '').replace(/\n/g, '<br/>')}
      </div>
      <p style="font-size: 0.85rem; color: #777; margin-top: 24px;">Sent from Noryvex Operations Hub.</p>
    `;
    sendEmailNotification(subject, htmlContent);

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

    // Trigger email notification
    const subject = `[Noryvex Booking] Strategy Call with ${name}`;
    const htmlContent = `
      <h2>New Meeting Scheduled</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company || '—'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || '—'}</p>
      <p><strong>Requested Date:</strong> ${date}</p>
      <p><strong>Requested Time:</strong> ${time}</p>
      <p><strong>Meeting Notes:</strong></p>
      <div style="background: #f4f5f7; padding: 16px; border-radius: 8px; border-left: 4px solid #C7FF3D; color: #111;">
        ${(notes || 'No extra notes provided.').replace(/\n/g, '<br/>')}
      </div>
      <p style="font-size: 0.85rem; color: #777; margin-top: 24px;">Sent from Noryvex Operations Hub.</p>
    `;
    sendEmailNotification(subject, htmlContent);

    res.status(201).json({ message: 'Meeting scheduled successfully.' });
  } catch (error) {
    console.error('Error saving meeting:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Submit trial request form
app.post('/api/trial', async (req, res) => {
  try {
    const { businessName, contactName, email, phone, businessType, aiHandling } = req.body;
    if (!contactName || !email || !businessName) {
      return res.status(400).json({ error: 'Business Name, Contact Name, and Email are required fields.' });
    }
    
    await saveTrial(businessName, contactName, email, phone, businessType, aiHandling);
    
    // Also save to contacts table for general logs listing
    await saveContact(contactName, businessName, email, phone, `7-Day Trial (${businessType})`, `AI Tasks: ${aiHandling.toUpperCase()}`);

    // Trigger email notification
    const subject = `[Noryvex Trial] New 7-Day Free Trial Request from ${contactName}`;
    const htmlContent = `
      <h2>New 7-Day Free Trial Requested</h2>
      <p><strong>Business Name:</strong> ${businessName}</p>
      <p><strong>Contact Name:</strong> ${contactName}</p>
      <p><strong>Email Address:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone || '—'}</p>
      <p><strong>Business Type/Niche:</strong> ${businessType}</p>
      <p><strong>AI Tasks:</strong> ${aiHandling.toUpperCase()}</p>
      <p><strong>Trial Status:</strong> REQUESTED</p>
      <p><strong>Limit:</strong> 30 Minutes call time / 7 Days</p>
      <p style="font-size: 0.85rem; color: #777; margin-top: 24px;">Sent from Noryvex Operations Hub.</p>
    `;
    sendEmailNotification(subject, htmlContent);

    res.status(201).json({ message: 'Free trial request received.' });
  } catch (error) {
    console.error('Error saving trial:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Log call duration and trigger auto-cutoff check
app.post('/api/trial/duration', async (req, res) => {
  try {
    const { emailOrPhone, durationSeconds } = req.body;
    if (!emailOrPhone || !durationSeconds) {
      return res.status(400).json({ error: 'emailOrPhone and durationSeconds are required.' });
    }
    
    const result = await updateTrialDuration(emailOrPhone, durationSeconds);
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json({ message: 'Trial duration updated.', expired: result.expired });
  } catch (error) {
    console.error('Error updating trial duration:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Vapi Webhook receiver endpoint for end-of-call auto-cutoff reports
app.post('/api/vapi/webhook', async (req, res) => {
  try {
    const event = req.body;
    if (event?.message?.type === 'end-of-call-report') {
      const call = event.message.call;
      const durationSeconds = call.duration || 0;
      const phone = call.customer?.number || '';
      
      if (phone && durationSeconds > 0) {
        console.log(`[Vapi Webhook] Call ended for ${phone}. Duration: ${durationSeconds} seconds.`);
        const result = await updateTrialDuration(phone, durationSeconds);
        
        // Send email alert if trial limit is reached/expired
        if (result.success && result.expired) {
          const subject = `[Trial Cap Reached] Call time expired for ${phone}`;
          const htmlContent = `
            <h2>Trial Limit Exceeded</h2>
            <p>The trial for phone number <strong>${phone}</strong> has exceeded its 30-minute (1800s) call limit and has been automatically deactivated.</p>
            <p><strong>Call duration logged:</strong> ${durationSeconds} seconds</p>
            <p>— Noryvex Automated Cut-off System</p>
          `;
          sendEmailNotification(subject, htmlContent);
        }
      }
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Error in Vapi webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed.' });
  }
});

// Public CMS Endpoints
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await getClients();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients.' });
  }
});

app.get('/api/partners', async (req, res) => {
  try {
    const partners = await getPartners();
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Failed to fetch partners.' });
  }
});

app.get('/api/settings/under-construction', async (req, res) => {
  try {
    const val = await getSetting('under_construction');
    res.json({ underConstruction: val === 'true' });
  } catch (error) {
    console.error('Error fetching under construction setting:', error);
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

app.get('/api/settings/booking-redirect', async (req, res) => {
  try {
    const val = await getSetting('booking_redirect_url');
    res.json({ bookingRedirectUrl: val || 'https://calendly.com/noryvex' });
  } catch (error) {
    console.error('Error fetching booking redirect setting:', error);
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

// Admin Authentication Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const allowedEmails = ['razi@trynoryvex.com', 'razi@noryvex.com', 'codingwithrazi@gmail.com'];
  const adminPassword = process.env.ADMIN_PASSWORD || 'RaziNoryvex2026!';
  
  const cleanedEmail = (email || '').toLowerCase().trim();
  if (allowedEmails.includes(cleanedEmail) && password === adminPassword) {
    const token = jwt.sign({ email: cleanedEmail }, JWT_SECRET, { expiresIn: '24h' });
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

// Get all trials
app.get('/api/admin/trials', authenticateToken, async (req, res) => {
  try {
    const trials = await getTrials();
    res.json(trials);
  } catch (error) {
    console.error('Error fetching trials:', error);
    res.status(500).json({ error: 'Failed to fetch trials.' });
  }
});

// Update trial status
app.patch('/api/admin/trials/:id', authenticateToken, async (req, res) => {
  try {
    const { trial_status } = req.body;
    await updateTrialStatus(req.params.id, trial_status);
    res.json({ message: 'Trial status updated successfully.' });
  } catch (error) {
    console.error('Error updating trial status:', error);
    res.status(500).json({ error: 'Failed to update trial status.' });
  }
});

// CMS Testimonials (Clients) Admin Operations
app.post('/api/admin/clients', authenticateToken, async (req, res) => {
  try {
    const { id, name, company, rating, quote } = req.body;
    const result = await saveClient(id, name, company, rating, quote);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error saving client:', error);
    res.status(500).json({ error: 'Failed to save client.' });
  }
});

app.delete('/api/admin/clients/:id', authenticateToken, async (req, res) => {
  try {
    await deleteClient(req.params.id);
    res.json({ message: 'Client testimonial deleted.' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client.' });
  }
});

// CMS Partners Admin Operations
app.post('/api/admin/partners', authenticateToken, async (req, res) => {
  try {
    const { id, name, link, image } = req.body;
    const result = await savePartner(id, name, link, image);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error saving partner:', error);
    res.status(500).json({ error: 'Failed to save partner.' });
  }
});

app.delete('/api/admin/partners/:id', authenticateToken, async (req, res) => {
  try {
    await deletePartner(req.params.id);
    res.json({ message: 'Partner brand deleted.' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ error: 'Failed to delete partner.' });
  }
});

// System Settings Operations
app.post('/api/admin/settings/under-construction', authenticateToken, async (req, res) => {
  try {
    const { underConstruction } = req.body;
    if (typeof underConstruction !== 'boolean') {
      return res.status(400).json({ error: 'underConstruction status must be a boolean.' });
    }
    await setSetting('under_construction', underConstruction ? 'true' : 'false');
    res.json({ message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('Error saving setting:', error);
    res.status(500).json({ error: 'Failed to save settings.' });
  }
});

app.post('/api/admin/settings/booking-redirect', authenticateToken, async (req, res) => {
  try {
    const { bookingRedirectUrl } = req.body;
    if (typeof bookingRedirectUrl !== 'string') {
      return res.status(400).json({ error: 'bookingRedirectUrl must be a string.' });
    }
    await setSetting('booking_redirect_url', bookingRedirectUrl.trim());
    res.json({ message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('Error saving setting:', error);
    res.status(500).json({ error: 'Failed to save settings.' });
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
