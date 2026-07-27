import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'noryvex.db');

let db = null;

export async function getDbConnection() {
  if (db) return db;
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  return db;
}

export async function initDb() {
  const connection = await getDbConnection();
  
  // Create contacts table
  await connection.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      service TEXT,
      message TEXT,
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create meetings table
  await connection.exec(`
    CREATE TABLE IF NOT EXISTS meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      phone TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create trials table
  await connection.exec(`
    CREATE TABLE IF NOT EXISTS trials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name TEXT,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      business_type TEXT,
      ai_handling TEXT,
      trial_status TEXT DEFAULT 'requested',
      call_duration_seconds INTEGER DEFAULT 0,
      limit_duration_seconds INTEGER DEFAULT 1800,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Database initialized successfully.');
}

// Trial Operations
export async function saveTrial(business_name, contact_name, email, phone, business_type, ai_handling) {
  const connection = await getDbConnection();
  const result = await connection.run(
    `INSERT OR REPLACE INTO trials (business_name, contact_name, email, phone, business_type, ai_handling, trial_status, call_duration_seconds, limit_duration_seconds) 
     VALUES (?, ?, ?, ?, ?, ?, COALESCE((SELECT trial_status FROM trials WHERE email = ?), 'requested'), COALESCE((SELECT call_duration_seconds FROM trials WHERE email = ?), 0), 1800)`,
    [business_name, contact_name, email, phone, business_type, ai_handling, email, email]
  );
  return result;
}

export async function getTrials() {
  const connection = await getDbConnection();
  return await connection.all(`SELECT * FROM trials ORDER BY created_at DESC`);
}

export async function updateTrialStatus(id, status) {
  const connection = await getDbConnection();
  return await connection.run(`UPDATE trials SET trial_status = ? WHERE id = ?`, [status, id]);
}

export async function updateTrialDuration(emailOrPhone, durationSeconds) {
  const connection = await getDbConnection();
  const trial = await connection.get(
    `SELECT id, call_duration_seconds, limit_duration_seconds FROM trials WHERE email = ? OR phone = ?`,
    [emailOrPhone, emailOrPhone]
  );
  if (!trial) return { success: false, error: 'Trial not found' };
  
  const newDuration = trial.call_duration_seconds + Number(durationSeconds);
  let newStatus = 'active';
  if (newDuration >= trial.limit_duration_seconds) {
    newStatus = 'expired';
  }
  
  await connection.run(
    `UPDATE trials SET call_duration_seconds = ?, trial_status = CASE WHEN trial_status = 'converted' THEN 'converted' ELSE ? END WHERE id = ?`,
    [newDuration, newStatus, trial.id]
  );
  return { success: true, expired: newDuration >= trial.limit_duration_seconds };
}

// Contact Operations
export async function saveContact(name, company, email, phone, service, message) {
  const connection = await getDbConnection();
  const result = await connection.run(
    `INSERT INTO contacts (name, company, email, phone, service, message) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, company, email, phone, service, message]
  );
  return result;
}

export async function getContacts() {
  const connection = await getDbConnection();
  return await connection.all(`SELECT * FROM contacts ORDER BY created_at DESC`);
}

export async function markContactRead(id) {
  const connection = await getDbConnection();
  return await connection.run(`UPDATE contacts SET status = 'read' WHERE id = ?`, [id]);
}

export async function deleteContact(id) {
  const connection = await getDbConnection();
  return await connection.run(`DELETE FROM contacts WHERE id = ?`, [id]);
}

// Meeting Operations
export async function saveMeeting(name, email, company, phone, date, time, notes) {
  const connection = await getDbConnection();
  const result = await connection.run(
    `INSERT INTO meetings (name, email, company, phone, date, time, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, company, phone, date, time, notes]
  );
  return result;
}

export async function getMeetings() {
  const connection = await getDbConnection();
  return await connection.all(`SELECT * FROM meetings ORDER BY date ASC, time ASC`);
}

export async function markMeetingCompleted(id) {
  const connection = await getDbConnection();
  return await connection.run(`UPDATE meetings SET status = 'completed' WHERE id = ?`, [id]);
}

export async function deleteMeeting(id) {
  const connection = await getDbConnection();
  return await connection.run(`DELETE FROM meetings WHERE id = ?`, [id]);
}
