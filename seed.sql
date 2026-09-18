-- Datos de demostración para SQLite.
-- Es idempotente: puedes ejecutarlo varias veces sin duplicar registros.
BEGIN TRANSACTION;

INSERT OR IGNORE INTO "Plantel" ("nombre", "siglas") VALUES
  ('Facultad de Ciencias', 'FC'),
  ('Facultad de Ingeniería', 'FI'),
  ('Facultad de Ciencias Políticas y Sociales (FCPyS)', 'FCPyS'),
  ('Facultad de Psicología', 'FP'),
  ('FES Acatlán', 'FES-A'),
  ('FES Zaragoza', 'FES-Z'),
  ('Facultad de Medicina', 'FM');

INSERT OR IGNORE INTO "Carrera" ("nombre") VALUES
  ('Actuaría'),
  ('Ciencia de Datos'),
  ('Ciencias de la Comunicación'),
  ('Derecho'),
  ('Ingeniería en Computación'),
  ('Medicina Cirujano'),
  ('Psicología'),
  ('Relaciones Internacionales');

INSERT OR IGNORE INTO "Coordinador" ("nombreCompleto", "gradoAcademico") VALUES
  ('Mariana López Hernández', 'Mtra.'),
  ('Jorge Alberto Ramírez Soto', 'Dr.'),
  ('Elena Martínez Cruz', 'Lic.'),
  ('Roberto Sánchez Morales', 'Ing.'),
  ('Patricia García Torres', 'Dra.');

