'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, UserPlus, LogOut, Award } from 'lucide-react';
import { cerrarSesion } from '@/actions/auth';
import type { UserPayload } from '@/lib/auth';

interface SidebarProps {
  user?: UserPayload | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Expedientes', href: '/expedientes', icon: FolderOpen },
    { name: 'Alta de Alumno', href: '/expedientes/nuevo', icon: UserPlus },
  ];

  return (
    <aside className="w-64 bg-[#0A1E42] text-slate-200 min-h-screen flex flex-col border-r border-[#06132A] shadow-xl hidden md:flex shrink-0">
      {/* Cabecera Institucional con Logos y Acentos Dorados */}
      <div className="p-5 border-b border-[#163670]/60 bg-[#06132A]/50 flex flex-col items-center text-center gap-2 relative">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 p-1 ring-2 ring-[#C68A2C] shadow-inner">
            <Image
              src="/unam.png"
              alt="Escudo de la UNAM"
              width={40}
              height={44}
              priority
              className="h-10 w-auto object-contain brightness-110"
            />
          </div>
          <span className="text-[#C68A2C]/60 text-xs font-serif">|</span>
          <div className="flex h-12 w-20 items-center justify-center">
            <Image
              src="/puic.png"
              alt="Logo del PUIC"
              width={80}
              height={45}
              priority
              className="h-10 w-auto object-contain brightness-110"
            />
          </div>
        </div>
        
        <div className="mt-2 space-y-1">
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-[#C68A2C]/20 text-[#DF9F38] border border-[#C68A2C]/40">
            <Award size={10} /> 475 Años de Historia
          </span>
          <h2 className="text-xs font-serif font-bold text-white tracking-wide leading-snug">
            Programa Universitario de Estudios de la Diversidad Cultural y la Interculturalidad
          </h2>
          <p className="text-[11px] text-[#DF9F38] font-medium">Servicio Social y Prácticas</p>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 p-4 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#C68A2C]/80">
          Módulos del Sistema
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#C68A2C] text-[#0A1E42] font-bold shadow-md ring-1 ring-[#DF9F38]'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#0A1E42]' : 'text-[#C68A2C]'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Perfil del Usuario Activo */}
      {user && (
        <div className="p-3.5 mx-3 mb-3 rounded-xl bg-[#06132A]/90 border border-[#C68A2C]/30 shadow-inner">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C68A2C]/20 border border-[#C68A2C] flex items-center justify-center text-[#DF9F38] font-serif font-bold text-xs shrink-0">
              {user.nombreCompleto?.charAt(0)?.toUpperCase() || 'U'}
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
          <div className="flex items-center justify-between pt-2 border-t border-[#163670]/60">
            <span
              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                user.rol === 'DEV'
                  ? 'bg-[#C68A2C]/25 text-[#DF9F38] border border-[#C68A2C]/50'
                  : user.rol === 'ADMIN'
                  ? 'bg-[#008A7C]/25 text-emerald-300 border border-[#008A7C]/50'
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600'
              }`}
            >
              {user.rol === 'DEV' ? 'Desarrollador' : user.rol === 'ADMIN' ? 'Administrador' : 'Consulta'}
            </span>
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-300 transition-colors p-1 cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut size={13} />
                <span>Salir</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pie Institucional Conmemorativo */}
      <div className="p-4 border-t border-[#163670]/60 text-center bg-[#06132A]/30">
        <p className="text-[10px] font-serif tracking-wider text-slate-400">
          UNAM • 475 AÑOS • PUIC
        </p>
        <p className="text-[9px] text-[#C68A2C]/80 italic mt-0.5">
          La UNAM y la pluriculturalidad
        </p>
      </div>
    </aside>
  );
}
