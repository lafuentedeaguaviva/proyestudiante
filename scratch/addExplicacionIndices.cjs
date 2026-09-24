const fs = require('fs');

// 1. Add explicacion_indices_demanda to Fase13_DocumentoIA.jsx
const fileFase13 = 'd:/estudiante/plataforma-gamificada/src/pages/Fase13_DocumentoIA.jsx';
let contentFase13 = fs.readFileSync(fileFase13, 'utf8');

const regexDemandaF13 = /addOrPushIA\('demanda', textoDemanda, 'Análisis de Demanda'\);/;
const replacementDemandaF13 = `addOrPushIA('demanda', textoDemanda, 'Análisis de Demanda');\n        addOrPushIA('explicacion_indices_demanda', '', 'Explicación de los índices utilizados para la demanda estimada (ej. INE, crecimiento poblacional, encuestas)');`;

if (contentFase13.match(regexDemandaF13)) {
  contentFase13 = contentFase13.replace(regexDemandaF13, replacementDemandaF13);
  fs.writeFileSync(fileFase13, contentFase13, 'utf8');
  console.log("explicacion_indices added to Fase13_DocumentoIA.jsx");
}

// 2. Add explicacion_indices_demanda to docxGenerator.js
const fileDocx = 'd:/estudiante/plataforma-gamificada/src/lib/docxGenerator.js';
let contentDocx = fs.readFileSync(fileDocx, 'utf8');

const regexDemandaDocx = /createHeading\("3\.2\.2 Demanda", 3\),\s*createParagraph\(getDato\('demanda'\) \|\| safeGet\(pDT\[3\], 'tamano_mercado'\)\),/;
const replacementDemandaDocx = `createHeading("3.2.2 Demanda Estimada", 3),
          createParagraph(getDato('demanda') || safeGet(pDT[3], 'tamano_mercado')),
          createHeading("Explicación de Índices de Demanda", 4),
          createParagraph(getDato('explicacion_indices_demanda') || "Explicación de los índices estadísticos y proyecciones utilizados para estimar la demanda."),`;

if (contentDocx.match(regexDemandaDocx)) {
  contentDocx = contentDocx.replace(regexDemandaDocx, replacementDemandaDocx);
  fs.writeFileSync(fileDocx, contentDocx, 'utf8');
  console.log("explicacion_indices added to docxGenerator.js");
}

console.log('Success');
