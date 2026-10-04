import { getDashboardData } from '@/actions/expedientes';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Building2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  Globe,
} from 'lucide-react';

export default async function DashboardPage() {
  const data = await getDashboardData();
  const hoy = new Date();

  return (
    <div className="space-y-8 pb-12">
      {/* ENCABEZADO INSTITUCIONAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2DACB] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0A1E42] text-white tracking-wider uppercase">
              PUIC - UNAM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1E42] tracking-tight">
            Sistema Operativo de Registros - PUIC
          </h1>
          <p className="text-xs sm:text-sm italic text-[#5C6779] mt-0.5">
            La UNAM y la pluriculturalidad: seguimiento integral de Servicio Social y Prácticas Profesionales.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/expedientes/nuevo"
            className="flex items-center gap-2 bg-[#0A1E42] hover:bg-[#06132A] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm border-b-2 border-[#C68A2C] transition-all cursor-pointer"
          >
            <PlusCircle size={17} className="text-[#DF9F38]" />
            Nuevo Registro
          </Link>
          <Link
            href="/expedientes"
            className="flex items-center gap-2 bg-white hover:bg-[#F5F0E6] text-[#0A1E42] border border-[#E2DACB] text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Directorio Institucional
          </Link>
        </div>
      </div>

      {/* TARJETAS PRINCIPALES INTERACTIVAS (CLICKABLES) */}
      <div>
        <p className="text-[11px] font-bold text-[#9E6B1D] uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <span>Métricas del Padrón Universitario</span>
          <span className="text-slate-400 font-normal normal-case text-xs">(Haz clic para filtrar)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* Card 1: Activos Totales */}
          <Link
            href="/expedientes?estatus=Activo"
            className="group bg-white p-5 rounded-2xl border border-[#E2DACB] hover:border-[#0A1E42] hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#5C6779] uppercase tracking-wider">
                  Alumnos Activos
                </span>
                <p className="text-3xl font-black text-[#0A1E42] mt-1 group-hover:text-[#163670] transition-colors">
                  {data.totalActivos}
                </p>
              </div>
              <div className="p-2.5 bg-[#0A1E42]/10 text-[#0A1E42] rounded-xl group-hover:bg-[#0A1E42] group-hover:text-white transition-colors">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#5C6779] group-hover:text-[#0A1E42]">
              <span className="font-medium">Consultar activos</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#C68A2C]" />
            </div>
          </Link>

          {/* Card 2: Servicio Social */}
          <Link
            href="/expedientes?programa=SS&estatus=Activo"
            className="group bg-white p-5 rounded-2xl border border-[#E2DACB] hover:border-[#008A7C] hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#5C6779] uppercase tracking-wider">
                  Servicio Social (SS)
                </span>
                <p className="text-3xl font-black text-[#008A7C] mt-1">
                  {data.totalSS}
                </p>
              </div>
              <div className="p-2.5 bg-[#008A7C]/10 text-[#008A7C] rounded-xl group-hover:bg-[#008A7C] group-hover:text-white transition-colors">
                <GraduationCap size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#5C6779] group-hover:text-[#008A7C]">
              <span className="font-medium">{Math.round((data.totalSS / (data.totalActivos || 1)) * 100)}% de activos</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#008A7C]" />
            </div>
          </Link>

          {/* Card 3: Prácticas Profesionales */}
          <Link
            href="/expedientes?programa=PP&estatus=Activo"
            className="group bg-white p-5 rounded-2xl border border-[#E2DACB] hover:border-[#C68A2C] hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#5C6779] uppercase tracking-wider">
                  Prácticas (PP)
                </span>
                <p className="text-3xl font-black text-[#C68A2C] mt-1">
                  {data.totalPP}
                </p>
              </div>
              <div className="p-2.5 bg-[#C68A2C]/15 text-[#9E6B1D] rounded-xl group-hover:bg-[#C68A2C] group-hover:text-white transition-colors">
                <Briefcase size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#5C6779] group-hover:text-[#9E6B1D]">
              <span className="font-medium">{Math.round((data.totalPP / (data.totalActivos || 1)) * 100)}% de activos</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#C68A2C]" />
            </div>
          </Link>

          {/* Card 4: Escuelas Externas (No UNAM) */}
          <Link
            href="/expedientes?origen=EXTERNA"
            className="group bg-white p-5 rounded-2xl border border-[#E2DACB] hover:border-[#008A7C] hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#008A7C] uppercase tracking-wider flex items-center gap-1">
                  Escuelas Externas
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-black text-[#008A7C]">{data.totalExternos}</p>
                  <span className="text-xs font-semibold text-slate-500">
                    ({data.activosExternos} activos)
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-[#008A7C]/10 text-[#008A7C] rounded-xl group-hover:bg-[#008A7C] group-hover:text-white transition-colors">
                <Globe size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#5C6779] group-hover:text-[#008A7C]">
              <span className="font-medium">{data.totalPlantelesExternos} planteles externos</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#008A7C]" />
            </div>
          </Link>

          {/* Card 5: Concluidos / Eficiencia Terminal */}
          <Link
            href="/expedientes?estatus=Terminado"
            className="group bg-white p-5 rounded-2xl border border-[#E2DACB] hover:border-[#0A1E42] hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#5C6779] uppercase tracking-wider">
                  Acreditados
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-black text-[#0A1E42]">{data.totalTerminados}</p>
                  <span className="text-xs font-bold text-[#008A7C] flex items-center gap-0.5">
                    <TrendingUp size={12} /> {data.tasaExito}%
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-[#0A1E42]/10 text-[#0A1E42] rounded-xl group-hover:bg-[#0A1E42] group-hover:text-white transition-colors">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#5C6779] group-hover:text-[#0A1E42]">
              <span className="font-medium">Ver concluidos</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#C68A2C]" />
            </div>
          </Link>

        </div>
      </div>

      {/* SECCIÓN ANALÍTICA: MODALIDADES, PLANTELES Y CARRERAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Widget 1: Modalidad y Entorno de Trabajo */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2DACB] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
            Modalidad de Trabajo (Activos)
          </h3>
          <div className="space-y-3">
            {Object.entries(data.modalidades).map(([modalidad, total]) => {
              const porcentaje = data.totalActivos > 0 ? Math.round((total / data.totalActivos) * 100) : 0;
              return (
                <div key={modalidad} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#0E1B2E]">{modalidad}</span>
                    <span className="text-[#5C6779]">{total} ({porcentaje}%)</span>
                  </div>
                  <div className="w-full bg-[#F5F0E6] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        modalidad === 'Presencial'
                          ? 'bg-[#0A1E42]'
                          : modalidad === 'Mixta'
                          ? 'bg-[#C68A2C]'
                          : 'bg-[#008A7C]'
                      }`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] italic text-[#5C6779] pt-2 border-t border-[#E2DACB]">
            Distribución operativa para sedes y proyectos de investigación del PUIC.
          </p>
        </div>

        {/* Widget 2: Top Planteles / Escuelas */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2DACB] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-[#0A1E42]" />
              Principales Escuelas
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-bold">
              <span className="text-[#9E6B1D] bg-[#C68A2C]/15 px-1.5 py-0.5 rounded">UNAM: {data.totalUnam}</span>
              <span className="text-[#008A7C] bg-[#008A7C]/15 px-1.5 py-0.5 rounded">Ext: {data.totalExternos}</span>
            </div>
          </div>
          <div className="space-y-3">
            {data.topPlanteles.length === 0 ? (
              <p className="text-xs text-slate-400">Sin datos registrados aún.</p>
            ) : (
              data.topPlanteles.map(([plantel, cant]) => {
                const pct = Math.round((cant / (data.totalExpedientes || 1)) * 100);
                return (
                  <div key={plantel} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#0E1B2E] truncate max-w-[200px]" title={plantel}>
                        {plantel}
                      </span>
                      <span className="font-bold text-[#0A1E42]">{cant}</span>
                    </div>
                    <div className="w-full bg-[#F5F0E6] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#0A1E42] h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Widget 3: Top Carreras */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2DACB] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0A1E42] uppercase tracking-wider flex items-center gap-2">
            <BookOpen size={16} className="text-[#C68A2C]" />
            Disciplinas y Carreras Top
          </h3>
          <div className="space-y-3">
            {data.topCarreras.length === 0 ? (
              <p className="text-xs text-slate-400">Sin datos registrados aún.</p>
            ) : (
              data.topCarreras.map(([carrera, cant]) => {
                const pct = Math.round((cant / (data.totalExpedientes || 1)) * 100);
                return (
                  <div key={carrera} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#0E1B2E] truncate max-w-[200px]" title={carrera}>
                        {carrera}
                      </span>
                      <span className="font-bold text-[#9E6B1D]">{cant}</span>
                    </div>
                    <div className="w-full bg-[#F5F0E6] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#C68A2C] h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* SEMÁFORO DE VENCIMIENTOS Y GESTIÓN DE RIESGO */}
      <div className="bg-white rounded-2xl border border-[#E2DACB] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2DACB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FBF9F5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                <AlertOctagon size={18} />
              </span>
              <h2 className="text-base font-bold text-[#0A1E42]">
                Semáforo de Vencimientos y Liberaciones Pendientes
              </h2>
            </div>
            <p className="text-xs text-[#5C6779] mt-1 italic">
              Alumnos con fecha tentativa vencida o que concluyen dentro de los próximos 30 días.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              {data.vencidos.length} vencidos
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#9E6B1D] border border-amber-200">
              {data.proximosAVencer.length} por vencer
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0A1E42] text-xs uppercase text-slate-200 border-b border-[#06132A]">
              <tr>
                <th className="p-4 tracking-wider">Folio / No. Cuenta</th>
                <th className="p-4 tracking-wider">Alumno</th>
                <th className="p-4 tracking-wider">Programa</th>
                <th className="p-4 tracking-wider">Carrera</th>
                <th className="p-4 tracking-wider">Término Estimado</th>
                <th className="p-4 text-center tracking-wider">Diagnóstico</th>
                <th className="p-4 text-right tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DACB]/60">
              {data.vencidos.length === 0 && data.proximosAVencer.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#5C6779] italic">
                    No hay expedientes en estado de riesgo o próximos a vencer. Todos los registros activos están en tiempo.
                  </td>
                </tr>
              ) : (
                [...data.vencidos, ...data.proximosAVencer].map((exp) => {
                  const ft = new Date(exp.fechaTentativa);
                  const diasRestantes = Math.ceil(
                    (ft.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const yaVencio = diasRestantes < 0;

                  return (
                    <tr key={exp.idExpediente} className="hover:bg-[#FBF9F5] transition-colors">
                      <td className="p-4">
                        <div className="font-mono font-bold text-xs text-[#0A1E42]">{exp.clave}</div>
                        <div className="font-mono text-[11px] text-[#5C6779]">Cta: {exp.numeroCuenta}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-[#0A1E42] text-xs sm:text-sm">
                          {exp.nombre} {exp.apPaterno} {exp.apMaterno}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            exp.tipoPrograma === 'SS'
                              ? 'bg-[#008A7C]/15 text-[#008A7C] border border-[#008A7C]/30'
                              : 'bg-[#C68A2C]/15 text-[#9E6B1D] border border-[#C68A2C]/30'
                          }`}
                        >
                          {exp.tipoPrograma === 'SS' ? 'Servicio Social' : 'Prácticas'}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-[#5C6779] truncate max-w-[180px]">
                        {exp.carrera?.nombre ?? 'Sin asignar'}
                      </td>
                      <td className="p-4 text-xs font-semibold text-[#0E1B2E]">
                        {ft.toLocaleDateString('es-MX', { timeZone: 'UTC' })}
                      </td>
                      <td className="p-4 text-center">
                        {yaVencio ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                            Venció hace {Math.abs(diasRestantes)} días
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-[#9E6B1D] border border-amber-200">
                            <Clock size={12} /> Faltan {diasRestantes} días
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/expedientes/${exp.idExpediente}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1E42] hover:text-[#C68A2C] transition-colors"
                        >
                          Ver Ficha
                          <ExternalLink size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
