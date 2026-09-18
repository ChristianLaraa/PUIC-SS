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
} from 'lucide-react';

export default async function DashboardPage() {
  const data = await getDashboardData();
  const hoy = new Date();

  return (
    <div className="space-y-8 pb-12">
      {/* ENCABEZADO INSTITUCIONAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#002B7A] text-white tracking-wide">
              PUIC - UNAM
            </span>
            <span className="text-xs text-slate-400 font-medium">Ciclo Operativo Activo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E42] tracking-tight">
            Panel de Inteligencia Operativa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitoreo en tiempo real, alertas de acreditación y procedencia académica.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/expedientes/nuevo"
            className="flex items-center gap-2 bg-[#002B7A] hover:bg-[#0A1E42] text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
          >
            <PlusCircle size={17} />
            Nuevo Registro
          </Link>
          <Link
            href="/expedientes"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
          >
            Ver Todo el Directorio
          </Link>
        </div>
      </div>

      {/* TARJETAS PRINCIPALES INTERACTIVAS (CLICKABLES) */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Métricas Operativas (Haz clic en cualquier tarjeta para filtrar el directorio)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Activos Totales */}
          <Link
            href="/expedientes?estatus=Activo"
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-[#002B7A] hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Alumnos Activos
                </span>
                <p className="text-3xl font-black text-[#0A1E42] mt-1 group-hover:text-[#002B7A] transition-colors">
                  {data.totalActivos}
                </p>
              </div>
              <div className="p-2.5 bg-blue-50 text-[#002B7A] rounded-xl group-hover:bg-[#002B7A] group-hover:text-white transition-colors">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 group-hover:text-[#002B7A]">
              <span>Consultar activos</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Servicio Social */}
          <Link
            href="/expedientes?programa=SS&estatus=Activo"
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Servicio Social (SS)
                </span>
                <p className="text-3xl font-black text-emerald-600 mt-1">
                  {data.totalSS}
                </p>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <GraduationCap size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-700">
              <span>{Math.round((data.totalSS / (data.totalActivos || 1)) * 100)}% del padrón activo</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Prácticas Profesionales */}
          <Link
            href="/expedientes?programa=PP&estatus=Activo"
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Prácticas (PP)
                </span>
                <p className="text-3xl font-black text-amber-600 mt-1">
                  {data.totalPP}
                </p>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Briefcase size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-700">
              <span>{Math.round((data.totalPP / (data.totalActivos || 1)) * 100)}% del padrón activo</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Concluidos / Eficiencia Terminal */}
          <Link
            href="/expedientes?estatus=Terminado"
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-600 hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Acreditados
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-black text-indigo-700">{data.totalTerminados}</p>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp size={12} /> {data.tasaExito}% éxito
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <CheckCircle2 size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 group-hover:text-indigo-700">
              <span>Ver egresados y constancias</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

      {/* SECCIÓN ANALÍTICA: MODALIDADES, PLANTELES Y CARRERAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Modalidad y Entorno de Trabajo */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            Modalidad de Trabajo (Activos)
          </h3>
          <div className="space-y-3">
            {Object.entries(data.modalidades).map(([modalidad, total]) => {
              const porcentaje = data.totalActivos > 0 ? Math.round((total / data.totalActivos) * 100) : 0;
              return (
                <div key={modalidad} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{modalidad}</span>
                    <span className="text-slate-500">{total} ({porcentaje}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        modalidad === 'Presencial'
                          ? 'bg-[#002B7A]'
                          : modalidad === 'Mixta'
                          ? 'bg-[#D59F0F]'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Útil para planificar rotación de escritorios y sedes del PUIC.
          </p>
        </div>

        {/* Widget 2: Top Planteles / Facultades UNAM */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 size={16} className="text-[#002B7A]" />
            Principales Planteles UNAM
          </h3>
          <div className="space-y-3">
            {data.topPlanteles.length === 0 ? (
              <p className="text-xs text-slate-400">Sin datos registrados aún.</p>
            ) : (
              data.topPlanteles.map(([plantel, cant]) => {
                const pct = Math.round((cant / (data.totalExpedientes || 1)) * 100);
                return (
                  <div key={plantel} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-800 truncate max-w-[200px]" title={plantel}>
                        {plantel}
                      </span>
                      <span className="font-bold text-slate-700">{cant}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#002B7A] h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Widget 3: Top Carreras */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen size={16} className="text-[#D59F0F]" />
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
                      <span className="text-slate-800 truncate max-w-[200px]" title={carrera}>
                        {carrera}
                      </span>
                      <span className="font-bold text-slate-700">{cant}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#D59F0F] h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* SEMÁFORO DE VENCIMIENTOS Y GESTIÓN DE RIESGO */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <AlertOctagon size={18} />
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Semáforo de Vencimientos y Liberaciones Pendientes
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Alumnos con fecha tentativa de término vencida o que concluyen dentro de los próximos 30 días.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              {data.vencidos.length} vencidos
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {data.proximosAVencer.length} por vencer
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0A1E42] text-xs uppercase text-slate-200 border-b border-blue-950">
              <tr>
                <th className="p-4">Clave / No. Cuenta</th>
                <th className="p-4">Alumno</th>
                <th className="p-4">Programa</th>
                <th className="p-4">Carrera</th>
                <th className="p-4">Término Estimado</th>
                <th className="p-4 text-center">Diagnóstico</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.vencidos.length === 0 && data.proximosAVencer.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
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
                    <tr key={exp.idExpediente} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="font-mono font-bold text-xs text-slate-800">{exp.clave}</div>
                        <div className="font-mono text-[11px] text-slate-400">Cta: {exp.numeroCuenta}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900 text-xs">
                          {exp.nombre} {exp.apPaterno} {exp.apMaterno}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            exp.tipoPrograma === 'SS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {exp.tipoPrograma === 'SS' ? 'Servicio Social' : 'Prácticas'}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-600 truncate max-w-[180px]">
                        {exp.carrera?.nombre ?? 'Sin asignar'}
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-700">
                        {ft.toLocaleDateString('es-MX', { timeZone: 'UTC' })}
                      </td>
                      <td className="p-4 text-center">
                        {yaVencio ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                            Venció hace {Math.abs(diasRestantes)} días
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock size={12} /> Faltan {diasRestantes} días
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/expedientes/${exp.idExpediente}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#002B7A] hover:underline"
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