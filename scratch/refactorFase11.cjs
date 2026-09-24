const fs = require('fs');

const fileF11 = 'src/pages/Fase11_Viabilidad.jsx';
let f11 = fs.readFileSync(fileF11, 'utf8');

if (!f11.includes("YoutubePlayer")) {
    f11 = f11.replace(/import { ShieldCheck/, "import YoutubePlayer from '../components/ui/YoutubePlayer';\nimport { Video, ShieldCheck");
}

f11 = f11.replace(/case 3:[\s\S]*?return \(/, `case 4: return (`);
f11 = f11.replace(/case 2:[\s\S]*?return \(/, `case 3: return (`);
f11 = f11.replace(/case 1:[\s\S]*?return \(/, `case 2: return (`);

f11 = f11.replace(/switch\s*\(pasoActual\)\s*\{/, `switch (pasoActual) {
        case 1: return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Video Viabilidad</h2>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <YoutubePlayer videoKey="video_fase_11" title="Video Viabilidad" fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
            </div>
          </div>
        );`);

f11 = f11.replace(/tabs=\{\[[\s\S]*?\]\}/, `tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <Wrench size={18} />, label: 'Viabilidad Técnica' },
          { id: 3, icon: <TrendingUp size={18} />, label: 'Viabilidad Comercial' },
          { id: 4, icon: <ShieldCheck size={18} />, label: 'Legal y Ambiental' }
        ]}`);

f11 = f11.replace(/step === 1 \? "La idea/g, `step === 2 ? "La idea`);
f11 = f11.replace(/step === 2 \? "Ahora que/g, `step === 3 ? "Ahora que`);

fs.writeFileSync(fileF11, f11);

const fileCtrl = 'src/controllers/useFase11Controller.js';
let ctrl = fs.readFileSync(fileCtrl, 'utf8');
ctrl = ctrl.replace(/totalPasos:\s*3/, "totalPasos: 4");
fs.writeFileSync(fileCtrl, ctrl);

console.log("Fase 11 Done!");
