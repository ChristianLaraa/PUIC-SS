'use server';

import { prisma } from '../lib/db';
import { revalidatePath } from 'next/cache';

export async function getPlanteles() {
  return prisma.plantel.findMany({
    include: {
      _count: {
        select: { expedientes: true },
      },
    },
    orderBy: [
      { esUnam: 'desc' },
      { institucion: 'asc' },
      { nombre: 'asc' },
    ],
  });
}

export async function getPlantelesStats() {
  const [totalPlanteles, totalUnam, totalExternos, planteles] = await Promise.all([
    prisma.plantel.count(),
    prisma.plantel.count({ where: { esUnam: true } }),
    prisma.plantel.count({ where: { esUnam: false } }),
    prisma.plantel.findMany({
      include: {
        _count: {
          select: { expedientes: true },
        },
      },
      orderBy: [
        { esUnam: 'desc' },
        { institucion: 'asc' },
        { nombre: 'asc' },
      ],
    }),
  ]);

  return {
    totalPlanteles,
    totalUnam,
    totalExternos,
    planteles,
  };
}

export async function crearPlantel(data: {
  nombre: string;
  institucion: string;
  siglas?: string;
  esUnam?: boolean;
}) {
  const nombreLimpio = data.nombre.trim();
  const institucionLimpia = data.institucion.trim() || (data.esUnam ? 'UNAM' : 'Externa');
  const esUnam = data.esUnam ?? (institucionLimpia.toUpperCase().includes('UNAM'));

  const nuevo = await prisma.plantel.upsert({
    where: { nombre: nombreLimpio },
    update: {
      siglas: data.siglas?.trim() || null,
      institucion: institucionLimpia,
      esUnam,
    },
    create: {
      nombre: nombreLimpio,
      siglas: data.siglas?.trim() || null,
      institucion: institucionLimpia,
      esUnam,
    },
  });

  revalidatePath('/planteles');
  revalidatePath('/expedientes');
  revalidatePath('/expedientes/nuevo');
  revalidatePath('/');

  return nuevo;
}

export async function actualizarPlantel(
  idPlantel: number,
  data: {
    nombre: string;
    institucion: string;
    siglas?: string;
    esUnam?: boolean;
  }
) {
  const institucionLimpia = data.institucion.trim() || 'UNAM';
  const esUnam = data.esUnam ?? (institucionLimpia.toUpperCase().includes('UNAM'));

  const actualizado = await prisma.plantel.update({
    where: { idPlantel },
    data: {
      nombre: data.nombre.trim(),
      institucion: institucionLimpia,
      siglas: data.siglas?.trim() || null,
      esUnam,
    },
  });

  revalidatePath('/planteles');
  revalidatePath('/expedientes');
  revalidatePath('/expedientes/nuevo');
  revalidatePath('/');

  return actualizado;
}

export async function eliminarPlantel(idPlantel: number) {
  const expCount = await prisma.expediente.count({
    where: { idPlantel },
  });

  if (expCount > 0) {
    throw new Error(`No se puede eliminar este plantel porque tiene ${expCount} expediente(s) asociado(s).`);
  }

  await prisma.plantel.delete({
    where: { idPlantel },
  });

  revalidatePath('/planteles');
  revalidatePath('/expedientes/nuevo');
  revalidatePath('/');

  return { success: true };
}
