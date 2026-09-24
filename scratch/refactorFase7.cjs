const fs = require('fs');

// 1. Rewrite Fase7_Planteamiento.jsx
const pathF7 = 'src/pages/Fase7_Planteamiento.jsx';
let jsxF7 = fs.readFileSync(pathF7, 'utf8');

// The file has switch (pasoActual) { case 1: ... case 11: ... }
// Cases 3, 5, 7, 9 are the videos.
// We must remove those cases, and shift the others.
// Luckily, we can just replace "case X:" with new numbers, or remove the old video cases.

const case3Regex = /case 3:[\s\S]*?return \([\s\S]*?<YoutubePlayer[\s\S]*?<\/div>\s*\);/;
jsxF7 = jsxF7.replace(case3Regex, '');

const case5Regex = /case 5:[\s\S]*?return \([\s\S]*?<YoutubePlayer[\s\S]*?<\/div>\s*\);/;
jsxF7 = jsxF7.replace(case5Regex, '');

const case7Regex = /case 7:[\s\S]*?return \([\s\S]*?<YoutubePlayer[\s\S]*?<\/div>\s*\);/;
jsxF7 = jsxF7.replace(case7Regex, '');

const case9Regex = /case 9:[\s\S]*?return \([\s\S]*?<YoutubePlayer[\s\S]*?<\/div>\s*\);/;
jsxF7 = jsxF7.replace(case9Regex, '');

// Shift the cases
jsxF7 = jsxF7.replace(/case 4:/g, 'case 3:');
jsxF7 = jsxF7.replace(/case 6:/g, 'case 4:');
jsxF7 = jsxF7.replace(/case 8:/g, 'case 5:');
jsxF7 = jsxF7.replace(/case 10:/g, 'case 6:');
jsxF7 = jsxF7.replace(/case 11:/g, 'case 7:');

// Change the step 11 check to step 7
jsxF7 = jsxF7.replace(/if \(step === 11/g, 'if (step === 7');

// Update tabs array
const oldTabsF7 = `      tabs={[
        { id: 1, icon: <Video size={18} />, label: 'Video Diagnstico' },
        { id: 2, icon: <MapPin size={18} />, label: 'Diagnstico' },
        { id: 3, icon: <Video size={18} />, label: 'Video Objetivos' },
        { id: 4, icon: <Target size={18} />, label: 'Objetivos' },
        { id: 5, icon: <Video size={18} />, label: 'Video Misin' },
        { id: 6, icon: <Compass size={18} />, label: 'Misin' },
        { id: 7, icon: <Video size={18} />, label: 'Video Visin' },
        { id: 8, icon: <Lightbulb size={18} />, label: 'Visin' },
        { id: 9, icon: <Video size={18} />, label: 'Video Justificacin' },
        { id: 10, icon: <CheckCircle size={18} />, label: 'Justificacin' },
        { id: 11, icon: <Sparkles size={18} />, label: 'Resumen IA' }
      ]}`;

const newTabsF7 = `      tabs={[
        { id: 1, icon: <Video size={18} />, label: 'Video' },
        { id: 2, icon: <MapPin size={18} />, label: 'Diagnóstico' },
        { id: 3, icon: <Target size={18} />, label: 'Objetivos' },
        { id: 4, icon: <Compass size={18} />, label: 'Misión' },
        { id: 5, icon: <Lightbulb size={18} />, label: 'Visión' },
        { id: 6, icon: <CheckCircle size={18} />, label: 'Justificación' },
        { id: 7, icon: <Sparkles size={18} />, label: 'Resumen IA' }
      ]}`;

jsxF7 = jsxF7.replace(/tabs=\{\[[\s\S]*?\}\]/, newTabsF7);

fs.writeFileSync(pathF7, jsxF7);

// 2. Rewrite useFase7Controller.js
const pathCtrl7 = 'src/controllers/useFase7Controller.js';
let ctrl7 = fs.readFileSync(pathCtrl7, 'utf8');
ctrl7 = ctrl7.replace(/totalPasos: 11/g, 'totalPasos: 7');
fs.writeFileSync(pathCtrl7, ctrl7);

console.log("Fase 7 done");
