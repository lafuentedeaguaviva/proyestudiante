const fs = require('fs');

// 1. Refactor useFase1Logic.js
let logicPath = 'src/hooks/useFase1Logic.js';
let logic = fs.readFileSync(logicPath, 'utf8');

logic = logic.replace(/p <= 10/g, 'p <= 7');
logic = logic.replace(/savedStep > 10 \? 10/g, 'savedStep > 7 ? 7');
logic = logic.replace(/step === 3 \|\| step === 5/g, 'step === 3 || step === 4');
logic = logic.replace(/} else if \(step === 7\) {/g, '} else if (step === 5) {');
logic = logic.replace(/if \(step === 6\) {/g, 'if (step === 4) {');

// Rewrite currentDialog
const oldDialog = `  const currentDialog = () => {
    if (!mentorData) return "";
    const { dialogos } = mentorData;
    switch(step) {
      case 1: return dialogos.paso1_area;
      case 2: return dialogos.recurso_observacion;
      case 3: return dialogos.paso2_observacion;
      case 4: return dialogos.recurso_fricciones;
      case 5: return dialogos.paso3_fricciones;
      case 6: return dialogos.recurso_ideacion;
      case 7: return dialogos.paso4_ideacion;
      case 8: return dialogos.recurso_evaluacion;
      case 9: return dialogos.paso5_batalla;
      case 10: return dialogos.paso6_ganador;
      default: return "";
    }
  };`;
const newDialog = `  const currentDialog = () => {
    if (!mentorData) return "";
    const { dialogos } = mentorData;
    switch(step) {
      case 1: return dialogos.paso1_area;
      case 2: return dialogos.recurso_observacion;
      case 3: return dialogos.paso2_observacion;
      case 4: return dialogos.paso3_fricciones;
      case 5: return dialogos.paso4_ideacion;
      case 6: return dialogos.paso5_batalla;
      case 7: return dialogos.paso6_ganador;
      default: return "";
    }
  };`;
logic = logic.replace(oldDialog, newDialog);
fs.writeFileSync(logicPath, logic);

// 2. Refactor Fase1_EmprendimientoMentor.jsx
let jsxPath = 'src/pages/Fase1_EmprendimientoMentor.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

jsx = jsx.replace(/step === 10/g, 'step === 7');

// Rewrite Tabs
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

// Remove step 4
jsx = jsx.replace(/{\/\* 4\. Recurso Fricciones \*\/}[\s\S]*?step === 4 && \([\s\S]*?<\/motion\.div>\n            \)}/g, '');

// Remove step 6
jsx = jsx.replace(/{\/\* 6\. Recurso Ideación \*\/}[\s\S]*?step === 6 && \([\s\S]*?<\/motion\.div>\n            \)}/g, '');

// Remove step 8
jsx = jsx.replace(/{\/\* 8\. Recurso Evaluación \*\/}[\s\S]*?step === 8 && \([\s\S]*?<\/motion\.div>\n            \)}/g, '');

// Renumber steps
jsx = jsx.replace(/{\/\* 5\. Formulario de Fricciones \*\//g, '{/* 4. Formulario de Fricciones */}');
jsx = jsx.replace(/step === 5 && \(/g, 'step === 4 && (');

jsx = jsx.replace(/{\/\* 7\. Lluvia de Ideas \*\//g, '{/* 5. Lluvia de Ideas */}');
jsx = jsx.replace(/step === 7 && \(/g, 'step === 5 && (');

jsx = jsx.replace(/{\/\* 9\. Matriz de Batalla \*\//g, '{/* 6. Matriz de Batalla */}');
jsx = jsx.replace(/step === 9 && \(/g, 'step === 6 && (');

jsx = jsx.replace(/{\/\* 10\. Pitch & Nombres \*\//g, '{/* 7. Pitch & Nombres */}');
// note step 10 was already replaced globally to step 7

fs.writeFileSync(jsxPath, jsx);

console.log("Fase 1 completada");
