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
} from '@/lib/constants/catalogos';

export default function ExpedienteForm() {
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
  const [semestre, setSemestre] = useState(SEMESTRES_UNAM[1]); // 6to semestre por defecto

  // 2. Adscripción Académica
  const [plantelNombre, setPlantelNombre] = useState(PLANTELES_UNAM[0]);
  const [carreraNombre, setCarreraNombre] = useState(CARRERAS_UNAM[0]);

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

  // Valores derivados: no requieren estado ni un efecto adicional.
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
    if (!clave || !fechaTentativa || !edad) return;

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
        plantelNombre,
        carreraNombre,
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
          <h3 className="font-serif text-lg font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0A1E42] text-white text-xs flex items-center justify-center font-bold">1</span>
            Datos Personales y de Contacto
          </h3>
          <p className="text-xs font-serif italic text-[#5C6779] ml-8">Información de identificación del prestador o practicante.</p>
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
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Número de Cuenta (9 dígitos) *</label>
            <input
              required
              type="text"
              maxLength={9}
              value={numeroCuenta}
              onChange={(e) => setNumeroCuenta(e.target.value.replace(/\D/g, ''))}
              placeholder="318123456"
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
              placeholder="alumno@comunidad.unam.mx"
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
              placeholder="Ej. 22"
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
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Semestre Cursando *</label>
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

      {/* SECCIÓN 2: ADSCRIPCIÓN ACADÉMICA */}
      <div>
        <div className="border-b border-[#E2DACB] pb-2 mb-4">
          <h3 className="font-serif text-lg font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0A1E42] text-white text-xs flex items-center justify-center font-bold">2</span>
            Adscripción Académica UNAM
          </h3>
          <p className="text-xs font-serif italic text-[#5C6779] ml-8">Plantel y carrera de procedencia del alumno.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Facultad o Escuela (Plantel) *</label>
            <select
              value={plantelNombre}
              onChange={(e) => setPlantelNombre(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              {PLANTELES_UNAM.map((plantel) => (
                <option key={plantel} value={plantel}>{plantel}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Carrera *</label>
            <select
              value={carreraNombre}
              onChange={(e) => setCarreraNombre(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              {CARRERAS_UNAM.map((carrera) => (
                <option key={carrera} value={carrera}>{carrera}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: PROGRAMA INSTITUCIONAL */}
      <div>
        <div className="border-b border-[#E2DACB] pb-2 mb-4">
          <h3 className="font-serif text-lg font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0A1E42] text-white text-xs flex items-center justify-center font-bold">3</span>
            Datos del Programa Institucional
          </h3>
          <p className="text-xs font-serif italic text-[#5C6779] ml-8">Registro oficial ante DGOAE / SIASS y características operativas.</p>
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
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Nombre del Programa / Proyecto Asignado *</label>
            <input
              required
              type="text"
              value={nombrePrograma}
              onChange={(e) => setNombrePrograma(e.target.value)}
              placeholder="Ej. Archivo y Preservación de Lenguas Indígenas Nacionales"
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Ubicación de la Dependencia *</label>
            <select
              value={ubicacionDependencia}
              onChange={(e) => setUbicacionDependencia(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              {UBICACIONES_DEPENDENCIA.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Modalidad *</label>
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-[#FBF9F5] focus:bg-white focus:ring-2 focus:ring-[#C68A2C] focus:border-[#0A1E42] outline-none transition-all"
            >
              {MODALIDADES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0A1E42] uppercase">Turno Asignado *</label>
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
          <h3 className="font-serif text-lg font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0A1E42] text-white text-xs flex items-center justify-center font-bold">4</span>
            Responsable Directo / Coordinador PUIC
          </h3>
          <p className="text-xs font-serif italic text-[#5C6779] ml-8">Académico o funcionario que supervisará las actividades.</p>
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
          <h3 className="font-serif text-lg font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C68A2C] text-white text-xs flex items-center justify-center font-bold">5</span>
            Tiempos Oficiales y Clave Única
          </h3>
          <p className="text-xs font-serif italic text-[#5C6779] ml-8">Cálculo normativo de 6 meses y generación automática de identificador institucional.</p>
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
          className="bg-[#0A1E42] hover:bg-[#06132A] text-white font-serif font-bold py-3 px-8 rounded-xl border-b-2 border-[#C68A2C] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? 'Guardando Expediente...' : 'Guardar y Registrar Expediente'}
        </button>
      </div>
    </form>
  );
}
