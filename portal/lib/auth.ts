import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export type SessionData = {
  userId: string;
  role: string;
  workspaceId?: string;
};

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('The JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
};

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function signAccessToken(payload: { userId: string; role: string; workspaceId?: string }): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getSecretKey());
}

export async function signRefreshToken(payload: { userId: string }): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecretKey());
}

export async function verifyAccessToken(token: string): Promise<JWTPayload & SessionData> {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload as JWTPayload & SessionData;
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload & { userId: string }> {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload as JWTPayload & { userId: string };
}

export async function getSession(request: Request | NextRequest): Promise<SessionData | null> {
  let token: string | undefined;

  if (request instanceof NextRequest) {
    token = request.cookies.get('access_token')?.value;
  } else {
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/access_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
  }

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAccessToken(token);
    return {
      userId: payload.userId,
      role: payload.role,
      workspaceId: payload.workspaceId,
    };
  } catch (error) {
    return null;
  }
}

