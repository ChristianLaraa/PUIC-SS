'use client';

import { useState } from 'react';
import { generarClaveExpediente, calcularFechaTentativa } from '../../lib/helpers';
import { registrarExpediente } from '../../actions/expedientes';

export default function ExpedienteForm() {
  const [tipo, setTipo] = useState<'SS' | 'PP'>('SS');
  const [rfc, setRfc] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');

  const claveGenerada = generarClaveExpediente(tipo, rfc, fechaRegistro);
  const fechaTentativaCalculada = calcularFechaTentativa(fechaInicio);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    await registrarExpediente({
      clave: claveGenerada,
      nombreAlumno: form.get('nombre') as string,
      sexo: form.get('sexo') as string,
      tipoPrograma: tipo,
      carreraNombre: form.get('carrera') as string,
      area: form.get('area') as string,
      coordinadorNombre: form.get('coordinador') as string,
      fechaInicio,
      fechaTentativa: fechaTentativaCalculada,
      preRegistro: form.get('preRegistro') as string,
      registro: fechaRegistro,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-4 border-b pb-2">
          1. Datos Generales del Alumno
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre Completo</label>
            <input required name="nombre" type="text" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">RFC Alumno</label>
            <input
              required
              value={rfc}
              onChange={(e) => setRfc(e.target.value)}
              placeholder="LOAP850913"
              className="w-full border rounded-lg p-2 text-sm uppercase focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Sexo</label>
            <select name="sexo" className="w-full border rounded-lg p-2 text-sm">
              <option value="H">Hombre</option>
              <option value="M">Mujer</option>
              <option value="O">Otro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Programa</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as 'SS' | 'PP')} className="w-full border rounded-lg p-2 text-sm font-semibold">
              <option value="SS">Servicio Social (SS)</option>
              <option value="PP">Prácticas Profesionales (PP)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Carrera (Plantel)</label>
            <input required name="carrera" placeholder="Ingeniería en Computación" className="w-full border rounded-lg p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Área</label>
            <input required name="area" placeholder="Desarrollo de Software" className="w-full border rounded-lg p-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Coordinador Asignado</label>
            <input required name="coordinador" placeholder="Ing. Roberto García M." className="w-full border rounded-lg p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Clave Única Calculada</label>
            <input
              readOnly
              value={claveGenerada || 'Complete RFC y Fecha de Registro'}
              className="w-full bg-slate-100 border border-dashed rounded-lg p-2 text-sm font-mono font-bold text-slate-600 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-4 border-b pb-2">
          2. Fechas de Seguimiento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Pre-registro</label>
            <input name="preRegistro" type="date" className="w-full border rounded-lg p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha Registro Oficial</label>
            <input
              required
              type="date"
              value={fechaRegistro}
              onChange={(e) => setFechaRegistro(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha de Inicio</label>
            <input
              required
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha Término Estimada (+6m)</label>
            <input
              readOnly
              type="date"
              value={fechaTentativaCalculada}
              className="w-full bg-slate-100 border border-dashed rounded-lg p-2 text-sm font-bold text-blue-600 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="submit" className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
          Guardar Expediente
        </button>
      </div>
    </form>
  );
}