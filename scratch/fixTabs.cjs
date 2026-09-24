const fs = require('fs');

// Fase 5
let f5 = fs.readFileSync('src/pages/Fase5_EstrategiaMarketing.jsx', 'utf8');
const oldTabsF5 = `      tabs={[
        { id: 1, icon: <Video size={18} />, label: 'Video Competencia' },
        { id: 2, icon: <Search size={18} />, label: 'Análisis Competencia' },
        { id: 3, icon: <Video size={18} />, label: 'Video Ventaja' },
        { id: 4, icon: <Rocket size={18} />, label: 'Ventaja Competitiva' },
        { id: 5, icon: <Video size={18} />, label: 'Video Entorno' },
        { id: 6, icon: <Globe size={18} />, label: 'PESTEL' },
        { id: 7, icon: <Video size={18} />, label: 'Video Promoción' },
        { id: 8, icon: <Megaphone size={18} />, label: 'Promoción' },
        { id: 9, icon: <Bot size={18} />, label: 'Resumen IA' }
      ]}`;
// Replace using a more generic regex for the whole block
f5 = f5.replace(/tabs=\{\[\s*\{\s*id:\s*1[\s\S]*?\]\}/, `tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <Search size={18} />, label: 'Análisis Competencia' },
          { id: 3, icon: <Rocket size={18} />, label: 'Ventaja Competitiva' },
          { id: 4, icon: <Globe size={18} />, label: 'PESTEL' },
          { id: 5, icon: <Megaphone size={18} />, label: 'Promoción' },
          { id: 6, icon: <Bot size={18} />, label: 'Resumen IA' }
        ]}`);
f5 = f5.replace('step < 9 ? siguientePaso()', 'step < 6 ? siguientePaso()');
fs.writeFileSync('src/pages/Fase5_EstrategiaMarketing.jsx', f5);

// Fase 6
let f6 = fs.readFileSync('src/pages/Fase6_LocalizacionDistribucion.jsx', 'utf8');
f6 = f6.replace(/tabs=\{\[\s*\{\s*id:\s*1[\s\S]*?\]\}/, `tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <MapPin size={18} />, label: 'Identificación Loc.' },
          { id: 3, icon: <Truck size={18} />, label: 'Canales Distribución' },
          { id: 4, icon: <MapPin size={18} />, label: 'Elección Lugar' },
          { id: 5, icon: <Image size={18} />, label: 'Croquis' },
          { id: 6, icon: <CreditCard size={18} />, label: 'Pagos' },
          { id: 7, icon: <ClipboardList size={18} />, label: 'Plan Acción' },
          { id: 8, icon: <Bot size={18} />, label: 'Resumen IA' }
        ]}`);
f6 = f6.replace('step < 9 ? siguientePaso()', 'step < 8 ? siguientePaso()');
fs.writeFileSync('src/pages/Fase6_LocalizacionDistribucion.jsx', f6);

// Fase 8
let f8 = fs.readFileSync('src/pages/Fase8_Operacion.jsx', 'utf8');
f8 = f8.replace(/tabs=\{\[\s*\{\s*id:\s*1[\s\S]*?\]\}/, `tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <List size={18} />, label: 'Listado Pasos' },
          { id: 3, icon: <CheckSquare size={18} />, label: 'Revisión' },
          { id: 4, icon: <Network size={18} />, label: 'Diagrama' }
        ]}`);
fs.writeFileSync('src/pages/Fase8_Operacion.jsx', f8);

// Fase 9
let f9 = fs.readFileSync('src/pages/Fase9_Estructura.jsx', 'utf8');
f9 = f9.replace(/tabs=\{\[\s*\{\s*id:\s*1[\s\S]*?\]\}/, `tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <Network size={18} />, label: 'Organigrama' },
          { id: 3, icon: <Briefcase size={18} />, label: 'Roles y Funciones' },
          { id: 4, icon: <Sparkles size={18} />, label: 'Resumen IA' }
        ]}`);
fs.writeFileSync('src/pages/Fase9_Estructura.jsx', f9);

console.log('Tabs fixed!');
