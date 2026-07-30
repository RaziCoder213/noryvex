import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    const userId = payload.userId as string;

    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const tokens = await db
      .select()
      .from(schema.refreshTokens)
      .where(
        and(
          eq(schema.refreshTokens.userId, userId),
          isNull(schema.refreshTokens.revokedAt),
          gt(schema.refreshTokens.expiresAt, new Date())
        )
      );

    let matchedTokenId: string | null = null;
    for (const token of tokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
      if (isMatch) {
        matchedTokenId = token.id;
        break;
      }
    }

    if (!matchedTokenId) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Revoke old token
    await db
      .update(schema.refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(schema.refreshTokens.id, matchedTokenId));

    // Issue new tokens
    const newAccessToken = await signAccessToken({ userId: user.id, role: user.role });
    const newRefreshToken = await signRefreshToken({ userId: user.id });

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(schema.refreshTokens).values({
      userId: user.id,
      tokenHash: hashedRefreshToken,
      expiresAt,
    });

    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
    });

    cookieStore.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

