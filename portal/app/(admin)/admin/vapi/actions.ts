"use server";

import { revalidatePath } from 'next/cache';

export async function saveVapiConfig(workspaceId: string, formData: FormData) {
  revalidatePath('/admin/vapi');
  return { success: true };
}

