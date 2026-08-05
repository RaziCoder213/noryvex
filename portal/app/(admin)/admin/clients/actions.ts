"use server";

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import { getServerSession } from '@/lib/session';

export async function createClient(formData: FormData) {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') {
    return { success: false, error: 'Session expired. Please log out and log back in.' };
  }

  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const workspaceId = formData.get('workspaceId') as string;

  if (!fullName || !email || !password || !workspaceId) {
    return { success: false, error: 'All fields are required.' };
  }

  try {
    const passwordHash = await hashPassword(password);

    const [user] = await db.insert(schema.users).values({
      email,
      passwordHash,
      fullName,
      role: 'client_owner',
      emailVerified: true,
    }).returning();

    await db.insert(schema.workspaceMembers).values({
      userId: user.id,
      workspaceId,
      role: 'client_owner',
    });

    revalidatePath('/admin/clients');
    return { success: true };
  } catch (err: any) {
    const detail = err?.cause?.message ?? err?.cause ?? err?.message ?? String(err);
    if (String(detail).includes('unique') || String(detail).includes('duplicate')) {
      return { success: false, error: 'A user with that email already exists.' };
    }
    console.error('[createClient]', detail);
    return { success: false, error: String(detail) };
  }
}

export async function suspendClient(userId: string) {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') {
    return { success: false, error: 'Session expired.' };
  }

  try {
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
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteClient(userId: string) {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') {
    return { success: false, error: 'Session expired.' };
  }

  try {
    await db
      .update(schema.users)
      .set({ deletedAt: new Date() })
      .where(eq(schema.users.id, userId));

    revalidatePath('/admin/clients');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
