const fs = require('fs');

// --- Fase 5 ---
let f5 = fs.readFileSync('src/pages/Fase5_EstrategiaMarketing.jsx', 'utf8');
if (!f5.includes('YoutubePlayer')) {
    f5 = f5.replace("import SubMenuFases from '../components/ui/SubMenuFases';", "import SubMenuFases from '../components/ui/SubMenuFases';\nimport YoutubePlayer from '../components/ui/YoutubePlayer';");
}
f5 = f5.replace(/const renderVideoStep = \([\s\S]*?\)\s*=>\s*\([\s\S]*?<\/div>\s*\);/, `const renderVideoStep = (titulo) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{titulo}</h2>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <YoutubePlayer videoKey="video_fase_5" title={titulo} fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
      </div>
    </div>
  );`);
f5 = f5.replace(/case 3: return renderVideoStep\([\s\S]*?\);/, "");
f5 = f5.replace(/case 5: return renderVideoStep\([\s\S]*?\);/, "");
f5 = f5.replace(/case 7: return renderVideoStep\([\s\S]*?\);/, "");
f5 = f5.replace(/case 4:/g, "case 3:");
f5 = f5.replace(/case 6:/g, "case 4:");
f5 = f5.replace(/case 8:/g, "case 5:");
f5 = f5.replace(/case 9:/g, "case 6:");
f5 = f5.replace(/if \(step === 9\)/g, "if (step === 6)");
f5 = f5.replace(/tabs=\{\[[\s\S]*?\}\]/, `tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <Search size={18} />, label: 'Análisis Competencia' },
          { id: 3, icon: <Rocket size={18} />, label: 'Ventaja Competitiva' },
          { id: 4, icon: <Globe size={18} />, label: 'PESTEL' },
          { id: 5, icon: <Megaphone size={18} />, label: 'Promoción' },
          { id: 6, icon: <Bot size={18} />, label: 'Resumen IA' }
        ]}`);
fs.writeFileSync('src/pages/Fase5_EstrategiaMarketing.jsx', f5);
let c5 = fs.readFileSync('src/controllers/useFase5Controller.js', 'utf8');
c5 = c5.replace(/totalPasos: \d+/, "totalPasos: 6");
fs.writeFileSync('src/controllers/useFase5Controller.js', c5);

// --- Fase 6 ---
let f6 = fs.readFileSync('src/pages/Fase6_LocalizacionDistribucion.jsx', 'utf8');
if (!f6.includes('YoutubePlayer')) {
    f6 = f6.replace("import SubMenuFases from '../components/ui/SubMenuFases';", "import SubMenuFases from '../components/ui/SubMenuFases';\nimport YoutubePlayer from '../components/ui/YoutubePlayer';");
}
f6 = f6.replace(/const renderVideoStep = \([\s\S]*?\)\s*=>\s*\([\s\S]*?<\/div>\s*\);/, `const renderVideoStep = (titulo) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{titulo}</h2>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <YoutubePlayer videoKey="video_fase_6" title={titulo} fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
      </div>
    </div>
  );`);
f6 = f6.replace(/case 7: return renderVideoStep\([\s\S]*?\);/, "");
f6 = f6.replace(/case 8:/g, "case 7:");
f6 = f6.replace(/case 9:/g, "case 8:");
f6 = f6.replace(/if \(step === 9/g, "if (step === 8");
f6 = f6.replace(/tabs=\{\[[\s\S]*?\}\]/, `tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <MapPin size={18} />, label: 'Identificación Loc.' },
          { id: 3, icon: <Truck size={18} />, label: 'Canales Distribución' },
          { id: 4, icon: <MapPin size={18} />, label: 'Elección Lugar' },
          { id: 5, icon: <Image size={18} />, label: 'Croquis' },
          { id: 6, icon: <CreditCard size={18} />, label: 'Pagos' },
          { id: 7, icon: <ClipboardList size={18} />, label: 'Plan Acción' },
          { id: 8, icon: <Bot size={18} />, label: 'Resumen IA' }
        ]}`);
fs.writeFileSync('src/pages/Fase6_LocalizacionDistribucion.jsx', f6);
let c6 = fs.readFileSync('src/controllers/useFase6Controller.js', 'utf8');
c6 = c6.replace(/totalPasos: \d+/, "totalPasos: 8");
fs.writeFileSync('src/controllers/useFase6Controller.js', c6);

// --- Fase 8 ---
let f8 = fs.readFileSync('src/pages/Fase8_Operacion.jsx', 'utf8');
if (!f8.includes('YoutubePlayer')) {
    f8 = f8.replace("import SubMenuFases from '../components/ui/SubMenuFases';", "import SubMenuFases from '../components/ui/SubMenuFases';\nimport YoutubePlayer from '../components/ui/YoutubePlayer';");
}
f8 = f8.replace(/const renderVideoStep = \([\s\S]*?\)\s*=>\s*\([\s\S]*?<\/div>\s*\);/, `const renderVideoStep = (titulo) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{titulo}</h2>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <YoutubePlayer videoKey="video_fase_8" title={titulo} fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
      </div>
    </div>
  );`);
f8 = f8.replace(/case 4: return renderVideoStep\([\s\S]*?\);/, "");
f8 = f8.replace(/case 5:/g, "case 4:");
f8 = f8.replace(/tabs=\{\[[\s\S]*?\}\]/, `tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <List size={18} />, label: 'Listado Pasos' },
          { id: 3, icon: <CheckSquare size={18} />, label: 'Revisión' },
          { id: 4, icon: <Network size={18} />, label: 'Diagrama' }
        ]}`);
fs.writeFileSync('src/pages/Fase8_Operacion.jsx', f8);
let c8 = fs.readFileSync('src/controllers/useFase8Controller.js', 'utf8');
c8 = c8.replace(/totalPasos: \d+/, "totalPasos: 4");
fs.writeFileSync('src/controllers/useFase8Controller.js', c8);

// --- Fase 9 ---
let f9 = fs.readFileSync('src/pages/Fase9_Estructura.jsx', 'utf8');
if (!f9.includes('YoutubePlayer')) {
    f9 = f9.replace("import SubMenuFases from '../components/ui/SubMenuFases';", "import SubMenuFases from '../components/ui/SubMenuFases';\nimport YoutubePlayer from '../components/ui/YoutubePlayer';\nimport { Video } from 'lucide-react';");
}
f9 = f9.replace(/case 1:/g, "case 2:");
f9 = f9.replace(/case 2:/g, "case 3:");
f9 = f9.replace(/case 3:/g, "case 4:");
f9 = f9.replace(/switch \(pasoActual\) \{/, `switch (pasoActual) {
        case 1: return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Video Estructura</h2>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <YoutubePlayer videoKey="video_fase_9" title="Estructura" fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
            </div>
          </div>
        );`);
f9 = f9.replace(/if \(step === 3/g, "if (step === 4");
f9 = f9.replace(/step < 3 \?/g, "step < 4 ?");
f9 = f9.replace(/tabs=\{\[[\s\S]*?\}\]/, `tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <Network size={18} />, label: 'Organigrama' },
          { id: 3, icon: <Briefcase size={18} />, label: 'Roles' },
          { id: 4, icon: <Sparkles size={18} />, label: 'Resumen IA' }
        ]}`);
fs.writeFileSync('src/pages/Fase9_Estructura.jsx', f9);
let c9 = fs.readFileSync('src/controllers/useFase9Controller.js', 'utf8');
c9 = c9.replace(/totalPasos: \d+/, "totalPasos: 4");
fs.writeFileSync('src/controllers/useFase9Controller.js', c9);

console.log("All done");
