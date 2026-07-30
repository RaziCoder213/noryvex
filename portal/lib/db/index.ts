import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazy initialization — only throws at request time, not during build
function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop: string) {
    return getDb()[prop as keyof ReturnType<typeof createDb>];
  },
});

export type DB = ReturnType<typeof createDb>;
