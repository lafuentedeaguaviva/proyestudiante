-- Habilitar extensión para generar UUIDs automáticamente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABLA: perfiles_usuario
-- ==========================================
CREATE TABLE IF NOT EXISTS perfiles_usuario (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  nombre_completo TEXT,
  celular TEXT,
  colegio TEXT,
  curso TEXT,
  caracteristicas_personales TEXT,
  entorno_id TEXT,
  personaje_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. TABLA: proyecto_usuario
-- ==========================================
CREATE TABLE IF NOT EXISTS proyecto_usuario (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id UUID REFERENCES perfiles_usuario(id) ON DELETE CASCADE,
  titulo TEXT,
  tipo_proyecto TEXT,
  fase_actual INTEGER DEFAULT 1,
  entorno_id TEXT,
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aseguramos que la columna nueva 'paso_actual' se agregue si la tabla ya existía
ALTER TABLE proyecto_usuario ADD COLUMN IF NOT EXISTS paso_actual INTEGER DEFAULT 0;

-- ==========================================
-- 3. TABLA: contenido_proyecto
-- ==========================================
CREATE TABLE IF NOT EXISTS contenido_proyecto (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  proyecto_id UUID REFERENCES proyecto_usuario(id) ON DELETE CASCADE,
  fase INTEGER,
  campo_clave TEXT,
  contenido JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proyecto_id, fase, campo_clave)
);

-- ==========================================
-- 4. TABLA: entornos_dialogos (NUEVA)
-- ==========================================
CREATE TABLE IF NOT EXISTS entornos_dialogos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entorno_id TEXT NOT NULL,
  fase_numero INTEGER NOT NULL,
  titulo_mapa TEXT,
  pasos_mapa JSONB,
  dialogos JSONB,
  cuestionario JSONB,
  teoria_caminos JSONB,
  UNIQUE(entorno_id, fase_numero)
);

-- Asegurarse de que si la tabla ya existía, se agreguen las nuevas columnas
ALTER TABLE entornos_dialogos ADD COLUMN IF NOT EXISTS titulo_mapa TEXT;
ALTER TABLE entornos_dialogos ADD COLUMN IF NOT EXISTS pasos_mapa JSONB;

-- ==========================================
-- REGLAS DE SEGURIDAD (RLS)
-- ==========================================
ALTER TABLE perfiles_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyecto_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE contenido_proyecto ENABLE ROW LEVEL SECURITY;
ALTER TABLE entornos_dialogos ENABLE ROW LEVEL SECURITY;

-- Borramos las políticas si ya existían para evitar el error 42710
DROP POLICY IF EXISTS "Permitir todo público" ON perfiles_usuario;
DROP POLICY IF EXISTS "Permitir todo público" ON proyecto_usuario;
DROP POLICY IF EXISTS "Permitir todo público" ON contenido_proyecto;
DROP POLICY IF EXISTS "Permitir lectura pública" ON entornos_dialogos;

-- Creamos las políticas de forma limpia
CREATE POLICY "Permitir todo público" ON perfiles_usuario FOR ALL USING (true);
CREATE POLICY "Permitir todo público" ON proyecto_usuario FOR ALL USING (true);
CREATE POLICY "Permitir todo público" ON contenido_proyecto FOR ALL USING (true);
CREATE POLICY "Permitir lectura pública" ON entornos_dialogos FOR SELECT USING (true);

-- ==========================================
-- INSERTAR DATOS INICIALES (Fase 0 del Mentor)
-- ==========================================
INSERT INTO entornos_dialogos (entorno_id, fase_numero, dialogos, cuestionario, teoria_caminos)
VALUES (
  '55555555-5555-5555-5555-555555555555', 
  0, 
  '{"bienvenida": "¡Qué onda! 👋 Soy tu Mentor virtual. Olvídate de los misterios y los juegos de rol, aquí vinimos a hacer que las cosas pasen. ¿List@ para arrancar tu proyecto con todo?", "paso1_video": "Primero, te recomiendo ver este breve video introductorio para entender los conceptos básicos.", "paso2_cuestionario": "Ahora, veamos qué tipo de proyecto se adapta mejor a lo que quieres hacer. Responde estas breves preguntas.", "paso3_eleccion": "Basado en tus respuestas, ya tengo una sugerencia para ti. Sin embargo, la decisión final es tuya. ¿Qué camino eliges?"}'::jsonb,
  '[{"id": "q1", "pregunta": "¿Cuál es tu objetivo principal?", "opciones": [{"texto": "Crear un producto o servicio para vender", "valor": "PEP"}, {"texto": "Mejorar un proceso técnico o inventar algo", "valor": "PI"}]}, {"id": "q2", "pregunta": "¿Qué tipo de problema quieres resolver?", "opciones": [{"texto": "Una necesidad de mercado (clientes)", "valor": "PEP"}, {"texto": "Un problema técnico en mi comunidad", "valor": "PI"}]}]'::jsonb,
  '{"PI": {"titulo": "Proyecto de Innovación (PI)", "cita_apa": "OCDE. (2005). Manual de Oslo: Guía para la recogida e interpretación de datos sobre innovación. Tragsa.", "base_teorica": "La innovación tecnológica implica la implementación de un producto o proceso nuevo o significativamente mejorado."}, "PEP": {"titulo": "Proyecto de Emprendimiento Productivo (PEP)", "cita_apa": "Osterwalder, A., & Pigneur, Y. (2010). Generación de modelos de negocio. Deusto.", "base_teorica": "El emprendimiento productivo busca generar valor a través de la creación de nuevas empresas o unidades de negocio que respondan a demandas del mercado."}}'::jsonb
) ON CONFLICT (entorno_id, fase_numero) DO UPDATE SET 
  dialogos = EXCLUDED.dialogos,
  cuestionario = EXCLUDED.cuestionario,
  teoria_caminos = EXCLUDED.teoria_caminos;
