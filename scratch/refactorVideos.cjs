const fs = require('fs');

// 1. Update VideosTab.jsx
let videosTabPath = 'src/components/admin/VideosTab.jsx';
let videosTabContent = fs.readFileSync(videosTabPath, 'utf8');

const oldVideoListMatch = videosTabContent.match(/const VIDEO_LIST = \[[\s\S]*?\];/);
if (oldVideoListMatch) {
  const newVideoList = `const VIDEO_LIST = [
  { key: 'video_fase_0', fase: 0, desc: 'Fase 0 - Onboarding' },
  { key: 'video_fase_1', fase: 1, desc: 'Fase 1 - Empatizar' },
  { key: 'video_fase_2', fase: 2, desc: 'Fase 2 - Validación' },
  { key: 'video_fase_3', fase: 3, desc: 'Fase 3 - Análisis de Competencia' },
  { key: 'video_fase_4', fase: 4, desc: 'Fase 4 - Diseño de Producto' },
  { key: 'video_fase_5', fase: 5, desc: 'Fase 5 - Modelo de Negocio' },
  { key: 'video_fase_6', fase: 6, desc: 'Fase 6 - Prototipado' },
  { key: 'video_fase_7', fase: 7, desc: 'Fase 7 - Planteamiento Estratégico' },
  { key: 'video_fase_8', fase: 8, desc: 'Fase 8 - Plan de Operaciones' },
  { key: 'video_fase_9', fase: 9, desc: 'Fase 9 - Plan de Marketing' },
  { key: 'video_fase_10', fase: 10, desc: 'Fase 10 - Plan Financiero' },
  { key: 'video_fase_11', fase: 11, desc: 'Fase 11 - Viabilidad' },
  { key: 'video_fase_12', fase: 12, desc: 'Fase 12 - Pitch' },
  { key: 'video_fase_13', fase: 13, desc: 'Fase 13 - Generación de Documento' }
];`;
  videosTabContent = videosTabContent.replace(oldVideoListMatch[0], newVideoList);
  fs.writeFileSync(videosTabPath, videosTabContent);
}

// 2. Update Fase0_OnboardingMentor.jsx
let f0Path = 'src/pages/Fase0_OnboardingMentor.jsx';
let f0 = fs.readFileSync(f0Path, 'utf8');
f0 = f0.replace(/video_encrucijada/g, 'video_fase_0');
fs.writeFileSync(f0Path, f0);

// 3. Update Encrucijada.jsx
let encPath = 'src/components/Encrucijada.jsx';
let enc = fs.readFileSync(encPath, 'utf8');
enc = enc.replace(/video_encrucijada/g, 'video_fase_0');
fs.writeFileSync(encPath, enc);

// 4. Update Fase1_EmprendimientoMentor.jsx
// Keep first video, remove others
let f1Path = 'src/pages/Fase1_EmprendimientoMentor.jsx';
let f1 = fs.readFileSync(f1Path, 'utf8');
f1 = f1.replace(/video_f1_observacion/g, 'video_fase_1');
f1 = f1.replace(/<YoutubePlayer[\s\S]*?video_f1_fricciones[\s\S]*?\/>/g, '');
f1 = f1.replace(/<YoutubePlayer[\s\S]*?video_f1_ideacion[\s\S]*?\/>/g, '');
f1 = f1.replace(/<YoutubePlayer[\s\S]*?video_f1_evaluacion[\s\S]*?\/>/g, '');
fs.writeFileSync(f1Path, f1);

// 5. Update LluviaIdeas.jsx (Fase 1/2 shared)
let lluviaPath = 'src/components/modos/mentor/fases/CaminoA/Fase1/LluviaIdeas.jsx';
let lluvia = fs.readFileSync(lluviaPath, 'utf8');
lluvia = lluvia.replace(/<YoutubePlayer[\s\S]*?video_f2_lluvia[\s\S]*?\/>/g, '');
fs.writeFileSync(lluviaPath, lluvia);

// 6. Update Fase 2 files
let f2P1Path = 'src/components/modos/mentor/fases/CaminoA/Fase2/Paso1_ValidacionVideo.jsx';
let f2P1 = fs.readFileSync(f2P1Path, 'utf8');
f2P1 = f2P1.replace(/video_f2_validacion/g, 'video_fase_2');
fs.writeFileSync(f2P1Path, f2P1);

let f2P3Path = 'src/components/modos/mentor/fases/CaminoA/Fase2/Paso3_VideoMatriz.jsx';
let f2P3 = fs.readFileSync(f2P3Path, 'utf8');
f2P3 = f2P3.replace(/<YoutubePlayer[\s\S]*?video_f2_matriz[\s\S]*?\/>/g, '');
fs.writeFileSync(f2P3Path, f2P3);

let f2RecPath = 'src/components/modos/mentor/fases/CaminoA/Fase2/RecopilarInfo.jsx';
let f2Rec = fs.readFileSync(f2RecPath, 'utf8');
f2Rec = f2Rec.replace(/<YoutubePlayer[\s\S]*?video_f2_encuesta[\s\S]*?\/>/g, '');
fs.writeFileSync(f2RecPath, f2Rec);

// 7. Update Fase7_Planteamiento.jsx
let f7Path = 'src/pages/Fase7_Planteamiento.jsx';
let f7 = fs.readFileSync(f7Path, 'utf8');
f7 = f7.replace(/video_f7_diagnostico/g, 'video_fase_7');
f7 = f7.replace(/<YoutubePlayer[\s\S]*?video_f7_objetivos[\s\S]*?\/>/g, '');
f7 = f7.replace(/<YoutubePlayer[\s\S]*?video_f7_mision[\s\S]*?\/>/g, '');
f7 = f7.replace(/<YoutubePlayer[\s\S]*?video_f7_vision[\s\S]*?\/>/g, '');
f7 = f7.replace(/<YoutubePlayer[\s\S]*?video_f7_justificacion[\s\S]*?\/>/g, '');
fs.writeFileSync(f7Path, f7);

console.log("Videos refactorizados a uno por fase.");
