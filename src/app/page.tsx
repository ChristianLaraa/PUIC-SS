import { getDashboardData } from '@/actions/expedientes';
import Link from 'next/link';

export default async function DashboardPage() {
  const { totalActivos, totalSS, totalPP, totalTerminados, alertas } = await getDashboardData();
  const hoy = new Date();

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Panel de Control Institucional
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supervisión general de prestadores de Servicio Social y Prácticas Profesionales.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/expedientes/nuevo"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            + Nuevo Registro
          </Link>
          <Link
            href="/expedientes"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            Ver Directorio
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Activos
          </span>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalActivos}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Servicio Social (SS)
          </span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{totalSS}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Prácticas (PP)
          </span>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{totalPP}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Concluidos
          </span>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">{totalTerminados}</p>
        </div>
      </div>

      {/* Semáforo de Vencimientos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Semáforo de Vencimientos (Próximos 30 días o Vencidos)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Alumnos activos con fecha límite cercana para entrega de informe final.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
            {alertas.length} {alertas.length === 1 ? 'pendiente' : 'pendientes'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4">Clave</th>
                <th className="p-4">Alumno</th>
                <th className="p-4">Programa</th>
                <th className="p-4">Carrera</th>
                <th className="p-4">Fecha Estimada</th>
                <th className="p-4 text-center">Diagnóstico</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alertas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No hay expedientes próximos a vencer. Todos los registros están al corriente.
                  </td>
                </tr>
              ) : (
                alertas.map((exp) => {
                  const fechaTent = new Date(exp.fechaTentativa);
                  const diasRestantes = Math.ceil(
                    (fechaTent.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const yaVencio = diasRestantes < 0;

                  return (
                    <tr key={exp.idExpediente} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-semibold text-slate-700">{exp.clave}</td>
                      <td className="p-4 font-medium text-slate-900">{exp.nombreAlumno}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            exp.tipoPrograma === 'SS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {exp.tipoPrograma === 'SS' ? 'Servicio Social' : 'Prácticas'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{exp.carrera?.nombre ?? 'Sin asignar'}</td>
                      <td className="p-4 text-slate-700 font-medium">
                        {fechaTent.toLocaleDateString('es-MX', { timeZone: 'UTC' })}
                      </td>
                      <td className="p-4 text-center">
                        {yaVencio ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                            Venció hace {Math.abs(diasRestantes)} días
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Faltan {diasRestantes} días
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/expedientes/${exp.idExpediente}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-xs underline"
                        >
                          Ver Detalle →
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