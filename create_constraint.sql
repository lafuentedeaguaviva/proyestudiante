-- Script para agregar la restricción única necesaria para guardar videos (upsert)
-- Paso 1: Eliminar posibles duplicados que impedirían crear la restricción
DELETE FROM public.prompts_ia 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY fase_id, proposito ORDER BY id) as row_num
    FROM public.prompts_ia
  ) t WHERE t.row_num > 1
);

-- Paso 2: Crear la restricción única (UNIQUE constraint)
ALTER TABLE public.prompts_ia 
ADD CONSTRAINT unique_fase_proposito UNIQUE (fase_id, proposito);

-- NOTA: Copia y pega este script en el "SQL Editor" de tu panel de Supabase y ejecútalo.
