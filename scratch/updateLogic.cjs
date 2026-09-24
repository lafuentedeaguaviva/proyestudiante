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
console.log("Logic Updated");
