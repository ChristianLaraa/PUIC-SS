'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  FileText,
  X,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { iniciarSesionConCredenciales } from '@/actions/auth';

/**
 * Ribete decorativo con grecas geométricas mesoamericanas (xicalcoliuhqui escalonado)
 * Evoca la arquitectura de Mitla, Teotihuacán y los textiles tradicionales.
 */
function GrecasMesoamericanas({ className = '' }: { className?: string }) {
  return (
    <div className={`overflow-hidden flex items-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-2.5"
        viewBox="0 0 240 10"
        fill="none"
        preserveAspectRatio="repeat-x"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id="greca-puic" width="24" height="10" patternUnits="userSpaceOnUse">
          <path
            d="M0 10V0H12V3H4V7H16V0H24V10H12V7H20V3H8V10H0Z"
            fill="currentColor"
          />
        </pattern>
        <rect width="100%" height="10" fill="url(#greca-puic)" />
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [modalPoliticaAbierto, setModalPoliticaAbierto] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const correoFinal = correo.trim().toLowerCase();
    const passwordFinal = password.trim();

    if (!correoFinal) {
      setError('Por favor ingresa tu correo institucional.');
      return;
    }

    if (!passwordFinal) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await iniciarSesionConCredenciales({
          correo: correoFinal,
          password: passwordFinal,
        });

        if (res?.error) {
          setError(res.error);
        }
      } catch (err: unknown) {
        if (
          err &&
          typeof err === 'object' &&
          'digest' in err &&
          typeof (err as { digest?: string }).digest === 'string' &&
          (err as { digest: string }).digest.includes('NEXT_REDIRECT')
        ) {
          throw err;
        }
        setError('Ocurrió un error inesperado al iniciar sesión.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] paper-canvas flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Tarjeta Principal de Login */}
      <div className="max-w-4xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#E2DACB] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* PANEL IZQUIERDO: Identidad Institucional PUIC & Pueblos Originarios */}
        <div className="lg:col-span-5 bg-[#0A1E42] text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#163670]/60">
          {/* Destellos de fondo */}
          <div className="absolute inset-0 bg-radial from-[#163670]/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#C68A2C]/10 blur-2xl pointer-events-none" />
          <div className="absolute top-10 -left-16 w-44 h-44 rounded-full bg-[#008A7C]/15 blur-2xl pointer-events-none" />

          {/* Encabezado con Logos */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-13 w-13 rounded-full bg-white/10 ring-2 ring-[#C68A2C] p-1.5 flex items-center justify-center shrink-0 shadow-md">
                <Image
                  src="/unam.png"
                  alt="Escudo de la Universidad Nacional Autónoma de México"
                  width={46}
                  height={50}
                  priority
                  className="h-10 w-auto object-contain brightness-110"
                />
              </div>
              <span className="text-[#C68A2C] text-lg font-light">|</span>
              <div className="h-13 w-20 flex items-center justify-center">
                <Image
                  src="/puic.png"
                  alt="Logo oficial del PUIC - UNAM"
                  width={80}
                  height={44}
                  priority
                  className="h-10 w-auto object-contain brightness-110"
                />
              </div>
            </div>

            {/* Greca mesoamericana sutil */}
            <GrecasMesoamericanas className="text-[#C68A2C]/60 my-2" />

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DF9F38] block mb-1">
                Universidad Nacional Autónoma de México
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                Programa Universitario de Estudios de la Diversidad Cultural y la Interculturalidad
              </h1>
              <p className="text-xs text-[#DF9F38] font-medium italic mt-2 leading-relaxed">
                «Una estrategia de investigación y educación superior para un mundo culturalmente diverso»
              </p>
            </div>
          </div>

          {/* Concepto filosófico originario */}
          <div className="relative z-10 my-6 p-4 rounded-xl bg-white/5 border border-[#C68A2C]/20 space-y-1.5">
            <p className="text-[#DF9F38] font-bold text-xs tracking-wide flex items-center gap-1.5">
              <span>✦</span>
              <span className="italic font-serif">In ixtli, in yollotl</span>
              <span className="text-[10px] text-slate-300 font-normal font-sans">(Un rostro, un corazón)</span>
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Gestión académica y seguimiento de Servicio Social y Prácticas Profesionales con pertinencia comunitaria y compromiso intercultural.
            </p>
          </div>

          {/* Pie de Panel Izquierdo */}
          <div className="relative z-10 pt-3 border-t border-[#163670]/60 space-y-2">
            <GrecasMesoamericanas className="text-[#DF9F38]/30" />
            <div className="text-[10px] text-slate-400">
              <span className="font-semibold text-slate-300">Coordinación de Humanidades</span> • PUIC Digital
              <p className="text-[9px] text-slate-400 mt-0.5">
                Av. Río Magdalena 100, La Otra Banda, CDMX • nacionmulticultural.unam.mx
              </p>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: Formulario Limpio de Login */}
        <div className="lg:col-span-7 p-7 sm:p-9 lg:p-11 flex flex-col justify-between bg-white relative">
          
          <div className="space-y-6">
            
            {/* Encabezado del Formulario */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0A1E42]/10 text-[#0A1E42] mb-2">
                <ShieldCheck size={13} className="text-[#008A7C]" />
                <span>Acceso Seguro</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E42] tracking-tight">
                Iniciar Sesión
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ingresa tu correo institucional y contraseña para acceder a la plataforma.
              </p>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0 text-red-500 mt-0.5" />
                <div className="leading-snug">{error}</div>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Campo Correo */}
              <div>
                <label className="block text-xs font-bold text-[#0A1E42] mb-1.5">
                  Correo Electrónico Institucional
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="usuario@unam.mx"
                    disabled={isPending}
                    autoComplete="email"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FBF9F5] border border-[#E2DACB] rounded-xl text-xs sm:text-sm text-[#0E1B2E] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#0A1E42]">
                    Contraseña
                  </label>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isPending}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FBF9F5] border border-[#E2DACB] rounded-xl text-xs sm:text-sm text-[#0E1B2E] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    title={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Botón de Envío */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#0A1E42] hover:bg-[#06132A] text-white font-bold py-3 px-4 rounded-xl shadow-md border-b-2 border-[#C68A2C] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2 group"
              >
                {isPending ? (
                  <>
                    <Loader2 size={17} className="animate-spin text-[#DF9F38]" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </button>
            </form>

            {/* Enlace Discreto a Política de Consulta y Privacidad */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setModalPoliticaAbierto(true)}
                className="inline-flex items-center gap-1.5 text-xs text-[#008A7C] hover:text-[#0A1E42] font-semibold transition-colors cursor-pointer"
              >
                <FileText size={13} />
                <span>Política de Consulta y Protección de Datos</span>
              </button>
            </div>

          </div>

          {/* Pie del Formulario */}
          <div className="pt-5 mt-6 border-t border-[#E2DACB]/80 text-center text-[10.5px] text-slate-400">
            Universidad Nacional Autónoma de México • Coordinación de Humanidades
          </div>
        </div>

      </div>

      {/* MODAL: POLÍTICA DE CONSULTA Y PROTECCIÓN DE DATOS PERSONALES */}
      {modalPoliticaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-[#E2DACB] max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
            
            {/* Cabecera del Modal */}
            <div className="p-5 bg-[#0A1E42] text-white flex items-center justify-between border-b border-[#163670]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#C68A2C]/20 border border-[#C68A2C]/40 text-[#DF9F38]">
                  <Lock size={17} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Aviso de Privacidad y Política de Datos Personales
                  </h3>
                  <p className="text-[11px] text-[#DF9F38]">
                    Universidad Nacional Autónoma de México • PUIC
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalPoliticaAbierto(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Cerrar modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo del Aviso */}
            <div className="p-6 overflow-y-auto text-xs text-[#0E1B2E] space-y-4 leading-relaxed">
              <div className="p-3 bg-[#FBF9F5] border border-[#E2DACB] rounded-xl flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#008A7C] shrink-0 mt-0.5" />
                <p className="text-[11.5px] text-slate-700">
                  La <strong>Universidad Nacional Autónoma de México (UNAM)</strong>, a través del <strong>Programa Universitario de Estudios de la Diversidad Cultural y la Interculturalidad (PUIC)</strong>, es la entidad responsable del tratamiento y resguardo de tus datos personales.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0A1E42] uppercase text-[11px] tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C68A2C]" />
                  1. Finalidad del Tratamiento de Datos
                </h4>
                <p className="text-slate-600 pl-3">
                  Los datos personales recabados mediante este sistema serán utilizados exclusivamente para validar el registro al programa de Servicio Social o Prácticas Profesionales, supervisión de horas y actividades, asignación de coordinadores de investigación y emisión de constancias de acreditación.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0A1E42] uppercase text-[11px] tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C68A2C]" />
                  2. Fundamento Legal
                </h4>
                <p className="text-slate-600 pl-3">
                  El tratamiento de datos se fundamenta en los artículos 6° y 16 de la Constitución Política de los Estados Unidos Mexicanos; la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados (LGPDPPSO); y el Reglamento de Transparencia y Acceso a la Información Pública de la UNAM.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0A1E42] uppercase text-[11px] tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C68A2C]" />
                  3. Ejercicio de Derechos ARCO
                </h4>
                <p className="text-slate-600 pl-3">
                  Tienes derecho a solicitar el Acceso, Rectificación, Cancelación y Oposición al tratamiento de tus datos personales ante la Unidad de Transparencia de la UNAM a través de{' '}
                  <a
                    href="https://www.transparencia.unam.mx"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#008A7C] font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    transparencia.unam.mx <ExternalLink size={10} />
                  </a>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0A1E42] uppercase text-[11px] tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C68A2C]" />
                  4. Confidencialidad
                </h4>
                <p className="text-slate-600 pl-3">
                  La UNAM no realizará transferencias de tus datos personales a terceros sin tu consentimiento previo, salvo excepciones estrictamente contempladas por la ley.
                </p>
              </div>
            </div>

            {/* Pie del Modal */}
            <div className="p-4 bg-[#FBF9F5] border-t border-[#E2DACB] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setModalPoliticaAbierto(false)}
                className="bg-[#0A1E42] hover:bg-[#06132A] text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors cursor-pointer border-b-2 border-[#C68A2C]"
              >
                Entendido y cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
