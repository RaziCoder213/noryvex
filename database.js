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
  
  console.log('Database initialized successfully.');
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
