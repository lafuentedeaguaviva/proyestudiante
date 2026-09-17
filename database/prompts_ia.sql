-- Script para poblar la tabla prompts_ia con los prompts necesarios para la Fase 1

-- Asegurarse de que la tabla exista (si no existe, puedes ignorar el CREATE TABLE si ya lo tienes)
-- CREATE TABLE IF NOT EXISTS public.prompts_ia (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   fase_id INTEGER NOT NULL,
--   proposito VARCHAR(50) NOT NULL,
--   prompt_texto TEXT NOT NULL,
--   creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Insertar Prompt para Generar Ideas
INSERT INTO public.prompts_ia (fase_id, proposito, prompt_texto)
VALUES (
  1, 
  'generar_ideas', 
  'El dolor del usuario es: "{frase_problema}". Su solución ideal es: "{solucionIdeal}". Basado en esto, genera 9 ideas de negocio variadas (apps, servicios, productos físicos). La primera debe ser una versión muy mejorada de su solución ideal, y el resto ideas nuevas y creativas. Responde solo con un array JSON como ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5", "Idea 6", "Idea 7", "Idea 8", "Idea 9"].'
);

-- Insertar Prompt para Generar Nombres
INSERT INTO public.prompts_ia (fase_id, proposito, prompt_texto)
VALUES (
  1, 
  'generar_nombres', 
  'La idea ganadora del negocio es: "{ideaGanadora}". Genera 3 nombres atractivos y modernos. Responde solo con el array JSON: [{"nombre": "Nombre1", "representa": "Representa..."}, {"nombre": "Nombre2", "representa": "Representa..."}, {"nombre": "Nombre3", "representa": "Representa..."}].'
);

-- Insertar Prompt para Generar Pitch
INSERT INTO public.prompts_ia (fase_id, proposito, prompt_texto)
VALUES (
  1, 
  'generar_pitch', 
  'El protagonista es: "{protagonista}". El contexto es: "{contexto}". Su dolor principal es: "{dolor}". La tarea que intentan realizar es: "{tarea}". La fricción de su solución actual es: "{friccion}". La solución propuesta se llama: "{nombreElegido}". Genera un "Discurso de Presentación (Pitch)" breve, persuasivo y motivacional de no más de 3 oraciones que resuma cómo esta solución resuelve su problema. No uses explicaciones adicionales, solo devuelve el texto del pitch.'
);
