import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const [user] = await db
      .select()
      .from(schema.users)
      .where(
        and(
          eq(schema.users.email, email),
          isNull(schema.users.deletedAt)
        )
      );

    if (!user) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.insert(schema.passwordResets).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // In production, send an email here
    // For now, return the token for debugging as requested
    return NextResponse.json({ success: true, debug_token: token });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    const activeResets = await db
      .select()
      .from(schema.passwordResets)
      .where(
        and(
          isNull(schema.passwordResets.usedAt),
          gt(schema.passwordResets.expiresAt, new Date())
        )
      );

    let matchedResetId: string | null = null;
    let matchedUserId: string | null = null;
    
    for (const reset of activeResets) {
      const isMatch = await bcrypt.compare(token, reset.tokenHash);
      if (isMatch) {
        matchedResetId = reset.id;
        matchedUserId = reset.userId;
        break;
      }
    }

    if (!matchedResetId || !matchedUserId) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const newPasswordHash = await hashPassword(password);

    await db.transaction(async (tx) => {
      await tx
        .update(schema.users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(schema.users.id, matchedUserId));
        
      await tx
        .update(schema.passwordResets)
        .set({ usedAt: new Date() })
        .where(eq(schema.passwordResets.id, matchedResetId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

