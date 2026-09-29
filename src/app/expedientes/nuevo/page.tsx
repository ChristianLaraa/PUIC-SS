import ExpedienteForm from '@/components/expedientes/ExpedienteForm';
import Link from 'next/link';
import { Award, ArrowLeft } from 'lucide-react';
import { getPlanteles } from '@/actions/planteles';
import { obtenerSiguienteNumeroFolio } from '@/actions/expedientes';

export default async function NuevoExpedientePage() {
  const [planteles, siguienteNumero] = await Promise.all([
    getPlanteles(),
    obtenerSiguienteNumeroFolio(),
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2DACB] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#9E6B1D] bg-[#C68A2C]/15 px-2 py-0.5 rounded border border-[#C68A2C]/30">
              <Award size={11} /> Registro Oficial • PUIC UNAM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1E42]">Alta de Alumno</h1>
          <p className="text-xs sm:text-sm italic text-[#5C6779]">Captura de nuevo expediente institucional para Servicio Social o Prácticas (UNAM o Institución Externa).</p>
        </div>
        <Link
          href="/expedientes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1E42] hover:text-[#C68A2C] transition-colors p-2 rounded-lg bg-white border border-[#E2DACB] shadow-2xs self-start sm:self-auto"
        >
          <ArrowLeft size={14} />
          Volver a expedientes
        </Link>
      </div>

      <ExpedienteForm plantelesIniciales={planteles} siguienteNumeroInicial={siguienteNumero} />
    </div>
  );
}