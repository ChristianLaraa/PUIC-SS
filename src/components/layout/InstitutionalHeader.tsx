'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ExternalLink, 
  Menu, 
  X, 
  LayoutDashboard, 
  FolderOpen, 
  UserPlus, 
  LogOut
} from 'lucide-react';
import { cerrarSesion } from '@/actions/auth';
import type { UserPayload } from '@/lib/auth';

interface InstitutionalHeaderProps {
  user?: UserPayload | null;
}

export default function InstitutionalHeader({ user }: InstitutionalHeaderProps) {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Expedientes', href: '/expedientes', icon: FolderOpen },
    { name: 'Alta de Alumno', href: '/expedientes/nuevo', icon: UserPlus },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#E2DACB] sticky top-0 z-30 shadow-2xs">
      <div className="px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        
        {/* Lado Izquierdo: Identidad Institucional Principal */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Botón de Menú Móvil (Solo pantallas pequeñas) */}
          <button
            type="button"
            onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
            className="md:hidden p-2 rounded-lg text-[#0A1E42] hover:bg-[#F5F0E6] border border-[#E2DACB] transition-colors cursor-pointer"
            aria-label="Abrir menú de navegación"
          >
            {menuMovilAbierto ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Símbolos Escudo UNAM y Logo PUIC */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-[#0A1E42]/20 bg-transparent p-1 flex items-center justify-center">
              <Image
                src="/unamneg.svg"
                alt="Escudo UNAM"
                width={38}
                height={40}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            
            <div className="h-7 w-px bg-[#E2DACB] hidden sm:block" />
            
            <div className="h-8 w-14 sm:w-16 hidden sm:flex items-center justify-center">
              <Image
                src="/puic.png"
                alt="Logo PUIC"
                width={65}
                height={35}
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </div>
          </div>

          {/* Títulos y Dependencia */}
          <div className="border-l border-[#E2DACB] pl-3 sm:pl-4 min-w-0">
            <h1 className="text-xs sm:text-sm md:text-base font-bold text-[#0A1E42] leading-tight tracking-tight truncate">
              Universidad Nacional Autónoma de México
            </h1>
            <p className="text-[11px] sm:text-xs text-[#5C6779] font-medium truncate hidden sm:block mt-0.5">
              Programa Universitario de Estudios de la Diversidad Cultural y la Interculturalidad (PUIC)
            </p>
            <p className="text-[10px] text-[#5C6779] font-medium truncate sm:hidden">
              PUIC • Servicio Social y Prácticas
            </p>
          </div>
        </div>

        {/* Lado Derecho: Dependencia Coordinadora y Enlace Institucional */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="hidden md:flex flex-col text-right">
            <span className="font-bold text-[#0A1E42] text-xs leading-tight">
              Coordinación de Humanidades
            </span>
            <span className="text-[11px] text-[#5C6779] font-medium leading-tight">
              Servicio Social y Prácticas
            </span>
          </div>

          <div className="h-7 w-px bg-[#E2DACB] hidden md:block" />

          {/* Enlace Oficial al Portal Web del PUIC */}
          <a
            href="https://www.nacionmulticultural.unam.mx"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2DACB] bg-[#FBF9F5] hover:bg-[#F5F0E6] text-xs font-semibold text-[#0A1E42] hover:border-[#C68A2C] hover:text-[#9E6B1D] shadow-2xs transition-all group cursor-pointer"
            title="Portal oficial PUIC UNAM"
          >
            <span className="hidden sm:inline">Portal PUIC</span>
            <span className="sm:hidden">PUIC</span>
            <ExternalLink size={13} className="text-[#C68A2C] group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Menú Desplegable en Móvil */}
      {menuMovilAbierto && (
        <div className="md:hidden border-t border-[#E2DACB] bg-white px-4 py-3 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuMovilAbierto(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0A1E42] text-white shadow-xs'
                      : 'text-[#0E1B2E] hover:bg-[#F5F0E6]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-[#DF9F38]' : 'text-[#C68A2C]'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Usuario en Móvil */}
          {user && (
            <div className="pt-2 border-t border-[#E2DACB] flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <p className="font-bold text-[#0A1E42] truncate">{user.nombreCompleto}</p>
                <p className="text-[10px] text-[#5C6779] truncate">{user.correo}</p>
              </div>
              <form action={cerrarSesion}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 text-xs text-rose-700 hover:text-rose-900 font-semibold px-2 py-1 rounded bg-rose-50 border border-rose-200 cursor-pointer"
                >
                  <LogOut size={13} />
                  Salir
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
