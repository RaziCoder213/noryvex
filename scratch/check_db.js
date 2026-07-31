import pg from 'pg';
const { Pool } = pg;

const connectionString = 'postgresql://neondb_owner:npg_JGY3PNIXWe2D@ep-orange-water-ayb9mumo-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function run() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM partners');
    console.log('Partners in database:', res.rows);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    client.release();
    process.exit(0);
  }
}

run();
