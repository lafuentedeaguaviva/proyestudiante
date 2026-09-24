const fs = require('fs');

const fileDocx = 'd:/estudiante/plataforma-gamificada/src/lib/docxGenerator.js';
let contentDocx = fs.readFileSync(fileDocx, 'utf8');

// 1. Convert Viability to a Table
const regexViability = /\/\/ 5\. RESULTADOS DE VIABILIDAD[\s\S]*?createParagraph\(getDato\('viabilidad_legal'\) \|\| safeGet\(pDT\[11\]\?\.viabilidad, 'viabilidadLegal'\)\),/g;

const tableViabilityCode = `// 5. RESULTADOS DE VIABILIDAD
          createHeading("5. RESULTADOS DE VIABILIDAD", 1),
          createCaption(\`Tabla \${tCount++}: Análisis de Viabilidad del Proyecto\`),
          createTable(["Criterio de Viabilidad", "Justificación y Resultados"], [
            ["Viabilidad Comercial", getDato('viabilidad_comercial') || safeGet(pDT[11]?.viabilidad, 'viabilidadComercial') || "Pendiente de análisis"],
            ["Viabilidad Técnica", getDato('viabilidad_tecnica') || safeGet(pDT[11]?.viabilidad, 'viabilidadTecnica') || "Pendiente de análisis"],
            ["Viabilidad Legal y Ambiental", getDato('viabilidad_legal') || safeGet(pDT[11]?.viabilidad, 'viabilidadLegal') || "Pendiente de análisis"]
          ]),
          createSource("Fuente: Elaboración propia."),`;

if (contentDocx.match(regexViability)) {
  contentDocx = contentDocx.replace(regexViability, tableViabilityCode);
  console.log("Viability table replaced.");
} else {
  console.log("Failed to find Viability regex");
}

// 2. Add KPIs Table after Evaluation Financiera
const regexFinanciera = /createParagraph\(getDato\('viabilidad_interpretacion'\) \|\| getDato\('viabilidad'\) \|\| "La viabilidad del proyecto se sustenta[\s\S]*?"\),/g;

const tableKPIsCode = `createParagraph(getDato('viabilidad_interpretacion') || getDato('viabilidad') || "La viabilidad del proyecto se sustenta en el análisis de sus indicadores financieros. Un VAN positivo confirma la generación de valor, mientras que la TIR supera la tasa exigida, confirmando su rentabilidad y viabilidad en el mercado."),
          
          createHeading("4.7. Indicadores de Éxito (KPIs)", 2),
          createCaption(\`Tabla \${tCount++}: Indicadores de Éxito Clave (KPIs)\`),
          createTable(["Indicador (KPI)", "Meta a Alcanzar"], [
            [safeGet(pDT[10]?.indicadores, 'kpi1') || "KPI 1 (Ej. Ventas Mensuales)", safeGet(pDT[10]?.indicadores, 'meta1') || "-"],
            [safeGet(pDT[10]?.indicadores, 'kpi2') || "KPI 2", safeGet(pDT[10]?.indicadores, 'meta2') || "-"],
            [safeGet(pDT[10]?.indicadores, 'kpi3') || "KPI 3", safeGet(pDT[10]?.indicadores, 'meta3') || "-"]
          ]),
          createSource("Fuente: Elaboración propia."),`;

if (contentDocx.match(regexFinanciera)) {
  contentDocx = contentDocx.replace(regexFinanciera, tableKPIsCode);
  console.log("KPIs table added.");
} else {
  console.log("Failed to find KPIs regex");
}

fs.writeFileSync(fileDocx, contentDocx, 'utf8');
console.log('Success');
