import { getExpedienteById } from '@/actions/expedientes';
import SeguimientoPanel from '@/components/expedientes/SeguimientoPanel';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Award,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Briefcase,
  Clock,
  Calendar,
  MapPin,
  Sun,
  BookOpen,
  Hash,
  Compass,
} from 'lucide-react';
import { obtenerDiasRestantes } from '@/lib/helpers';

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

  const sexoTexto =
    expediente.sexo === 'H'
      ? 'Hombre'
      : expediente.sexo === 'M'
      ? 'Mujer'
      : 'Otro';

  const { dias, esCritico } = obtenerDiasRestantes(expediente.fechaTentativa);

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2DACB] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#9E6B1D] bg-[#C68A2C]/15 px-2 py-0.5 rounded border border-[#C68A2C]/30">
              <Award size={11} /> Expediente PUIC • UNAM
            </span>
            <span className="text-xs text-[#5C6779] font-mono">
              Folio: <strong className="text-[#0A1E42]">{expediente.clave}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1E42]">
              {expediente.nombre} {expediente.apPaterno} {expediente.apMaterno}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColor}`}>
              ● {expediente.estatus}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5C6779] mt-0.5">
            {expediente.tipoPrograma === 'SS' ? 'Servicio Social' : 'Prácticas Profesionales'} • {expediente.carrera?.nombre}
          </p>
        </div>
        <Link
          href="/expedientes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1E42] hover:text-[#C68A2C] transition-colors p-2.5 rounded-xl bg-white border border-[#E2DACB] shadow-2xs self-start sm:self-auto"
        >
          <ArrowLeft size={14} />
          Volver a expedientes
        </Link>
      </div>

      {/* BLOQUE DE INFORMACIÓN COMPLETA DEL ALUMNO (3 COLUMNAS MODULARES) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Módulo 1: Datos Personales y de Contacto */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2DACB] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E2DACB] pb-3">
            <User size={16} className="text-[#C68A2C]" />
            <h2 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider">
              Datos del Alumno y Contacto
            </h2>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-bold text-[#5C6779] block">Número de Cuenta / Matrícula</span>
              <p className="font-mono font-bold text-sm text-[#0A1E42] mt-0.5">{expediente.numeroCuenta}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#5C6779] block">Correo Electrónico</span>
              <a
                href={`mailto:${expediente.correoElectronico}`}
                className="text-xs font-semibold text-[#008A7C] hover:underline flex items-center gap-1 mt-0.5"
              >
                <Mail size={13} className="shrink-0" />
                <span className="truncate">{expediente.correoElectronico}</span>
              </a>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#5C6779] block">Teléfono de Contacto</span>
              <a
                href={`tel:${expediente.telefono}`}
                className="text-xs font-semibold text-[#0A1E42] hover:text-[#C68A2C] flex items-center gap-1 mt-0.5"
              >
                <Phone size={13} className="shrink-0" />
                <span>{expediente.telefono || 'Sin teléfono registrado'}</span>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2DACB]/60">
              <div>
                <span className="text-[11px] font-bold text-[#5C6779] block">Edad</span>
                <p className="font-semibold text-[#0E1B2E] mt-0.5">{expediente.edad} años</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#5C6779] block">Sexo</span>
                <p className="font-semibold text-[#0E1B2E] mt-0.5">{sexoTexto}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E2DACB]/60">
              <span className="text-[11px] font-bold text-[#5C6779] block">Semestre Cursado</span>
              <p className="font-semibold text-[#0E1B2E] mt-0.5">{expediente.semestre}</p>
            </div>
          </div>
        </div>

        {/* Módulo 2: Adscripción Académica y Procedencia */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2DACB] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E2DACB] pb-3">
            <GraduationCap size={16} className="text-[#008A7C]" />
            <h2 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider">
              Adscripción Académica
            </h2>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-bold text-[#5C6779] block">Plantel / Escuela</span>
              <p className="font-bold text-[#0A1E42] mt-0.5 leading-snug">
                {expediente.plantel?.nombre}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    expediente.plantel?.esUnam !== false
                      ? 'bg-[#C68A2C]/15 text-[#9E6B1D] border border-[#C68A2C]/30'
                      : 'bg-[#008A7C]/15 text-[#008A7C] border border-[#008A7C]/30'
                  }`}
                >
                  {expediente.plantel?.institucion ?? (expediente.plantel?.esUnam !== false ? 'UNAM' : 'Externa')}
                </span>
                {expediente.plantel?.siglas && (
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {expediente.plantel.siglas}
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#5C6779] block">Carrera / Disciplina</span>
              <p className="font-semibold text-[#0E1B2E] mt-0.5">{expediente.carrera?.nombre}</p>
            </div>
            <div className="pt-2 border-t border-[#E2DACB]/60">
              <span className="text-[11px] font-bold text-[#5C6779] block">Coordinador / Tutor PUIC</span>
              <p className="font-semibold text-[#0A1E42] mt-0.5">
                <span className="text-[#9E6B1D] font-bold">{expediente.coordinador?.gradoAcademico} </span>
                {expediente.coordinador?.nombreCompleto}
              </p>
            </div>
            <div className="pt-2 border-t border-[#E2DACB]/60">
              <span className="text-[11px] font-bold text-[#5C6779] block">Sede / Ubicación de Asignación</span>
              <p className="font-semibold text-[#0E1B2E] mt-0.5 flex items-center gap-1">
                <MapPin size={13} className="text-[#C68A2C] shrink-0" />
                <span>{expediente.ubicacionDependencia || 'Sede Central PUIC'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Módulo 3: Datos del Programa y Tiempos Oficiales */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2DACB] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E2DACB] pb-3">
            <Briefcase size={16} className="text-[#0A1E42]" />
            <h2 className="text-xs font-bold text-[#0A1E42] uppercase tracking-wider">
              Programa y Tiempos Oficiales
            </h2>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-bold text-[#5C6779] block">Programa Registrado</span>
              <p className="font-bold text-[#0A1E42] mt-0.5 leading-snug">
                {expediente.nombrePrograma || (expediente.tipoPrograma === 'SS' ? 'Servicio Social en Investigación PUIC' : 'Prácticas Profesionales PUIC')}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  Clave: {expediente.clavePrograma || 'S/C'}
                </span>
                <span className="text-[10px] text-[#5C6779]">
                  Ciclo: <strong>{expediente.cicloEscolar}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2DACB]/60">
              <div>
                <span className="text-[11px] font-bold text-[#5C6779] block">Modalidad</span>
                <p className="font-semibold text-[#0E1B2E] mt-0.5">{expediente.modalidad}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#5C6779] block">Turno</span>
                <p className="font-semibold text-[#0E1B2E] mt-0.5">{expediente.turno}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2DACB]/60">
              <div>
                <span className="text-[11px] font-bold text-[#5C6779] block">Inicio Oficial</span>
                <p className="font-bold text-[#0A1E42] mt-0.5">
                  {new Date(expediente.fechaInicio).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#5C6779] block">Término Tentativo (+6m)</span>
                <p className="font-bold text-[#0A1E42] mt-0.5">
                  {new Date(expediente.fechaTentativa).toLocaleDateString('es-MX', { timeZone: 'UTC' })}
                </p>
              </div>
            </div>

            {/* Diagnóstico de Días */}
            <div className="pt-2 border-t border-[#E2DACB]/60">
              {expediente.estatus === 'Terminado' ? (
                <div className="p-2 rounded-lg bg-[#E0F2F1] text-[#008A7C] font-bold text-[11px]">
                  ✓ Concluido oficialmente el {expediente.fechaTermino ? new Date(expediente.fechaTermino).toLocaleDateString('es-MX', { timeZone: 'UTC' }) : 'N/D'}
                </div>
              ) : dias < 0 ? (
                <div className="p-2 rounded-lg bg-rose-50 text-rose-800 font-bold text-[11px] border border-rose-200">
                  ⚠ El plazo de 6 meses concluyó hace {Math.abs(dias)} días
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-amber-50 text-[#9E6B1D] font-bold text-[11px] border border-amber-200 flex items-center justify-between">
                  <span>Plazo reglamentario activo</span>
                  <span>{dias} días restantes</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* SECCIÓN: CONTROL DOCUMENTAL INSTITUCIONAL CON FLUJO DE 4 FASES */}
      <SeguimientoPanel
        idExpediente={expediente.idExpediente}
        estatusActual={expediente.estatus}
        seguimiento={expediente.seguimiento}
      />
    </div>
  );
}
