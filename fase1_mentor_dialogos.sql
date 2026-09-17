-- ==========================================
-- INSERTAR DATOS INICIALES (Fase 1 del Mentor)
-- ==========================================
INSERT INTO entornos_dialogos (entorno_id, fase_numero, titulo_mapa, pasos_mapa, dialogos, cuestionario, teoria_caminos)
VALUES (
  '55555555-5555-5555-5555-555555555555', 
  1, 
  'Fase 1: Idea de Negocio',
  '["Área de Interés", "Observación", "Lluvia de Ideas", "Matriz de Batalla", "Pitch & Nombre"]'::jsonb,
  '{
    "paso1_area": "Todo empieza por lo que conoces. Selecciona tu carrera técnica o el área en la que quieres enfocarte.", 
    "recurso_observacion": "Antes de observar el mundo, te recomiendo ver este recurso. Te abrirá la mente sobre cómo detectar verdaderos problemas.",
    "paso2_observacion": "Define a tu protagonista. ¿Quién tiene un problema, cuándo le ocurre y qué intenta lograr realmente?", 
    "recurso_fricciones": "Ahora que tienes el problema, mira este recurso sobre por qué las soluciones actuales suelen fallar y generar fricción.",
    "paso3_fricciones": "Analiza las soluciones actuales. ¿Por qué la gente está frustrada hoy y qué tendría que tener tu solución para hacerlos felices?", 
    "recurso_ideacion": "¡Llegó el momento creativo! Revisa esta guía rápida de cómo hacer una lluvia de ideas sin límites.",
    "paso4_ideacion": "Basado en tu análisis, hagamos una lluvia de ideas. Anota tus posibles soluciones.",
    "recurso_evaluacion": "Las ideas por sí solas no valen nada. Mira cómo vamos a filtrarlas objetivamente usando la matriz de batalla.",
    "paso5_batalla": "Puntúa tus 3 mejores ideas de 0 a 5 en estos 6 criterios clave. La que tenga mayor puntaje será la elegida.",
    "paso6_ganador": "¡Tenemos una idea ganadora! Ahora, vamos a bautizarla y a redactar tu primer Pitch oficial."
  }'::jsonb,
  '[]'::jsonb,
  '{
    "recursos": {
      "observacion": {
        "tipo": "video",
        "titulo": "El arte de observar problemas",
        "url": "https://www.youtube.com/embed/T6mvaB7tZ9U"
      },
      "fricciones": {
        "tipo": "video",
        "titulo": "¿Por qué fallan las soluciones?",
        "url": "https://www.youtube.com/embed/z4vG_y-J15o"
      },
      "ideacion": {
        "tipo": "documento",
        "titulo": "Guía: Brainstorming Efectivo",
        "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      },
      "evaluacion": {
        "tipo": "video",
        "titulo": "Evaluación objetiva de negocios",
        "url": "https://www.youtube.com/embed/fAymKnd8b44"
      }
    }
  }'::jsonb
) ON CONFLICT (entorno_id, fase_numero) DO UPDATE SET 
  titulo_mapa = EXCLUDED.titulo_mapa,
  pasos_mapa = EXCLUDED.pasos_mapa,
  dialogos = EXCLUDED.dialogos,
  cuestionario = EXCLUDED.cuestionario,
  teoria_caminos = EXCLUDED.teoria_caminos;
