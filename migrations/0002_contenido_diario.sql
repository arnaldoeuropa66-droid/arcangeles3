-- Tabla de contenido diario por ángel
CREATE TABLE IF NOT EXISTS contenido_diario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  angel_slug TEXT NOT NULL,
  fecha TEXT NOT NULL,
  versiculo TEXT NOT NULL,
  cita_versiculo TEXT NOT NULL,
  oracion TEXT NOT NULL,
  reflexion TEXT NOT NULL,
  bendicion TEXT,
  imagen_url TEXT,
  fecha_creacion INTEGER NOT NULL,
  UNIQUE(angel_slug, fecha)
);

CREATE INDEX IF NOT EXISTS idx_contenido_angel_fecha
  ON contenido_diario(angel_slug, fecha);

-- Tabla de usuarios de prueba (mientras Stripe no está activo)
-- Cuando integremos Stripe, esta tabla se fusionará con la de usuarios real
CREATE TABLE IF NOT EXISTS usuarios_prueba (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT,
  angel_slug TEXT NOT NULL,
  canal TEXT DEFAULT 'email',
  activo INTEGER DEFAULT 1,
  fecha_alta INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_usuarios_prueba_email
  ON usuarios_prueba(email);