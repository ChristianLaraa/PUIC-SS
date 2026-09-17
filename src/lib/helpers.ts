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

export function generarClaveExpediente(
  tipo: 'SS' | 'PP',
  rfc: string,
  fechaRegistro: string
): string {
  if (!rfc || !fechaRegistro) return '';
  const [anio, mes, dia] = fechaRegistro.split('-');
  return `${tipo}${rfc.trim().toUpperCase()}${dia}${mes}${anio}`;
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