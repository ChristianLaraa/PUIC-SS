'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderOpen, 
  UserPlus, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';
import { cerrarSesion } from '@/actions/auth';
import type { UserPayload } from '@/lib/auth';

interface SidebarProps {
  user?: UserPayload | null;
}

/**
 * Ribete sutil con grecas mesoamericanas (xicalcoliuhqui)
 * Vincula la identidad visual del PUIC con las raíces culturales y el arte indígena.
 */
function GrecasMesoamericanas({ className = '' }: { className?: string }) {
  return (
    <div className={`overflow-hidden flex items-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-2"
        viewBox="0 0 240 10"
        fill="none"
        preserveAspectRatio="repeat-x"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id="greca-sidebar" width="24" height="10" patternUnits="userSpaceOnUse">
          <path
            d="M0 10V0H12V3H4V7H16V0H24V10H12V7H20V3H8V10H0Z"
            fill="currentColor"
          />
        </pattern>
        <rect width="100%" height="10" fill="url(#greca-sidebar)" />
      </svg>
    </div>
  );
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const modulosOperativos = [
    { 
      name: 'Panel General', 
      href: '/', 
      icon: LayoutDashboard,
      badge: 'Inicio'
    },
    { 
      name: 'Directorio Alumnos', 
      href: '/expedientes', 
      icon: FolderOpen 
    },
    { 
      name: 'Nuevo Registro', 
      href: '/expedientes/nuevo', 
      icon: UserPlus,
      destacado: true
    },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-[#06132A] via-[#0A1E42] to-[#071630] text-slate-200 min-h-screen flex flex-col border-r border-[#163670]/60 shadow-2xl hidden md:flex shrink-0 relative select-none">
      
      {/* Resplandor decorativo sutil en la esquina superior */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#C68A2C]/10 via-transparent to-transparent pointer-events-none" />

      {/* Cabecera Institucional con Logos y Estilo Premium */}
      <div className="p-5 border-b border-[#163670]/50 bg-[#06132A]/70 backdrop-blur-xs flex flex-col items-center text-center relative z-10">
        
        {/* Contenedor de Emblemas UNAM y PUIC */}
        <div className="flex items-center justify-center gap-3.5 w-full bg-white/[0.04] p-3 rounded-2xl border border-white/10 shadow-inner">
          {/* Escudo UNAM */}
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A1E42] p-1 ring-1 ring-[#C68A2C]/80 shadow-md">
            <Image
              src="/unam.png"
              alt="Escudo de la UNAM"
              width={40}
              height={44}
              priority
              className="h-8 w-auto object-contain brightness-110 drop-shadow-xs"
            />
          </div>

          <div className="h-7 w-px bg-gradient-to-b from-transparent via-[#C68A2C]/50 to-transparent" />

          {/* Logo PUIC */}
          <div className="flex h-11 w-20 items-center justify-center">
            <Image
              src="/puicpng.png"
              alt="Logo del PUIC"
              width={75}
              height={40}
              priority
              className="h-8 w-auto object-contain brightness-110 drop-shadow-xs"
            />
          </div>
        </div>

        {/* Títulos y Subtítulos con Escala Armónica */}
        <div className="mt-3 space-y-1 w-full">
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-[#C68A2C]/15 text-[#DF9F38] border border-[#C68A2C]/30 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistema Institucional
            </span>
          </div>

          <h2 className="text-xs font-bold text-white tracking-wide leading-snug px-1 pt-0.5">
            Programa Universitario de Estudios de la Diversidad Cultural
          </h2>
          <p className="text-[11px] text-[#DF9F38] font-medium tracking-tight">
            Servicio Social y Prácticas Profesionales
          </p>
        </div>

        {/* Detalle Cultural PUIC: Greca Mesoamericana en Oro */}
        <GrecasMesoamericanas className="text-[#C68A2C]/35 w-full mt-3" />
      </div>

      {/* Navegación Principal Organizada por Secciones */}
      <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
        
        {/* Sección: Operación */}
        <div className="space-y-1.5">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#C68A2C]/90 flex items-center justify-between">
            <span>Operación</span>
            <span className="text-[9px] font-normal text-slate-400 lowercase">módulos</span>
          </div>

          {modulosOperativos.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C68A2C] to-[#DF9F38] text-[#06132A] font-bold shadow-md shadow-[#C68A2C]/25 border border-[#DF9F38]/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.08] hover:translate-x-1 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[#06132A]/15 text-[#06132A]' 
                      : 'text-[#DF9F38] group-hover:text-white group-hover:scale-110 transition-transform'
                  }`}>
                    <Icon size={17} />
                  </div>
                  <span className="truncate">{item.name}</span>
                </div>

                {isActive ? (
                  <ChevronRight size={15} className="text-[#06132A]" />
                ) : item.badge ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-medium">
                    {item.badge}
                  </span>
                ) : item.destacado ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C68A2C]/20 text-[#DF9F38] font-bold border border-[#C68A2C]/30">
                    +Alta
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

      </nav>

      {/* Tarjeta de Identidad y Sesión del Usuario */}
      {user && (
        <div className="p-3 mx-3 mb-3 rounded-2xl bg-gradient-to-b from-[#06132A]/90 to-[#0A1E42]/80 border border-[#C68A2C]/25 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2.5">
            {/* Avatar estilizado con inicial y punto de conexión */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#DF9F38] to-[#9E6B1D] border border-[#DF9F38]/50 flex items-center justify-center text-[#06132A] font-black text-xs shadow-md">
                {user.nombreCompleto?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#06132A]" title="Usuario conectado" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate" title={user.nombreCompleto}>
                {user.nombreCompleto}
              </p>
              <p className="text-[10px] text-slate-400 truncate" title={user.correo}>
                {user.correo}
              </p>
            </div>
          </div>

          {/* Fila de Rol y Botón de Salir */}
          <div className="flex items-center justify-between pt-2 border-t border-[#163670]/50">
            <span
              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                user.rol === 'DEV'
                  ? 'bg-[#C68A2C]/25 text-[#DF9F38] border border-[#C68A2C]/50'
                  : user.rol === 'ADMIN'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600'
              }`}
            >
              {user.rol === 'DEV' ? 'Desarrollador' : user.rol === 'ADMIN' ? 'Administrador' : 'Consulta'}
            </span>

            <form action={cerrarSesion}>
              <button
                type="submit"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                title="Cerrar sesión segura"
              >
                <LogOut size={13} />
                <span>Salir</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pie Institucional Fino y Conexión UNAM */}
      <div className="p-3 border-t border-[#163670]/50 text-center bg-[#06132A]/50">
        <p className="text-[10px] tracking-widest uppercase font-semibold text-slate-300">
          UNAM • PUIC
        </p>
        <p className="text-[9px] text-[#C68A2C]/80 italic mt-0.5">
          "La UNAM y la pluriculturalidad"
        </p>
      </div>
    </aside>
  );
}
