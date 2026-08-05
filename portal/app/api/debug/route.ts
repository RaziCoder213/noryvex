import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, string> = {};

  // Test 1: Environment variables
  results.DATABASE_URL = process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET';
  results.JWT_SECRET = process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET';
  results.NODE_ENV = process.env.NODE_ENV ?? 'unknown';

  // Test 2: DB import
  try {
    const { db } = await import('@/lib/db');
    results.db_import = '✅ OK';

    // Test 3: Schema import
    try {
      const schema = await import('@/lib/db/schema');
      results.schema_import = '✅ OK';

      // Test 4: Simple query
      try {
        const { count } = await import('drizzle-orm');
        const result = await db.select({ count: count() }).from(schema.workspaces);
        results.db_query = `✅ OK — count: ${result[0]?.count ?? 'null'}`;
      } catch (e: any) {
        results.db_query = `❌ FAIL: ${e?.message ?? String(e)}`;
      }
    } catch (e: any) {
      results.schema_import = `❌ FAIL: ${e?.message ?? String(e)}`;
    }
  } catch (e: any) {
    results.db_import = `❌ FAIL: ${e?.message ?? String(e)}`;
  }

  // Test 5: Auth import
  try {
    const { verifyAccessToken } = await import('@/lib/auth');
    results.auth_import = '✅ OK';
  } catch (e: any) {
    results.auth_import = `❌ FAIL: ${e?.message ?? String(e)}`;
  }

  // Test 6: Session import + cookies
  try {
    const { getServerSession } = await import('@/lib/session');
    const session = await getServerSession();
    results.session = session ? `✅ Logged in as ${session.role}` : '⚠️ No session (not logged in)';
  } catch (e: any) {
    results.session = `❌ FAIL: ${e?.message ?? String(e)}`;
  }

  return NextResponse.json(results, { status: 200 });
}
