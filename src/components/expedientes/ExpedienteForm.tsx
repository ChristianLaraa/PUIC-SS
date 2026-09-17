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
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
      
      {/* SECCIÓN 1: DATOS DEL ALUMNO Y CONTACTO */}
      <div>
        <div className="border-b border-slate-200 pb-2 mb-4">
          <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#002B7A] text-white text-xs flex items-center justify-center font-bold">1</span>
            Datos Personales y de Contacto
          </h3>
          <p className="text-xs text-slate-500 ml-8">Información de identificación del prestador o practicante.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Nombre(s) *</label>
            <input
              required
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Juan Carlos"
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Apellido Paterno *</label>
            <input
              required
              type="text"
              value={apPaterno}
              onChange={(e) => setApPaterno(e.target.value)}
              placeholder="Ej. Pérez"
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Apellido Materno *</label>
            <input
              required
              type="text"
              value={apMaterno}
              onChange={(e) => setApMaterno(e.target.value)}
              placeholder="Ej. López"
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Número de Cuenta (9 dígitos) *</label>
            <input
              required
              type="text"
              maxLength={9}
              value={numeroCuenta}
              onChange={(e) => setNumeroCuenta(e.target.value.replace(/\D/g, ''))}
              placeholder="318123456"
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none font-mono font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Correo Electrónico *</label>
            <input
              required
              type="email"
              value={correoElectronico}
              onChange={(e) => setCorreoElectronico(e.target.value)}
              placeholder="alumno@comunidad.unam.mx"
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Teléfono de Contacto *</label>
            <input
              required
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="55 1234 5678"
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Edad *</label>
            <input
              required
              type="number"
              min={17}
              max={99}
              value={edad}
              onChange={(e) => setEdad(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Ej. 22"
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Sexo *</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            >
              <option value="H">Hombre</option>
              <option value="M">Mujer</option>
              <option value="O">Otro</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Semestre Cursando *</label>
            <select
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
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
        <div className="border-b border-slate-200 pb-2 mb-4">
          <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#002B7A] text-white text-xs flex items-center justify-center font-bold">2</span>
            Adscripción Académica UNAM
          </h3>
          <p className="text-xs text-slate-500 ml-8">Plantel y carrera de procedencia del alumno.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Facultad o Escuela (Plantel) *</label>
            <select
              value={plantelNombre}
              onChange={(e) => setPlantelNombre(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            >
              {PLANTELES_UNAM.map((plantel) => (
                <option key={plantel} value={plantel}>{plantel}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Carrera *</label>
            <select
              value={carreraNombre}
              onChange={(e) => setCarreraNombre(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
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
        <div className="border-b border-slate-200 pb-2 mb-4">
          <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#002B7A] text-white text-xs flex items-center justify-center font-bold">3</span>
            Datos del Programa Institucional
          </h3>
          <p className="text-xs text-slate-500 ml-8">Registro oficial ante DGOAE / SIASS y características operativas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Tipo de Programa *</label>
            <select
              value={tipoPrograma}
              onChange={(e) => setTipoPrograma(e.target.value as 'SS' | 'PP')}
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none font-semibold text-[#002B7A]"
            >
              <option value="SS">Servicio Social (SS)</option>
              <option value="PP">Prácticas Profesionales (PP)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Clave del Programa *</label>
            <input
              required
              type="text"
              value={clavePrograma}
              onChange={(e) => setClavePrograma(e.target.value)}
              placeholder="Ej. 2026-12/45-1234"
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Ciclo Escolar *</label>
            <select
              value={cicloEscolar}
              onChange={(e) => setCicloEscolar(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            >
              {CICLOS_ESCOLARES.map((ciclo) => (
                <option key={ciclo} value={ciclo}>{ciclo}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 md:col-span-3">
            <label className="text-xs font-semibold text-slate-700 uppercase">Nombre del Programa / Proyecto *</label>
            <input
              required
              type="text"
              value={nombrePrograma}
              onChange={(e) => setNombrePrograma(e.target.value)}
              placeholder="Ej. Apoyo en Investigación Intercultural y Difusión Comunitaria"
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Ubicación de la Dependencia *</label>
            <select
              value={ubicacionDependencia}
              onChange={(e) => setUbicacionDependencia(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            >
              {UBICACIONES_DEPENDENCIA.map((ubi) => (
                <option key={ubi} value={ubi}>{ubi}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Modalidad *</label>
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            >
              {MODALIDADES.map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Turno *</label>
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            >
              {TURNOS.map((tur) => (
                <option key={tur} value={tur}>{tur}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: COORDINADOR / RESPONSABLE */}
      <div>
        <div className="border-b border-slate-200 pb-2 mb-4">
          <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#002B7A] text-white text-xs flex items-center justify-center font-bold">4</span>
            Responsable / Coordinador del Programa
          </h3>
          <p className="text-xs text-slate-500 ml-8">Titular o asesor directo asignado al alumno.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1 md:col-span-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Grado Académico *</label>
            <select
              value={coordinadorGrado}
              onChange={(e) => setCoordinadorGrado(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none font-medium"
            >
              {GRADOS_ACADEMICOS.map((grado) => (
                <option key={grado} value={grado}>{grado}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1 md:col-span-3">
            <label className="text-xs font-semibold text-slate-700 uppercase">Nombre Completo del Responsable *</label>
            <input
              required
              type="text"
              value={coordinadorNombre}
              onChange={(e) => setCoordinadorNombre(e.target.value)}
              placeholder="Ej. Roberto Sánchez Morales"
              className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#002B7A] outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 5: TIEMPOS Y CLAVE INSTITUCIONAL */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="border-b border-slate-200 pb-2 mb-4">
          <h3 className="text-base font-bold text-[#0A1E42] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#D59F0F] text-[#0A1E42] text-xs flex items-center justify-center font-bold">5</span>
            Tiempos Oficiales y Clave Única
          </h3>
          <p className="text-xs text-slate-500 ml-8">Cálculo normativo de 6 meses y generación de identificador.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Fecha de Inicio Oficial *</label>
            <input
              required
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#002B7A] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase">Fecha Tentativa (+6 Meses)</label>
            <input
              readOnly
              type="date"
              value={fechaTentativa}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-600 font-medium cursor-not-allowed"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#002B7A] uppercase">Clave Única Institucional</label>
            <input
              readOnly
              type="text"
              value={clave}
              placeholder="Automático (SS/PP-Cuenta-Fecha)"
              className="w-full p-2.5 border border-[#D59F0F] rounded-lg text-sm bg-amber-50 text-[#0A1E42] font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* BOTÓN DE ACCIÓN */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#002B7A] hover:bg-[#0A1E42] text-white font-semibold py-3 px-8 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Guardando Expediente...' : 'Guardar y Registrar Expediente'}
        </button>
      </div>
    </form>
  );
}
