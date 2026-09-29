'use client';

import { useState, useTransition, useMemo } from 'react';
import { crearPlantel, actualizarPlantel, eliminarPlantel } from '@/actions/planteles';
import { INSTITUCIONES_DISPONIBLES } from '@/lib/constants/catalogos';
import {
  School,
  Globe,
  PlusCircle,
  Search,
  Building2,
  Trash2,
  Edit2,
  Users,
  CheckCircle2,
  AlertCircle,
  Filter,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface PlantelWithCount {
  idPlantel: number;
  nombre: string;
  siglas: string | null;
  institucion: string;
  esUnam: boolean;
  createdAt: Date;
  _count: {
    expedientes: number;
  };
}

interface PlantelesDirectoryProps {
  planteles: PlantelWithCount[];
  stats: {
    totalPlanteles: number;
    totalUnam: number;
    totalExternos: number;
  };
}

export default function PlantelesDirectory({ planteles, stats }: PlantelesDirectoryProps) {
  const [isPending, startTransition] = useTransition();

  // Estados de Filtro y Búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'TODAS' | 'UNAM' | 'EXTERNA'>('TODAS');
  const [filtroInstitucion, setFiltroInstitucion] = useState('TODAS');

  // Estados del Modal / Formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [plantelEnEdicion, setPlantelEnEdicion] = useState<PlantelWithCount | null>(null);

  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [siglas, setSiglas] = useState('');
  const [institucion, setInstitucion] = useState(INSTITUCIONES_DISPONIBLES[1]);
  const [otraInstitucion, setOtraInstitucion] = useState('');
  const [esUnamForm, setEsUnamForm] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Lista única de instituciones presentes en los datos
  const institucionesPresentes = useMemo(() => {
    const set = new Set<string>();
    planteles.forEach((p) => {
      if (p.institucion) set.add(p.institucion);
    });
    return Array.from(set).sort();
  }, [planteles]);

  // Filtrado reactivo
  const plantelesFiltrados = useMemo(() => {
    return planteles.filter((p) => {
      // Filtro texto
      const matchTexto =
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.siglas && p.siglas.toLowerCase().includes(busqueda.toLowerCase())) ||
        p.institucion.toLowerCase().includes(busqueda.toLowerCase());

      // Filtro Tipo
      const matchTipo =
        filtroTipo === 'TODAS'
          ? true
          : filtroTipo === 'UNAM'
          ? p.esUnam
          : !p.esUnam;

      // Filtro Institución específica
      const matchInstitucion =
        filtroInstitucion === 'TODAS' || p.institucion === filtroInstitucion;

      return matchTexto && matchTipo && matchInstitucion;
    });
  }, [planteles, busqueda, filtroTipo, filtroInstitucion]);

  function abrirCrear() {
    setPlantelEnEdicion(null);
    setNombre('');
    setSiglas('');
    setInstitucion(INSTITUCIONES_DISPONIBLES[1]);
    setOtraInstitucion('');
    setEsUnamForm(false);
    setMensajeError(null);
    setModalAbierto(true);
  }

  function abrirEditar(p: PlantelWithCount) {
    setPlantelEnEdicion(p);
    setNombre(p.nombre);
    setSiglas(p.siglas || '');
    if (INSTITUCIONES_DISPONIBLES.includes(p.institucion)) {
      setInstitucion(p.institucion);
      setOtraInstitucion('');
    } else {
      setInstitucion('Otra Institución');
      setOtraInstitucion(p.institucion);
    }
    setEsUnamForm(p.esUnam);
    setMensajeError(null);
    setModalAbierto(true);
  }

  function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setMensajeError(null);
    setMensajeExito(null);

    const institucionFinal =
      esUnamForm
        ? 'UNAM'
        : institucion === 'Otra Institución'
        ? otraInstitucion.trim() || 'Institución Externa'
        : institucion;

    if (!nombre.trim()) {
      setMensajeError('El nombre de la escuela o plantel es obligatorio.');
      return;
    }

    startTransition(async () => {
      try {
        if (plantelEnEdicion) {
          await actualizarPlantel(plantelEnEdicion.idPlantel, {
            nombre: nombre.trim(),
            siglas: siglas.trim() || undefined,
            institucion: institucionFinal,
            esUnam: esUnamForm,
          });
          setMensajeExito('Plantel actualizado exitosamente.');
        } else {
          await crearPlantel({
            nombre: nombre.trim(),
            siglas: siglas.trim() || undefined,
            institucion: institucionFinal,
            esUnam: esUnamForm,
          });
          setMensajeExito('Nueva escuela registrada en el sistema.');
        }
        setModalAbierto(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setMensajeError(err.message);
        } else {
          setMensajeError('Ocurrió un error al guardar el plantel.');
        }
      }
    });
  }

  function handleEliminar(p: PlantelWithCount) {
    if (p._count.expedientes > 0) {
      alert(`No es posible eliminar "${p.nombre}" porque cuenta con ${p._count.expedientes} expediente(s) activo(s).`);
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar "${p.nombre}"?`)) {
      startTransition(async () => {
        try {
          await eliminarPlantel(p.idPlantel);
          setMensajeExito('Plantel eliminado con éxito.');
        } catch (err: unknown) {
          if (err instanceof Error) {
            alert(err.message);
          }
        }
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* ENCABEZADO PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2DACB] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008A7C] bg-[#E0F2F1] px-2 py-0.5 rounded border border-[#008A7C]/30">
              <Globe size={12} /> Catálogo Institucional
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1E42] tracking-tight">
            Planteles, Escuelas y Universidades
          </h1>
          <p className="text-sm italic text-[#5C6779] mt-0.5">
            Administración de entidades académicas de procedencia (UNAM e Instituciones Externas).
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={abrirCrear}
            className="flex items-center gap-2 bg-[#0A1E42] hover:bg-[#06132A] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm border-b-2 border-[#C68A2C] transition-all cursor-pointer"
          >
            <PlusCircle size={18} className="text-[#DF9F38]" />
            Agregar Escuela No UNAM / Externa
          </button>
        </div>
      </div>

      {/* MENSAJE DE ÉXITO */}
      {mensajeExito && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{mensajeExito}</span>
          </div>
          <button onClick={() => setMensajeExito(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2DACB] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#5C6779] uppercase tracking-wider">Total de Escuelas</span>
            <p className="text-3xl font-black text-[#0A1E42] mt-1">{stats.totalPlanteles}</p>
          </div>
          <div className="p-3 bg-[#0A1E42]/10 text-[#0A1E42] rounded-xl">
            <Building2 size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2DACB] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#5C6779] uppercase tracking-wider">Facultades / FES (UNAM)</span>
            <p className="text-3xl font-black text-[#C68A2C] mt-1">{stats.totalUnam}</p>
          </div>
          <div className="p-3 bg-[#C68A2C]/15 text-[#9E6B1D] rounded-xl">
            <School size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2DACB] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#5C6779] uppercase tracking-wider">Escuelas Externas (No UNAM)</span>
            <p className="text-3xl font-black text-[#008A7C] mt-1">{stats.totalExternos}</p>
          </div>
          <div className="p-3 bg-[#008A7C]/10 text-[#008A7C] rounded-xl">
            <Globe size={24} />
          </div>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2DACB] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Barra de búsqueda */}
          <div className="md:col-span-6 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre de escuela, siglas o institución..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FBF9F5] border border-[#E2DACB] rounded-xl text-xs sm:text-sm text-[#0E1B2E] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C68A2C] transition-all"
            />
          </div>

          {/* Filtro Tipo: Todas, UNAM, No UNAM */}
          <div className="md:col-span-3">
            <div className="flex p-1 bg-[#F5F0E6] rounded-xl border border-[#E2DACB]">
              <button
                type="button"
                onClick={() => setFiltroTipo('TODAS')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filtroTipo === 'TODAS' ? 'bg-[#0A1E42] text-white shadow-xs' : 'text-[#0A1E42] hover:bg-white/60'
                }`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setFiltroTipo('UNAM')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filtroTipo === 'UNAM' ? 'bg-[#C68A2C] text-white shadow-xs' : 'text-[#0A1E42] hover:bg-white/60'
                }`}
              >
                UNAM
              </button>
              <button
                type="button"
                onClick={() => setFiltroTipo('EXTERNA')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filtroTipo === 'EXTERNA' ? 'bg-[#008A7C] text-white shadow-xs' : 'text-[#0A1E42] hover:bg-white/60'
                }`}
              >
                No UNAM
              </button>
            </div>
          </div>

          {/* Filtro por Institución */}
          <div className="md:col-span-3">
            <select
              value={filtroInstitucion}
              onChange={(e) => setFiltroInstitucion(e.target.value)}
              className="w-full p-2.5 bg-[#FBF9F5] border border-[#E2DACB] rounded-xl text-xs sm:text-sm text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C68A2C] transition-all"
            >
              <option value="TODAS">Todas las Instituciones</option>
              {institucionesPresentes.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-2xl border border-[#E2DACB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0A1E42] text-xs uppercase text-slate-200 border-b border-[#06132A]">
              <tr>
                <th className="p-4 tracking-wider">Nombre del Plantel / Escuela</th>
                <th className="p-4 tracking-wider">Institución</th>
                <th className="p-4 tracking-wider">Siglas</th>
                <th className="p-4 text-center tracking-wider">Origen</th>
                <th className="p-4 text-center tracking-wider">Expedientes</th>
                <th className="p-4 text-right tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DACB]/60">
              {plantelesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#F5F0E6] text-[#9E6B1D] flex items-center justify-center mx-auto">
                        <Filter size={24} />
                      </div>
                      <p className="text-[#0A1E42] font-bold text-base">No se encontraron escuelas</p>
                      <p className="text-xs text-[#5C6779]">
                        {busqueda
                          ? 'Ningún plantel coincide con el criterio de búsqueda ingresado.'
                          : 'No hay escuelas registradas bajo los filtros seleccionados.'}
                      </p>
                      <button
                        onClick={abrirCrear}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#008A7C] hover:underline cursor-pointer"
                      >
                        <PlusCircle size={14} />
                        Registrar nueva escuela ahora
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                plantelesFiltrados.map((p) => (
                  <tr key={p.idPlantel} className="hover:bg-[#FBF9F5] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#0A1E42] text-sm">{p.nombre}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-[#0E1B2E] font-medium">{p.institucion}</div>
                    </td>
                    <td className="p-4">
                      {p.siglas ? (
                        <span className="font-mono text-xs font-bold text-[#5C6779] bg-slate-100 px-2 py-0.5 rounded">
                          {p.siglas}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.esUnam
                            ? 'bg-[#C68A2C]/15 text-[#9E6B1D] border border-[#C68A2C]/30'
                            : 'bg-[#008A7C]/15 text-[#008A7C] border border-[#008A7C]/30'
                        }`}
                      >
                        {p.esUnam ? <School size={11} /> : <Globe size={11} />}
                        {p.esUnam ? 'UNAM' : 'Externa'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={`/expedientes?q=${encodeURIComponent(p.nombre)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1E42] hover:text-[#C68A2C] bg-[#F5F0E6] px-2.5 py-1 rounded-full transition-colors"
                        title="Ver expedientes de esta escuela"
                      >
                        <Users size={12} />
                        {p._count.expedientes} {p._count.expedientes === 1 ? 'alumno' : 'alumnos'}
                      </Link>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => abrirEditar(p)}
                          className="p-1.5 text-slate-500 hover:text-[#0A1E42] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar plantel"
                        >
                          <Edit2 size={15} />
                        </button>
                        {!p.esUnam && p._count.expedientes === 0 && (
                          <button
                            onClick={() => handleEliminar(p)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar plantel"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-[#E2DACB] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2DACB] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-[#008A7C]/15 text-[#008A7C] rounded-lg">
                  <Building2 size={18} />
                </span>
                <h3 className="text-base font-bold text-[#0A1E42]">
                  {plantelEnEdicion ? 'Editar Escuela / Plantel' : 'Registrar Nueva Escuela No UNAM'}
                </h3>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {mensajeError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{mensajeError}</span>
              </div>
            )}

            <form onSubmit={handleGuardar} className="space-y-4">
              {/* Selector de Origen en Formulario */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A1E42] uppercase">Tipo de Institución *</label>
                <div className="flex p-1 bg-[#F5F0E6] rounded-xl border border-[#E2DACB]">
                  <button
                    type="button"
                    onClick={() => {
                      setEsUnamForm(false);
                      if (institucion === 'UNAM') setInstitucion(INSTITUCIONES_DISPONIBLES[1]);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !esUnamForm ? 'bg-[#008A7C] text-white shadow-xs' : 'text-[#0A1E42] hover:bg-white/60'
                    }`}
                  >
                    Institución Externa (No UNAM)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEsUnamForm(true);
                      setInstitucion('UNAM');
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      esUnamForm ? 'bg-[#0A1E42] text-white shadow-xs' : 'text-[#0A1E42] hover:bg-white/60'
                    }`}
                  >
                    Comunidad UNAM
                  </button>
                </div>
              </div>

              {!esUnamForm && (
                <>
                  {/* Institución */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0A1E42] uppercase">Institución / Universidad *</label>
                    <select
                      value={institucion}
                      onChange={(e) => setInstitucion(e.target.value)}
                      className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#008A7C] outline-none"
                    >
                      {INSTITUCIONES_DISPONIBLES.filter((i) => i !== 'UNAM').map((inst) => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                    </select>
                  </div>

                  {institucion === 'Otra Institución' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#0A1E42] uppercase">Especificar Nombre de la Institución *</label>
                      <input
                        required
                        type="text"
                        value={otraInstitucion}
                        onChange={(e) => setOtraInstitucion(e.target.value)}
                        placeholder="Ej. Universidad Veracruzana, UAM, ITESM..."
                        className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#008A7C] outline-none"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Nombre del Plantel */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A1E42] uppercase">
                  Nombre del Plantel, Unidad o Escuela *
                </label>
                <input
                  required
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Escuela Superior de Cómputo (ESCOM) - IPN"
                  className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#008A7C] outline-none"
                />
              </div>

              {/* Siglas */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A1E42] uppercase">Siglas / Acrónimo (Opcional)</label>
                <input
                  type="text"
                  value={siglas}
                  onChange={(e) => setSiglas(e.target.value)}
                  placeholder="Ej. ESCOM, UAM-X, UPIITA"
                  className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#008A7C] outline-none font-mono"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2DACB]">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 bg-[#008A7C] hover:bg-[#007367] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'Guardando...' : plantelEnEdicion ? 'Actualizar Plantel' : 'Guardar Nueva Escuela'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
