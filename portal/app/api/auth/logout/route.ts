import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { verifyRefreshToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.set('access_token', '', { maxAge: 0 });
  cookieStore.set('refresh_token', '', { maxAge: 0 });
  return NextResponse.redirect(new URL('/login', 'https://portal.trynoryvex.com'));
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (refreshToken) {
      const payload = await verifyRefreshToken(refreshToken).catch(() => null);
      if (payload && payload.userId) {
        const userId = payload.userId as string;
        
        const tokens = await db
          .select()
          .from(schema.refreshTokens)
          .where(
            and(
              eq(schema.refreshTokens.userId, userId),
              isNull(schema.refreshTokens.revokedAt)
            )
          );
          
        for (const token of tokens) {
          const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
          if (isMatch) {
            await db
              .update(schema.refreshTokens)
              .set({ revokedAt: new Date() })
              .where(eq(schema.refreshTokens.id, token.id));
            break;
          }
        }
      }
    }

    cookieStore.set('access_token', '', { maxAge: 0 });
    cookieStore.set('refresh_token', '', { maxAge: 0 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

