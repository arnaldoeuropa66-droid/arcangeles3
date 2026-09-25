-- ============================================
-- Migración 0007: introducir sistema de ciclo de 120 días
-- ============================================
-- Añade la columna dia_ciclo (1-120) a contenido_diario
-- Renumera el contenido existente (Tanda 1: días 1-30)
-- ============================================

-- 1. Añadir la columna dia_ciclo
ALTER TABLE contenido_diario ADD COLUMN dia_ciclo INTEGER;

-- 2. Renumerar el contenido existente por ángel y fecha
-- Cada ángel tiene sus piezas ordenadas por fecha; las convertimos en días 1-30
-- (Fórmula: día del ciclo = 1 + (fecha - 2026-09-23))

UPDATE contenido_diario
SET dia_ciclo = CAST(
  (julianday(fecha) - julianday('2026-09-23')) + 1
  AS INTEGER
)
WHERE angel_slug = 'miguel';

UPDATE contenido_diario
SET dia_ciclo = CAST(
  (julianday(fecha) - julianday('2026-09-23')) + 1
  AS INTEGER
)
WHERE angel_slug = 'gabriel';

UPDATE contenido_diario
SET dia_ciclo = CAST(
  (julianday(fecha) - julianday('2026-09-23')) + 1
  AS INTEGER
)
WHERE angel_slug = 'rafael';

UPDATE contenido_diario
SET dia_ciclo = CAST(
  (julianday(fecha) - julianday('2026-09-23')) + 1
  AS INTEGER
)
WHERE angel_slug = 'uriel';

UPDATE contenido_diario
SET dia_ciclo = CAST(
  (julianday(fecha) - julianday('2026-09-23')) + 1
  AS INTEGER
)
WHERE angel_slug = 'chamuel';

UPDATE contenido_diario
SET dia_ciclo = CAST(
  (julianday(fecha) - julianday('2026-09-23')) + 1
  AS INTEGER
)
WHERE angel_slug = 'zadkiel';

UPDATE contenido_diario
SET dia_ciclo = CAST(
  (julianday(fecha) - julianday('2026-09-23')) + 1
  AS INTEGER
)
WHERE angel_slug = 'jophiel';

-- 3. Índice para búsquedas por ciclo
CREATE INDEX IF NOT EXISTS idx_contenido_ciclo 
  ON contenido_diario(angel_slug, dia_ciclo);