INSERT OR IGNORE INTO "Expediente" (
  "clave", "nombre", "apPaterno", "apMaterno", "numeroCuenta", "correoElectronico",
  "telefono", "edad", "sexo", "semestre", "idPlantel", "idCarrera", "tipoPrograma",
  "clavePrograma", "nombrePrograma", "cicloEscolar", "ubicacionDependencia", "modalidad",
  "turno", "idCoordinador", "fechaInicio", "fechaTentativa", "fechaTermino", "estatus",
  "createdAt", "updatedAt"
) VALUES
  ('SS-421123456-2026', 'Ana Sofía', 'García', 'Mendoza', '421123456', 'ana.garcia@comunidad.unam.mx',
   '55 1234 5678', 21, 'M', '8vo Semestre',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'Facultad de Ciencias'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Ciencia de Datos'), 'SS', 'SS-2026-014',
   'Análisis de información para proyectos culturales', '2026-2', 'Sede Central PUIC (Loreto)', 'Mixta', 'Matutino',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Mariana López Hernández'),
   '2026-04-15 00:00:00', '2026-10-15 00:00:00', NULL, 'Activo', '2026-04-10 09:00:00', '2026-09-17 09:00:00'),

  ('PP-422234567-2026', 'Diego', 'Hernández', 'Vega', '422234567', 'diego.hernandez@comunidad.unam.mx',
   '55 2345 6789', 22, 'H', '9no Semestre',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'Facultad de Ingeniería'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Ingeniería en Computación'), 'PP', 'PP-2026-031',
   'Desarrollo de herramientas digitales para el PUIC', '2026-2', 'Sede Central PUIC (Loreto)', 'Presencial', 'Vespertino',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Roberto Sánchez Morales'),
   '2026-04-02 00:00:00', '2026-10-02 00:00:00', NULL, 'Activo', '2026-03-28 10:30:00', '2026-09-17 10:30:00'),

  ('SS-423345678-2026', 'Valeria', 'Santos', 'Ríos', '423345678', 'valeria.santos@comunidad.unam.mx',
   '55 3456 7890', 20, 'M', '7mo Semestre',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'FES Acatlán'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Relaciones Internacionales'), 'SS', 'SS-2026-008',
   'Vinculación comunitaria y cooperación internacional', '2026-1', 'Sede Externa (Oaxaca)', 'A Distancia', 'Mixto',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Jorge Alberto Ramírez Soto'),
   '2026-02-28 00:00:00', '2026-08-30 00:00:00', NULL, 'Activo', '2026-02-20 08:45:00', '2026-09-17 08:45:00'),

  ('PP-424456789-2026', 'Luis Fernando', 'Morales', 'Castillo', '424456789', 'luis.morales@comunidad.unam.mx',
   '55 4567 8901', 23, 'H', 'Pasante / Egresado',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'Facultad de Ciencias Políticas y Sociales (FCPyS)'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Ciencias de la Comunicación'), 'PP', 'PP-2026-022',
   'Producción de contenidos de divulgación', '2026-1', 'Sede Central PUIC (Loreto)', 'Presencial', 'Matutino',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Elena Martínez Cruz'),
   '2026-01-15 00:00:00', '2026-07-15 00:00:00', '2026-07-12 00:00:00', 'Terminado', '2026-01-10 11:15:00', '2026-07-12 16:00:00'),

  ('SS-425567890-2026', 'Camila', 'Torres', 'Nava', '425567890', 'camila.torres@comunidad.unam.mx',
   '55 5678 9012', 21, 'M', '8vo Semestre',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'Facultad de Psicología'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Psicología'), 'SS', 'SS-2026-019',
   'Acompañamiento psicosocial comunitario', '2026-1', 'Sede Externa (Oaxaca)', 'Mixta', 'Matutino',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Patricia García Torres'),
   '2026-02-01 00:00:00', '2026-08-01 00:00:00', NULL, 'Declinado', '2026-01-25 12:00:00', '2026-03-10 12:00:00'),

  ('SS-426678901-2026', 'Emiliano', 'Cruz', 'Ortega', '426678901', 'emiliano.cruz@comunidad.unam.mx',
   '55 6789 0123', 22, 'H', '10mo Semestre',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'Facultad de Medicina'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Medicina Cirujano'), 'SS', 'SS-2026-027',
   'Promoción de la salud en comunidades indígenas', '2026-2', 'Sede Externa (Oaxaca)', 'Presencial', 'Matutino',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Patricia García Torres'),
   '2026-05-05 00:00:00', '2026-11-05 00:00:00', NULL, 'Activo', '2026-04-29 09:20:00', '2026-09-17 09:20:00'),

  ('PP-427789012-2026', 'Ximena', 'Luna', 'Pérez', '427789012', 'ximena.luna@comunidad.unam.mx',
   '55 7890 1234', 20, 'M', '7mo Semestre',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'FES Zaragoza'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Derecho'), 'PP', 'PP-2026-041',
   'Asesoría jurídica y gestión de derechos culturales', '2026-1', 'Sede Central PUIC (Loreto)', 'A Distancia', 'Vespertino',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Elena Martínez Cruz'),
   '2026-03-20 00:00:00', '2026-09-20 00:00:00', NULL, 'Activo', '2026-03-15 14:00:00', '2026-09-17 14:00:00'),

  ('SS-428890123-2026', 'Santiago', 'Vargas', 'León', '428890123', 'santiago.vargas@comunidad.unam.mx',
   '55 8901 2345', 22, 'H', 'Pasante / Egresado',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'Facultad de Ciencias'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Actuaría'), 'SS', 'SS-2026-011',
   'Estadística aplicada a estudios humanísticos', '2026-1', 'Sede Central PUIC (Loreto)', 'A Distancia', 'Mixto',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Mariana López Hernández'),
   '2026-01-10 00:00:00', '2026-07-10 00:00:00', '2026-07-08 00:00:00', 'Terminado', '2026-01-06 08:00:00', '2026-07-08 15:30:00'),

  ('PP-429901234-2026', 'Renata', 'Flores', 'Salas', '429901234', 'renata.flores@comunidad.unam.mx',
   '55 9012 3456', 21, 'M', '8vo Semestre',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'FES Acatlán'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Ciencia de Datos'), 'PP', 'PP-2026-052',
   'Visualización de datos para observatorios culturales', '2027-1', 'Sede Central PUIC (Loreto)', 'Mixta', 'Matutino',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Roberto Sánchez Morales'),
   '2026-11-15 00:00:00', '2027-05-15 00:00:00', NULL, 'Activo', '2026-09-10 10:00:00', '2026-09-17 10:00:00'),

  ('SS-430012345-2026', 'Mateo', 'Ramírez', 'Ibarra', '430012345', 'mateo.ramirez@comunidad.unam.mx',
   '55 0123 4567', 20, 'H', '6to Semestre',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'Facultad de Ingeniería'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Ingeniería en Computación'), 'SS', 'SS-2026-033',
   'Mantenimiento de acervos digitales', '2026-2', 'Sede Central PUIC (Loreto)', 'Presencial', 'Vespertino',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Jorge Alberto Ramírez Soto'),
   '2026-04-10 00:00:00', '2026-10-10 00:00:00', NULL, 'Declinado', '2026-04-05 09:45:00', '2026-05-02 11:00:00'),

  ('SS-431123450-2026', 'Sofía', 'Navarro', 'Delgado', '431123450', 'sofia.navarro@comunidad.unam.mx',
   '55 1122 3344', 23, 'O', '9no Semestre',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'Facultad de Ciencias Políticas y Sociales (FCPyS)'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Relaciones Internacionales'), 'SS', 'SS-2026-039',
   'Investigación sobre patrimonio cultural inmaterial', '2026-2', 'Sede Externa (Oaxaca)', 'A Distancia', 'Mixto',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Mariana López Hernández'),
   '2026-05-18 00:00:00', '2026-11-18 00:00:00', NULL, 'Activo', '2026-05-12 13:30:00', '2026-09-17 13:30:00'),

  ('PP-432234561-2026', 'Carlos Eduardo', 'Mejía', 'Romero', '432234561', 'carlos.mejia@comunidad.unam.mx',
   '55 2233 4455', 24, 'H', 'Pasante / Egresado',
   (SELECT "idPlantel" FROM "Plantel" WHERE "nombre" = 'FES Zaragoza'),
   (SELECT "idCarrera" FROM "Carrera" WHERE "nombre" = 'Psicología'), 'PP', 'PP-2026-016',
   'Evaluación de programas de intervención social', '2026-1', 'Sede Externa (Oaxaca)', 'Mixta', 'Vespertino',
   (SELECT "idCoordinador" FROM "Coordinador" WHERE "nombreCompleto" = 'Patricia García Torres'),
   '2026-01-22 00:00:00', '2026-07-22 00:00:00', '2026-07-20 00:00:00', 'Terminado', '2026-01-18 12:15:00', '2026-07-20 17:00:00');

