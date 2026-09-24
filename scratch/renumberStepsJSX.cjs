const fs = require('fs');

let jsxPath = 'src/pages/Fase1_EmprendimientoMentor.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

// Helper to remove a block
function removeBlock(startStr) {
    const startIndex = jsx.indexOf(startStr);
    if (startIndex === -1) {
        console.error("NOT FOUND:", startStr);
        return;
    }
    const endStr = '</motion.div>';
    const endDivIndex = jsx.indexOf(endStr, startIndex);
    if (endDivIndex === -1) {
        console.error("END NOT FOUND");
        return;
    }
    const endIndex = jsx.indexOf(')}', endDivIndex) + 2;
    jsx = jsx.substring(0, startIndex) + jsx.substring(endIndex);
}

// 1. Remove step 4
removeBlock('{/* 4. Recurso Fricciones */}');

// 2. Remove step 6
removeBlock('{/* 6. Recurso Ideación */}');

// 3. Remove step 8
removeBlock('{/* 8. Recurso Evaluación */}');

// Now renumbering:
// Step 5 (Fricciones) -> Step 4
jsx = jsx.replace('{/* 5. Formulario de Fricciones */}', '{/* 4. Formulario de Fricciones */}');
jsx = jsx.replace('{step === 5 && (', '{step === 4 && (');

// Step 7 (Ideas) -> Step 5
jsx = jsx.replace('{/* 7. Lluvia de Ideas */}', '{/* 5. Lluvia de Ideas */}');
jsx = jsx.replace('{step === 7 && (', '{step === 5 && (');

// Step 9 (Batalla) -> Step 6
jsx = jsx.replace('{/* 9. Matriz de Batalla */}', '{/* 6. Matriz de Batalla */}');
jsx = jsx.replace('{step === 9 && (', '{step === 6 && (');

// Step 10 (Pitch) -> Step 7
jsx = jsx.replace('{/* 10. Pitch & Nombres */}', '{/* 7. Pitch & Nombres */}');
jsx = jsx.replace('{step === 10 && (', '{step === 7 && (');
jsx = jsx.replace('if (step === 10 && ideaGanadora', 'if (step === 7 && ideaGanadora');

// Update video_f1_observacion to video_fase_1
jsx = jsx.replace('video_f1_observacion', 'video_fase_1');

// Update Tabs
const oldTabs = `              tabs={[
                { id: 1, icon: <Monitor size={18} />, label: 'Área' },
                { id: 2, icon: <Video size={18} />, label: 'Problemas' },
                { id: 3, icon: <Eye size={18} />, label: 'Observación' },
                { id: 4, icon: <Video size={18} />, label: 'Soluciones' },
                { id: 5, icon: <AlertCircle size={18} />, label: 'Fricciones' },
                { id: 6, icon: <Video size={18} />, label: 'Ideación' },
                { id: 7, icon: <Lightbulb size={18} />, label: 'Ideas' },
                { id: 8, icon: <Video size={18} />, label: 'Evaluación' },
                { id: 9, icon: <Zap size={18} />, label: 'Batalla' },
                { id: 10, icon: <Award size={18} />, label: 'Ganadora' }
              ]}`;
const newTabs = `              tabs={[
                { id: 1, icon: <Monitor size={18} />, label: 'Área' },
                { id: 2, icon: <Video size={18} />, label: 'Video' },
                { id: 3, icon: <Eye size={18} />, label: 'Observación' },
                { id: 4, icon: <AlertCircle size={18} />, label: 'Fricciones' },
                { id: 5, icon: <Lightbulb size={18} />, label: 'Ideas' },
                { id: 6, icon: <Zap size={18} />, label: 'Batalla' },
                { id: 7, icon: <Award size={18} />, label: 'Ganadora' }
              ]}`;
jsx = jsx.replace(oldTabs, newTabs);

fs.writeFileSync(jsxPath, jsx);
console.log("SUCCESS");
