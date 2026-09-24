const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/pages/Fase2_ValidacionIdea.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove import of Paso3_VideoMatriz
content = content.replace("import Paso3_VideoMatriz from '../components/modos/mentor/fases/CaminoA/Fase2/Paso3_VideoMatriz';\n", "");

// 2. Update tabs array
const oldTabs = `  const tabs = [
    { id: 1, icon: <Video size={18} />, label: 'Validar' },
    { id: 2, icon: <FileText size={18} />, label: 'Encuesta' },
    { id: 3, icon: <Database size={18} />, label: 'Matriz' },
    { id: 4, icon: <Code size={18} />, label: 'Códigos' },
    { id: 5, icon: <CheckCircle size={18} />, label: 'Tabular' },
    { id: 6, icon: <PieChart size={18} />, label: 'Resultados' },
    { id: 7, icon: <Sparkles size={18} />, label: 'Resumen IA' }
  ];`;
const newTabs = `  const tabs = [
    { id: 1, icon: <Video size={18} />, label: 'Validar' },
    { id: 2, icon: <FileText size={18} />, label: 'Encuesta' },
    { id: 3, icon: <Code size={18} />, label: 'Códigos' },
    { id: 4, icon: <CheckCircle size={18} />, label: 'Tabular' },
    { id: 5, icon: <PieChart size={18} />, label: 'Resultados' },
    { id: 6, icon: <Sparkles size={18} />, label: 'Resumen IA' }
  ];`;

// Also check for 'Cdigos' which might be the actual text due to encoding issues
const fallbackTabsRegex = /const tabs = \[\s*{\s*id:\s*1[^\n]*\n[^\n]*id:\s*2[^\n]*\n[^\n]*id:\s*3[^\n]*\n[^\n]*id:\s*4[^\n]*\n[^\n]*id:\s*5[^\n]*\n[^\n]*id:\s*6[^\n]*\n[^\n]*id:\s*7[^\n]*\n\s*\];/m;

if (content.includes(oldTabs)) {
  content = content.replace(oldTabs, newTabs);
} else {
  // Use regex
  content = content.replace(fallbackTabsRegex, newTabs);
}

// 3. MaxStep from 7 to 6
content = content.replace('maxStep={7}', 'maxStep={6}');

// 4. Update AnimatePresence blocks
// Paso 1: onComplete={() => irAPaso(2)} onSkip={() => irAPaso(4)} (skip went to 5 previously)
content = content.replace(/irAPaso\(5\)/g, 'irAPaso(4)');

// Paso 2: onComplete={() => irAPaso(3)} -> used to go to 3, now it should still go to 3 (but 3 is codificacion)
// No change needed for Paso 2's irAPaso(3).

// Remove Step 3 completely
const step3BlockRegex = /\{\s*step === 3 && \([\s\S]*?Paso3_VideoMatriz[\s\S]*?<\/motion\.div>\s*\)\s*\}/;
content = content.replace(step3BlockRegex, "");

// Replace step numbers in the remaining components
content = content.replace(/step === 4/g, "step === 3");
content = content.replace(/step === 5/g, "step === 4");
content = content.replace(/step === 6/g, "step === 5");
content = content.replace(/step === 7/g, "step === 6");
content = content.replace(/key="4"/g, 'key="3"');
content = content.replace(/key="5"/g, 'key="4"');
content = content.replace(/key="6"/g, 'key="5"');
content = content.replace(/key="7"/g, 'key="6"');

// Update irAPaso in remaining components:
// Paso4 (now 3): onComplete={() => irAPaso(5)} -> needs to go to 4
content = content.replace(/irAPaso\(5\)/g, 'irAPaso(4)');
// Paso6 (now 5): onComplete={() => irAPaso(7)} -> needs to go to 6
content = content.replace(/irAPaso\(7\)/g, 'irAPaso(6)');

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Fase2_ValidacionIdea.jsx updated.");
