-- ============================================
-- Migración 0008: sistema de doble opt-in
-- ============================================
-- Añade columnas a usuarios_prueba para gestionar el alta con verificación por email

-- Token único para confirmar el email
ALTER TABLE usuarios_prueba ADD COLUMN token_confirmacion TEXT;

-- Fecha de expiración del token (24h desde el alta)
ALTER TABLE usuarios_prueba ADD COLUMN fecha_expiracion_token INTEGER;

-- Fecha en que el usuario confirmó su email
ALTER TABLE usuarios_prueba ADD COLUMN fecha_confirmacion INTEGER;

-- IP desde la que se registró (para auditoría RGPD)
ALTER TABLE usuarios_prueba ADD COLUMN ip_registro TEXT;

-- Versión de la política de privacidad aceptada
ALTER TABLE usuarios_prueba ADD COLUMN consentimiento_version TEXT;

-- Los usuarios existentes (tú) están ya confirmados
UPDATE usuarios_prueba SET fecha_confirmacion = fecha_alta WHERE fecha_confirmacion IS NULL;

-- Índice para búsquedas por token (rápidas)
CREATE INDEX IF NOT EXISTS idx_usuarios_token ON usuarios_prueba(token_confirmacion);