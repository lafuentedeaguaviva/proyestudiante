const fs = require('fs');

function refactorFase(file, videoKey, title) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Check if it already has YoutubePlayer
    if (code.includes('YoutubePlayer')) {
        console.log(file + " already has YoutubePlayer");
        return false;
    }

    // Add imports
    code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { YoutubePlayer } from '../components/ui/YoutubePlayer';\nimport { $1, Video } from 'lucide-react';");
    code = code.replace(/import YoutubePlayer.*?;\n?/, ""); // Clean up if any weird duplicated import
    
    // It's safer to just inject it at the top
    if (!code.includes("import YoutubePlayer")) {
        code = code.replace("import React,", "import YoutubePlayer from '../components/ui/YoutubePlayer';\nimport React,");
    }

    // Add Video to lucide-react if not there
    if (!code.includes("Video,")) {
         code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, Video } from 'lucide-react';");
    }

    // Adjust cases: replace case 5 with case 6, etc.
    // For Fase 12: originally 5 steps (case 1 to case 5)
    // We want to shift them 1 -> 2, 2 -> 3, etc. but carefully
    // We match `case 5:` and change to `case 6:` first!
    code = code.replace(/case 5:/g, "case 6:");
    code = code.replace(/case 4:/g, "case 5:");
    code = code.replace(/case 3:/g, "case 4:");
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

    // Update tabs array
    // find `const tabs = [` and add the Video tab
    code = code.replace(/const tabs = \[/, `const tabs = [\n    { id: 1, icon: <Video size={18} />, label: 'Video' },`);
    
    // The previous IDs in tabs will be duplicated or wrong, let's just rewrite the IDs dynamically if they are hardcoded
    // Actually, in Fase 12 they might be: { id: 1, ... }
    // Let's increment the IDs in the tabs array!
    code = code.replace(/id: 1, icon/g, "id: 2, icon");
    code = code.replace(/id: 2, icon/g, "id: 3, icon");
    code = code.replace(/id: 3, icon/g, "id: 4, icon");
    code = code.replace(/id: 4, icon/g, "id: 5, icon");
    code = code.replace(/id: 5, icon/g, "id: 6, icon");

    // Fix the first one that we just injected
    code = code.replace(/id: 2, icon: <Video/, "id: 1, icon: <Video");

    fs.writeFileSync(file, code);
    console.log(file + " updated!");
    return true;
}

refactorFase('src/pages/Fase12_ProyectoVida.jsx', 'video_fase_12', 'Video Proyecto de Vida');
// Fase 13 is different, let's look at it first.
