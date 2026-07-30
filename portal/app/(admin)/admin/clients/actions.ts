"use server";

import { revalidatePath } from 'next/cache';

export async function createClient(formData: FormData) {
  // Logic to insert user with role='client_owner', hash pass, insert workspace_member
  revalidatePath('/admin/clients');
  return { success: true };
}

export async function suspendClient(userId: string) {
  revalidatePath('/admin/clients');
}

export async function deleteClient(userId: string) {
  revalidatePath('/admin/clients');
}

