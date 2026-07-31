"use server";

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function createClient(formData: FormData) {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') redirect('/login');

  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const workspaceId = formData.get('workspaceId') as string;

  if (!fullName || !email || !password || !workspaceId) {
    return { success: false, error: 'All fields are required.' };
  }

  try {
    const passwordHash = await hashPassword(password);

    // Create user
    const [user] = await db.insert(schema.users).values({
      email,
      passwordHash,
      fullName,
      role: 'client_owner',
      emailVerified: true,
    }).returning();

    // Link to workspace
    await db.insert(schema.workspaceMembers).values({
      userId: user.id,
      workspaceId,
      role: 'client_owner',
    });

    revalidatePath('/admin/clients');
    return { success: true };
  } catch (err: any) {
    if (err.message?.includes('unique') || err.message?.includes('duplicate')) {
      return { success: false, error: 'A user with that email already exists.' };
    }
    return { success: false, error: err.message || 'Failed to create client.' };
  }
}

export async function suspendClient(userId: string) {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') redirect('/login');

  // Suspend all workspaces this user owns
  const memberships = await db
    .select()
    .from(schema.workspaceMembers)
    .where(eq(schema.workspaceMembers.userId, userId));

  for (const m of memberships) {
    if (m.workspaceId) {
      await db
        .update(schema.workspaces)
        .set({ status: 'suspended' })
        .where(eq(schema.workspaces.id, m.workspaceId));
    }
  }

  revalidatePath('/admin/clients');
}

export async function deleteClient(userId: string) {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') redirect('/login');

  await db
    .update(schema.users)
    .set({ deletedAt: new Date() })
    .where(eq(schema.users.id, userId));

  revalidatePath('/admin/clients');
}
