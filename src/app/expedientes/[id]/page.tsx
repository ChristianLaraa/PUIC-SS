import { getExpedienteById } from '@/actions/expedientes';
import SeguimientoPanel from '@/components/expedientes/SeguimientoPanel';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpedienteDetallePage({ params }: PageProps) {
  const { id } = await params;
  const expedienteId = parseInt(id, 10);

  if (isNaN(expedienteId)) {
    notFound();
  }

  const expediente = await getExpedienteById(expedienteId);

  if (!expediente) {
    notFound();
  }

  const badgeColor =
    expediente.estatus === 'Activo'
      ? 'bg-blue-100 text-blue-800'
      : expediente.estatus === 'Terminado'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-red-100 text-red-800';

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {expediente.nombre} {expediente.apPaterno} {expediente.apMaterno}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColor}`}>
              {expediente.estatus}
            </span>
          </div>
          <p className="text-sm font-mono text-slate-500 mt-1">Clave: {expediente.clave}</p>
        </div>
        <Link
          href="/expedientes"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Volver a expedientes
        </Link>
      </div>

      {/* Resumen de Información General */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase">Programa</span>
          <p className="font-semibold text-slate-800 mt-0.5">
            {expediente.tipoPrograma === 'SS' ? 'Servicio Social' : 'Prácticas Profesionales'}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase">Carrera</span>
          <p className="font-semibold text-slate-800 mt-0.5">{expediente.carrera.nombre}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase">Programa / Proyecto</span>
          <p className="font-semibold text-slate-800 mt-0.5">{expediente.nombrePrograma}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase">Coordinador</span>
          <p className="font-semibold text-slate-800 mt-0.5">{expediente.coordinador.nombreCompleto}</p>
        </div>

        <div className="pt-3 border-t">
          <span className="text-xs font-semibold text-slate-400 uppercase">Fecha de Inicio</span>
          <p className="font-medium text-slate-700 mt-0.5">
            {new Date(expediente.fechaInicio).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
          </p>
        </div>
        <div className="pt-3 border-t">
          <span className="text-xs font-semibold text-slate-400 uppercase">Fecha Tentativa (+6m)</span>
          <p className="font-medium text-slate-700 mt-0.5">
            {new Date(expediente.fechaTentativa).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
          </p>
        </div>
        <div className="pt-3 border-t">
          <span className="text-xs font-semibold text-slate-400 uppercase">Fecha Término Real</span>
          <p className="font-medium text-slate-700 mt-0.5">
            {expediente.fechaTermino
              ? new Date(expediente.fechaTermino).toLocaleDateString('es-MX', { timeZone: 'UTC' })
              : 'Pendiente'}
          </p>
        </div>
        <div className="pt-3 border-t">
          <span className="text-xs font-semibold text-slate-400 uppercase">Sexo</span>
          <p className="font-medium text-slate-700 mt-0.5">
            {expediente.sexo === 'H' ? 'Hombre' : expediente.sexo === 'M' ? 'Mujer' : 'Otro'}
          </p>
        </div>
      </div>

      {/* Panel de Checklist y Estatus */}
      <SeguimientoPanel
        idExpediente={expediente.idExpediente}
        estatusActual={expediente.estatus}
        seguimiento={expediente.seguimiento}
      />
    </div>
  );
}
