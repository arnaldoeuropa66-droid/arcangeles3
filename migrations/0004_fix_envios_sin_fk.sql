-- Recrear envios_diarios sin FOREIGN KEY constraint
-- (para convivir con usuarios_prueba hasta que llegue Stripe)

-- 1. Renombrar la tabla antigua
ALTER TABLE envios_diarios RENAME TO envios_diarios_old;

-- 2. Crear la nueva tabla sin FK
CREATE TABLE envios_diarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  angel_slug TEXT NOT NULL,
  fecha_envio INTEGER NOT NULL,
  canal TEXT NOT NULL,
  estado TEXT DEFAULT 'enviado'
);

CREATE INDEX IF NOT EXISTS idx_envios_fecha ON envios_diarios(fecha_envio);

-- 3. Eliminar la tabla antigua
DROP TABLE envios_diarios_old;