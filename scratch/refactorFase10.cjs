const fs = require('fs');

const path = 'src/pages/Fase10_PlanFinanciero.jsx';
let code = fs.readFileSync(path, 'utf8');

// Ensure YoutubePlayer is imported
if (!code.includes("import YoutubePlayer")) {
    code = code.replace(/import { Plus/, "import YoutubePlayer from '../components/ui/YoutubePlayer';\nimport { Plus, Video");
}

// Remove the video cases
const casesToRemove = [6, 8, 10, 12, 14, 16, 18];
casesToRemove.forEach(c => {
    // We match the case down to its ending `</div>\s*\);`
    // Since each case returns a div with "animate-fade-in", we can regex it carefully
    const regex = new RegExp(`case ${c}:[\\s\\S]*?alt=".*?Video.*?"[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*\\);`, 'm');
    // Actually, looking at the code above, it's: 
    // case 6: return ( ... <div className="aspect-video... > ... </div> </div> );
    // A simpler approach: just remove everything from "case 6: return (" to the next "case X:" or "default:"
});

// A robust way to remove cases is by splitting by "case " and filtering, but that's risky if "case " appears inside strings.
// Let's use a simpler replace block.

// Instead of complex regex, let's just do:
code = code.replace(/case 6:[\s\S]*?(?=case 7: return)/, '');
code = code.replace(/case 8:[\s\S]*?(?=case 9: return)/, '');
code = code.replace(/case 10:[\s\S]*?(?=case 11: return)/, '');
code = code.replace(/case 12:[\s\S]*?(?=case 13: return)/, '');
code = code.replace(/case 14:[\s\S]*?(?=case 15: return)/, '');
code = code.replace(/case 16:[\s\S]*?(?=case 17: return)/, '');
code = code.replace(/case 18:[\s\S]*?(?=case 19: return)/, '');

// Now replace Case 1 with YoutubePlayer
code = code.replace(/case 1:[\s\S]*?(?=case 2: return)/, `case 1: return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Video Viabilidad y Sostenibilidad</h2>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <YoutubePlayer videoKey="video_fase_10" title="Plan Financiero" fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
            </div>
          </div>
        );
        `);

// Now shift the cases!
// 2->2, 3->3, 4->4, 5->5
// 7->6
code = code.replace(/case 7:/g, "case 6:");
// 9->7
code = code.replace(/case 9:/g, "case 7:");
// 11->8
code = code.replace(/case 11:/g, "case 8:");
// 13->9
code = code.replace(/case 13:/g, "case 9:");
// 15->10
code = code.replace(/case 15:/g, "case 10:");
// 17->11
code = code.replace(/case 17:/g, "case 11:");
// 19->12
code = code.replace(/case 19:/g, "case 12:");

// Shift logic limits
code = code.replace(/step === 19/g, "step === 12");
code = code.replace(/step < 19/g, "step < 12");

// Replace tabs
const newTabs = `tabs={[
          { id: 1, icon: <Video size={16} />, label: 'Video' },
          { id: 2, icon: <Wallet size={16} />, label: 'Cap. Inversión' },
          { id: 3, icon: <Calculator size={16} />, label: 'Costos por Prod.' },
          { id: 4, icon: <Package size={16} />, label: 'Cap. Trabajo' },
          { id: 5, icon: <Wallet size={16} />, label: 'Resumen' },
          { id: 6, icon: <Calculator size={16} />, label: 'Costos' },
          { id: 7, icon: <Calculator size={16} />, label: 'Precio Venta' },
          { id: 8, icon: <TrendingUp size={16} />, label: 'Proy. Gan' },
          { id: 9, icon: <Wallet size={16} />, label: 'Proy. Gastos' },
          { id: 10, icon: <TrendingUp size={16} />, label: 'Utilidad' },
          { id: 11, icon: <Calculator size={16} />, label: 'Equilibrio' },
          { id: 12, icon: <TrendingUp size={16} />, label: 'VAN y TIR' }
        ]}`;
code = code.replace(/tabs=\{\[[\s\S]*?\]\}/, newTabs);

fs.writeFileSync(path, code);

// Update controller
const ctrlPath = 'src/controllers/useFase10Controller.js';
if (fs.existsSync(ctrlPath)) {
    let ctrl = fs.readFileSync(ctrlPath, 'utf8');
    ctrl = ctrl.replace(/totalPasos:\s*19/, "totalPasos: 12");
    fs.writeFileSync(ctrlPath, ctrl);
}

// Just in case there's a CaminoB version for Fase 10
const ctrlPathB = 'src/controllers/useFase10bController.js';
if (fs.existsSync(ctrlPathB)) {
    let ctrl = fs.readFileSync(ctrlPathB, 'utf8');
    ctrl = ctrl.replace(/totalPasos:\s*19/, "totalPasos: 12");
    fs.writeFileSync(ctrlPathB, ctrl);
}

console.log("Done");
