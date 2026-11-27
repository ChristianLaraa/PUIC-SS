'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Ban } from 'lucide-react';

interface WeekdayDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  id?: string;
}

const MESES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const DIAS_SEMANA_CORTOS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

function parseISO(iso: string): { year: number; month: number; day: number } | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDisplay(iso: string): string {
  const parsed = parseISO(iso);
  if (!parsed) return '';
  const d = new Date(parsed.year, parsed.month, parsed.day);
  return d.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function WeekdayDatePicker({
  value,
  onChange,
  required = false,
  placeholder = 'Selecciona una fecha (Lun - Vie)',
  id,
}: WeekdayDatePickerProps) {
  const parsedValue = useMemo(() => parseISO(value), [value]);
  const today = useMemo(() => new Date(), []);

  const [abierto, setAbierto] = useState(false);
  const [vistaAnio, setVistaAnio] = useState(() => parsedValue?.year ?? today.getFullYear());
  const [vistaMes, setVistaMes] = useState(() => parsedValue?.month ?? today.getMonth());
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFuera(event: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setAbierto(false);
    }
    if (abierto) {
      document.addEventListener('mousedown', handleClickFuera);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [abierto]);

  function toggleCalendario() {
    if (!abierto && parsedValue) {
      setVistaAnio(parsedValue.year);
      setVistaMes(parsedValue.month);
    }
    setAbierto((prev) => !prev);
  }

  function mesAnterior() {
    if (vistaMes === 0) {
      setVistaMes(11);
      setVistaAnio((y) => y - 1);
    } else {
      setVistaMes((m) => m - 1);
    }
  }

  function mesSiguiente() {
    if (vistaMes === 11) {
      setVistaMes(0);
      setVistaAnio((y) => y + 1);
    } else {
      setVistaMes((m) => m + 1);
    }
  }

  const celdas = useMemo(() => {
    const primerDia = new Date(vistaAnio, vistaMes, 1);
    // Convertir domingo=0..sábado=6 a lunes=0..domingo=6
    const offsetLunes = (primerDia.getDay() + 6) % 7;
    const diasEnMes = new Date(vistaAnio, vistaMes + 1, 0).getDate();

    const lista: Array<{
      dia: number | null;
      iso: string;
      esFinDeSemana: boolean;
      esHoy: boolean;
      esSeleccionado: boolean;
    }> = [];

    for (let i = 0; i < offsetLunes; i++) {
      lista.push({
        dia: null,
        iso: `empty-${i}`,
        esFinDeSemana: false,
        esHoy: false,
        esSeleccionado: false,
      });
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(vistaAnio, vistaMes, dia);
      const dow = fecha.getDay();
      const finDeSemana = dow === 0 || dow === 6;
      const iso = toISO(vistaAnio, vistaMes, dia);
      const esHoy =
        today.getFullYear() === vistaAnio &&
        today.getMonth() === vistaMes &&
        today.getDate() === dia;

      lista.push({
        dia,
        iso,
        esFinDeSemana: finDeSemana,
        esHoy,
        esSeleccionado: value === iso,
      });
    }

    return lista;
  }, [vistaAnio, vistaMes, value, today]);

  function seleccionarDia(iso: string, finDeSemana: boolean) {
    if (finDeSemana) return;
    onChange(iso);
    setAbierto(false);
  }

  const aniosDisponibles = useMemo(() => {
    const base = today.getFullYear();
    const lista: number[] = [];
    for (let y = base - 3; y <= base + 4; y++) {
      lista.push(y);
    }
    return lista;
  }, [today]);

  return (
    <div ref={contenedorRef} className="relative">
      {/* Input oculto para mantener validación nativa HTML required */}
      <input
        id={id}
        type="text"
        required={required}
        value={value}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />

      <button
        type="button"
        onClick={toggleCalendario}
        className="w-full p-2.5 border border-[#E2DACB] rounded-xl text-sm bg-white hover:border-[#0A1E42] focus:ring-2 focus:ring-[#C68A2C] outline-none transition-all flex items-center justify-between gap-2 text-left cursor-pointer"
      >
        <span className={value ? 'text-[#0A1E42] font-semibold capitalize' : 'text-slate-400'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <CalendarIcon size={16} className="text-[#C68A2C] shrink-0" />
      </button>

      {abierto && (
        <div className="absolute z-40 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-[#E2DACB] shadow-xl p-4 space-y-3 left-0">
          {/* Cabecera Mes / Año */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={mesAnterior}
              className="p-1.5 rounded-lg hover:bg-[#F5F0E6] text-[#0A1E42] transition-colors cursor-pointer"
              aria-label="Mes anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1.5">
              <select
                value={vistaMes}
                onChange={(e) => setVistaMes(Number(e.target.value))}
                className="text-xs font-bold text-[#0A1E42] bg-[#FBF9F5] border border-[#E2DACB] rounded-lg px-2 py-1 outline-none cursor-pointer"
              >
                {MESES_ES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={vistaAnio}
                onChange={(e) => setVistaAnio(Number(e.target.value))}
                className="text-xs font-bold text-[#0A1E42] bg-[#FBF9F5] border border-[#E2DACB] rounded-lg px-2 py-1 outline-none cursor-pointer"
              >
                {aniosDisponibles.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={mesSiguiente}
              className="p-1.5 rounded-lg hover:bg-[#F5F0E6] text-[#0A1E42] transition-colors cursor-pointer"
              aria-label="Mes siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Encabezados días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DIAS_SEMANA_CORTOS.map((dia, idx) => {
              const esFinde = idx >= 5;
              return (
                <div
                  key={dia}
                  className={`text-[11px] font-bold py-1 rounded ${
                    esFinde ? 'text-rose-400 bg-rose-50/60' : 'text-[#5C6779]'
                  }`}
                >
                  {dia}
                </div>
              );
            })}
          </div>

          {/* Cuadrícula de días */}
          <div className="grid grid-cols-7 gap-1">
            {celdas.map((celda) => {
              if (celda.dia === null) {
                return <div key={celda.iso} className="h-8" />;
              }

              if (celda.esFinDeSemana) {
                return (
                  <button
                    key={celda.iso}
                    type="button"
                    disabled
                    title="Sábados y domingos bloqueados"
                    className="h-8 rounded-lg text-xs font-medium text-slate-300 bg-slate-100/80 line-through cursor-not-allowed flex items-center justify-center select-none"
                  >
                    {celda.dia}
                  </button>
                );
              }

              return (
                <button
                  key={celda.iso}
                  type="button"
                  onClick={() => seleccionarDia(celda.iso, false)}
                  className={`h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                    celda.esSeleccionado
                      ? 'bg-[#0A1E42] text-white shadow-xs ring-2 ring-[#C68A2C]'
                      : celda.esHoy
                      ? 'bg-[#C68A2C]/20 text-[#0A1E42] font-bold border border-[#C68A2C]'
                      : 'text-[#0E1B2E] hover:bg-[#F5F0E6] hover:text-[#0A1E42]'
                  }`}
                >
                  {celda.dia}
                </button>
              );
            })}
          </div>

          {/* Leyenda de bloqueo de fines de semana */}
          <div className="pt-2 border-t border-[#E2DACB] flex items-center gap-1.5 text-[10px] text-[#5C6779]">
            <Ban size={12} className="text-rose-500 shrink-0" />
            <span>Sábados y domingos bloqueados (solo días hábiles L–V).</span>
          </div>
        </div>
      )}
    </div>
  );
}
