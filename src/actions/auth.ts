'use server';

import { prisma } from '@/lib/prisma';
import { validarDominioInstitucional, determinarRolInicial } from '@/lib/roleManager';
import { signSessionToken, getSession, type UserPayload } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/password';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function iniciarSesionConCredenciales(datos: {
  correo: string;
  password: string;
}) {
  const correo = datos.correo?.trim().toLowerCase();
  const password = datos.password?.trim();

  if (!correo) {
    return { error: 'Por favor ingresa tu correo electrónico.' };
  }

  if (!password) {
    return { error: 'Por favor ingresa tu contraseña.' };
  }

  // 1. Barrera de seguridad: Solo cuentas institucionales UNAM
  if (!validarDominioInstitucional(correo)) {
    return {
      error: 'Acceso denegado: El sistema requiere una cuenta de correo institucional de la UNAM.',
    };
  }

  // 2. Buscar al usuario en la base de datos
  let usuario = await prisma.usuario.findUnique({
    where: { correo },
  });

  const rolCalculado = determinarRolInicial(correo);

  if (!usuario) {
    // Si no existe, registrar cuenta institucional con la contraseña provista
    usuario = await prisma.usuario.create({
      data: {
        nombreCompleto: correo.split('@')[0],
        correo,
        password: hashPassword(password),
        rol: rolCalculado,
        activo: true,
      },
    });
  } else {
    // Validar contraseña
    const esValida = verifyPassword(password, usuario.password);
    if (!esValida) {
      return {
        error: 'Contraseña incorrecta. Por favor verifica tus credenciales.',
      };
    }

    // Migración transparente si venía de inicialización previa sin contraseña asignada
    if (usuario.password === 'SSO_INSTITUCIONAL_UNAM') {
      usuario = await prisma.usuario.update({
        where: { idUsuario: usuario.idUsuario },
        data: {
          password: hashPassword(password),
          rol: rolCalculado,
        },
      });
    }
  }

  if (!usuario.activo) {
    return {
      error: 'Tu cuenta institucional ha sido desactivada temporalmente en este sistema.',
    };
  }

  // 3. Crear cookie de sesión cifrada
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

export async function sincronizarUsuarioInstitucional(datos: {
  nombre?: string;
  correo: string;
  password?: string;
}) {
  return iniciarSesionConCredenciales({
    correo: datos.correo,
    password: datos.password || 'SSO_INSTITUCIONAL_UNAM',
  });
}

export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete('puic_session');
  redirect('/login');
}

export async function obtenerUsuarioActual(): Promise<UserPayload | null> {
  return getSession();
}