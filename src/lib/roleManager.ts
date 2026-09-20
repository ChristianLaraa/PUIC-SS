export type AppRole = 'DEV' | 'ADMIN' | 'LECTOR';

export function validarDominioInstitucional(correo: string): boolean {
  const allowedDomains = (process.env.ALLOWED_DOMAINS || 'unam.mx,comunidad.unam.mx,aragon.unam.mx')
    .split(',')
    .map((d) => d.trim().toLowerCase());

  const emailDomain = correo.split('@')[1]?.toLowerCase();
  return allowedDomains.some((d) => emailDomain === d || emailDomain?.endsWith(`.${d}`));
}

export function determinarRolInicial(correo: string): AppRole {
  const cleanEmail = correo.trim().toLowerCase();

  const devEmail = process.env.DEV_EMAIL?.trim().toLowerCase();
  if (devEmail && cleanEmail === devEmail) {
    return 'DEV';
  }

  const adminEmails = (process.env.PUIC_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.includes(cleanEmail)) {
    return 'ADMIN';
  }

  return 'LECTOR';
}