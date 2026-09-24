const fs = require('fs');

function refactorFase(file, videoKey, title) {
    let code = fs.readFileSync(file, 'utf8');
    
    if (code.includes('YoutubePlayer')) {
        console.log(file + " already has YoutubePlayer");
        return false;
    }

    code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { YoutubePlayer } from '../components/ui/YoutubePlayer';\nimport { $1, Video } from 'lucide-react';");

    if (!code.includes("import YoutubePlayer")) {
        code = code.replace("import React,", "import YoutubePlayer from '../components/ui/YoutubePlayer';\nimport React,");
    }

    // Shift cases: 2 -> 3, 1 -> 2
    code = code.replace(/case 2:/g, "case 3:");
    code = code.replace(/case 1:/g, "case 2:");

    const videoCase = `case 1: return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>${title}</h2>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <YoutubePlayer videoKey="${videoKey}" title="${title}" fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
            </div>
          </div>
        );
        `;
    
    code = code.replace(/case 2: return \(/, videoCase + "case 2: return (");

    // Fix tabs
    // From:
    // { id: 1, icon: <Settings size={16} />, label: 'Configuración' },
    // { id: 2, icon: <CheckCircle size={16} />, label: 'Documento' }
    // To:
    // { id: 1, icon: <Video size={16} />, label: 'Video' },
    // { id: 2, icon: <Settings size={16} />, label: 'Configuración' },
    // { id: 3, icon: <CheckCircle size={16} />, label: 'Documento' }
    
    code = code.replace(/id: 2, icon: <CheckCircle/, "id: 3, icon: <CheckCircle");
    code = code.replace(/id: 1, icon: <Settings/, "id: 2, icon: <Settings");
    
    code = code.replace(/tabs=\{\[/, "tabs={[\n          { id: 1, icon: <Video size={16} />, label: 'Video' },");

    // Also update totalPasos from 2 to 3
    code = code.replace(/totalPasos=\{2\}/, "totalPasos={3}");

    // Also step texts: step === 1 ? ... : step === 2 ? ... : ...
    code = code.replace(/step === 1 \? "La Inteligencia Artificial/, 'step === 1 ? "Mira este video para entender cómo la IA te ayudará a consolidar todo." : step === 2 ? "La Inteligencia Artificial');
    
    fs.writeFileSync(file, code);
    console.log(file + " updated!");
    return true;
}

refactorFase('src/pages/Fase13_DocumentoIA.jsx', 'video_fase_13', 'Video Documento Final IA');
