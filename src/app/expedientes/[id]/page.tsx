import { getExpedienteById } from '@/actions/expedientes';
import SeguimientoPanel from '@/components/expedientes/SeguimientoPanel';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Award, ArrowLeft } from 'lucide-react';

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
      ? 'bg-[#0A1E42]/10 text-[#0A1E42] border border-[#0A1E42]/20'
      : expediente.estatus === 'Terminado'
      ? 'bg-[#008A7C]/15 text-[#008A7C] border border-[#008A7C]/30'
      : 'bg-rose-100 text-rose-800 border border-rose-200';

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2DACB] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-serif font-bold text-[#9E6B1D] bg-[#C68A2C]/15 px-2 py-0.5 rounded border border-[#C68A2C]/30">
              <Award size={11} /> Expediente PUIC • UNAM
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1E42]">
              {expediente.nombre} {expediente.apPaterno} {expediente.apMaterno}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColor}`}>
              {expediente.estatus}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#5C6779] mt-1">Clave Institucional: {expediente.clave}</p>
        </div>
        <Link
          href="/expedientes"
          className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#0A1E42] hover:text-[#C68A2C] transition-colors p-2 rounded-lg bg-white border border-[#E2DACB] shadow-2xs self-start sm:self-auto"
        >
          <ArrowLeft size={14} />
          Volver a expedientes
        </Link>
      </div>

      {/* Resumen de Información General */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2DACB] shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-[11px] font-bold text-[#5C6779] uppercase tracking-wider">Programa</span>
          <p className="font-serif font-bold text-[#0A1E42] mt-0.5">
            {expediente.tipoPrograma === 'SS' ? 'Servicio Social' : 'Prácticas Profesionales'}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-bold text-[#5C6779] uppercase tracking-wider">Carrera</span>
          <p className="font-medium text-[#0E1B2E] mt-0.5">{expediente.carrera.nombre}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold text-[#5C6779] uppercase tracking-wider">Programa / Proyecto</span>
          <p className="font-medium text-[#0E1B2E] mt-0.5">{expediente.nombrePrograma}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold text-[#5C6779] uppercase tracking-wider">Coordinador</span>
          <p className="font-medium text-[#0E1B2E] mt-0.5">{expediente.coordinador.nombreCompleto}</p>
        </div>

        <div className="pt-3 border-t border-[#E2DACB]/60">
          <span className="text-[11px] font-bold text-[#5C6779] uppercase tracking-wider">Fecha de Inicio</span>
          <p className="font-medium text-[#0E1B2E] mt-0.5">
            {new Date(expediente.fechaInicio).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
          </p>
        </div>
        <div className="pt-3 border-t border-[#E2DACB]/60">
          <span className="text-[11px] font-bold text-[#5C6779] uppercase tracking-wider">Fecha Tentativa (+6m)</span>
          <p className="font-medium text-[#0E1B2E] mt-0.5">
            {new Date(expediente.fechaTentativa).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
          </p>
        </div>
        <div className="pt-3 border-t border-[#E2DACB]/60">
          <span className="text-[11px] font-bold text-[#5C6779] uppercase tracking-wider">Fecha Término Real</span>
          <p className="font-medium text-[#0E1B2E] mt-0.5">
            {expediente.fechaTermino
              ? new Date(expediente.fechaTermino).toLocaleDateString('es-MX', { timeZone: 'UTC' })
              : 'Pendiente'}
          </p>
        </div>
        <div className="pt-3 border-t border-[#E2DACB]/60">
          <span className="text-[11px] font-bold text-[#5C6779] uppercase tracking-wider">Sexo</span>
          <p className="font-medium text-[#0E1B2E] mt-0.5">
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
