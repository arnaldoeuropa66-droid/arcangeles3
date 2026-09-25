-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT,
  stripe_customer_id TEXT,
  plan TEXT DEFAULT 'personal',
  estado TEXT DEFAULT 'activo',
  canal_preferido TEXT DEFAULT 'email',
  fecha_alta INTEGER NOT NULL,
  fecha_baja INTEGER
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_stripe ON usuarios(stripe_customer_id);

-- Ángeles suscritos por usuario
CREATE TABLE IF NOT EXISTS suscripciones_angeles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  angel_slug TEXT NOT NULL,
  activo INTEGER DEFAULT 1,
  fecha_creacion INTEGER NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  UNIQUE(usuario_id, angel_slug)
);

-- Registro de envíos diarios
CREATE TABLE IF NOT EXISTS envios_diarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  angel_slug TEXT NOT NULL,
  fecha_envio INTEGER NOT NULL,
  canal TEXT NOT NULL,
  estado TEXT DEFAULT 'enviado',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_envios_fecha ON envios_diarios(fecha_envio);