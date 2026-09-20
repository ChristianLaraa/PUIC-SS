'use client';

import { useState, useTransition } from 'react';
import { 
  actualizarSeguimientoDocumental, 
  marcarComoConcluido, 
  registrarDeclinacion 
} from '@/actions/expedientes';
import { CheckCircle2, FileText, AlertTriangle, ExternalLink } from 'lucide-react';

interface SeguimientoProps {
  idExpediente: number;
  estatusActual: string;
  seguimiento: {
    cartaAceptacion: boolean;
    informeFinalUrl: string | null;
    cartaTermino: boolean;
    declinacionObs: string | null;
    preRegistro: Date | null;
    registro: Date | null;
  } | null;
}

export default function SeguimientoPanel({ idExpediente, estatusActual, seguimiento }: SeguimientoProps) {
  const [isPending, startTransition] = useTransition();

  // Estados locales para el checklist
  const [cartaAceptacion, setCartaAceptacion] = useState(seguimiento?.cartaAceptacion ?? false);
  const [informeUrl, setInformeUrl] = useState(seguimiento?.informeFinalUrl ?? '');
  const [cartaTermino, setCartaTermino] = useState(seguimiento?.cartaTermino ?? false);
  const [mensajeChecklist, setMensajeChecklist] = useState('');

  // Estados para declinación
  const [mostrarDeclinacion, setMostrarDeclinacion] = useState(false);
  const [motivoBaja, setMotivoBaja] = useState(seguimiento?.declinacionObs ?? '');

  function handleGuardarChecklist(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await actualizarSeguimientoDocumental(idExpediente, {
        cartaAceptacion,
        informeFinalUrl: informeUrl,
        cartaTermino,
      });
      setMensajeChecklist('Checklist documental actualizado correctamente.');
      setTimeout(() => setMensajeChecklist(''), 3500);
    });
  }

  function handleConcluir() {
    if (!confirm('¿Confirmas marcar este expediente como Terminado?')) return;
    const hoy = new Date().toISOString().split('T')[0];
    startTransition(async () => {
      await marcarComoConcluido(idExpediente, hoy);
    });
  }

  function handleDeclinar(e: React.FormEvent) {
    e.preventDefault();
    if (!motivoBaja.trim()) {
      alert('Debes ingresar una observación o motivo de declinación.');
      return;
    }
    startTransition(async () => {
      await registrarDeclinacion(idExpediente, motivoBaja);
      setMostrarDeclinacion(false);
    });
  }

  const esEditable = estatusActual === 'Activo';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna izquierda: Checklist de documentos */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E2DACB] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2DACB] pb-4">
          <div className="flex items-center gap-2">
            <FileText className="text-[#C68A2C]" size={20} />
            <h2 className="font-serif text-lg font-bold text-[#0A1E42]">Control Documental Institucional</h2>
          </div>
          {mensajeChecklist && (
            <span className="text-xs text-[#008A7C] font-semibold">{mensajeChecklist}</span>
          )}
        </div>

        <form onSubmit={handleGuardarChecklist} className="space-y-5">
          <div className="space-y-3">
            {/* Checkbox: Carta de Aceptación */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E2DACB] hover:bg-[#FBF9F5] cursor-pointer transition-colors">
              <input
                type="checkbox"
                disabled={!esEditable || isPending}
                checked={cartaAceptacion}
                onChange={(e) => setCartaAceptacion(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#E2DACB] text-[#0A1E42] focus:ring-[#C68A2C]"
              />
              <div>
                <span className="text-sm font-serif font-bold text-[#0A1E42]">1. Carta de Aceptación Oficial</span>
                <p className="text-xs text-[#5C6779]">Documento sellado y avalado por el PUIC / entidad receptora.</p>
              </div>
            </label>

            {/* Input: Enlace al Informe Final */}
            <div className="p-3.5 rounded-xl border border-[#E2DACB] space-y-2 bg-[#FBF9F5]/60">
              <span className="text-sm font-serif font-bold text-[#0A1E42]">2. Informe Final de Actividades</span>
              <p className="text-xs text-[#5C6779]">Liga en la nube (Drive institucional, repositorio o PDF) con el informe.</p>
              <div className="flex gap-2 items-center">
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  disabled={!esEditable || isPending}
                  value={informeUrl}
                  onChange={(e) => setInformeUrl(e.target.value)}
                  className="flex-1 border border-[#E2DACB] rounded-xl p-2.5 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] outline-none"
                />
                {informeUrl && (
                  <a
                    href={informeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-[#0A1E42] hover:text-[#C68A2C] border border-[#E2DACB] bg-white rounded-xl hover:bg-[#FBF9F5] transition-colors"
                    title="Abrir enlace"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Checkbox: Carta de Término */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E2DACB] hover:bg-[#FBF9F5] cursor-pointer transition-colors">
              <input
                type="checkbox"
                disabled={!esEditable || isPending}
                checked={cartaTermino}
                onChange={(e) => setCartaTermino(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#E2DACB] text-[#0A1E42] focus:ring-[#C68A2C]"
              />
              <div>
                <span className="text-sm font-serif font-bold text-[#0A1E42]">3. Carta de Término y Liberación</span>
                <p className="text-xs text-[#5C6779]">Constancia institucional que avala las 480 horas reglamentarias.</p>
              </div>
            </label>
          </div>

          {esEditable && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 bg-[#0A1E42] hover:bg-[#06132A] text-white font-serif font-bold text-xs rounded-xl border-b-2 border-[#C68A2C] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isPending ? 'Guardando...' : 'Guardar Checklist Documental'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Columna derecha: Acciones de Estatus */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2DACB] shadow-xs space-y-6 flex flex-col justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#0A1E42] border-b border-[#E2DACB] pb-4">Gestión de Estatus</h2>
          <div className="mt-4 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C6779]">Estatus del Expediente</span>
              <p className="font-serif text-lg font-bold mt-1 text-[#0A1E42]">{estatusActual}</p>
            </div>

            {seguimiento?.declinacionObs && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-xs font-bold text-red-700">Observación de Declinación:</span>
                <p className="text-xs text-red-600 mt-1">{seguimiento.declinacionObs}</p>
              </div>
            )}
          </div>
        </div>

        {esEditable && (
          <div className="space-y-3 pt-6 border-t border-[#E2DACB]">
            <button
              onClick={handleConcluir}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#008A7C] hover:bg-[#007367] text-white font-serif text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <CheckCircle2 size={16} />
              Acreditar y Concluir Expediente
            </button>

            {!mostrarDeclinacion ? (
              <button
                onClick={() => setMostrarDeclinacion(true)}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <AlertTriangle size={16} />
                Registrar Declinación / Baja
              </button>
            ) : (
              <form onSubmit={handleDeclinar} className="space-y-2 p-3 bg-red-50 rounded-xl border border-red-200">
                <label className="text-xs font-bold text-red-800 block">Motivo de la baja:</label>
                <textarea
                  rows={2}
                  required
                  value={motivoBaja}
                  onChange={(e) => setMotivoBaja(e.target.value)}
                  placeholder="Ej. Abandono voluntario por cambio de horario laboral..."
                  className="w-full text-xs p-2 border border-red-300 rounded-lg outline-none bg-white"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 rounded-lg"
                  >
                    Confirmar Baja
                  </button>
                  <button
                    type="button"
                    onClick={() => setMostrarDeclinacion(false)}
                    className="px-2.5 py-1.5 border border-slate-300 bg-white text-slate-700 text-xs rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}