-- Habilitar RLS en la tabla (por si no lo estaba)
ALTER TABLE public.prompts_ia ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores si existían (para evitar errores al recrearlas)
DROP POLICY IF EXISTS "Permitir lectura a todos" ON public.prompts_ia;
DROP POLICY IF EXISTS "Permitir todo a todos" ON public.prompts_ia;

-- Crear política que permite TODO (Insert, Update, Select, Delete) a todos los usuarios
-- (Ideal para asegurar que funcione sin bloqueos)
CREATE POLICY "Permitir todo a todos" 
ON public.prompts_ia 
FOR ALL 
USING (true) 
WITH CHECK (true);
