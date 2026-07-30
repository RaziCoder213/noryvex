"use server";

import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/session';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function updateProfile(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const fullName = formData.get('fullName') as string;
  if (!fullName?.trim()) throw new Error('Name is required');

  await db
    .update(schema.users)
    .set({ fullName: fullName.trim() })
    .where(eq(schema.users.id, session.userId));

  revalidatePath('/settings');
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!currentPassword || !newPassword) throw new Error('Both passwords are required');
  if (newPassword.length < 8) throw new Error('Password must be at least 8 characters');

  const [user] = await db
    .select({ passwordHash: schema.users.passwordHash })
    .from(schema.users)
    .where(eq(schema.users.id, session.userId));

  if (!user) throw new Error('User not found');

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) throw new Error('Current password is incorrect');

  const newHash = await hashPassword(newPassword);
  await db
    .update(schema.users)
    .set({ passwordHash: newHash })
    .where(eq(schema.users.id, session.userId));

  return { success: true };
}
