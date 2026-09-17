-- Migración para crear la tabla de configuración de prompts de IA

CREATE TABLE IF NOT EXISTS public.prompts_ia (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fase_id INTEGER NOT NULL,
    proposito VARCHAR(255) NOT NULL, -- ej: 'generar_ideas', 'generar_nombres'
    prompt_texto TEXT NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar el prompt por defecto para la Fase 1 (Generación de Ideas)
INSERT INTO public.prompts_ia (fase_id, proposito, prompt_texto, descripcion)
VALUES (
    1, 
    'generar_ideas', 
    $$Eres un mentor experto en innovación y emprendimiento. Tu objetivo es generar ideas de negocio creativas y viables.

Aquí está el contexto del problema que el emprendedor ha investigado:
- Área del proyecto: {area}
- El Problema: {frase_problema}
- Lo que usan actualmente: {solucionActual}
- Por qué falla lo actual (Fricción): {friccion}
- Lo que realmente desean (Solución Ideal): {solucionIdeal}

Basado en esta información, genera 5 ideas de negocio variadas (pueden ser apps, servicios o productos físicos) que eliminen la fricción actual, entreguen la solución ideal y estén dentro del área del proyecto.

Responde ÚNICAMENTE con un array JSON de 5 strings concisos que describan la idea de negocio. 
Ejemplo de formato: ["Suscripción semanal de viandas saludables para la universidad", "Máquina expendedora de comida caliente nutritiva", "App de delivery estudiantil"]$$,
    $$Prompt para generar 5 ideas de negocio basadas en el dolor y la solución ideal$$
);

-- Insertar el prompt por defecto para la Fase 1 (Resumen de Fase 1)
INSERT INTO public.prompts_ia (fase_id, proposito, prompt_texto, descripcion)
VALUES (
    1, 
    'generar_resumen_fase1', 
    $$La idea ganadora (solución) es: "{ideaGanadora}". El protagonista al que va dirigida es: "{protagonista}". Su dolor principal (problema) es: "{dolor}". Genera un texto muy corto, directo y conciso (máximo 15 palabras por campo) para cada propiedad del JSON.$$,
    $$Prompt para generar el resumen final (problema, solucion, protagonista) muy conciso$$
);
