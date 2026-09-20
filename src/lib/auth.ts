import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function getEncodedKey() {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET debe configurarse para crear o verificar sesiones en producción.');
  }

  return new TextEncoder().encode(secretKey || 'desarrollo-puic-no-usar-en-produccion');
}

export interface UserPayload {
  idUsuario: number;
  nombreCompleto: string;
  correo: string;
  rol: 'DEV' | 'ADMIN' | 'LECTOR';
}

export async function signSessionToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getEncodedKey());
}

export async function verifySessionToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ['HS256'],
    });
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('puic_session')?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
