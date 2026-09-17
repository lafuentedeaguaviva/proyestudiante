-- ==========================================
-- PERMISOS DE LECTURA Y SEGURIDAD RLS
-- ==========================================
-- Asegurar que los usuarios anónimos (y logueados) puedan leer esta tabla
GRANT SELECT ON TABLE entornos_dialogos TO anon, authenticated;

-- Activar RLS y permitir lectura a todos
ALTER TABLE entornos_dialogos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura pública" ON entornos_dialogos;
CREATE POLICY "Permitir lectura pública" ON entornos_dialogos FOR SELECT USING (true);

-- ==========================================
-- INSERTAR DATOS INICIALES (Fase 0 del Mentor)
-- ==========================================
INSERT INTO entornos_dialogos (entorno_id, fase_numero, titulo_mapa, pasos_mapa, dialogos, cuestionario, teoria_caminos)
VALUES (
  '55555555-5555-5555-5555-555555555555', 
  0, 
  'Fase 0: Onboarding',
  '["Video Explicativo", "Cuestionario", "Elección de Camino"]'::jsonb,
  '{
    "bienvenida": "¡Hola! Soy tu Mentor. Estoy aquí para guiarte en esta nueva aventura. ¿Estás listo para descubrir qué camino de desarrollo es el ideal para ti?",
    "paso1_video": "Antes de comenzar, mira este breve video introductorio. Te explicará las diferencias clave entre emprender un negocio y desarrollar una innovación tecnológica.",
    "paso2_cuestionario": "Ahora responderemos un par de preguntas. No hay respuestas incorrectas, esto me ayudará a recomendarte la ruta que mejor encaja con tus intereses.",
    "paso3_eleccion": "He analizado tus respuestas. A continuación te presento mi sugerencia y la teoría que la respalda. ¡La decisión final es tuya!"
  }'::jsonb,
  '[
    {
      "id": "q1",
      "pregunta": "¿Qué prefieres hacer cuando ves un problema en tu entorno?",
      "opciones": [
        { "texto": "Pensar en un servicio o negocio que lo resuelva y me genere ingresos.", "valor": "PEP" },
        { "texto": "Construir una herramienta, sistema o prototipo técnico para solucionarlo.", "valor": "PI" }
      ]
    },
    {
      "id": "q2",
      "pregunta": "Cuando trabajas en un proyecto, ¿qué te motiva más?",
      "opciones": [
        { "texto": "Investigar el mercado, conseguir clientes y asegurar ventas.", "valor": "PEP" },
        { "texto": "Perfeccionar el funcionamiento técnico, diseñar y probar mejoras.", "valor": "PI" }
      ]
    }
  ]'::jsonb,
  '{
    "PEP": {
      "titulo": "Proyecto de Emprendimiento Productivo (PEP)",
      "base_teorica": "El emprendimiento productivo se centra en organizar recursos para crear un negocio rentable que cubra una necesidad en el mercado, asumiendo riesgos financieros con el objetivo de generar un impacto económico y social.",
      "cita_apa": "(Ministerio de Educación, 2023. Guía para la modalidad de graduación Emprendimiento Productivo)"
    },
    "PI": {
      "titulo": "Proyecto de Innovación (PI)",
      "base_teorica": "La innovación busca resolver un problema técnico mediante la invención o mejora de una herramienta, proceso o producto. Se basa en transformar la realidad aplicando conocimientos tecnológicos para optimizar soluciones.",
      "cita_apa": "(Ministerio de Educación, 2023. Guía para la modalidad de graduación Innovación Tecnológica)"
    }
  }'::jsonb
) ON CONFLICT (entorno_id, fase_numero) DO UPDATE SET 
  titulo_mapa = EXCLUDED.titulo_mapa,
  pasos_mapa = EXCLUDED.pasos_mapa,
  dialogos = EXCLUDED.dialogos,
  cuestionario = EXCLUDED.cuestionario,
  teoria_caminos = EXCLUDED.teoria_caminos;
