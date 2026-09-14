const MS_POR_DIA = 1000 * 60 * 60 * 24;

function inicioDelDia(fecha: Date) {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function obtenerDiasRestantes(fechaTentativa: Date | string) {
  const hoy = inicioDelDia(new Date());
  const fecha = inicioDelDia(new Date(fechaTentativa));
  const dias = Math.ceil((fecha.getTime() - hoy.getTime()) / MS_POR_DIA);

  return { dias };
}
