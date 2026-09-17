const fs = require('fs');
const path = require('path');

const fixFile = (fileName) => {
  const filePath = path.resolve(__dirname, '../src/pages', fileName);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  if (content.includes("return () => clearTimeout(saveTimer);")) {
    content = content.replace(/return \(\) => clearTimeout\(saveTimer\);\s*\}, \[globalData, pendingSave\]\);/g, "");
    changed = true;
  }

  if (content.includes("setPendingSave(true)")) {
    content = content.replace(/setPendingSave\(true\);?/g, "");
    content = content.replace(/onBlur=\{.*?\}\s*/g, "");
    changed = true;
  }

  if (content.includes("isLoadingData")) {
    content = content.replace(/isLoadingData/g, "cargando");
    changed = true;
  }

  if (content.includes("const handleFinalizar = async () => {")) {
    // There might be a duplicate handleFinalizar, but removing it entirely via regex is tricky.
    // I'll try to find if it was destructured first.
    if (content.includes("handleFinalizar") && content.match(/const handleFinalizar = async \(\) => \{[\s\S]*?\}\s*;/)) {
      content = content.replace(/const handleFinalizar = async \(\) => \{[\s\S]*?\}\s*;/g, "");
      changed = true;
    }
  }

  // Also make sure 'guardando' is exported from the controller
  if (content.includes("handleFinalizar") && !content.includes("guardando,") && !content.includes(", guardando")) {
     content = content.replace(/handleFinalizar\s*\}/, "handleFinalizar, guardando }");
     changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed ${fileName}`);
  }
};

['Fase2_ProblemaSolucion.jsx', 'Fase3_PublicoObjetivo.jsx', 'Fase4_DisenoProducto.jsx', 'Fase5_Prototipo.jsx', 'Fase6_Mercado.jsx', 'Fase7_EstrategiaMercado.jsx'].forEach(fixFile);
