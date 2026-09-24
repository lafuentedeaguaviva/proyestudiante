const fs = require('fs');

const path = 'src/components/ui/SidebarFases.jsx';
let code = fs.readFileSync(path, 'utf8');

const newMapaEstatico = `const mapaEstatico = [
        { id: 0, titulo: 'El Inicio del Viaje', path: '/fase/0', pasos: ['Bienvenida', 'Video', 'Cuestionario Orientador', 'Elección de Camino'] },
        { id: 1, titulo: 'Encontrar la idea', path: '/fase/1', pasos: ['Video', 'Selección de Área', 'Observación del Entorno', 'Análisis de Fricciones', 'Guía: Brainstorming Efectivo', 'Lluvia de Ideas', 'Matriz de Batalla', 'Idea Ganadora y Pitch'] },
        { id: 2, titulo: 'Validación de la Idea', path: '/fase/2', pasos: ['Video', 'Introducción a la Validación', 'Diseño de la Encuesta', 'Explicación de la Matriz', 'Codificación de Preguntas', 'Tabulación de Resultados', 'Análisis de Resultados', 'Resumen IA'] },
        { id: 3, titulo: 'Público Objetivo', path: '/fase/3', pasos: ['Video', 'Público Objetivo'] },
        { id: 4, titulo: 'Diseño de producto o servicio', path: '/fase/4', pasos: ['Video', 'Qué vas a vender', 'Características', 'Beneficios', 'Empaque', 'Presentación', 'Demanda Potencial', 'Resumen IA'] },
        { id: 5, titulo: 'La Estrategia de Marketing', path: '/fase/5', pasos: ['Video', 'Análisis de competencia', 'Tu Ventaja Competitiva', 'Análisis del entorno', 'Estrategia de promoción', 'Resumen IA'] },
        { id: 6, titulo: 'Localización y Distribución', path: '/fase/6', pasos: ['Video', 'Identificación', 'Canales', 'Elección Lugar', 'Croquis', 'Pagos', 'Plan Acción', 'Resumen IA'] },
        { id: 7, titulo: 'Planteamiento del Emprendimiento', path: '/fase/7', pasos: ['Video', 'Diagnóstico del contexto', 'Objetivos', 'Misión', 'Visión', 'Justificación', 'Resumen IA'] },
        { id: 8, titulo: 'La Operación', path: '/fase/8', pasos: ['Video', 'Definir Pasos', 'Revisión de Procesos', 'Clasificación de Procesos'] },
        { id: 9, titulo: 'Estructura Organizacional', path: '/fase/9', pasos: ['Video', 'Organigrama', 'Roles', 'Resumen IA'] },
        { id: 10, titulo: 'Viabilidad y Sostenibilidad', path: '/fase/10', pasos: ['Video', 'Cap. Inversión', 'Costos por Prod.', 'Cap. Trabajo', 'Resumen', 'Costos', 'Precio Venta', 'Proy. Gan', 'Proy. Gastos', 'Utilidad', 'Equilibrio', 'VAN y TIR'] },
        { id: 11, titulo: 'Consolidación del Documento', path: '/fase/11', pasos: ['Video', 'Intro', 'Resultados', 'Conclusiones', 'Agradecimientos', 'Dedicatoria', 'Resumen IA'] },
        { id: 12, titulo: 'Proyecto de Vida', path: '/fase/12', pasos: ['Alineación', 'Metas', 'Equilibrio', 'Legado', 'Resumen IA'] },
        { id: 13, titulo: 'Documento Final IA', path: '/fase/13', pasos: ['Configuración IA'] }
      ];`;

code = code.replace(/const mapaEstatico = \[[\s\S]*?\];/m, newMapaEstatico);

fs.writeFileSync(path, code);
console.log("Mapa Estático updated!");
