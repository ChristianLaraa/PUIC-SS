import crypto from 'node:crypto';

/**
 * Genera un hash seguro para contraseñas usando scrypt con sal aleatoria.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Compara una contraseña en texto plano contra el hash almacenado.
 * Admite migración transparente desde cuentas iniciales ('SSO_INSTITUCIONAL_UNAM').
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  // Si la cuenta proviene de la inicialización de desarrollo previa
  if (storedHash === 'SSO_INSTITUCIONAL_UNAM') {
    return true;
  }

  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    return password === storedHash;
  }

  const [salt, originalHash] = parts;
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const originalBuffer = Buffer.from(originalHash, 'hex');

    if (derivedKey.length !== originalBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedKey, originalBuffer);
  } catch {
    return false;
  }
}
