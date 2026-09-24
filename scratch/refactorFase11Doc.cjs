const fs = require('fs');

const path = 'src/pages/Fase11_DocumentoFinal.jsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes("YoutubePlayer")) {
    code = code.replace(/import { Play/, "import YoutubePlayer from '../components/ui/YoutubePlayer';\nimport { Play, Video");
}

// Replace case 1 with YoutubePlayer
const case1Regex = /case 1: return \([\s\S]*?alt="Introduccin"[\s\S]*?<\/div>\s*\);\s*case 2: return/m;
code = code.replace(/case 1:[\s\S]*?(?=case 2: return)/, `case 1: return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Video Documento Final</h2>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <YoutubePlayer videoKey="video_fase_11_doc" title="Documento Final" fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
            </div>
          </div>
        );
        `);

// Remove case 3, 5, 7, 9
code = code.replace(/case 3:[\s\S]*?alt="Resultados"[\s\S]*?<\/div>\s*\);/m, "");
code = code.replace(/case 5:[\s\S]*?alt="Conclusiones"[\s\S]*?<\/div>\s*\);/m, "");
code = code.replace(/case 7:[\s\S]*?alt="Agradecimientos"[\s\S]*?<\/div>\s*\);/m, "");
code = code.replace(/case 9:[\s\S]*?alt="Dedicatoria"[\s\S]*?<\/div>\s*\);/m, "");

// Shift remaining cases
code = code.replace(/case 4:/g, "case 3:");
code = code.replace(/case 6:/g, "case 4:");
code = code.replace(/case 8:/g, "case 5:");
code = code.replace(/case 10:/g, "case 6:");
code = code.replace(/case 11:/g, "case 7:");

// Shift steps in logic
code = code.replace(/step === 11/g, "step === 7");
code = code.replace(/step < 11/g, "step < 7");
code = code.replace(/step === 4/g, "step === 3");

// Replace tabs array using explicit match since there are no nested inner objects using `}]`
const newTabs = `tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <BookOpen size={16} />, label: 'Intro' },
          { id: 3, icon: <BarChart size={16} />, label: 'Resultados' },
          { id: 4, icon: <CheckCircle size={16} />, label: 'Conclusiones' },
          { id: 5, icon: <Gift size={16} />, label: 'Agradecimientos' },
          { id: 6, icon: <Heart size={16} />, label: 'Dedicatoria' },
          { id: 7, icon: <BookOpen size={16} />, label: 'Resumen IA' }
        ]}`;
code = code.replace(/tabs=\{\[[\s\S]*?\]\}/, newTabs);

fs.writeFileSync(path, code);

// Controller
const ctrlPath = 'src/controllers/useFase11bController.js';
if (fs.existsSync(ctrlPath)) {
    let ctrl = fs.readFileSync(ctrlPath, 'utf8');
    ctrl = ctrl.replace(/totalPasos:\s*11/, "totalPasos: 7");
    fs.writeFileSync(ctrlPath, ctrl);
} else {
    const ctrlPath2 = 'src/controllers/useFase11Controller.js'; // Fallback
    if (fs.existsSync(ctrlPath2)) {
        let ctrl = fs.readFileSync(ctrlPath2, 'utf8');
        ctrl = ctrl.replace(/totalPasos:\s*11/, "totalPasos: 7");
        fs.writeFileSync(ctrlPath2, ctrl);
    }
}

console.log("Done refactoring Fase 11 Documento Final");
