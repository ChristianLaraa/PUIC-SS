'use server';

import { prisma } from '../lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getExpedientes() {
  return prisma.expediente.findMany({
    include: {
      carrera: true,
      coordinador: true,
      seguimiento: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDashboardData() {
  const [totalActivos, totalSS, totalPP, totalTerminados, expedientesActivos] = await Promise.all([
    prisma.expediente.count({ where: { estatus: 'Activo' } }),
    prisma.expediente.count({ where: { estatus: 'Activo', tipoPrograma: 'SS' } }),
    prisma.expediente.count({ where: { estatus: 'Activo', tipoPrograma: 'PP' } }),
    prisma.expediente.count({ where: { estatus: 'Terminado' } }),
    prisma.expediente.findMany({
      where: { estatus: 'Activo' },
      include: { carrera: true, coordinador: true },
      orderBy: { fechaTentativa: 'asc' },
    }),
  ]);

  const hoy = new Date();
  const limite30Dias = new Date();
  limite30Dias.setDate(hoy.getDate() + 30);

  const alertas = expedientesActivos.filter((exp) => {
    const ft = new Date(exp.fechaTentativa);
    return ft <= limite30Dias;
  });

  return { totalActivos, totalSS, totalPP, totalTerminados, alertas };
}

export async function getExpedienteById(id: number) {
  return prisma.expediente.findUnique({
    where: { idExpediente: id },
    include: {
      carrera: true,
      coordinador: true,
      seguimiento: true,
    },
  });
}

export async function registrarExpediente(data: {
  clave: string;
  nombreAlumno: string;
  sexo: string;
  tipoPrograma: string;
  carreraNombre: string;
  area: string;
  coordinadorNombre: string;
  fechaInicio: string;
  fechaTentativa: string;
  preRegistro?: string;
  registro?: string;
}) {
  const carrera = await prisma.carrera.create({
    data: { nombre: data.carreraNombre, area: data.area },
  });

  const coordinador = await prisma.coordinador.create({
    data: { nombreCompleto: data.coordinadorNombre },
  });

  await prisma.expediente.create({
    data: {
      clave: data.clave,
      nombreAlumno: data.nombreAlumno,
      sexo: data.sexo,
      tipoPrograma: data.tipoPrograma,
      idCarrera: carrera.idCarrera,
      idCoordinador: coordinador.idCoordinador,
      fechaInicio: new Date(data.fechaInicio),
      fechaTentativa: new Date(data.fechaTentativa),
      seguimiento: {
        create: {
          preRegistro: data.preRegistro ? new Date(data.preRegistro) : null,
          registro: data.registro ? new Date(data.registro) : null,
        },
      },
    },
  });

  revalidatePath('/');
  revalidatePath('/expedientes');
  redirect('/expedientes');
}

export async function actualizarSeguimientoDocumental(
  idExpediente: number,
  data: {
    cartaAceptacion: boolean;
    informeFinalUrl?: string;
    cartaTermino: boolean;
  }
) {
  await prisma.seguimientoDocumental.upsert({
    where: { idExpediente },
    update: {
      cartaAceptacion: data.cartaAceptacion,
      informeFinalUrl: data.informeFinalUrl || null,
      cartaTermino: data.cartaTermino,
    },
    create: {
      idExpediente,
      cartaAceptacion: data.cartaAceptacion,
      informeFinalUrl: data.informeFinalUrl || null,
      cartaTermino: data.cartaTermino,
    },
  });

  revalidatePath(`/expedientes/${idExpediente}`);
  revalidatePath('/expedientes');
  revalidatePath('/');
}

export async function marcarComoConcluido(idExpediente: number, fechaTermino: string) {
  await prisma.expediente.update({
    where: { idExpediente },
    data: {
      estatus: 'Terminado',
      fechaTermino: new Date(fechaTermino),
    },
  });

  revalidatePath(`/expedientes/${idExpediente}`);
  revalidatePath('/expedientes');
  revalidatePath('/');
}

export async function registrarDeclinacion(idExpediente: number, observaciones: string) {
  await prisma.$transaction([
    prisma.expediente.update({
      where: { idExpediente },
      data: { estatus: 'Declinado' },
    }),
    prisma.seguimientoDocumental.upsert({
      where: { idExpediente },
      update: { declinacionObs: observaciones },
      create: {
        idExpediente,
        declinacionObs: observaciones,
      },
    }),
  ]);

  revalidatePath(`/expedientes/${idExpediente}`);
  revalidatePath('/expedientes');
  revalidatePath('/');
}

