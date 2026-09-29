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


export function calcularFechaTentativa(fechaInicio: string): string {
  if (!fechaInicio) return '';
  const [anio, mes, dia] = fechaInicio.split('-').map(Number);
  const d = new Date(anio, mes - 1, dia);
  d.setMonth(d.getMonth() + 6);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}