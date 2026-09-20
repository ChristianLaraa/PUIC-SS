'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { ShieldCheck, School, ArrowRight, AlertCircle, Sparkles, User, Mail, Loader2, Award, Calendar } from 'lucide-react';
import { sincronizarUsuarioInstitucional } from '@/actions/auth';

export default function LoginPage() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (nombreTarget?: string, correoTarget?: string) => {
    setError(null);
    const nombreFinal = (nombreTarget ?? nombre).trim();
    const correoFinal = (correoTarget ?? correo).trim().toLowerCase();

    if (!correoFinal) {
      setError('Por favor ingresa tu correo institucional de la UNAM.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await sincronizarUsuarioInstitucional({
          nombre: nombreFinal || 'Usuario Institucional',
          correo: correoFinal,
        });

        if (res?.error) {
          setError(res.error);
        }
      } catch (err: unknown) {
        // En Next.js redirect() lanza una excepción interna esperada (NEXT_REDIRECT)
        if (
          err &&
          typeof err === 'object' &&
          'digest' in err &&
          typeof (err as { digest?: string }).digest === 'string' &&
          (err as { digest: string }).digest.includes('NEXT_REDIRECT')
        ) {
          throw err;
        }
        setError('Ocurrió un error inesperado durante la autenticación.');
      }
    });
  };

  const handleQuickLogin = (nombreDemo: string, correoDemo: string) => {
    setNombre(nombreDemo);
    setCorreo(correoDemo);
    handleLogin(nombreDemo, correoDemo);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] paper-canvas flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Listón Conmemorativo Oro Ocre Superior en Pantallas Grandes */}
      <div className="fixed top-0 right-12 hidden xl:block z-50 drop-shadow-lg pointer-events-none">
        <div className="bg-[#C68A2C] text-white px-5 pt-3 pb-6 text-center ribbon-475 relative flex flex-col items-center">
          <span className="text-xl font-serif font-black tracking-tight leading-none">
            475+
          </span>
          <span className="text-[9px] uppercase tracking-widest font-sans font-extrabold mt-1">
            Universidad de México
          </span>
          <div className="w-10 h-px bg-white/40 my-1.5" />
          <span className="text-[8px] tracking-tight font-serif italic text-white/95">
            UNAM rumbo al medio milenio
          </span>
        </div>
      </div>

      <div className="max-w-5xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E2DACB] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* PANEL IZQUIERDO: Conmemorativo 475 Años e Identidad del Cartel */}
        <div className="lg:col-span-5 bg-[#0A1E42] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E2DACB]/30">
          {/* Patrón de Fondo y Resplandor Oro */}
          <div className="absolute inset-0 bg-radial from-[#163670]/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#C68A2C]/10 blur-3xl pointer-events-none" />

          {/* Encabezado del Panel Izquierdo */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-white/10 ring-2 ring-[#C68A2C] p-1.5 flex items-center justify-center shrink-0 shadow-lg">
                <Image
                  src="/unam.png"
                  alt="Escudo UNAM"
                  width={48}
                  height={52}
                  priority
                  className="h-11 w-auto object-contain brightness-110"
                />
              </div>
              <span className="text-[#C68A2C] text-xl font-serif">|</span>
              <div className="h-14 w-20 flex items-center justify-center">
                <Image
                  src="/puic.png"
                  alt="Logo PUIC"
                  width={85}
                  height={48}
                  priority
                  className="h-11 w-auto object-contain brightness-110"
                />
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-[#C68A2C]/20 text-[#DF9F38] border border-[#C68A2C]/40">
                <Award size={12} /> Jornadas Académicas
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-white mt-2 leading-tight tracking-tight">
                475 Aniversario de la Universidad de México
              </h1>
              <p className="text-sm font-serif italic text-[#DF9F38] mt-1 font-medium">
                La UNAM y la pluriculturalidad
              </p>
            </div>
          </div>

          {/* Imagen / Grabado de Biblioteca Central del Cartel */}
          <div className="relative z-10 my-6 rounded-xl overflow-hidden border border-[#C68A2C]/30 shadow-lg bg-[#06132A] group">
            <div className="relative h-48 sm:h-56 w-full">
              <Image
                src="/cartel-475.jpg"
                alt="Cartel Conmemorativo 475 Años UNAM - PUIC"
                fill
                className="object-cover object-bottom filter contrast-105 brightness-95 group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E42] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-xs">
                <span className="bg-[#C68A2C] text-[#0A1E42] font-bold text-[9px] uppercase px-2 py-0.5 rounded tracking-wider inline-block mb-1">
                  Mural Central CU
                </span>
                <p className="text-[11px] text-white/90 font-serif leading-tight">
                  Programa Universitario de Estudios de la Diversidad Cultural y la Interculturalidad
                </p>
              </div>
            </div>
          </div>

          {/* Pie del Panel Izquierdo */}
          <div className="relative z-10 pt-3 border-t border-[#163670]/60 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-2 text-[#DF9F38] text-[11px] font-semibold">
              <Calendar size={13} />
              <span>Ciclo Operativo Activo • Coordinación de Humanidades</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Av. Río Magdalena 100, Col. La Otra Banda, CDMX • www.nacionmulticultural.unam.mx
            </p>
          </div>
        </div>

        {/* PANEL DERECHO: Formulario de Acceso y Perfiles Rápidos */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            
            {/* Título del Formulario */}
            <div className="border-b border-[#E2DACB] pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0A1E42] text-white">
                  Sistema PUIC
                </span>
                <span className="text-xs text-[#9E6B1D] font-serif font-semibold">
                  Expedientes Digitales
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A1E42]">
                Autenticación Institucional
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Ingresa con tu cuenta de correo electrónico autorizada de la UNAM
              </p>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle size={17} className="shrink-0 text-red-500 mt-0.5" />
                <div className="leading-snug">{error}</div>
              </div>
            )}

            {/* Formulario */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#0A1E42] mb-1.5">
                  Nombre Completo (Opcional para registro de sesión)
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Christian Gael Lara Martínez"
                    disabled={isPending}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FBF9F5] border border-[#E2DACB] rounded-xl text-xs sm:text-sm text-[#0E1B2E] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A1E42] mb-1.5">
                  Correo Electrónico Institucional UNAM *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="usuario@aragon.unam.mx o @unam.mx"
                    disabled={isPending}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FBF9F5] border border-[#E2DACB] rounded-xl text-xs sm:text-sm text-[#0E1B2E] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] transition-all disabled:opacity-60"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Dominios admitidos: <span className="font-semibold text-[#0A1E42]">@unam.mx</span>, <span className="font-semibold text-[#0A1E42]">@comunidad.unam.mx</span>, <span className="font-semibold text-[#0A1E42]">@aragon.unam.mx</span>
                </p>
              </div>

              {/* Botón Principal */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#0A1E42] hover:bg-[#06132A] text-white font-serif font-bold py-3 px-4 rounded-xl shadow-md border-b-2 border-[#C68A2C] transition-all text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2 group"
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-[#DF9F38]" />
                    <span>Verificando Credenciales Universitarias...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} className="text-[#DF9F38] group-hover:scale-110 transition-transform" />
                    <span>Ingresar al Sistema PUIC</span>
                  </>
                )}
              </button>
            </form>

            {/* Accesos Rápidos de Prueba / Perfiles Predefinidos */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2.5 text-[#0A1E42] text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-[#C68A2C]" />
                <span>Perfiles de Acceso Rápido Autorizados:</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleQuickLogin(
                      'Christian Gael Lara Martínez',
                      'christianlara225@aragon.unam.mx'
                    )
                  }
                  className="group flex items-center justify-between p-2.5 bg-[#FBF9F5] hover:bg-[#F5F0E6] border border-[#E2DACB] hover:border-[#C68A2C] rounded-xl text-left transition-all cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#C68A2C]/20 text-[#9E6B1D] border border-[#C68A2C]/40">
                        DEV
                      </span>
                      <span className="text-xs font-bold text-[#0A1E42]">
                        Christian Gael Lara Martínez
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      christianlara225@aragon.unam.mx
                    </p>
                  </div>
                  <ArrowRight
                    size={15}
                    className="text-[#C68A2C] group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleQuickLogin(
                      'Titular de Servicio Social',
                      'titular.ss@unam.mx'
                    )
                  }
                  className="group flex items-center justify-between p-2.5 bg-[#FBF9F5] hover:bg-[#E0F2F1]/50 border border-[#E2DACB] hover:border-[#008A7C] rounded-xl text-left transition-all cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#008A7C]/20 text-[#008A7C] border border-[#008A7C]/30">
                        ADMIN
                      </span>
                      <span className="text-xs font-bold text-[#0A1E42]">
                        Titular PUIC (Administración)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      titular.ss@unam.mx
                    </p>
                  </div>
                  <ArrowRight
                    size={15}
                    className="text-[#008A7C] group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleQuickLogin(
                      'Alumno PUIC',
                      'alumno.consulta@comunidad.unam.mx'
                    )
                  }
                  className="group flex items-center justify-between p-2.5 bg-[#FBF9F5] hover:bg-slate-100 border border-[#E2DACB] rounded-xl text-left transition-all cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        LECTOR
                      </span>
                      <span className="text-xs font-bold text-[#0A1E42]">
                        Usuario de Consulta
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      alumno.consulta@comunidad.unam.mx
                    </p>
                  </div>
                  <ArrowRight
                    size={15}
                    className="text-slate-400 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Políticas Institucionales */}
            <div className="bg-[#FBF9F5] border border-[#E2DACB] rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#0A1E42]">
                <School size={15} className="text-[#C68A2C]" />
                <span className="font-serif">Políticas de Acceso Universitario:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
                <li>Exclusivo para la comunidad universitaria UNAM autorizada.</li>
                <li>Los roles se validan contra el padrón de Servicio Social y Prácticas.</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-[#E2DACB] text-center">
            <p className="text-[11px] font-serif text-slate-400">
              Universidad Nacional Autónoma de México • Coordinación de Humanidades • 475 Años
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
