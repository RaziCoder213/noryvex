import pg from 'pg';
const { Pool } = pg;

// Connection string from environment variable or user fallback
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_JGY3PNIXWe2D@ep-orange-water-ayb9mumo-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Neon Postgres connections over SSL
  }
});

export async function initDb() {
  const client = await pool.connect();
  try {
    // 1. Create contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        service VARCHAR(255),
        message TEXT,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create meetings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS meetings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        phone VARCHAR(255),
        date VARCHAR(50) NOT NULL,
        time VARCHAR(50) NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Create trials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trials (
        id SERIAL PRIMARY KEY,
        business_name VARCHAR(255),
        contact_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(255),
        business_type VARCHAR(255),
        ai_handling VARCHAR(255),
        trial_status VARCHAR(50) DEFAULT 'requested',
        call_duration_seconds INTEGER DEFAULT 0,
        limit_duration_seconds INTEGER DEFAULT 1800,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Create clients table
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        rating INTEGER DEFAULT 5,
        quote TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Create partners table
    await client.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        link TEXT,
        image TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Create settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    // Seed clients if table is empty
    const clientsRes = await client.query('SELECT COUNT(*) FROM clients');
    if (parseInt(clientsRes.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO clients (name, company, rating, quote) VALUES
        ('Sarah Jenkins', 'Bright Dental', 5, 'Chloe resolved 92% of our FAQ calls and booked 45 meetings in her first week.'),
        ('Marcus Thorne', 'Apex Logistics', 5, 'The workflow integration saves our dispatch team at least 15 hours every single week.')
      `);
    }

    // Seed partners if table is empty
    const partnersRes = await client.query('SELECT COUNT(*) FROM partners');
    if (parseInt(partnersRes.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO partners (name, link, image) VALUES
        ('Super Launch', 'https://www.superlaun.ch/products/2926', 'https://www.superlaun.ch/badge.png'),
        ('Twelve Tools', 'https://twelve.tools', 'https://twelve.tools/badge3-dark.svg'),
        ('Wired Business', 'https://wired.business', 'https://wired.business/badge3-dark.svg'),
        ('GoodFirms', 'https://www.goodfirms.co/company/noryvex', 'https://www.goodfirms.co/img/badges/recognized-on-goodfirms.png')
      `);
    }

    // Seed under_construction setting if empty
    const settingsRes = await client.query("SELECT COUNT(*) FROM settings WHERE key = 'under_construction'");
    if (parseInt(settingsRes.rows[0].count, 10) === 0) {
      await client.query("INSERT INTO settings (key, value) VALUES ('under_construction', 'false')");
    }

    console.log('Neon Postgres Database initialized and seeded successfully.');
  } finally {
    client.release();
  }
}

// Settings Operations
export async function getSetting(key) {
  const res = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
  return res.rows[0]?.value || null;
}

export async function setSetting(key, value) {
  await pool.query(
    'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
    [key, value]
  );
  return { success: true };
}

// Trial Operations
export async function saveTrial(business_name, contact_name, email, phone, business_type, ai_handling) {
  const res = await pool.query(
    `INSERT INTO trials (business_name, contact_name, email, phone, business_type, ai_handling, trial_status, call_duration_seconds, limit_duration_seconds) 
     VALUES ($1, $2, $3, $4, $5, $6, 'requested', 0, 1800)
     ON CONFLICT (email) 
     DO UPDATE SET 
       business_name = EXCLUDED.business_name,
       contact_name = EXCLUDED.contact_name,
       phone = EXCLUDED.phone,
       business_type = EXCLUDED.business_type,
       ai_handling = EXCLUDED.ai_handling
     RETURNING id`,
    [business_name, contact_name, email, phone, business_type, ai_handling]
  );
  return { lastID: res.rows[0].id };
}

export async function getTrials() {
  const res = await pool.query('SELECT * FROM trials ORDER BY created_at DESC');
  return res.rows;
}

export async function updateTrialStatus(id, status) {
  await pool.query('UPDATE trials SET trial_status = $1 WHERE id = $2', [status, id]);
  return { success: true };
}

export async function updateTrialDuration(emailOrPhone, durationSeconds) {
  const res = await pool.query(
    'SELECT id, call_duration_seconds, limit_duration_seconds, trial_status FROM trials WHERE email = $1 OR phone = $2',
    [emailOrPhone, emailOrPhone]
  );
  const trial = res.rows[0];
  if (!trial) return { success: false, error: 'Trial not found' };
  
  const newDuration = trial.call_duration_seconds + Number(durationSeconds);
  let newStatus = 'active';
  if (newDuration >= trial.limit_duration_seconds) {
    newStatus = 'expired';
  }
  
  await pool.query(
    `UPDATE trials SET call_duration_seconds = $1, trial_status = CASE WHEN trial_status = 'converted' THEN 'converted' ELSE $2 END WHERE id = $3`,
    [newDuration, newStatus, trial.id]
  );
  return { success: true, expired: newDuration >= trial.limit_duration_seconds };
}

// Contact Operations
export async function saveContact(name, company, email, phone, service, message) {
  const res = await pool.query(
    'INSERT INTO contacts (name, company, email, phone, service, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [name, company, email, phone, service, message]
  );
  return { lastID: res.rows[0].id };
}

export async function getContacts() {
  const res = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
  return res.rows;
}

export async function markContactRead(id) {
  await pool.query("UPDATE contacts SET status = 'read' WHERE id = $1", [id]);
  return { success: true };
}

export async function deleteContact(id) {
  await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
  return { success: true };
}

// Meeting Operations
export async function saveMeeting(name, email, company, phone, date, time, notes) {
  const res = await pool.query(
    'INSERT INTO meetings (name, email, company, phone, date, time, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [name, email, company, phone, date, time, notes]
  );
  return { lastID: res.rows[0].id };
}

export async function getMeetings() {
  const res = await pool.query('SELECT * FROM meetings ORDER BY date ASC, time ASC');
  return res.rows;
}

export async function markMeetingCompleted(id) {
  await pool.query("UPDATE meetings SET status = 'completed' WHERE id = $1", [id]);
  return { success: true };
}

export async function deleteMeeting(id) {
  await pool.query('DELETE FROM meetings WHERE id = $1', [id]);
  return { success: true };
}

// Clients (CMS) Operations
export async function getClients() {
  const res = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
  return res.rows;
}

export async function saveClient(id, name, company, rating, quote) {
  if (id) {
    await pool.query(
      'UPDATE clients SET name = $1, company = $2, rating = $3, quote = $4 WHERE id = $5',
      [name, company, Number(rating), quote, id]
    );
    return { success: true, lastID: id };
  } else {
    const res = await pool.query(
      'INSERT INTO clients (name, company, rating, quote) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, company, Number(rating), quote]
    );
    return { success: true, lastID: res.rows[0].id };
  }
}

export async function deleteClient(id) {
  await pool.query('DELETE FROM clients WHERE id = $1', [id]);
  return { success: true };
}

// Partners (CMS) Operations
export async function getPartners() {
  const res = await pool.query('SELECT * FROM partners ORDER BY created_at DESC');
  return res.rows;
}

export async function savePartner(id, name, link, image) {
  if (id) {
    await pool.query(
      'UPDATE partners SET name = $1, link = $2, image = $3 WHERE id = $4',
      [name, link, image, id]
    );
    return { success: true, lastID: id };
  } else {
    const res = await pool.query(
      'INSERT INTO partners (name, link, image) VALUES ($1, $2, $3) RETURNING id',
      [name, link, image]
    );
    return { success: true, lastID: res.rows[0].id };
  }
}

export async function deletePartner(id) {
  await pool.query('DELETE FROM partners WHERE id = $1', [id]);
  return { success: true };
}
