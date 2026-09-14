import Link from "next/link";
import { LayoutDashboard, Users, FolderPlus } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-5 flex flex-col justify-between border-r border-slate-800">
      <div>
        <div className="mb-8">
          <h2 className="text-white font-bold text-lg tracking-tight">
            Sistema SS / PP
          </h2>
          <p className="text-xs text-blue-400">Coordinación de Alumnos</p>
        </div>

        <nav className="space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            href="/expedientes"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Users size={18} />
            Expedientes
          </Link>
          <Link
            href="/expedientes/nuevo"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FolderPlus size={18} />
            Nuevo Registro
          </Link>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
        Gestión Interna · 2026
      </div>
    </aside>
  );
}
