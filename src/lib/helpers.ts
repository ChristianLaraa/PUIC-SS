const MS_POR_DIA = 1000 * 60 * 60 * 24;

function normalizarFecha(fecha: Date | string): Date {
  if (typeof fecha === 'string') {
    const [anio, mes, dia] = fecha.split('T')[0].split('-').map(Number);
    return new Date(anio, mes - 1, dia, 0, 0, 0, 0);
  }
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatearFechaISO(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function sumarMesesSeguro(anio: number, mesIdx: number, dia: number, meses: number): Date {
  const totalMeses = mesIdx + meses;
  const nuevoAnio = anio + Math.floor(totalMeses / 12);
  const nuevoMes = ((totalMeses % 12) + 12) % 12;
  const ultimoDiaMes = new Date(nuevoAnio, nuevoMes + 1, 0).getDate();
  return new Date(nuevoAnio, nuevoMes, Math.min(dia, ultimoDiaMes));
}

/**
 * Devuelve true si la fecha corresponde a sábado (6) o domingo (0).
 */
export function esFinDeSemana(fecha: Date | string): boolean {
  if (!fecha) return false;
  const d = normalizarFecha(fecha);
  const diaSemana = d.getDay();
  return diaSemana === 0 || diaSemana === 6;
}

/**
 * Si la fecha cae en sábado o domingo, la recorre al lunes siguiente.
 */
export function ajustarADiaHabilSiguiente(fecha: Date): Date {
  const d = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const diaSemana = d.getDay();
  if (diaSemana === 6) {
    d.setDate(d.getDate() + 2);
  } else if (diaSemana === 0) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export function obtenerDiasRestantes(fechaTentativa: Date | string) {
  const hoy = normalizarFecha(new Date());
  const fecha = normalizarFecha(fechaTentativa);
  const dias = Math.ceil((fecha.getTime() - hoy.getTime()) / MS_POR_DIA);

  return { dias, esCritico: dias <= 30 && dias >= 0 };
}

/**
 * Genera un folio institucional numérico e iterativo de 6 dígitos con base en los datos.
 * Estructura: [2 dígitos del año de inicio o registro][4 dígitos del consecutivo iterativo]
 * Ejemplo: Año 2026 y expediente #14 => "260014"
 */
export function generarFolioExpediente(
  fechaInicio?: string,
  consecutivo: number = 1
): string {
  const anio = fechaInicio && fechaInicio.includes('-')
    ? fechaInicio.split('-')[0]
    : String(new Date().getFullYear());
  const year2Digits = (anio || String(new Date().getFullYear())).slice(-2);
  const contador4Digits = String(Math.max(1, consecutivo)).padStart(4, '0');
  return `${year2Digits}${contador4Digits}`;
}

export function generarClaveExpediente(
  tipo: 'SS' | 'PP',
  numeroCuenta: string,
  fechaInicio: string,
  consecutivo: number = 1
): string {
  return generarFolioExpediente(fechaInicio, consecutivo);
}

/**
 * Calcula la fecha tentativa de término de acuerdo al tipo de programa y horas:
 * - Servicio Social (SS) o 480 hrs: +6 meses calendario
 * - Prácticas Profesionales (PP) 360 hrs: +4 meses y 15 días (4.5 meses)
 * - Prácticas Profesionales (PP) 240 hrs: +3 meses calendario
 * Si la fecha calculada cae en sábado o domingo, se ajusta al lunes siguiente.
 */
export function calcularFechaTentativa(
  fechaInicio: string,
  tipoPrograma: 'SS' | 'PP' = 'SS',
  horasRequeridas: number = 480
): string {
  if (!fechaInicio) return '';
  const [anio, mes, dia] = fechaInicio.split('T')[0].split('-').map(Number);
  if (!anio || !mes || !dia) return '';

  const horasEfectivas = tipoPrograma === 'SS' ? 480 : horasRequeridas;

  let fechaCalculada: Date;
  if (horasEfectivas === 240) {
    fechaCalculada = sumarMesesSeguro(anio, mes - 1, dia, 3);
  } else if (horasEfectivas === 360) {
    fechaCalculada = sumarMesesSeguro(anio, mes - 1, dia, 4);
    fechaCalculada.setDate(fechaCalculada.getDate() + 15);
  } else {
    fechaCalculada = sumarMesesSeguro(anio, mes - 1, dia, 6);
  }

  const fechaHabil = ajustarADiaHabilSiguiente(fechaCalculada);
  return formatearFechaISO(fechaHabil);
}

export function describirPlazoPrograma(
  tipoPrograma: string,
  horasRequeridas?: number | null
): string {
  if (tipoPrograma === 'SS') {
    return '6 meses · 480 hrs';
  }
  const horas = horasRequeridas ?? 480;
  if (horas === 240) return '3 meses · 240 hrs';
  if (horas === 360) return '4.5 meses · 360 hrs';
  return '6 meses · 480 hrs';
}
