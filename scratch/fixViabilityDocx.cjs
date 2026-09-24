const fs = require('fs');

// 1. UPDATE Fase13_DocumentoIA.jsx
const fileFase13 = 'd:/estudiante/plataforma-gamificada/src/pages/Fase13_DocumentoIA.jsx';
let contentFase13 = fs.readFileSync(fileFase13, 'utf8');

const regexResultadosF13 = /const resultadosText = \([\s\S]*?mejorados\['resultados'\] = resultadosText;/;
const replacementResultadosF13 = `const v = pDT[11]?.viabilidad || {};
        mejorados['viabilidad_comercial'] = v.viabilidadComercial || ds(11, 'resultados_mercado') || '';
        mejorados['viabilidad_tecnica'] = v.viabilidadTecnica || ds(11, 'resultados_tecnico') || '';
        mejorados['viabilidad_legal'] = v.viabilidadLegal || ds(11, 'resultados_financiero') || '';`;

if (contentFase13.match(regexResultadosF13)) {
  contentFase13 = contentFase13.replace(regexResultadosF13, replacementResultadosF13);
  fs.writeFileSync(fileFase13, contentFase13, 'utf8');
  console.log("Fase13 updated");
}

// 2. UPDATE docxGenerator.js
const fileDocx = 'd:/estudiante/plataforma-gamificada/src/lib/docxGenerator.js';
let contentDocx = fs.readFileSync(fileDocx, 'utf8');

const regexResultadosDocx = /\/\/ 5\. RESULTADOS\s*createHeading\("5\. RESULTADOS", 1\),\s*createParagraph\(getDato\('resultados'\) \|\|[\s\S]*?\),/g;
const replacementResultadosDocx = `// 5. RESULTADOS DE VIABILIDAD
          createHeading("5. RESULTADOS DE VIABILIDAD", 1),
          createHeading("5.1. Viabilidad Comercial", 2),
          createParagraph(getDato('viabilidad_comercial') || safeGet(pDT[11]?.viabilidad, 'viabilidadComercial')),
          createHeading("5.2. Viabilidad Técnica", 2),
          createParagraph(getDato('viabilidad_tecnica') || safeGet(pDT[11]?.viabilidad, 'viabilidadTecnica')),
          createHeading("5.3. Viabilidad Legal y Ambiental", 2),
          createParagraph(getDato('viabilidad_legal') || safeGet(pDT[11]?.viabilidad, 'viabilidadLegal')),`;

if (contentDocx.match(regexResultadosDocx)) {
  contentDocx = contentDocx.replace(regexResultadosDocx, replacementResultadosDocx);
  fs.writeFileSync(fileDocx, contentDocx, 'utf8');
  console.log("docxGenerator updated");
}

console.log('Success');
