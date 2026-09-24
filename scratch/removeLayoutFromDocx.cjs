const fs = require('fs');

// 1. Remove Layout from docxGenerator.js
const fileDocx = 'd:/estudiante/plataforma-gamificada/src/lib/docxGenerator.js';
let contentDocx = fs.readFileSync(fileDocx, 'utf8');

const regexLayoutDocx = /\s*createHeading\("3\.6\.2 Layout", 3\),[\s\S]*?createSource\("Fuente: Elaboración propia\."\)\s*\] : \[\]\),/g;
if (contentDocx.match(regexLayoutDocx)) {
  contentDocx = contentDocx.replace(regexLayoutDocx, '');
  fs.writeFileSync(fileDocx, contentDocx, 'utf8');
  console.log("Layout removed from docxGenerator.js");
}

// 2. Remove layout_intro from Fase13_DocumentoIA.jsx
const fileFase13 = 'd:/estudiante/plataforma-gamificada/src/pages/Fase13_DocumentoIA.jsx';
let contentFase13 = fs.readFileSync(fileFase13, 'utf8');

const regexLayoutFase13 = /\s*addOrPushIA\('layout_intro', '', 'Redacta un solo párrafo introductorio sobre la distribución de la planta, indicando que a continuación se muestra el layout\.'\);/g;
if (contentFase13.match(regexLayoutFase13)) {
  contentFase13 = contentFase13.replace(regexLayoutFase13, '');
  fs.writeFileSync(fileFase13, contentFase13, 'utf8');
  console.log("layout_intro removed from Fase13_DocumentoIA.jsx");
}

console.log('Success');
