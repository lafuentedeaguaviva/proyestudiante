const fs = require('fs');
let content = fs.readFileSync('src/components/ui/SidebarFases.jsx', 'utf8');

// The replacement logic to update the mapaEstatico array

const orig =         { id: 6, titulo: 'La Operación', path: '/fase/6', pasos: [
          '1. Video: Listado de procesos', '2. Definir Pasos', '3. Revisión de Procesos', '4. Video: Diagrama de Procesos',
          '5. Juego: Clasificación de Procesos', '6. Video: Layout del Negocio', '7. Juego: Zonas de Trabajo'
        ] },
        { id: 7, titulo: 'Estructura Organizacional', path: '/fase/7', pasos: ['Organigrama', 'Roles'] },
        { id: 8, titulo: 'Localización', path: '/fase/8', pasos: ['Identificación', 'Justificación', 'Croquis'] },
        { id: 9, titulo: 'Viabilidad', path: '/fase/9', pasos: ['Viabilidad Económica'] },
        { id: 10, titulo: 'Indicadores', path: '/fase/10', pasos: ['Métricas de Éxito'] },
        { id: 11, titulo: 'Justificación', path: '/fase/11', pasos: ['Social', 'Económica', 'Personal', 'Redacción'] },
        { id: 13, titulo: 'Objetivos, Misión, Visión', path: '/fase/13', pasos: ['Misión', 'Visión', 'Objetivos Generales', 'Objetivos Específicos'] },
        { id: 14, titulo: 'Pitch Comercial', path: '/fase/14', pasos: ['Pitch'] };

const repl =         { id: 6, titulo: 'Distribución', path: '/fase/6', pasos: [
          '1. Video: Distribución', '2. Canales Distribución', '3. Elección Lugar', '4. Video: Entrega',
          '5. Logística', '6. Pagos', '7. Necesidades Dist.', '8. Video: Plan Acción', '9. Plan Acción', '10. Presupuesto'
        ] },
        { id: 7, titulo: 'La Operación', path: '/fase/7', pasos: [
          '1. Video: Listado de procesos', '2. Definir Pasos', '3. Revisión de Procesos', '4. Video: Diagrama de Procesos',
          '5. Juego: Clasificación de Procesos', '6. Video: Layout del Negocio', '7. Juego: Zonas de Trabajo'
        ] },
        { id: 8, titulo: 'Estructura Organizacional', path: '/fase/8', pasos: ['Organigrama', 'Roles'] },
        { id: 9, titulo: 'Localización', path: '/fase/9', pasos: ['Identificación', 'Justificación', 'Croquis'] },
        { id: 10, titulo: 'Viabilidad', path: '/fase/10', pasos: ['Viabilidad Económica'] },
        { id: 11, titulo: 'Indicadores', path: '/fase/11', pasos: ['Métricas de Éxito'] },
        { id: 12, titulo: 'Justificación', path: '/fase/12', pasos: ['Social', 'Económica', 'Personal', 'Redacción'] },
        { id: 14, titulo: 'Objetivos, Misión, Visión', path: '/fase/14', pasos: ['Misión', 'Visión', 'Objetivos Generales', 'Objetivos Específicos'] },
        { id: 15, titulo: 'Pitch Comercial', path: '/fase/15', pasos: ['Pitch'] };

content = content.replace(orig, repl);

// update marketing steps in Fase 5
const origFase5 =         { id: 5, titulo: 'La Estrategia de Marketing', path: '/fase/5', pasos: [
          '1. Video: Análisis de competencia', '2. Análisis de competencia', '3. Video: Soluciones actuales', '4. Soluciones actuales de clientes',
          '5. Video: Ventaja competitiva', '6. Ventaja competitiva', '7. Video: Análisis del entorno', '8. Análisis del entorno (PESTEL)',
          '9. Video: Estrategia de promoción', '10. Estrategia de promoción', '11. Video: Distribución', '12. Canales de Distribución',
          '13. Elección del Lugar', '14. Video: Cómo entregar', '15. Logística de entrega', '16. Métodos de pago',
          '17. Necesidades de distribución', '18. Video: Plan de acción', '19. Plan de acción de distribución', '20. Presupuesto de promoción'
        ] },;
const replFase5 =         { id: 5, titulo: 'La Estrategia de Marketing', path: '/fase/5', pasos: [
          '1. Video: Análisis de competencia', '2. Análisis de competencia', '3. Video: Soluciones actuales', '4. Soluciones actuales de clientes',
          '5. Video: Ventaja competitiva', '6. Ventaja competitiva', '7. Video: Análisis del entorno', '8. Análisis del entorno (PESTEL)',
          '9. Video: Estrategia de promoción', '10. Estrategia de promoción'
        ] },;

content = content.replace(origFase5, replFase5);

fs.writeFileSync('src/components/ui/SidebarFases.jsx', content);
