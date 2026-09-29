import { Suspense } from 'react';
import { getPlantelesStats } from '@/actions/planteles';
import PlantelesDirectory from '@/components/planteles/PlantelesDirectory';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Escuelas y Planteles | PUIC UNAM',
  description: 'Gestión y administración de facultades, escuelas de la UNAM e instituciones de educación superior externas.',
};

export default async function PlantelesPage() {
  const stats = await getPlantelesStats();

  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
          Cargando catálogo de escuelas y planteles...
        </div>
      }
    >
      <PlantelesDirectory planteles={stats.planteles} stats={stats} />
    </Suspense>
  );
}
