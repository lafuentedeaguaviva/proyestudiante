-- Migración para añadir el campo 'area' a la tabla 'proyecto_usuario'

ALTER TABLE public.proyecto_usuario
ADD COLUMN IF NOT EXISTS area text;

-- Opcional: Agregar un comentario para documentar la columna
COMMENT ON COLUMN public.proyecto_usuario.area IS 'Área o carrera técnica seleccionada en la Fase 1 del entorno Mentor';
