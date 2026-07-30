"use server";

import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/session';

async function getWorkspaceId(userId: string): Promise<string> {
  const memberships = await db
    .select({ workspaceId: schema.workspaceMembers.workspaceId })
    .from(schema.workspaceMembers)
    .where(eq(schema.workspaceMembers.userId, userId))
    .limit(1);
  const workspaceId = memberships[0]?.workspaceId;
  if (!workspaceId) throw new Error('Unauthorized: no workspace');
  return workspaceId;
}

export async function createPatient(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const workspaceId = await getWorkspaceId(session.userId);

  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string | null;
  const email = formData.get('email') as string | null;
  const treatmentRequested = formData.get('treatmentRequested') as string | null;
  const notes = formData.get('notes') as string | null;

  if (!name) throw new Error('Name is required');

  await db.insert(schema.patients).values({
    workspaceId,
    name,
    phone: phone || null,
    email: email || null,
    treatmentRequested: treatmentRequested || null,
    notes: notes || null,
    status: 'new',
  });

  revalidatePath('/patients');
}

export async function updatePatient(id: string, formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const workspaceId = await getWorkspaceId(session.userId);

  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string | null;
  const email = formData.get('email') as string | null;
  const status = (formData.get('status') as 'new' | 'active' | 'follow_up' | 'inactive') ?? 'active';

  await db
    .update(schema.patients)
    .set({ name, phone: phone || null, email: email || null, status })
    .where(and(eq(schema.patients.id, id), eq(schema.patients.workspaceId, workspaceId)));

  revalidatePath('/patients');
}
