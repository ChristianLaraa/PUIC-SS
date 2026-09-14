-- CreateTable
CREATE TABLE "cat_carreras" (
    "idCarrera" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "plantel" TEXT
);

-- CreateTable
CREATE TABLE "cat_coordinadores" (
    "idCoordinador" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombreCompleto" TEXT NOT NULL,
    "programa" TEXT
);

-- CreateTable
CREATE TABLE "expedientes" (
    "idExpediente" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clave" TEXT NOT NULL,
    "nombreAlumno" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "tipoPrograma" TEXT NOT NULL,
    "idCarrera" INTEGER NOT NULL,
    "idCoordinador" INTEGER NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaTentativa" DATETIME NOT NULL,
    "fechaTermino" DATETIME,
    "estatus" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "expedientes_idCarrera_fkey" FOREIGN KEY ("idCarrera") REFERENCES "cat_carreras" ("idCarrera") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "expedientes_idCoordinador_fkey" FOREIGN KEY ("idCoordinador") REFERENCES "cat_coordinadores" ("idCoordinador") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "seguimiento_documental" (
    "idSeguimiento" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idExpediente" INTEGER NOT NULL,
    "preRegistro" DATETIME,
    "registro" DATETIME,
    "cartaAceptacion" BOOLEAN NOT NULL DEFAULT false,
    "informeFinalUrl" TEXT,
    "cartaTermino" BOOLEAN NOT NULL DEFAULT false,
    "declinacionObs" TEXT,
    CONSTRAINT "seguimiento_documental_idExpediente_fkey" FOREIGN KEY ("idExpediente") REFERENCES "expedientes" ("idExpediente") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "expedientes_clave_key" ON "expedientes"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "seguimiento_documental_idExpediente_key" ON "seguimiento_documental"("idExpediente");
