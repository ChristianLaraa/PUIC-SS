'use client';

import { useState, useTransition } from 'react';
import { 
  actualizarSeguimientoDocumental, 
  marcarComoConcluido, 
  registrarDeclinacion 
} from '@/actions/expedientes';
import { 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  ExternalLink, 
  Cloud, 
  Hash, 
  UserCheck, 
  Save,
  CheckSquare,
  FileCheck2,
  Clock
} from 'lucide-react';

interface SeguimientoProps {
  idExpediente: number;
  estatusActual: string;
  seguimiento: {
    // 1. Carta de Presentación
    cartaPresentacionUrl?: string | null;
    cartaPresentacionFolio?: string | null;

    // 2. Carta de Aceptación
    cartaAceptacionUrl?: string | null;
    cartaAceptacionRecogida?: boolean;
    cartaAceptacionFolio?: string | null;
    cartaAceptacion?: boolean;

    // 3. Informe Final
    informeFinalUrl?: string | null;
    aplicaInformeFinal?: boolean;
    informeFinalFolio?: string | null;

    // 4. Carta de Término
    cartaTerminoUrl?: string | null;
    cartaTerminoFolio?: string | null;
    cartaTermino?: boolean;

    declinacionObs?: string | null;
    preRegistro?: Date | null;
    registro?: Date | null;
  } | null;
}

