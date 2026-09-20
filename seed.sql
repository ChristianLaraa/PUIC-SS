-- Limpieza previa opcional (descomentar si quieres vaciar las tablas antes)
-- DELETE FROM SeguimientoDocumental;
-- DELETE FROM Expediente;
-- DELETE FROM Coordinador;
-- DELETE FROM Carrera;
-- DELETE FROM Plantel;

-- 1. PLANTELES UNAM
INSERT INTO Plantel (idPlantel, nombre, siglas) VALUES
(1, 'FES Aragón', 'FES-A'),
(2, 'Facultad de Filosofía y Letras (FFyL)', 'FFyL'),
(3, 'Facultad de Ciencias Políticas y Sociales (FCPyS)', 'FCPyS'),
(4, 'Facultad de Ingeniería', 'FI'),
(5, 'Escuela Nacional de Trabajo Social (ENTS)', 'ENTS');

-- 2. CARRERAS UNAM
INSERT INTO Carrera (idCarrera, nombre) VALUES
(1, 'Ingeniería en Computación'),
(2, 'Desarrollo y Gestión Interculturales'),
(3, 'Sociología'),
(4, 'Derecho'),
(5, 'Trabajo Social'),
(6, 'Diseño y Comunicación Visual');

-- 3. COORDINADORES / RESPONSABLES DE PROGRAMA
INSERT INTO Coordinador (idCoordinador, nombreCompleto, gradoAcademico) VALUES
(1, 'Roberto Sánchez Morales', 'Dr.'),
(2, 'María Elena Gómez Tagle', 'Mtra.'),
(3, 'Carlos Mendoza Albarrán', 'Lic.'),
(4, 'Ana Karen Domínguez', 'Ing.');

-- 4. EXPEDIENTES

