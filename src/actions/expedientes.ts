'use server';

import { prisma } from '../lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getExpedientes() {
  return prisma.expediente.findMany({
    include: {
      plantel: true,
      carrera: true,
      coordinador: true,
      seguimiento: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDashboardData() {
  const [
    totalExpedientes,
    totalActivos,
    totalSS,
    totalPP,
    totalTerminados,
    totalDeclinados,
    expedientes,
  ] = await Promise.all([
    prisma.expediente.count(),
    prisma.expediente.count({ where: { estatus: 'Activo' } }),
    prisma.expediente.count({ where: { estatus: 'Activo', tipoPrograma: 'SS' } }),
    prisma.expediente.count({ where: { estatus: 'Activo', tipoPrograma: 'PP' } }),
    prisma.expediente.count({ where: { estatus: 'Terminado' } }),
    prisma.expediente.count({ where: { estatus: 'Declinado' } }),
    prisma.expediente.findMany({
      include: {
        plantel: true,
        carrera: true,
        coordinador: true,
      },
    }),
  ]);

  const hoy = new Date();
  const limite30Dias = new Date();
  limite30Dias.setDate(hoy.getDate() + 30);

  // Alertas de vencimiento
  const activos = expedientes.filter((e) => e.estatus === 'Activo');
  const vencidos = activos.filter((e) => new Date(e.fechaTentativa) < hoy);
  const proximosAVencer = activos.filter((e) => {
    const ft = new Date(e.fechaTentativa);
    return ft >= hoy && ft <= limite30Dias;
  });

  // Tasa de conclusión
  const totalCerrados = totalTerminados + totalDeclinados;
  const tasaExito = totalCerrados > 0 ? Math.round((totalTerminados / totalCerrados) * 100) : 100;

  // Distribución por Modalidad
  const modalidades = {
    Presencial: activos.filter((e) => e.modalidad === 'Presencial').length,
    'A Distancia': activos.filter((e) => e.modalidad === 'A Distancia').length,
    Mixta: activos.filter((e) => e.modalidad === 'Mixta').length,
  };

  // Top Planteles
  const plantelesCount: Record<string, number> = {};
  expedientes.forEach((e) => {
    const nombre = e.plantel?.nombre || 'Sin Plantel';
    plantelesCount[nombre] = (plantelesCount[nombre] || 0) + 1;
  });
  const topPlanteles = Object.entries(plantelesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Top Carreras
  const carrerasCount: Record<string, number> = {};
  expedientes.forEach((e) => {
    const nombre = e.carrera?.nombre || 'Sin Carrera';
    carrerasCount[nombre] = (carrerasCount[nombre] || 0) + 1;
  });
  const topCarreras = Object.entries(carrerasCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return {
    totalExpedientes,
    totalActivos,
    totalSS,
    totalPP,
    totalTerminados,
    totalDeclinados,
    tasaExito,
    vencidos,
    proximosAVencer,
    modalidades,
    topPlanteles,
    topCarreras,
  };
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
  // Datos del alumno
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  numeroCuenta: string;
  correoElectronico: string;
  telefono: string;
  edad: number;
  sexo: string;
  semestre: string;
  // Adscripción
  plantelNombre: string;
  carreraNombre: string;
  // Programa
  tipoPrograma: string;
  clavePrograma: string;
  nombrePrograma: string;
  cicloEscolar: string;
  ubicacionDependencia: string;
  modalidad: string;
  turno: string;
  // Coordinador
  coordinadorGrado: string;
  coordinadorNombre: string;
  // Tiempos
  fechaInicio: string;
  fechaTentativa: string;
  preRegistro?: string;
  registro?: string;
}) {
  // Asegurar o crear Plantel
  const plantel = await prisma.plantel.upsert({
    where: { nombre: data.plantelNombre },
    update: {},
    create: { nombre: data.plantelNombre },
  });

  // Asegurar o crear Carrera
  const carrera = await prisma.carrera.upsert({
    where: { nombre: data.carreraNombre },
    update: {},
    create: { nombre: data.carreraNombre },
  });

  // Crear Coordinador con su grado académico
  const coordinador = await prisma.coordinador.create({
    data: {
      nombreCompleto: data.coordinadorNombre,
      gradoAcademico: data.coordinadorGrado,
    },
  });

  // Crear Expediente completo
  await prisma.expediente.create({
    data: {
      clave: data.clave,
      nombre: data.nombre,
      apPaterno: data.apPaterno,
      apMaterno: data.apMaterno,
      numeroCuenta: data.numeroCuenta,
      correoElectronico: data.correoElectronico,
      telefono: data.telefono,
      edad: Number(data.edad),
      sexo: data.sexo,
      semestre: data.semestre,
      idPlantel: plantel.idPlantel,
      idCarrera: carrera.idCarrera,
      tipoPrograma: data.tipoPrograma,
      clavePrograma: data.clavePrograma,
      nombrePrograma: data.nombrePrograma,
      cicloEscolar: data.cicloEscolar,
      ubicacionDependencia: data.ubicacionDependencia,
      modalidad: data.modalidad,
      turno: data.turno,
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
