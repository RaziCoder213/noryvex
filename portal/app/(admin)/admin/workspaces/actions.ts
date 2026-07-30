"use server";

import { revalidatePath } from 'next/cache';

export async function createWorkspace(formData: FormData) {
  revalidatePath('/admin/workspaces');
  return { success: true };
}

export async function updateWorkspaceStatus(id: string, status: string) {
  revalidatePath('/admin/workspaces');
}

export async function deleteWorkspace(id: string) {
  revalidatePath('/admin/workspaces');
}

