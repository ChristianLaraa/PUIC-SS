import Link from 'next/link';

export default function ExpedientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expedientes Registrados</h1>
          <p className="text-sm text-slate-500">Listado general de alumnos en el programa.</p>
        </div>
        <Link
          href="/expedientes/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          + Nuevo Registro
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-600 font-medium">Módulo de expedientes cargado con éxito.</p>
      </div>
    </div>
  );
}
