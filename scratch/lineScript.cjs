const fs = require('fs');

const path = 'src/pages/Fase1_EmprendimientoMentor.jsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

let inBlockToRemove = false;
let currentBlockName = '';
const newLines = [];

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Detect start of blocks to remove
    if (line.includes('{/* 4. Recurso Fricciones */}')) {
        inBlockToRemove = true;
        currentBlockName = 'step4';
        continue; // Skip this line
    }
    if (line.includes('{/* 6. Recurso Ideación */}')) {
        inBlockToRemove = true;
        currentBlockName = 'step6';
        continue;
    }
    if (line.includes('{/* 8. Recurso Evaluación */}')) {
        inBlockToRemove = true;
        currentBlockName = 'step8';
        continue;
    }

    // Detect end of block (the matching )} for the block)
    if (inBlockToRemove) {
        // The blocks end with `            )}` 
        // But to be safe, we check for exactly `            )}` on a single line after `</motion.div>`
        // Let's just look for `            )}`
        if (line.trim() === ')}') {
            // Check if the previous line was `              </motion.div>`
            const prevLine = lines[i-1].trim();
            if (prevLine === '</motion.div>') {
                inBlockToRemove = false;
                continue; // Skip the closing bracket too
            }
        }
        continue; // Skip lines inside the block
    }

    // Rename steps
    line = line.replace(/\{\/\* 5\. Formulario de Fricciones \*\/\}/g, '{/* 4. Formulario de Fricciones */}');
    line = line.replace(/step === 5 && \(/g, 'step === 4 && (');

    line = line.replace(/\{\/\* 7\. Lluvia de Ideas \*\/\}/g, '{/* 5. Lluvia de Ideas */}');
    line = line.replace(/step === 7 && \(/g, 'step === 5 && (');

    line = line.replace(/\{\/\* 9\. Matriz de Batalla \*\/\}/g, '{/* 6. Matriz de Batalla */}');
    line = line.replace(/step === 9 && \(/g, 'step === 6 && (');

    line = line.replace(/\{\/\* 10\. Pitch & Nombres \*\/\}/g, '{/* 7. Pitch & Nombres */}');
    line = line.replace(/step === 10 && \(/g, 'step === 7 && (');
    line = line.replace(/if \(step === 10 && ideaGanadora/g, 'if (step === 7 && ideaGanadora');

    // Change video_f1_observacion to video_fase_1
    line = line.replace(/video_f1_observacion/g, 'video_fase_1');

    newLines.push(line);
}

let result = newLines.join('\n');

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
result = result.replace(oldTabs, newTabs);

fs.writeFileSync(path, result);
console.log('SUCCESS');
