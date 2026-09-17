import ExpedienteForm from '@/components/expedientes/ExpedienteForm';
import Link from 'next/link';

export default function NuevoExpedientePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alta de Alumno</h1>
          <p className="text-sm text-slate-500">Captura de nuevo expediente institucional para SS o PP.</p>
        </div>
        <Link
          href="/expedientes"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Volver a expedientes
        </Link>
      </div>

      <ExpedienteForm />
    </div>
  );
}