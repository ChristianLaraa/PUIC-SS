'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, UserPlus } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Expedientes', href: '/expedientes', icon: FolderOpen },
    { name: 'Alta de Alumno', href: '/expedientes/nuevo', icon: UserPlus },
  ];

  return (
    <aside className="w-64 bg-[#0A1E42] text-slate-200 min-h-screen flex flex-col border-r border-blue-950 hidden md:flex">
      {/* Cabecera Institucional con Logos */}
      <div className="p-5 border-b border-blue-900/60 bg-[#002B7A]/40 flex flex-col items-center text-center gap-2">
        <div className="flex items-center justify-center gap-3">
          {/* Espacio para Escudo UNAM */}
          <div className="w-10 h-10 rounded-full bg-white/10 border border-[#D59F0F] flex items-center justify-center text-[10px] font-bold text-[#D59F0F] tracking-tighter">
            UNAM
          </div>
          <span className="text-slate-400 text-xs">|</span>
          {/* Espacio para Logo PUIC */}
          <div className="px-2 py-1 rounded bg-[#D59F0F]/15 border border-[#D59F0F]/40 text-xs font-bold text-[#D59F0F] tracking-wider">
            PUIC
          </div>
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">Sistema PUIC</h2>
          <p className="text-[11px] text-[#D59F0F] font-medium">Servicio Social y Prácticas</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1.5">
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
                  ? 'bg-[#D59F0F] text-[#0A1E42] font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Pie Institucional */}
      <div className="p-4 border-t border-blue-900/60 text-center">
        <p className="text-[11px] text-slate-400">UNAM • Coordinación de Humanidades</p>
        <p className="text-[10px] text-[#D59F0F] mt-0.5">Gestión Institucional v2.0</p>
      </div>
    </aside>
  );
}