-- Caso 1: VENCIDO (Inició en ene-2026, venció en jul-2026 y sigue Activo -> Semáforo ROJO)
INSERT INTO Expediente (
  idExpediente, clave, nombre, apPaterno, apMaterno, numeroCuenta, correoElectronico,
  telefono, edad, sexo, semestre, idPlantel, idCarrera, tipoPrograma, clavePrograma,
  nombrePrograma, cicloEscolar, ubicacionDependencia, modalidad, turno, idCoordinador,
  fechaInicio, fechaTentativa, fechaTermino, estatus, createdAt, updatedAt
) VALUES (
  1, 'SS-318091234-150126', 'Rodrigo', 'Morales', 'Paredes', '318091234', 'rodrigo.morales@comunidad.unam.mx',
  '5511223344', 23, 'H', '8vo Semestre', 1, 1, 'SS', '2026-12/45-1001',
  'Digitalización de Acervos Lingüísticos y Étnicos', '2026-1',
  'Sede Central PUIC (C.U. / Oficinas)', 'Presencial', 'Matutino', 1,
  '2026-01-15T00:00:00.000Z', '2026-07-15T00:00:00.000Z', NULL, 'Activo',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Caso 2: PRÓXIMO A VENCER (Inició en abr-2026, vence el 1 de oct-2026 -> Semáforo AMARILLO)
INSERT INTO Expediente (
  idExpediente, clave, nombre, apPaterno, apMaterno, numeroCuenta, correoElectronico,
  telefono, edad, sexo, semestre, idPlantel, idCarrera, tipoPrograma, clavePrograma,
  nombrePrograma, cicloEscolar, ubicacionDependencia, modalidad, turno, idCoordinador,
  fechaInicio, fechaTentativa, fechaTermino, estatus, createdAt, updatedAt
) VALUES (
  2, 'SS-319456789-010426', 'Valeria', 'Estrada', 'Ramos', '319456789', 'valeria.estrada@comunidad.unam.mx',
  '5522334455', 22, 'M', '7mo Semestre', 2, 2, 'SS', '2026-12/45-1002',
  'Investigación sobre Saberes Tradicionales e Interculturalidad', '2026-2',
  'Sede Central PUIC (C.U. / Oficinas)', 'Mixta', 'Matutino', 2,
  '2026-04-01T00:00:00.000Z', '2026-10-01T00:00:00.000Z', NULL, 'Activo',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Caso 3: PRÓXIMO A VENCER EN PP (Inició en abr-2026, vence el 10 de oct-2026 -> Semáforo AMARILLO)
INSERT INTO Expediente (
  idExpediente, clave, nombre, apPaterno, apMaterno, numeroCuenta, correoElectronico,
  telefono, edad, sexo, semestre, idPlantel, idCarrera, tipoPrograma, clavePrograma,
  nombrePrograma, cicloEscolar, ubicacionDependencia, modalidad, turno, idCoordinador,
  fechaInicio, fechaTentativa, fechaTermino, estatus, createdAt, updatedAt
) VALUES (
  3, 'PP-317654321-100426', 'Diego Iván', 'Navarro', 'Soto', '317654321', 'diego.navarro@comunidad.unam.mx',
  '5533445566', 24, 'H', '9no Semestre', 3, 3, 'PP', '2026-12/45-2001',
  'Diagnóstico Socioeconómico en Comunidades Migrantes', '2026-2',
  'Sede Externa / En línea / Proyecto Regional', 'A Distancia', 'Vespertino', 3,
  '2026-04-10T00:00:00.000Z', '2026-10-10T00:00:00.000Z', NULL, 'Activo',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Caso 4: ACTIVO REGULAR (Inició en jun-2026, concluye en dic-2026 -> En tiempo)
INSERT INTO Expediente (
  idExpediente, clave, nombre, apPaterno, apMaterno, numeroCuenta, correoElectronico,
  telefono, edad, sexo, semestre, idPlantel, idCarrera, tipoPrograma, clavePrograma,
  nombrePrograma, cicloEscolar, ubicacionDependencia, modalidad, turno, idCoordinador,
  fechaInicio, fechaTentativa, fechaTermino, estatus, createdAt, updatedAt
) VALUES (
  4, 'SS-420987654-010626', 'Mariana', 'López', 'Gutiérrez', '420987654', 'mariana.lg@comunidad.unam.mx',
  '5544556677', 21, 'M', '6to Semestre', 4, 1, 'SS', '2026-12/45-1003',
  'Desarrollo de Plataforma Web para Difusión de Proyectos Comunitarios', '2026-2',
  'Sede Central PUIC (C.U. / Oficinas)', 'Presencial', 'Tiempo Completo / Mixto', 4,
  '2026-06-01T00:00:00.000Z', '2026-12-01T00:00:00.000Z', NULL, 'Activo',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Caso 5: NUEVO REGISTRO (Inició en ago-2026, termina en feb-2027)
INSERT INTO Expediente (
  idExpediente, clave, nombre, apPaterno, apMaterno, numeroCuenta, correoElectronico,
  telefono, edad, sexo, semestre, idPlantel, idCarrera, tipoPrograma, clavePrograma,
  nombrePrograma, cicloEscolar, ubicacionDependencia, modalidad, turno, idCoordinador,
  fechaInicio, fechaTentativa, fechaTermino, estatus, createdAt, updatedAt
) VALUES (
  5, 'PP-318332211-150826', 'Carlos Alberto', 'Ríos', 'Castillo', '318332211', 'carlos.rios@comunidad.unam.mx',
  '5555667788', 23, 'H', '8vo Semestre', 5, 5, 'PP', '2026-12/45-2002',
  'Intervención Social en Espacios Multiculturales', '2027-1',
  'Sede Central PUIC (C.U. / Oficinas)', 'Presencial', 'Matutino', 3,
  '2026-08-15T00:00:00.000Z', '2027-02-15T00:00:00.000Z', NULL, 'Activo',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Caso 6: CONCLUIDO / TERMINADO (Liberado satisfactoriamente)
INSERT INTO Expediente (
  idExpediente, clave, nombre, apPaterno, apMaterno, numeroCuenta, correoElectronico,
  telefono, edad, sexo, semestre, idPlantel, idCarrera, tipoPrograma, clavePrograma,
  nombrePrograma, cicloEscolar, ubicacionDependencia, modalidad, turno, idCoordinador,
  fechaInicio, fechaTentativa, fechaTermino, estatus, createdAt, updatedAt
) VALUES (
  6, 'SS-316112233-150126', 'Fernanda', 'Castillo', 'Molina', '316112233', 'fer.castillo@comunidad.unam.mx',
  '5566778899', 24, 'M', 'Pasante / Egresado', 1, 4, 'SS', '2026-12/45-1001',
  'Asesoría Jurídica en Derechos Colectivos de Pueblos Indígenas', '2026-1',
  'Sede Central PUIC (C.U. / Oficinas)', 'Mixta', 'Vespertino', 1,
  '2026-01-15T00:00:00.000Z', '2026-07-15T00:00:00.000Z', '2026-07-20T00:00:00.000Z', 'Terminado',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Caso 7: CONCLUIDO / TERMINADO (Liberado satisfactoriamente)
INSERT INTO Expediente (
  idExpediente, clave, nombre, apPaterno, apMaterno, numeroCuenta, correoElectronico,
  telefono, edad, sexo, semestre, idPlantel, idCarrera, tipoPrograma, clavePrograma,
  nombrePrograma, cicloEscolar, ubicacionDependencia, modalidad, turno, idCoordinador,
  fechaInicio, fechaTentativa, fechaTermino, estatus, createdAt, updatedAt
) VALUES (
  7, 'PP-317889900-010226', 'Alejandro', 'Cruz', 'Ortiz', '317889900', 'alejandro.cruz@comunidad.unam.mx',
  '5577889900', 25, 'H', '10mo Semestre', 1, 6, 'PP', '2026-12/45-2003',
  'Identidad Gráfica y Campañas Audiovisuales PUIC', '2026-1',
  'Sede Externa / En línea / Proyecto Regional', 'A Distancia', 'Vespertino', 2,
  '2026-02-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z', '2026-08-05T00:00:00.000Z', 'Terminado',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- Caso 8: DECLINADO / BAJA (Alumno que causó baja por motivos laborales)
INSERT INTO Expediente (
  idExpediente, clave, nombre, apPaterno, apMaterno, numeroCuenta, correoElectronico,
  telefono, edad, sexo, semestre, idPlantel, idCarrera, tipoPrograma, clavePrograma,
  nombrePrograma, cicloEscolar, ubicacionDependencia, modalidad, turno, idCoordinador,
  fechaInicio, fechaTentativa, fechaTermino, estatus, createdAt, updatedAt
) VALUES (
  8, 'SS-319998877-010326', 'Sebastián', 'Fuentes', 'Vega', '319998877', 's.fuentes@comunidad.unam.mx',
  '5588990011', 22, 'H', '7mo Semestre', 3, 3, 'SS', '2026-12/45-1002',
  'Sistematización de Datos Etnográficos', '2026-1',
  'Sede Central PUIC (C.U. / Oficinas)', 'Presencial', 'Matutino', 1,
  '2026-03-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z', NULL, 'Declinado',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

-- 5. SEGUIMIENTO DOCUMENTAL DE CADA EXPEDIENTE

-- Exp 1: Tiene aceptación pero debe informe final y término
INSERT INTO SeguimientoDocumental (idExpediente, cartaAceptacion, informeFinalUrl, cartaTermino, createdAt, updatedAt)
VALUES (1, 1, NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Exp 2: En espera de entrega de informe final
INSERT INTO SeguimientoDocumental (idExpediente, cartaAceptacion, informeFinalUrl, cartaTermino, createdAt, updatedAt)
VALUES (2, 1, NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Exp 3: Entregó informe final en Drive, falta validación de carta término
INSERT INTO SeguimientoDocumental (idExpediente, cartaAceptacion, informeFinalUrl, cartaTermino, createdAt, updatedAt)
VALUES (3, 1, 'https://drive.google.com/file/d/ejemplo-informe-diego-navarro/view', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Exp 4: Trámite reciente, solo carta de aceptación
INSERT INTO SeguimientoDocumental (idExpediente, cartaAceptacion, informeFinalUrl, cartaTermino, createdAt, updatedAt)
VALUES (4, 1, NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Exp 5: Nuevo ingreso, sin documentos
INSERT INTO SeguimientoDocumental (idExpediente, cartaAceptacion, informeFinalUrl, cartaTermino, createdAt, updatedAt)
VALUES (5, 0, NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Exp 6: Liberado completo (Aceptación, Informe y Término)
INSERT INTO SeguimientoDocumental (idExpediente, cartaAceptacion, informeFinalUrl, cartaTermino, createdAt, updatedAt)
VALUES (6, 1, 'https://drive.google.com/file/d/informe-final-fernanda-castillo/view', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Exp 7: Liberado completo
INSERT INTO SeguimientoDocumental (idExpediente, cartaAceptacion, informeFinalUrl, cartaTermino, createdAt, updatedAt)
VALUES (7, 1, 'https://drive.google.com/file/d/informe-final-alejandro-cruz/view', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Exp 8: Declinado con justificación
INSERT INTO SeguimientoDocumental (idExpediente, cartaAceptacion, informeFinalUrl, cartaTermino, declinacionObs, createdAt, updatedAt)
VALUES (8, 1, NULL, 0, 'Baja voluntaria notificada el 15/05/2026 por cruce de horarios laborales en su nuevo empleo.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);