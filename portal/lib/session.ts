import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth';

export type ServerSession = {
  userId: string;
  role: string;
  workspaceId?: string;
};

/**
 * Use this in Server Components and Server Actions.
 * It reads the access_token cookie directly from next/headers.
 * Returns null if the token is missing or invalid.
 */
export async function getServerSession(): Promise<ServerSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return null;

    const payload = await verifyAccessToken(token);
    if (!payload || typeof payload.userId !== 'string') return null;

    return {
      userId: payload.userId as string,
      role: payload.role as string,
      workspaceId: payload.workspaceId as string | undefined,
    };
  } catch {
    return null;
  }
}
