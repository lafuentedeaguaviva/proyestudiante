const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/pages/Fase13_DocumentoIA.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove old step 1 (Video)
const step1Regex = /if \(step === 1\) {[\s\S]*?return \([\s\S]*?<YoutubePlayer[\s\S]*?<\/div>\s*\);\s*}/;
content = content.replace(step1Regex, '');

// 2. Change step 2 to 1, and step 3 to 2
content = content.replace(/if \(step === 2\)/g, 'if (step === 1)');
content = content.replace(/if \(step === 3\)/g, 'if (step === 2)');

// 3. Update totalPasos and tabs
content = content.replace(/totalPasos={3}/g, 'totalPasos={2}');
content = content.replace(/{\s*id:\s*1,\s*icon:\s*<Video\s*size={16}\s*\/>,\s*label:\s*'Video'\s*},/g, '');
content = content.replace(/{\s*id:\s*2,\s*icon:\s*<Settings\s*size={16}\s*\/>,\s*label:\s*'Configuración'\s*}/g, "{ id: 1, icon: <Settings size={16} />, label: 'Configuración' }");
// For the strange characters in 'Configuracin', we'll just replace the ids in the array:
content = content.replace(/tabs={\[[\s\S]*?\]}/, `tabs={[
          { id: 1, icon: <Settings size={16} />, label: 'Configuración' },
          { id: 2, icon: <CheckCircle size={16} />, label: 'Documento' }
        ]}`);

// 4. Update mentorText
content = content.replace(/mentorText={[\s\S]*?}/, `mentorText={
          step === 1 ? "La Inteligencia Artificial tomará toda la información que llenaste en las fases anteriores y le dará estructura y formato académico." : 
          "¡Excelente trabajo! Hemos llegado al final de este recorrido. Revisa tu documento y prepárate para presentarlo."
        }`);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Fase13_DocumentoIA.jsx modified");
