'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  RotateCcw, 
  PlusCircle, 
  ArrowRight, 
  Filter, 
  Award
} from 'lucide-react';
import { CICLOS_ESCOLARES, MODALIDADES } from '@/lib/constants/catalogos';

interface ExpedienteItem {
  idExpediente: number;
  clave: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  numeroCuenta: string;
  tipoPrograma: string;
  modalidad: string;
  cicloEscolar: string;
  estatus: string;
  fechaInicio: Date | string;
  fechaTentativa: Date | string;
  plantel?: { nombre: string } | null;
  carrera?: { nombre: string } | null;
  coordinador?: { nombreCompleto: string; gradoAcademico: string } | null;
}

export default function ExpedientesDirectory({ expedientes }: { expedientes: ExpedienteItem[] }) {
  const searchParams = useSearchParams();

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroPrograma, setFiltroPrograma] = useState(
    () => searchParams.get('programa') || 'TODOS'
  );
  const [filtroEstatus, setFiltroEstatus] = useState(
    () => searchParams.get('estatus') || 'TODOS'
  );
  const [filtroCiclo, setFiltroCiclo] = useState('TODOS');
  const [filtroModalidad, setFiltroModalidad] = useState('TODOS');

  // Obtener lista única de planteles presentes en los expedientes
  const plantelesDisponibles = useMemo(() => {
    const list = expedientes
      .map((e) => e.plantel?.nombre)
      .filter((p): p is string => Boolean(p));
    return Array.from(new Set(list));
  }, [expedientes]);

  const [filtroPlantel, setFiltroPlantel] = useState('TODOS');

  // Lógica de filtrado reactivo combinada
  const expedientesFiltrados = useMemo(() => {
    return expedientes.filter((exp) => {
      // 1. Filtro texto (Nombre, No. Cuenta, Clave, Carrera)
      const termino = busqueda.toLowerCase().trim();
      const nombreCompleto = `${exp.nombre} ${exp.apPaterno} ${exp.apMaterno}`.toLowerCase();
      const matchBusqueda =
        !termino ||
        nombreCompleto.includes(termino) ||
        exp.numeroCuenta.toLowerCase().includes(termino) ||
        exp.clave.toLowerCase().includes(termino) ||
        (exp.carrera?.nombre ?? '').toLowerCase().includes(termino);

      // 2. Filtro programa
      const matchPrograma = filtroPrograma === 'TODOS' || exp.tipoPrograma === filtroPrograma;

      // 3. Filtro estatus
      const matchEstatus = filtroEstatus === 'TODOS' || exp.estatus === filtroEstatus;

      // 4. Filtro ciclo escolar
      const matchCiclo = filtroCiclo === 'TODOS' || exp.cicloEscolar === filtroCiclo;

      // 5. Filtro modalidad
      const matchModalidad = filtroModalidad === 'TODOS' || exp.modalidad === filtroModalidad;

      // 6. Filtro plantel
      const matchPlantel = filtroPlantel === 'TODOS' || exp.plantel?.nombre === filtroPlantel;

      return matchBusqueda && matchPrograma && matchEstatus && matchCiclo && matchModalidad && matchPlantel;
    });
  }, [expedientes, busqueda, filtroPrograma, filtroEstatus, filtroCiclo, filtroModalidad, filtroPlantel]);

  const hayFiltrosActivos =
    busqueda !== '' ||
    filtroPrograma !== 'TODOS' ||
    filtroEstatus !== 'TODOS' ||
    filtroCiclo !== 'TODOS' ||
    filtroModalidad !== 'TODOS' ||
    filtroPlantel !== 'TODOS';

  function resetFiltros() {
    setBusqueda('');
    setFiltroPrograma('TODOS');
    setFiltroEstatus('TODOS');
    setFiltroCiclo('TODOS');
    setFiltroModalidad('TODOS');
    setFiltroPlantel('TODOS');
  }

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2DACB] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-serif font-bold text-[#9E6B1D] bg-[#C68A2C]/15 px-2 py-0.5 rounded border border-[#C68A2C]/30">
              <Award size={12} /> PUIC • 475 Años UNAM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A1E42] tracking-tight">
            Directorio Institucional de Expedientes
          </h1>
          <p className="text-sm font-serif italic text-[#5C6779] mt-0.5">
            Registro, consulta y seguimiento de prestadores de Servicio Social y Prácticas Profesionales.
          </p>
        </div>
        <Link
          href="/expedientes/nuevo"
          className="inline-flex items-center gap-2 bg-[#0A1E42] hover:bg-[#06132A] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm border-b-2 border-[#C68A2C] transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle size={18} className="text-[#DF9F38]" />
          Nuevo Registro
        </Link>
      </div>

      {/* Bloque de Búsqueda y Filtros */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2DACB] shadow-xs space-y-4">
        {/* Barra de Búsqueda Principal */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre del alumno, número de cuenta (9 dígitos), clave institucional o carrera..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
          />
        </div>

        {/* Selectores de Filtro Específico */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {/* Programa */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0A1E42] block mb-1">
              Programa
            </label>
            <select
              value={filtroPrograma}
              onChange={(e) => setFiltroPrograma(e.target.value)}
              className="w-full p-2 border border-[#E2DACB] rounded-xl text-xs bg-[#FBF9F5] focus:ring-2 focus:ring-[#C68A2C] outline-none"
            >
              <option value="TODOS">Todos los programas</option>
              <option value="SS">Servicio Social (SS)</option>
              <option value="PP">Prácticas (PP)</option>
            </select>
          </div>

          {/* Estatus */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0A1E42] block mb-1">
              Estatus
            </label>
            <select
              value={filtroEstatus}
              onChange={(e) => setFiltroEstatus(e.target.value)}
              className="w-full p-2 border border-[#E2DACB] rounded-xl text-xs bg-[#FBF9F5] focus:ring-2 focus:ring-[#C68A2C] outline-none"
            >
              <option value="TODOS">Todos los estatus</option>
              <option value="Activo">Activos</option>
              <option value="Terminado">Terminados / Acreditados</option>
              <option value="Declinado">Declinados / Bajas</option>
            </select>
          </div>

          {/* Ciclo Escolar */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0A1E42] block mb-1">
              Ciclo Escolar
            </label>
            <select
              value={filtroCiclo}
              onChange={(e) => setFiltroCiclo(e.target.value)}
              className="w-full p-2 border border-[#E2DACB] rounded-xl text-xs bg-[#FBF9F5] focus:ring-2 focus:ring-[#C68A2C] outline-none"
            >
              <option value="TODOS">Todos los ciclos</option>
              {CICLOS_ESCOLARES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Modalidad */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0A1E42] block mb-1">
              Modalidad
            </label>
            <select
              value={filtroModalidad}
              onChange={(e) => setFiltroModalidad(e.target.value)}
              className="w-full p-2 border border-[#E2DACB] rounded-xl text-xs bg-[#FBF9F5] focus:ring-2 focus:ring-[#C68A2C] outline-none"
            >
              <option value="TODOS">Todas las modalidades</option>
              {MODALIDADES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Plantel */}
          <div className="col-span-2 sm:col-span-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0A1E42] block mb-1">
              Plantel / Escuela
            </label>
            <select
              value={filtroPlantel}
              onChange={(e) => setFiltroPlantel(e.target.value)}
              className="w-full p-2 border border-[#E2DACB] rounded-xl text-xs bg-[#FBF9F5] focus:ring-2 focus:ring-[#C68A2C] outline-none truncate"
            >
              <option value="TODOS">Todos los planteles</option>
              {plantelesDisponibles.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra de Estado de Filtros */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E2DACB]/60 text-xs text-[#5C6779]">
          <span>
            Mostrando <strong>{expedientesFiltrados.length}</strong> de <strong>{expedientes.length}</strong> expedientes registrados
          </span>
          {hayFiltrosActivos && (
            <button
              onClick={resetFiltros}
              className="inline-flex items-center gap-1.5 text-[#0A1E42] hover:text-[#C68A2C] font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-2xl border border-[#E2DACB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0A1E42] text-xs uppercase font-serif text-slate-200 border-b border-[#06132A]">
              <tr>
                <th className="p-4 tracking-wider">Clave / No. Cuenta</th>
                <th className="p-4 tracking-wider">Alumno</th>
                <th className="p-4 tracking-wider">Programa</th>
                <th className="p-4 tracking-wider">Procedencia</th>
                <th className="p-4 tracking-wider">Responsable</th>
                <th className="p-4 tracking-wider">Periodo Oficial</th>
                <th className="p-4 text-center tracking-wider">Estatus</th>
                <th className="p-4 text-right tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DACB]/60">
              {expedientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#F5F0E6] text-[#9E6B1D] flex items-center justify-center mx-auto">
                        <Filter size={24} />
                      </div>
                      <p className="text-[#0A1E42] font-serif font-bold text-base">No se encontraron expedientes</p>
                      <p className="text-xs text-[#5C6779]">
                        {hayFiltrosActivos
                          ? 'Ningún registro coincide con los criterios de búsqueda seleccionados.'
                          : 'Aún no hay expedientes capturados en el sistema.'}
                      </p>
                      {hayFiltrosActivos && (
                        <button
                          onClick={resetFiltros}
                          className="text-xs font-semibold text-[#0A1E42] hover:text-[#C68A2C] underline cursor-pointer"
                        >
                          Limpiar todos los filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                expedientesFiltrados.map((exp) => {
                  const fInicio = new Date(exp.fechaInicio).toLocaleDateString('es-MX', { timeZone: 'UTC' });
                  const fTentativa = new Date(exp.fechaTentativa).toLocaleDateString('es-MX', { timeZone: 'UTC' });

                  return (
                    <tr key={exp.idExpediente} className="hover:bg-[#FBF9F5] transition-colors">
                      {/* Clave y No. Cuenta */}
                      <td className="p-4">
                        <div className="font-mono font-bold text-[#0A1E42] text-xs">{exp.clave}</div>
                        <div className="font-mono text-[11px] text-[#5C6779] mt-0.5">
                          Cta: {exp.numeroCuenta}
                        </div>
                      </td>

                      {/* Alumno */}
                      <td className="p-4">
                        <div className="font-serif font-bold text-[#0A1E42]">
                          {exp.nombre} {exp.apPaterno} {exp.apMaterno}
                        </div>
                        <div className="text-xs text-[#5C6779] mt-0.5">
                          Ciclo {exp.cicloEscolar}
                        </div>
                      </td>

                      {/* Programa & Modalidad */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            exp.tipoPrograma === 'SS'
                              ? 'bg-[#008A7C]/15 text-[#008A7C] border border-[#008A7C]/30'
                              : 'bg-[#C68A2C]/15 text-[#9E6B1D] border border-[#C68A2C]/30'
                          }`}
                        >
                          {exp.tipoPrograma === 'SS' ? 'Servicio Social' : 'Prácticas'}
                        </span>
                        <div className="text-[11px] text-[#5C6779] mt-1 capitalize">
                          {exp.modalidad}
                        </div>
                      </td>

                      {/* Procedencia (Plantel y Carrera) */}
                      <td className="p-4 max-w-xs">
                        <div className="text-xs font-medium text-[#0E1B2E] truncate" title={exp.carrera?.nombre ?? ''}>
                          {exp.carrera?.nombre ?? 'Sin carrera'}
                        </div>
                        <div className="text-[11px] text-[#5C6779] truncate mt-0.5" title={exp.plantel?.nombre ?? ''}>
                          {exp.plantel?.nombre ?? 'Sin plantel'}
                        </div>
                      </td>

                      {/* Responsable */}
                      <td className="p-4">
                        <div className="text-xs text-[#0E1B2E]">
                          <span className="font-semibold text-[#0A1E42]">
                            {exp.coordinador?.gradoAcademico}{' '}
                          </span>
                          {exp.coordinador?.nombreCompleto ?? 'Sin asignar'}
                        </div>
                      </td>

                      {/* Fechas */}
                      <td className="p-4 text-xs text-[#0E1B2E]">
                        <div>{fInicio}</div>
                        <div className="text-[#5C6779] text-[11px] mt-0.5">Fin: {fTentativa}</div>
                      </td>

                      {/* Estatus */}
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            exp.estatus === 'Activo'
                              ? 'bg-[#0A1E42]/10 text-[#0A1E42] border border-[#0A1E42]/20'
                              : exp.estatus === 'Terminado'
                              ? 'bg-[#008A7C]/15 text-[#008A7C] border border-[#008A7C]/30'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {exp.estatus}
                        </span>
                      </td>

                      {/* Acción */}
                      <td className="p-4 text-right">
                        <Link
                          href={`/expedientes/${exp.idExpediente}`}
                          className="inline-flex items-center gap-1 text-[#0A1E42] hover:text-[#C68A2C] font-serif font-bold text-xs transition-colors"
                        >
                          Ficha
                          <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
