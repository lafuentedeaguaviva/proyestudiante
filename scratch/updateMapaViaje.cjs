const fs = require('fs');

const path = 'src/components/MapaViaje.jsx';
let code = fs.readFileSync(path, 'utf8');

const newNiveles = `const niveles = [
    { id: 0, title: 'El Inicio del Viaje', icon: <User />, pasos: ['Bienvenida', 'Video', 'Cuestionario Orientador', 'Elección de Camino'] },
    { 
      id: 1, 
      title: 'Fase 1: Encontrar la idea', 
      icon: <Rocket />, 
      pasos: ['Video', 'Selección de Área', 'Observación del Entorno', 'Análisis de Fricciones', 'Guía: Brainstorming Efectivo', 'Lluvia de Ideas', 'Matriz de Batalla', 'Idea Ganadora y Pitch'] 
    },
    { 
      id: 2, 
      title: 'Fase 2: Validación de la Idea', 
      icon: <Target />, 
      pasos: ['Video', 'Introducción a la Validación', 'Diseño de la Encuesta', 'Explicación de la Matriz', 'Codificación de Preguntas', 'Tabulación de Resultados', 'Análisis de Resultados', 'Resumen IA'] 
    },
    { id: 3, title: 'Fase 3: Público Objetivo', icon: <Users />, pasos: ['Video', 'Público Objetivo'] },
    { 
      id: 4, 
      title: 'Fase 4: Diseño de producto', 
      icon: <Star />, 
      pasos: ['Video', 'Qué vas a vender', 'Características', 'Beneficios', 'Empaque', 'Presentación', 'Demanda Potencial', 'Resumen IA'] 
    },
    { 
      id: 5, 
      title: 'Fase 5: Estrategia de Marketing', 
      icon: <Megaphone />, 
      pasos: ['Video', 'Análisis de competencia', 'Tu Ventaja Competitiva', 'Análisis del entorno', 'Estrategia de promoción', 'Resumen IA'] 
    },
    { 
      id: 6, 
      title: 'Fase 6: Localización', 
      icon: <Truck />, 
      pasos: ['Video', 'Identificación', 'Canales', 'Elección Lugar', 'Croquis', 'Pagos', 'Plan Acción', 'Resumen IA'] 
    },
    { id: 7, title: 'Fase 7: Planteamiento', icon: <CheckCircle2 />, pasos: ['Video', 'Diagnóstico del contexto', 'Objetivos', 'Misión', 'Visión', 'Justificación', 'Resumen IA'] },
    { id: 8, title: 'Fase 8: La Operación', icon: <Settings />, pasos: ['Video', 'Definir Pasos', 'Revisión de Procesos', 'Clasificación de Procesos'] },
    { id: 9, title: 'Fase 9: Estructura Org.', icon: <Network />, pasos: ['Video', 'Organigrama', 'Roles', 'Resumen IA'] },
    { id: 10, title: 'Fase 10: Viabilidad', icon: <TrendingUp />, pasos: ['Video', 'Cap. Inversión', 'Costos por Prod.', 'Cap. Trabajo', 'Resumen', 'Costos', 'Precio Venta', 'Proy. Gan', 'Proy. Gastos', 'Utilidad', 'Equilibrio', 'VAN y TIR'] },
    { id: 11, title: 'Fase 11: Consolidación del Documento', icon: <FileText />, pasos: ['Video', 'Intro', 'Resultados', 'Conclusiones', 'Agradecimientos', 'Dedicatoria', 'Resumen IA'] },
    { id: 12, title: 'Fase 12: Proyecto de Vida', icon: <Heart />, pasos: ['Alineación', 'Metas', 'Equilibrio', 'Legado', 'Resumen IA'] },
    { id: 13, title: 'Fase 13: Documento Final IA', icon: <Bot />, pasos: ['Configuración IA'] }
  ];`;

code = code.replace(/const niveles = \[[\s\S]*?\];/m, newNiveles);

fs.writeFileSync(path, code);
console.log("MapaViaje updated!");