INSERT OR IGNORE INTO "SeguimientoDocumental" (
  "idExpediente", "preRegistro", "registro", "cartaAceptacion", "informeFinalUrl", "cartaTermino",
  "declinacionObs", "createdAt", "updatedAt"
) VALUES
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'SS-421123456-2026'), '2026-04-01 00:00:00', '2026-04-10 00:00:00', 1, NULL, 0, NULL, '2026-04-10 09:00:00', '2026-09-17 09:00:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'PP-422234567-2026'), '2026-03-20 00:00:00', '2026-03-28 00:00:00', 1, NULL, 0, NULL, '2026-03-28 10:30:00', '2026-09-17 10:30:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'SS-423345678-2026'), '2026-02-14 00:00:00', '2026-02-20 00:00:00', 0, NULL, 0, 'Pendiente de regularizar documentación.', '2026-02-20 08:45:00', '2026-09-17 08:45:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'PP-424456789-2026'), '2026-01-04 00:00:00', '2026-01-10 00:00:00', 1, '/documentos/informe-luis-morales.pdf', 1, NULL, '2026-01-10 11:15:00', '2026-07-12 16:00:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'SS-425567890-2026'), '2026-01-18 00:00:00', '2026-01-25 00:00:00', 1, NULL, 0, 'Cambio de residencia fuera de la sede asignada.', '2026-01-25 12:00:00', '2026-03-10 12:00:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'SS-426678901-2026'), '2026-04-20 00:00:00', '2026-04-29 00:00:00', 1, NULL, 0, NULL, '2026-04-29 09:20:00', '2026-09-17 09:20:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'PP-427789012-2026'), '2026-03-08 00:00:00', '2026-03-15 00:00:00', 0, NULL, 0, NULL, '2026-03-15 14:00:00', '2026-09-17 14:00:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'SS-428890123-2026'), '2026-01-02 00:00:00', '2026-01-06 00:00:00', 1, '/documentos/informe-santiago-vargas.pdf', 1, NULL, '2026-01-06 08:00:00', '2026-07-08 15:30:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'PP-429901234-2026'), '2026-09-03 00:00:00', '2026-09-10 00:00:00', 1, NULL, 0, NULL, '2026-09-10 10:00:00', '2026-09-17 10:00:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'SS-430012345-2026'), '2026-03-29 00:00:00', '2026-04-05 00:00:00', 0, NULL, 0, 'Incompatibilidad de horario con materias obligatorias.', '2026-04-05 09:45:00', '2026-05-02 11:00:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'SS-431123450-2026'), '2026-05-04 00:00:00', '2026-05-12 00:00:00', 1, NULL, 0, NULL, '2026-05-12 13:30:00', '2026-09-17 13:30:00'),
  ((SELECT "idExpediente" FROM "Expediente" WHERE "clave" = 'PP-432234561-2026'), '2026-01-12 00:00:00', '2026-01-18 00:00:00', 1, '/documentos/informe-carlos-mejia.pdf', 1, NULL, '2026-01-18 12:15:00', '2026-07-20 17:00:00');

COMMIT;
