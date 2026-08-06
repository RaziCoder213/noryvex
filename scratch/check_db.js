import pg from 'pg';
const { Pool } = pg;

const connectionString = 'postgresql://neondb_owner:npg_JGY3PNIXWe2D@ep-orange-water-ayb9mumo-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function run() {
  const client = await pool.connect();
  try {
    console.log('--- Testing Contact INSERT & DELETE ---');
    const contactInsert = await client.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id',
      ['Test User', 'test@example.com', 'Test message']
    );
    const contactId = contactInsert.rows[0].id;
    console.log('Inserted contact ID:', contactId);

    const contactSelect = await client.query('SELECT * FROM contacts WHERE id = $1', [contactId]);
    console.log('Fetched contact:', contactSelect.rows[0]);

    const contactDelete = await client.query('DELETE FROM contacts WHERE id = $1', [contactId]);
    console.log('Deleted contact result:', contactDelete.rowCount);

    console.log('\n--- Testing Client Testimonial INSERT & DELETE ---');
    const clientInsert = await client.query(
      'INSERT INTO clients (name, company, rating, quote) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Test Client', 'Test Company', 5, 'Great!']
    );
    const clientId = clientInsert.rows[0].id;
    console.log('Inserted client ID:', clientId);

    const clientDelete = await client.query('DELETE FROM clients WHERE id = $1', [clientId]);
    console.log('Deleted client result:', clientDelete.rowCount);

    console.log('\n--- Testing Partner Badge INSERT & DELETE ---');
    const partnerInsert = await client.query(
      'INSERT INTO partners (name, link, image) VALUES ($1, $2, $3) RETURNING id',
      ['Test Partner', 'http://link.com', 'http://image.com']
    );
    const partnerId = partnerInsert.rows[0].id;
    console.log('Inserted partner ID:', partnerId);

    const partnerDelete = await client.query('DELETE FROM partners WHERE id = $1', [partnerId]);
    console.log('Deleted partner result:', partnerDelete.rowCount);

    console.log('\nAll database test operations succeeded!');
  } catch (e) {
    console.error('Error during database test operations:', e);
  } finally {
    client.release();
    process.exit(0);
  }
}

run();