export default function SeguimientoPanel({ idExpediente, estatusActual, seguimiento }: SeguimientoProps) {
  const [isPending, startTransition] = useTransition();

  // 1. Carta de Presentación
  const [cartaPresentacionUrl, setCartaPresentacionUrl] = useState(seguimiento?.cartaPresentacionUrl ?? '');
  const [cartaPresentacionFolio, setCartaPresentacionFolio] = useState(seguimiento?.cartaPresentacionFolio ?? '');

  // 2. Carta de Aceptación
  const [cartaAceptacionUrl, setCartaAceptacionUrl] = useState(seguimiento?.cartaAceptacionUrl ?? '');
  const [cartaAceptacionRecogida, setCartaAceptacionRecogida] = useState(seguimiento?.cartaAceptacionRecogida ?? (seguimiento?.cartaAceptacion ?? false));
  const [cartaAceptacionFolio, setCartaAceptacionFolio] = useState(seguimiento?.cartaAceptacionFolio ?? '');

  // 3. Informe Final
  const [informeFinalUrl, setInformeFinalUrl] = useState(seguimiento?.informeFinalUrl ?? '');
  const [aplicaInformeFinal, setAplicaInformeFinal] = useState(seguimiento?.aplicaInformeFinal ?? true);
  const [informeFinalFolio, setInformeFinalFolio] = useState(seguimiento?.informeFinalFolio ?? '');

  // 4. Carta de Término
  const [cartaTerminoUrl, setCartaTerminoUrl] = useState(seguimiento?.cartaTerminoUrl ?? '');
  const [cartaTerminoFolio, setCartaTerminoFolio] = useState(seguimiento?.cartaTerminoFolio ?? '');

  const [mensajeChecklist, setMensajeChecklist] = useState('');

  // Estados para declinación
  const [mostrarDeclinacion, setMostrarDeclinacion] = useState(false);
  const [motivoBaja, setMotivoBaja] = useState(seguimiento?.declinacionObs ?? '');

  function handleGuardarControlDocumental(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await actualizarSeguimientoDocumental(idExpediente, {
        cartaPresentacionUrl,
        cartaPresentacionFolio,
        cartaAceptacionUrl,
        cartaAceptacionRecogida,
        cartaAceptacionFolio,
        cartaAceptacion: cartaAceptacionRecogida || Boolean(cartaAceptacionUrl),
        informeFinalUrl,
        aplicaInformeFinal,
        informeFinalFolio,
        cartaTerminoUrl,
        cartaTerminoFolio,
        cartaTermino: Boolean(cartaTerminoUrl || cartaTerminoFolio),
      });
      setMensajeChecklist('Control documental actualizado exitosamente en el expediente.');
      setTimeout(() => setMensajeChecklist(''), 4000);
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

  // Métricas rápidas de avance documental
  const docsCompletados = [
    Boolean(cartaPresentacionUrl || cartaPresentacionFolio),
    Boolean(cartaAceptacionRecogida || cartaAceptacionUrl || cartaAceptacionFolio),
    Boolean(!aplicaInformeFinal || informeFinalUrl || informeFinalFolio),
    Boolean(cartaTerminoUrl || cartaTerminoFolio),
  ].filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna Izquierda (2 Cols): Flujo Documental Institucional de 4 Fases */}
      <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-2xl border border-[#E2DACB] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E2DACB] pb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C68A2C]/15 text-[#9E6B1D]">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0A1E42]">Control Documental Institucional</h2>
              <p className="text-xs text-[#5C6779] italic">
                Flujo reglamentario de acreditación, ligas en OneDrive y folios oficiales de archivo.
              </p>
            </div>
          </div>
          {mensajeChecklist && (
            <span className="text-xs text-[#008A7C] font-bold bg-[#E0F2F1] px-3 py-1.5 rounded-lg border border-[#008A7C]/30 animate-fadeIn">
              ✓ {mensajeChecklist}
            </span>
          )}
        </div>

        <form onSubmit={handleGuardarControlDocumental} className="space-y-6">
          <div className="space-y-5">
            
            {/* FASE 1: CARTA DE PRESENTACIÓN */}
            <div className="p-4 sm:p-5 rounded-2xl border border-[#E2DACB] bg-[#FBF9F5]/70 space-y-3 relative overflow-hidden transition-all hover:border-[#0A1E42]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#0A1E42] text-white text-xs flex items-center justify-center font-bold shadow-xs">
                    1
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1E42]">Carta de Presentación</h3>
                    <p className="text-[11px] text-[#5C6779]">
                      Documento oficial expedido por la escuela/facultad de procedencia.
                    </p>
                  </div>
                </div>
                {Boolean(cartaPresentacionUrl || cartaPresentacionFolio) && (
                  <span className="text-[10px] font-bold text-[#008A7C] bg-[#008A7C]/15 px-2 py-0.5 rounded-full border border-[#008A7C]/30 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Registrada
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                {/* Cuadro de texto para Link de Microsoft OneDrive */}
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-[11px] font-bold text-[#0A1E42] uppercase flex items-center gap-1">
                    <Cloud size={13} className="text-[#008A7C]" />
                    <span>Enlace Microsoft OneDrive</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="url"
                      placeholder="https://unam-my.sharepoint.com/... o enlace de OneDrive"
                      disabled={!esEditable || isPending}
                      value={cartaPresentacionUrl}
                      onChange={(e) => setCartaPresentacionUrl(e.target.value)}
                      className="w-full border border-[#E2DACB] rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] outline-none transition-all placeholder:text-slate-400"
                    />
                    {cartaPresentacionUrl && (
                      <a
                        href={cartaPresentacionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#0A1E42] hover:text-[#C68A2C] border border-[#E2DACB] bg-white rounded-xl hover:bg-[#FBF9F5] transition-colors shrink-0 shadow-2xs"
                        title="Abrir enlace en OneDrive"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Cuadro de texto para Folio */}
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-bold text-[#0A1E42] uppercase flex items-center gap-1">
                    <Hash size={13} className="text-[#C68A2C]" />
                    <span>Folio Documental</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. CP-2026-0042"
                    disabled={!esEditable || isPending}
                    value={cartaPresentacionFolio}
                    onChange={(e) => setCartaPresentacionFolio(e.target.value)}
                    className="w-full border border-[#E2DACB] rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] outline-none font-mono font-bold text-[#0A1E42] transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>

            {/* FASE 2: CARTA DE ACEPTACIÓN */}
            <div className="p-4 sm:p-5 rounded-2xl border border-[#E2DACB] bg-[#FBF9F5]/70 space-y-3 relative overflow-hidden transition-all hover:border-[#0A1E42]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#C68A2C] text-white text-xs flex items-center justify-center font-bold shadow-xs">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1E42]">Carta de Aceptación Oficial</h3>
                    <p className="text-[11px] text-[#5C6779]">
                      Constancia formal emitida por el PUIC que avala la incorporación del alumno.
                    </p>
                  </div>
                </div>

                {/* Check si el alumno ya fue por ese documento */}
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2DACB] bg-white hover:bg-[#F5F0E6] cursor-pointer transition-colors self-start sm:self-auto shadow-2xs">
                  <input
                    type="checkbox"
                    disabled={!esEditable || isPending}
                    checked={cartaAceptacionRecogida}
                    onChange={(e) => setCartaAceptacionRecogida(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E2DACB] text-[#0A1E42] focus:ring-[#C68A2C] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#0A1E42] flex items-center gap-1">
                    <UserCheck size={14} className={cartaAceptacionRecogida ? 'text-[#008A7C]' : 'text-slate-400'} />
                    El alumno ya recogió el documento
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                {/* Cuadro de texto para Link de Microsoft OneDrive */}
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-[11px] font-bold text-[#0A1E42] uppercase flex items-center gap-1">
                    <Cloud size={13} className="text-[#008A7C]" />
                    <span>Enlace Microsoft OneDrive</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="url"
                      placeholder="https://unam-my.sharepoint.com/... o enlace de OneDrive"
                      disabled={!esEditable || isPending}
                      value={cartaAceptacionUrl}
                      onChange={(e) => setCartaAceptacionUrl(e.target.value)}
                      className="w-full border border-[#E2DACB] rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] outline-none transition-all placeholder:text-slate-400"
                    />
                    {cartaAceptacionUrl && (
                      <a
                        href={cartaAceptacionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#0A1E42] hover:text-[#C68A2C] border border-[#E2DACB] bg-white rounded-xl hover:bg-[#FBF9F5] transition-colors shrink-0 shadow-2xs"
                        title="Abrir enlace en OneDrive"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Cuadro de texto para Folio */}
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-bold text-[#0A1E42] uppercase flex items-center gap-1">
                    <Hash size={13} className="text-[#C68A2C]" />
                    <span>Folio Documental</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. CA-PUIC-2026-015"
                    disabled={!esEditable || isPending}
                    value={cartaAceptacionFolio}
                    onChange={(e) => setCartaAceptacionFolio(e.target.value)}
                    className="w-full border border-[#E2DACB] rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] outline-none font-mono font-bold text-[#0A1E42] transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>

            {/* FASE 3: INFORME FINAL */}
            <div className="p-4 sm:p-5 rounded-2xl border border-[#E2DACB] bg-[#FBF9F5]/70 space-y-3 relative overflow-hidden transition-all hover:border-[#0A1E42]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#008A7C] text-white text-xs flex items-center justify-center font-bold shadow-xs">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1E42]">Informe Final de Actividades</h3>
                    <p className="text-[11px] text-[#5C6779]">
                      Memoria técnica y reporte de actividades elaborado por el prestador.
                    </p>
                  </div>
                </div>

                {/* Check si el alumno sí aplica para esto */}
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2DACB] bg-white hover:bg-[#F5F0E6] cursor-pointer transition-colors self-start sm:self-auto shadow-2xs">
                  <input
                    type="checkbox"
                    disabled={!esEditable || isPending}
                    checked={aplicaInformeFinal}
                    onChange={(e) => setAplicaInformeFinal(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E2DACB] text-[#008A7C] focus:ring-[#008A7C] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#0A1E42] flex items-center gap-1">
                    <CheckSquare size={14} className={aplicaInformeFinal ? 'text-[#008A7C]' : 'text-slate-400'} />
                    {aplicaInformeFinal ? 'El alumno sí aplica para informe final' : 'No aplica / Exento para este programa'}
                  </span>
                </label>
              </div>

              {aplicaInformeFinal ? (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                  {/* Cuadro de texto para Link de Microsoft OneDrive */}
                  <div className="sm:col-span-8 space-y-1">
                    <label className="text-[11px] font-bold text-[#0A1E42] uppercase flex items-center gap-1">
                      <Cloud size={13} className="text-[#008A7C]" />
                      <span>Enlace Microsoft OneDrive</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="url"
                        placeholder="https://unam-my.sharepoint.com/... o enlace de OneDrive"
                        disabled={!esEditable || isPending}
                        value={informeFinalUrl}
                        onChange={(e) => setInformeFinalUrl(e.target.value)}
                        className="w-full border border-[#E2DACB] rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] outline-none transition-all placeholder:text-slate-400"
                      />
                      {informeFinalUrl && (
                        <a
                          href={informeFinalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#0A1E42] hover:text-[#C68A2C] border border-[#E2DACB] bg-white rounded-xl hover:bg-[#FBF9F5] transition-colors shrink-0 shadow-2xs"
                          title="Abrir enlace en OneDrive"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Cuadro de texto para Folio */}
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[11px] font-bold text-[#0A1E42] uppercase flex items-center gap-1">
                      <Hash size={13} className="text-[#C68A2C]" />
                      <span>Folio Documental</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. IF-PUIC-2026-089"
                      disabled={!esEditable || isPending}
                      value={informeFinalFolio}
                      onChange={(e) => setInformeFinalFolio(e.target.value)}
                      className="w-full border border-[#E2DACB] rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] outline-none font-mono font-bold text-[#0A1E42] transition-all placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic">
                  Este expediente está marcado como no aplicable para entrega de informe final según los criterios del programa.
                </div>
              )}
            </div>

            {/* FASE 4: CARTA DE TÉRMINO */}
            <div className="p-4 sm:p-5 rounded-2xl border border-[#E2DACB] bg-[#FBF9F5]/70 space-y-3 relative overflow-hidden transition-all hover:border-[#0A1E42]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#0A1E42] text-white text-xs flex items-center justify-center font-bold shadow-xs">
                    4
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1E42]">Carta de Término y Liberación</h3>
                    <p className="text-[11px] text-[#5C6779]">
                      Constancia definitiva expedida por el PUIC que avala las horas reglamentarias concluidas.
                    </p>
                  </div>
                </div>
                {Boolean(cartaTerminoUrl || cartaTerminoFolio) && (
                  <span className="text-[10px] font-bold text-[#008A7C] bg-[#008A7C]/15 px-2 py-0.5 rounded-full border border-[#008A7C]/30 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Emitida
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                {/* Cuadro de texto para Link de Microsoft OneDrive */}
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-[11px] font-bold text-[#0A1E42] uppercase flex items-center gap-1">
                    <Cloud size={13} className="text-[#008A7C]" />
                    <span>Enlace Microsoft OneDrive</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="url"
                      placeholder="https://unam-my.sharepoint.com/... o enlace de OneDrive"
                      disabled={!esEditable || isPending}
                      value={cartaTerminoUrl}
                      onChange={(e) => setCartaTerminoUrl(e.target.value)}
                      className="w-full border border-[#E2DACB] rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] outline-none transition-all placeholder:text-slate-400"
                    />
                    {cartaTerminoUrl && (
                      <a
                        href={cartaTerminoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#0A1E42] hover:text-[#C68A2C] border border-[#E2DACB] bg-white rounded-xl hover:bg-[#FBF9F5] transition-colors shrink-0 shadow-2xs"
                        title="Abrir enlace en OneDrive"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Cuadro de texto para Folio */}
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-bold text-[#0A1E42] uppercase flex items-center gap-1">
                    <Hash size={13} className="text-[#C68A2C]" />
                    <span>Folio Documental</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. CT-PUIC-2026-048"
                    disabled={!esEditable || isPending}
                    value={cartaTerminoFolio}
                    onChange={(e) => setCartaTerminoFolio(e.target.value)}
                    className="w-full border border-[#E2DACB] rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] outline-none font-mono font-bold text-[#0A1E42] transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>

          </div>

          {esEditable && (
            <div className="flex items-center justify-between pt-3 border-t border-[#E2DACB]">
              <span className="text-[11px] text-[#5C6779]">
                Los cambios se vinculan de manera permanente al historial del expediente.
              </span>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0A1E42] hover:bg-[#06132A] text-white font-bold text-xs rounded-xl border-b-2 border-[#C68A2C] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Save size={15} className="text-[#DF9F38]" />
                <span>{isPending ? 'Guardando cambios...' : 'Guardar Control Documental'}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Columna Derecha (1 Col): Gestión de Estatus y Avance */}
      <div className="space-y-6">
        
        {/* Tarjeta de Estatus y Conclusión */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2DACB] shadow-xs space-y-5">
          <div className="border-b border-[#E2DACB] pb-3">
            <h3 className="text-sm font-bold text-[#0A1E42] uppercase tracking-wider">
              Estatus del Expediente
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span
                className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                  estatusActual === 'Activo'
                    ? 'bg-[#0A1E42]/10 text-[#0A1E42] border border-[#0A1E42]/30'
                    : estatusActual === 'Terminado'
                    ? 'bg-[#008A7C]/15 text-[#008A7C] border border-[#008A7C]/30'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                ● {estatusActual}
              </span>
              <span className="text-xs font-bold text-[#5C6779]">
                {docsCompletados}/4 Fases
              </span>
            </div>
          </div>

          {/* Barra de progreso de fases documentales */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#5C6779]">
              <span>Avance Documental</span>
              <span>{Math.round((docsCompletados / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-[#F5F0E6] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#008A7C] rounded-full transition-all duration-300"
                style={{ width: `${(docsCompletados / 4) * 100}%` }}
              />
            </div>
          </div>

          {seguimiento?.declinacionObs && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-rose-800 block">Motivo de Declinación:</span>
              <p className="text-xs text-rose-700 leading-relaxed">{seguimiento.declinacionObs}</p>
            </div>
          )}

          {esEditable && (
            <div className="space-y-3 pt-3 border-t border-[#E2DACB]">
              <button
                type="button"
                onClick={handleConcluir}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#008A7C] hover:bg-[#007367] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs border-b-2 border-[#005f55]"
              >
                <FileCheck2 size={16} />
                <span>Acreditar y Concluir Expediente</span>
              </button>

              {!mostrarDeclinacion ? (
                <button
                  type="button"
                  onClick={() => setMostrarDeclinacion(true)}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <AlertTriangle size={15} />
                  <span>Registrar Declinación / Baja</span>
                </button>
              ) : (
                <div className="space-y-2 p-3.5 bg-rose-50 rounded-xl border border-rose-200">
                  <label className="text-xs font-bold text-rose-800 block">
                    Motivo u observación de baja:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={motivoBaja}
                    onChange={(e) => setMotivoBaja(e.target.value)}
                    placeholder="Ej. Declinación voluntaria por cambio de adscripción..."
                    className="w-full text-xs p-2.5 border border-rose-300 rounded-xl outline-none bg-white text-slate-800"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDeclinar}
                      disabled={isPending}
                      className="flex-1 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold py-2 rounded-xl"
                    >
                      Confirmar Baja
                    </button>
                    <button
                      type="button"
                      onClick={() => setMostrarDeclinacion(false)}
                      className="px-3 py-2 border border-slate-300 bg-white text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tarjeta de Soporte Institucional */}
        <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E2DACB] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0A1E42]">
            <Clock size={15} className="text-[#C68A2C]" />
            <span>Lineamientos de Almacenamiento</span>
          </div>
          <p className="text-[11px] text-[#5C6779] leading-relaxed">
            Se sugiere alojar los archivos en el repositorio oficial de Microsoft OneDrive/SharePoint de la UNAM bajo la nomenclatura estandarizada del PUIC.
          </p>
        </div>

      </div>
    </div>
  );
}