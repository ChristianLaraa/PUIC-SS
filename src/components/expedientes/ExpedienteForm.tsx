'use client';

import { useMemo, useState, useTransition } from 'react';
import { registrarExpediente } from '@/actions/expedientes';
import { generarClaveExpediente, calcularFechaTentativa } from '@/lib/helpers';
import {
  GRADOS_ACADEMICOS,
  SEMESTRES_UNAM,
  CICLOS_ESCOLARES,
  UBICACIONES_DEPENDENCIA,
  MODALIDADES,
  TURNOS,
  PLANTELES_UNAM,
  CARRERAS_UNAM,
  INSTITUCIONES_DISPONIBLES,
  PLANTELES_EXTERNOS_SUGERIDOS,
} from '@/lib/constants/catalogos';
import { School, Globe, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface PlantelItem {
  idPlantel: number;
  nombre: string;
  siglas?: string | null;
  institucion: string;
  esUnam: boolean;
}

interface ExpedienteFormProps {
  plantelesIniciales?: PlantelItem[];
}

export default function ExpedienteForm({ plantelesIniciales = [] }: ExpedienteFormProps) {
  const [isPending, startTransition] = useTransition();

  // 1. Datos Personales y de Contacto
  const [nombre, setNombre] = useState('');
  const [apPaterno, setApPaterno] = useState('');
  const [apMaterno, setApMaterno] = useState('');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [telefono, setTelefono] = useState('');
  const [edad, setEdad] = useState<number | ''>('');
  const [sexo, setSexo] = useState('H');
  const [semestre, setSemestre] = useState(SEMESTRES_UNAM[1]); // 7mo semestre por defecto

  // 2. Origen Institucional y Adscripción Académica
  const [esUnam, setEsUnam] = useState(true);
  
  // UNAM
  const [plantelUnam, setPlantelUnam] = useState(PLANTELES_UNAM[0]);
  const [carreraUnam, setCarreraUnam] = useState(CARRERAS_UNAM[0]);

  // NO UNAM / Externa
  const [institucionExterna, setInstitucionExterna] = useState(INSTITUCIONES_DISPONIBLES[1]); // IPN por defecto
  const [otraInstitucionNombre, setOtraInstitucionNombre] = useState('');
  const [modoEscuelaExterna, setModoEscuelaExterna] = useState<'catalogo' | 'nueva'>('catalogo');
  const [plantelExternoSeleccionado, setPlantelExternoSeleccionado] = useState(PLANTELES_EXTERNOS_SUGERIDOS[0].nombre);
  const [nuevoPlantelNombre, setNuevoPlantelNombre] = useState('');
  const [nuevoPlantelSiglas, setNuevoPlantelSiglas] = useState('');
  const [carreraExterna, setCarreraExterna] = useState('');

  // 3. Datos del Programa
  const [tipoPrograma, setTipoPrograma] = useState<'SS' | 'PP'>('SS');
  const [clavePrograma, setClavePrograma] = useState('');
  const [nombrePrograma, setNombrePrograma] = useState('');
  const [cicloEscolar, setCicloEscolar] = useState(CICLOS_ESCOLARES[0]);
  const [ubicacionDependencia, setUbicacionDependencia] = useState(UBICACIONES_DEPENDENCIA[0]);
  const [modalidad, setModalidad] = useState(MODALIDADES[0]);
  const [turno, setTurno] = useState(TURNOS[0]);

  // 4. Coordinador / Responsable
  const [coordinadorGrado, setCoordinadorGrado] = useState(GRADOS_ACADEMICOS[0]);
  const [coordinadorNombre, setCoordinadorNombre] = useState('');

  // 5. Tiempos y Clave Institucional
  const [fechaInicio, setFechaInicio] = useState('');

  // Resolver nombre de institución final
  const institucionFinal = useMemo(() => {
    if (esUnam) return 'UNAM';
    if (institucionExterna === 'Otra Institución') {
      return otraInstitucionNombre.trim() || 'Institución Externa';
    }
    return institucionExterna;
  }, [esUnam, institucionExterna, otraInstitucionNombre]);

  // Resolver nombre de plantel final
  const plantelFinal = useMemo(() => {
    if (esUnam) return plantelUnam;
    if (modoEscuelaExterna === 'nueva') {
      return nuevoPlantelNombre.trim();
    }
    return plantelExternoSeleccionado;
  }, [esUnam, plantelUnam, modoEscuelaExterna, nuevoPlantelNombre, plantelExternoSeleccionado]);

  // Resolver siglas del plantel
  const siglasFinal = useMemo(() => {
    if (esUnam) return null;
    if (modoEscuelaExterna === 'nueva') {
      return nuevoPlantelSiglas.trim() || null;
    }
    const sugerido = PLANTELES_EXTERNOS_SUGERIDOS.find((p) => p.nombre === plantelExternoSeleccionado);
    return sugerido?.siglas || null;
  }, [esUnam, modoEscuelaExterna, nuevoPlantelSiglas, plantelExternoSeleccionado]);

  // Resolver carrera final
  const carreraFinal = useMemo(() => {
    if (esUnam) return carreraUnam;
    return carreraExterna.trim() || 'Sin carrera especificada';
  }, [esUnam, carreraUnam, carreraExterna]);

  // Lista combinada de escuelas externas (sugeridas + registradas en base de datos)
  const escuelasExternasDisponibles = useMemo(() => {
    const externasDb = plantelesIniciales
      .filter((p) => !p.esUnam)
      .map((p) => ({ nombre: p.nombre, institucion: p.institucion, siglas: p.siglas || '' }));

    const todas = [...PLANTELES_EXTERNOS_SUGERIDOS];
    externasDb.forEach((dbP) => {
      if (!todas.some((t) => t.nombre.toLowerCase() === dbP.nombre.toLowerCase())) {
        todas.push(dbP);
      }
    });

    return todas;
  }, [plantelesIniciales]);

  // Valores derivados: cálculo de término y clave oficial
  const fechaTentativa = useMemo(
    () => (fechaInicio ? calcularFechaTentativa(fechaInicio) : ''),
    [fechaInicio]
  );

  const clave = useMemo(
    () =>
      numeroCuenta && fechaInicio
        ? generarClaveExpediente(tipoPrograma, numeroCuenta, fechaInicio)
        : '',
    [numeroCuenta, tipoPrograma, fechaInicio]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clave || !fechaTentativa || !edad || !plantelFinal || !carreraFinal) return;

    startTransition(async () => {
      await registrarExpediente({
        clave,
        nombre,
        apPaterno,
        apMaterno,
        numeroCuenta,
        correoElectronico,
        telefono,
        edad: Number(edad),
        sexo,
        semestre,
        plantelNombre: plantelFinal,
        plantelInstitucion: institucionFinal,
        esUnam,
        plantelSiglas: siglasFinal || undefined,
        carreraNombre: carreraFinal,
        tipoPrograma,
        clavePrograma,
        nombrePrograma,
        cicloEscolar,
        ubicacionDependencia,
        modalidad,
        turno,
        coordinadorGrado,
        coordinadorNombre,
        fechaInicio,
        fechaTentativa,
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2DACB] shadow-xs space-y-8">
      
      {/* SECCIÓN 1: DATOS DEL ALUMNO Y CONTACTO */}
      <div>
        <div className="border-b border-[#E2DACB] pb-2 mb-4">
          <h3 className="text-lg font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0A1E42] text-white text-xs flex items-center justify-center font-bold">1</span>
            Datos Personales y de Contacto
          </h3>
          <p className="text-xs italic text-[#5C6779] ml-8">Información de identificación del prestador o practicante.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Nombre(s) *</label>
            <input
              required
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Juan Carlos"
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Apellido Paterno *</label>
            <input
              required
              type="text"
              value={apPaterno}
              onChange={(e) => setApPaterno(e.target.value)}
              placeholder="Ej. Pérez"
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Apellido Materno *</label>
            <input
              required
              type="text"
              value={apMaterno}
              onChange={(e) => setApMaterno(e.target.value)}
              placeholder="Ej. López"
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">
              {esUnam ? 'Número de Cuenta UNAM (9 dígitos) *' : 'Matrícula / Boleta / No. Cuenta *'}
            </label>
            <input
              required
              type="text"
              maxLength={esUnam ? 9 : 20}
              value={numeroCuenta}
              onChange={(e) => {
                const val = esUnam ? e.target.value.replace(/\D/g, '') : e.target.value.trim();
                setNumeroCuenta(val);
              }}
              placeholder={esUnam ? '318123456' : 'Ej. 2021640192 o MAT-4590'}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none font-mono font-semibold transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Correo Electrónico *</label>
            <input
              required
              type="email"
              value={correoElectronico}
              onChange={(e) => setCorreoElectronico(e.target.value)}
              placeholder="alumno@comunidad.unam.mx o correo@ipn.mx"
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Teléfono de Contacto *</label>
            <input
              required
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="55 1234 5678"
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Edad *</label>
            <input
              required
              type="number"
              min={17}
              max={99}
              value={edad}
              onChange={(e) => setEdad(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="22"
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Sexo *</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              <option value="H">Hombre</option>
              <option value="M">Mujer</option>
              <option value="O">Otro</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Semestre / Grado Cursando *</label>
            <select
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              {SEMESTRES_UNAM.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: ADSCRIPCIÓN ACADÉMICA (UNAM vs NO UNAM) */}
      <div className="space-y-4">
        <div className="border-b border-[#E2DACB] pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#0A1E42] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0A1E42] text-white text-xs flex items-center justify-center font-bold">2</span>
                Adscripción Académica e Institución
              </h3>
              <p className="text-xs italic text-[#5C6779] ml-8">Selecciona si el alumno proviene de la UNAM o de una institución externa.</p>
            </div>

            {/* Selector de Origen: UNAM vs No UNAM */}
            <div className="inline-flex p-1 bg-[#F5F0E6] rounded-xl border border-[#E2DACB] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setEsUnam(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  esUnam
                    ? 'bg-[#0A1E42] text-white shadow-xs'
                    : 'text-[#0A1E42] hover:bg-white/60'
                }`}
              >
                <School size={14} className={esUnam ? 'text-[#DF9F38]' : ''} />
                Comunidad UNAM
              </button>
              <button
                type="button"
                onClick={() => setEsUnam(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !esUnam
                    ? 'bg-[#008A7C] text-white shadow-xs'
                    : 'text-[#0A1E42] hover:bg-white/60'
                }`}
              >
                <Globe size={14} className={!esUnam ? 'text-white' : ''} />
                Institución Externa (No UNAM)
              </button>
            </div>
          </div>
        </div>

        {/* CONTENIDO SI ES UNAM */}
        {esUnam ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FBF9F5] p-4 sm:p-5 rounded-xl border border-[#E2DACB]">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0A1E42] uppercase flex items-center gap-1.5">
                <School size={14} className="text-[#C68A2C]" />
                Facultad, Escuela o FES (UNAM) *
              </label>
              <select
                value={plantelUnam}
                onChange={(e) => setPlantelUnam(e.target.value)}
                className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
              >
                {PLANTELES_UNAM.map((plantel) => (
                  <option key={plantel} value={plantel}>{plantel}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0A1E42] uppercase">Carrera o Licenciatura UNAM *</label>
              <select
                value={carreraUnam}
                onChange={(e) => setCarreraUnam(e.target.value)}
                className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
              >
                {CARRERAS_UNAM.map((carrera) => (
                  <option key={carrera} value={carrera}>{carrera}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          /* CONTENIDO SI ES NO UNAM / EXTERNA */
          <div className="space-y-4 bg-emerald-50/40 p-4 sm:p-5 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#008A7C] text-white">
                  <Globe size={15} />
                </span>
                <span className="text-xs font-bold text-[#008A7C] uppercase tracking-wide">
                  Registro de Alumno Externo a la UNAM
                </span>
              </div>

              {/* Botón para alternar entre catálogo de escuelas externas y captura manual */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setModoEscuelaExterna('catalogo')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    modoEscuelaExterna === 'catalogo'
                      ? 'bg-[#008A7C] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Catálogo de Escuelas
                </button>
                <button
                  type="button"
                  onClick={() => setModoEscuelaExterna('nueva')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    modoEscuelaExterna === 'nueva'
                      ? 'bg-[#008A7C] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <PlusCircle size={13} />
                  Ingresar Nueva Escuela
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institución / Universidad de Origen */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A1E42] uppercase">Institución / Universidad *</label>
                <select
                  value={institucionExterna}
                  onChange={(e) => setInstitucionExterna(e.target.value)}
                  className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#008A7C] focus:border-[#0A1E42] outline-none transition-all"
                >
                  {INSTITUCIONES_DISPONIBLES.filter((i) => i !== 'UNAM').map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              {/* Si seleccionó "Otra Institución", especificar nombre */}
              {institucionExterna === 'Otra Institución' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0A1E42] uppercase">Nombre de la Institución *</label>
                  <input
                    required
                    type="text"
                    value={otraInstitucionNombre}
                    onChange={(e) => setOtraInstitucionNombre(e.target.value)}
                    placeholder="Ej. Universidad Veracruzana, UAM, ITESM, etc."
                    className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#008A7C] focus:border-[#0A1E42] outline-none transition-all"
                  />
                </div>
              ) : null}

              {/* Plantel / Escuela según modo */}
              {modoEscuelaExterna === 'catalogo' ? (
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-[#0A1E42] uppercase">Plantel, Unidad o Escuela Externa *</label>
                  <select
                    value={plantelExternoSeleccionado}
                    onChange={(e) => setPlantelExternoSeleccionado(e.target.value)}
                    className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#008A7C] focus:border-[#0A1E42] outline-none transition-all"
                  >
                    {escuelasExternasDisponibles.map((escuela) => (
                      <option key={escuela.nombre} value={escuela.nombre}>
                        {escuela.nombre} ({escuela.institucion})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#5C6779] mt-0.5">
                    ¿No encuentras tu escuela? Haz clic en <span className="font-bold text-[#008A7C]">"Ingresar Nueva Escuela"</span> arriba para registrarla.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0A1E42] uppercase">Nombre del Plantel / Escuela *</label>
                    <input
                      required
                      type="text"
                      value={nuevoPlantelNombre}
                      onChange={(e) => setNuevoPlantelNombre(e.target.value)}
                      placeholder="Ej. Escuela Superior de Cómputo (ESCOM)"
                      className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#008A7C] focus:border-[#0A1E42] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0A1E42] uppercase">Siglas / Acrónimo (Opcional)</label>
                    <input
                      type="text"
                      value={nuevoPlantelSiglas}
                      onChange={(e) => setNuevoPlantelSiglas(e.target.value)}
                      placeholder="Ej. ESCOM, UAM-X, UPIITA"
                      className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#008A7C] focus:border-[#0A1E42] outline-none transition-all font-mono"
                    />
                  </div>
                </>
              )}

              {/* Carrera del Alumno Externo */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-[#0A1E42] uppercase">Carrera o Licenciatura del Alumno *</label>
                <input
                  required
                  type="text"
                  list="carreras-sugeridas"
                  value={carreraExterna}
                  onChange={(e) => setCarreraExterna(e.target.value)}
                  placeholder="Ej. Ingeniería en Sistemas Computacionales, Licenciatura en Sociología, etc."
                  className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#008A7C] focus:border-[#0A1E42] outline-none transition-all"
                />
                <datalist id="carreras-sugeridas">
                  {CARRERAS_UNAM.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <p className="text-[11px] text-[#5C6779] mt-0.5">
                  Puedes escribir el nombre exacto del plan de estudios de la universidad de procedencia.
                </p>
              </div>
            </div>

            {/* Resumen Informativo de Adscripción */}
            <div className="p-3 bg-white rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#008A7C]" />
                <span className="text-[#0E1B2E]">
                  Se registrará en el padrón como: <strong className="text-[#008A7C]">{plantelFinal || 'Escuela no definida'}</strong> ({institucionFinal})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 3: PROGRAMA INSTITUCIONAL */}
      <div>
        <div className="border-b border-[#E2DACB] pb-2 mb-4">
          <h3 className="text-lg font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0A1E42] text-white text-xs flex items-center justify-center font-bold">3</span>
            Datos del Programa Institucional
          </h3>
          <p className="text-xs italic text-[#5C6779] ml-8">Registro oficial ante DGOAE / SIASS y características operativas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Tipo de Programa *</label>
            <select
              value={tipoPrograma}
              onChange={(e) => setTipoPrograma(e.target.value as 'SS' | 'PP')}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none font-semibold text-[#0A1E42] transition-all"
            >
              <option value="SS">Servicio Social (SS)</option>
              <option value="PP">Prácticas Profesionales (PP)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Clave de Programa (SIASS/DGOAE) *</label>
            <input
              required
              type="text"
              value={clavePrograma}
              onChange={(e) => setClavePrograma(e.target.value)}
              placeholder="Ej. 2026-12/45-1234"
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Ciclo Escolar *</label>
            <select
              value={cicloEscolar}
              onChange={(e) => setCicloEscolar(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              {CICLOS_ESCOLARES.map((ciclo) => (
                <option key={ciclo} value={ciclo}>{ciclo}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Nombre Oficial del Programa *</label>
            <input
              required
              type="text"
              value={nombrePrograma}
              onChange={(e) => setNombrePrograma(e.target.value)}
              placeholder="Ej. Apoyo a la Investigación en Diversidad Cultural y Patrimonio Comunitario"
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Sede de Asignación PUIC *</label>
            <select
              value={ubicacionDependencia}
              onChange={(e) => setUbicacionDependencia(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              {UBICACIONES_DEPENDENCIA.map((sede) => (
                <option key={sede} value={sede}>{sede}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Modalidad Operativa *</label>
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              {MODALIDADES.map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Turno *</label>
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              {TURNOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: COORDINADOR / RESPONSABLE */}
      <div>
        <div className="border-b border-[#E2DACB] pb-2 mb-4">
          <h3 className="text-lg font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0A1E42] text-white text-xs flex items-center justify-center font-bold">4</span>
            Responsable Directo / Coordinador PUIC
          </h3>
          <p className="text-xs italic text-[#5C6779] ml-8">Académico o funcionario que supervisará las actividades.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Grado Académico *</label>
            <select
              value={coordinadorGrado}
              onChange={(e) => setCoordinadorGrado(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              {GRADOS_ACADEMICOS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3 space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Nombre Completo del Coordinador *</label>
            <input
              required
              type="text"
              value={coordinadorNombre}
              onChange={(e) => setCoordinadorNombre(e.target.value)}
              placeholder="Ej. Roberto Sánchez Morales"
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 5: TIEMPOS Y CLAVE INSTITUCIONAL */}
      <div className="bg-[#FBF9F5] p-6 rounded-2xl border border-[#E2DACB]">
        <div className="border-b border-[#E2DACB] pb-2 mb-4">
          <h3 className="text-lg font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C68A2C] text-white text-xs flex items-center justify-center font-bold">5</span>
            Tiempos Oficiales y Clave Única
          </h3>
          <p className="text-xs italic text-[#5C6779] ml-8">Cálculo normativo de 6 meses y generación automática de identificador institucional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Fecha de Inicio Oficial *</label>
            <input
              required
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#C68A2C] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5C6779] uppercase">Fecha Tentativa (+6 Meses)</label>
            <input
              readOnly
              type="date"
              value={fechaTentativa}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-slate-100 text-slate-600 font-medium cursor-not-allowed"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Clave Única Institucional</label>
            <input
              readOnly
              type="text"
              value={clave}
              placeholder="Automático (SS/PP-Cuenta-Fecha)"
              className="w-full p-2.5 border border-[#C68A2C] rounded-xl text-sm bg-[#C68A2C]/10 text-[#0A1E42] font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* BOTÓN DE ACCIÓN */}
      <div className="flex justify-end pt-4 border-t border-[#E2DACB]">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#0A1E42] hover:bg-[#06132A] text-white font-bold py-3 px-8 rounded-xl border-b-2 border-[#C68A2C] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
        >
          {isPending ? (
            <span>Guardando Expediente...</span>
          ) : (
            <>
              <CheckCircle2 size={18} className="text-[#DF9F38]" />
              <span>Guardar y Registrar Expediente</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
