"use server";

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from '@/lib/session';

export async function createWorkspace(formData: FormData) {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') {
    return { success: false, error: 'Session expired. Please log out and log back in.' };
  }

  const name = formData.get('name') as string;
  const subdomain = formData.get('subdomain') as string;
  const industry = formData.get('industry') as string;
  const timezone = (formData.get('timezone') as string) || 'UTC';

  if (!name || !subdomain || !industry) {
    return { success: false, error: 'Name, subdomain, and industry are required.' };
  }

  const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  try {
    await db.insert(schema.workspaces).values({
      name,
      subdomain: cleanSubdomain,
      industry,
      timezone,
      status: 'active',
    });

    revalidatePath('/admin/workspaces');
    return { success: true, subdomain: cleanSubdomain };
  } catch (err: any) {
    const detail = err?.cause?.message ?? err?.cause ?? err?.message ?? String(err);
    if (String(detail).includes('unique') || String(detail).includes('duplicate') || String(detail).includes('already exists')) {
      return { success: false, error: 'That subdomain is already taken. Choose another.' };
    }
    console.error('[createWorkspace]', detail);
    return { success: false, error: String(detail) };
  }
}

export async function updateWorkspaceStatus(id: string, status: string) {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') {
    return { success: false, error: 'Session expired.' };
  }

  try {
    await db
      .update(schema.workspaces)
      .set({ status: status as schema.WorkspaceStatus })
      .where(eq(schema.workspaces.id, id));

    revalidatePath('/admin/workspaces');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteWorkspace(id: string) {
  const session = await getServerSession();
  if (!session || session.role !== 'super_admin') {
    return { success: false, error: 'Session expired.' };
  }

  try {
    await db
      .update(schema.workspaces)
      .set({ deletedAt: new Date() })
      .where(eq(schema.workspaces.id, id));

    revalidatePath('/admin/workspaces');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
