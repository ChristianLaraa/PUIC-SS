'use server';

import { prisma } from '../lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generarFolioExpediente } from '@/lib/helpers';

export async function obtenerSiguienteNumeroFolio(): Promise<number> {
  const [total, ultimo] = await Promise.all([
    prisma.expediente.count(),
    prisma.expediente.findFirst({
      orderBy: { idExpediente: 'desc' },
      select: { idExpediente: true, clave: true },
    }),
  ]);

  let consecutivo = Math.max(total + 1, (ultimo?.idExpediente ?? 0) + 1);

  // Si el último ya tenía formato de 6 dígitos numéricos, extraer su correlativo
  if (ultimo?.clave && /^\d{6}$/.test(ultimo.clave)) {
    const numPart = parseInt(ultimo.clave.slice(2), 10);
    if (!isNaN(numPart)) {
      consecutivo = Math.max(consecutivo, numPart + 1);
    }
  }

  return consecutivo;
}

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

  // Distribución Institucional y Escuelas Externas
  const expedientesExternos = expedientes.filter((e) => e.plantel?.esUnam === false);
  const totalUnam = expedientes.filter((e) => e.plantel?.esUnam !== false).length;
  const totalExternos = expedientesExternos.length;
  const activosExternos = expedientesExternos.filter((e) => e.estatus === 'Activo').length;
  const activosUnam = activos.filter((e) => e.plantel?.esUnam !== false).length;

  // Desglose por Institución Externa (ej. IPN, UAM, UAEMex, etc.)
  const instExternasCount: Record<string, number> = {};
  const escuelasExternasCount: Record<string, { institucion: string; count: number }> = {};

  expedientesExternos.forEach((e) => {
    const inst = e.plantel?.institucion || 'Otras Instituciones';
    instExternasCount[inst] = (instExternasCount[inst] || 0) + 1;

    const escuela = e.plantel?.nombre || 'Escuela Externa';
    if (!escuelasExternasCount[escuela]) {
      escuelasExternasCount[escuela] = {
        institucion: inst,
        count: 0,
      };
    }
    escuelasExternasCount[escuela].count += 1;
  });

  const topInstitucionesExternas = Object.entries(instExternasCount)
    .sort((a, b) => b[1] - a[1]);

  const topPlantelesExternos = Object.entries(escuelasExternasCount)
    .map(([nombre, item]) => ({
      nombre,
      institucion: item.institucion,
      total: item.count,
    }))
    .sort((a, b) => b.total - a.total);

  const totalPlantelesExternos = await prisma.plantel.count({
    where: { esUnam: false },
  });

  return {
    totalExpedientes,
    totalActivos,
    totalSS,
    totalPP,
    totalTerminados,
    totalDeclinados,
    totalUnam,
    totalExternos,
    activosExternos,
    activosUnam,
    totalPlantelesExternos,
    topInstitucionesExternas,
    topPlantelesExternos,
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
      plantel: true,
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
  plantelInstitucion?: string;
  esUnam?: boolean;
  plantelSiglas?: string;
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
  const nombrePlantelLimpio = data.plantelNombre.trim();
  const institucionLimpia = data.plantelInstitucion?.trim() || (data.esUnam !== false ? 'UNAM' : 'Externa');
  const esUnam = data.esUnam ?? (institucionLimpia.toUpperCase().includes('UNAM'));

  // Asegurar o crear Plantel con su metadata institucional
  const plantel = await prisma.plantel.upsert({
    where: { nombre: nombrePlantelLimpio },
    update: {
      institucion: institucionLimpia,
      esUnam,
      siglas: data.plantelSiglas?.trim() || undefined,
    },
    create: {
      nombre: nombrePlantelLimpio,
      institucion: institucionLimpia,
      esUnam,
      siglas: data.plantelSiglas?.trim() || null,
    },
  });

  // Asegurar o crear Carrera
  const carrera = await prisma.carrera.upsert({
    where: { nombre: data.carreraNombre.trim() },
    update: {},
    create: { nombre: data.carreraNombre.trim() },
  });

  // Crear Coordinador con su grado académico
  const coordinador = await prisma.coordinador.create({
    data: {
      nombreCompleto: data.coordinadorNombre,
      gradoAcademico: data.coordinadorGrado,
    },
  });

  // Asegurar que el folio (clave) sea único y consecutivo
  let folioFinal = data.clave?.trim() || '';
  if (!folioFinal || !/^\d{6}$/.test(folioFinal)) {
    const siguienteNum = await obtenerSiguienteNumeroFolio();
    folioFinal = generarFolioExpediente(data.fechaInicio, siguienteNum);
  }

  // Verificar si ya existe por concurrencia
  let existe = await prisma.expediente.findUnique({
    where: { clave: folioFinal },
    select: { idExpediente: true },
  });

  if (existe) {
    let intento = 1;
    const siguienteNum = await obtenerSiguienteNumeroFolio();
    while (existe) {
      folioFinal = generarFolioExpediente(data.fechaInicio, siguienteNum + intento);
      existe = await prisma.expediente.findUnique({
        where: { clave: folioFinal },
        select: { idExpediente: true },
      });
      intento++;
    }
  }

  // Crear Expediente completo
  await prisma.expediente.create({
    data: {
      clave: folioFinal,
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
    cartaPresentacionUrl?: string | null;
    cartaPresentacionFolio?: string | null;
    cartaAceptacionUrl?: string | null;
    cartaAceptacionRecogida?: boolean;
    cartaAceptacionFolio?: string | null;
    cartaAceptacion?: boolean;
    informeFinalUrl?: string | null;
    aplicaInformeFinal?: boolean;
    informeFinalFolio?: string | null;
    cartaTerminoUrl?: string | null;
    cartaTerminoFolio?: string | null;
    cartaTermino?: boolean;
  }
) {
  const payload = {
    cartaPresentacionUrl: data.cartaPresentacionUrl?.trim() || null,
    cartaPresentacionFolio: data.cartaPresentacionFolio?.trim() || null,
    cartaAceptacionUrl: data.cartaAceptacionUrl?.trim() || null,
    cartaAceptacionRecogida: data.cartaAceptacionRecogida ?? false,
    cartaAceptacionFolio: data.cartaAceptacionFolio?.trim() || null,
    cartaAceptacion: data.cartaAceptacion ?? Boolean(data.cartaAceptacionUrl || data.cartaAceptacionRecogida),
    informeFinalUrl: data.informeFinalUrl?.trim() || null,
    aplicaInformeFinal: data.aplicaInformeFinal ?? true,
    informeFinalFolio: data.informeFinalFolio?.trim() || null,
    cartaTerminoUrl: data.cartaTerminoUrl?.trim() || null,
    cartaTerminoFolio: data.cartaTerminoFolio?.trim() || null,
    cartaTermino: data.cartaTermino ?? Boolean(data.cartaTerminoUrl),
  };

  await prisma.seguimientoDocumental.upsert({
    where: { idExpediente },
    update: payload,
    create: {
      idExpediente,
      ...payload,
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
