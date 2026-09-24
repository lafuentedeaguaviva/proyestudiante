const fs = require('fs');
const path = require('path');

function replaceVideoKeys(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all video_fX_something with video_fase_X
    // For Fase 0
    content = content.replace(/video_encrucijada/g, 'video_fase_0');
    
    // For Fase 1
    content = content.replace(/video_f1_[a-zA-Z0-9_]+/g, 'video_fase_1');
    
    // For Fase 2
    content = content.replace(/video_f2_[a-zA-Z0-9_]+/g, 'video_fase_2');
    
    // For Fase 7
    content = content.replace(/video_f7_[a-zA-Z0-9_]+/g, 'video_fase_7');

    fs.writeFileSync(filePath, content);
}

const files = [
    'src/pages/Fase0_OnboardingMentor.jsx',
    'src/components/Encrucijada.jsx',
    'src/pages/Fase1_EmprendimientoMentor.jsx',
    'src/components/modos/mentor/fases/CaminoA/Fase1/LluviaIdeas.jsx',
    'src/components/modos/mentor/fases/CaminoA/Fase2/Paso1_ValidacionVideo.jsx',
    'src/components/modos/mentor/fases/CaminoA/Fase2/Paso3_VideoMatriz.jsx',
    'src/components/modos/mentor/fases/CaminoA/Fase2/RecopilarInfo.jsx',
    'src/pages/Fase7_Planteamiento.jsx'
];

files.forEach(replaceVideoKeys);
console.log("Keys replaced.");
