import { Suspense } from 'react';
import { getExpedientes } from '@/actions/expedientes';
import ExpedientesDirectory from '@/components/expedientes/ExpedientesDirectory';

export default async function ExpedientesPage() {
  const expedientes = await getExpedientes();

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Cargando directorio institucional...</div>}>
      <ExpedientesDirectory expedientes={expedientes} />
    </Suspense>
  );
}
