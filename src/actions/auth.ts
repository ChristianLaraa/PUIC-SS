'use server';

import { prisma } from '@/lib/prisma';
import { validarDominioInstitucional, determinarRolInicial } from '@/lib/roleManager';
import { signSessionToken, getSession, type UserPayload } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function sincronizarUsuarioInstitucional(datos: {
  nombre: string;
  correo: string;
}) {
  const nombre = datos.nombre?.trim() || 'Usuario Institucional';
  const correo = datos.correo?.trim().toLowerCase();

  if (!correo) {
    return {
      error: 'Por favor ingresa un correo electrónico institucional.',
    };
  }

  // 1. Barrera de seguridad: Solo cuentas institucionales UNAM
  if (!validarDominioInstitucional(correo)) {
    return {
      error: 'Acceso denegado: El sistema solo permite el ingreso con cuenta institucional de la UNAM (@unam.mx, @comunidad.unam.mx o @aragon.unam.mx).',
    };
  }

  // 2. Evaluar el rol que le corresponde según la configuración (.env)
  const rolCalculado = determinarRolInicial(correo);

  // 3. Upsert en base de datos: si existe actualiza el rol si cambió en el .env, si no lo crea
  const usuario = await prisma.usuario.upsert({
    where: { correo },
    update: {
      nombreCompleto: nombre,
      rol: rolCalculado,
    },
    create: {
      nombreCompleto: nombre,
      correo,
      password: 'SSO_INSTITUCIONAL_UNAM',
      rol: rolCalculado,
      activo: true,
    },
  });

  if (!usuario.activo) {
    return { error: 'Tu cuenta institucional ha sido desactivada temporalmente en este sistema.' };
  }

  // 4. Crear cookie de sesión cifrada
  const token = await signSessionToken({
    idUsuario: usuario.idUsuario,
    nombreCompleto: usuario.nombreCompleto,
    correo: usuario.correo,
    rol: usuario.rol as 'ADMIN' | 'DEV' | 'LECTOR',
  });

  const cookieStore = await cookies();
  cookieStore.set('puic_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 horas
  });

  redirect('/');
}

export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete('puic_session');
  redirect('/login');
}

export async function obtenerUsuarioActual(): Promise<UserPayload | null> {
  return getSession();
}