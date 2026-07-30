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

export async function createKnowledgeDoc(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const workspaceId = await getWorkspaceId(session.userId);

  const title = formData.get('title') as string;
  const content = formData.get('content') as string | null;
  const type = (formData.get('type') as schema.KnowledgeType) ?? 'faq';
  const sourceUrl = formData.get('sourceUrl') as string | null;

  if (!title) throw new Error('Title is required');

  await db.insert(schema.knowledgeDocuments).values({
    workspaceId,
    title,
    content: content || null,
    type,
    sourceUrl: sourceUrl || null,
    isActive: true,
  });

  revalidatePath('/knowledge');
}

export async function deleteKnowledgeDoc(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const workspaceId = await getWorkspaceId(session.userId);

  await db
    .delete(schema.knowledgeDocuments)
    .where(and(eq(schema.knowledgeDocuments.id, id), eq(schema.knowledgeDocuments.workspaceId, workspaceId)));

  revalidatePath('/knowledge');
}

export async function toggleKnowledgeDoc(id: string, currentState: boolean) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const workspaceId = await getWorkspaceId(session.userId);

  await db
    .update(schema.knowledgeDocuments)
    .set({ isActive: !currentState })
    .where(and(eq(schema.knowledgeDocuments.id, id), eq(schema.knowledgeDocuments.workspaceId, workspaceId)));

  revalidatePath('/knowledge');
}
