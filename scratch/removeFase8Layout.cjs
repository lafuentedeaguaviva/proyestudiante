const fs = require('fs');
let c = fs.readFileSync('src/pages/Fase8_Operacion.jsx', 'utf8');

// 1. Update the maximum step to 5 instead of 7
c = c.replace(/if \(step < 7\) \{/g, 'if (step < 5) {');

// 2. We need to handle the finish logic. Let's create a finish function or just use the existing one.
// Wait, the existing finish logic is:
// setIsFinishing(true); try { ... navigate('/fase/9/intro'); }
// Let's replace the `irAPaso(6)` with a call to finishPhase()
const finishLogic = `
  const finishPhase = async () => {
    setIsFinishing(true);
    try {
      if(typeof setPendingSave === 'function') setPendingSave(true);
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
      await Promise.race([
        FaseModel.guardarDatos(8, 'operacion', data),
        timeoutPromise
      ]);
      await FaseModel.actualizarProgreso(9, 1);
      navigate('/fase/9/intro');
    } catch (err) {
      console.error(err);
      navigate('/fase/9/intro');
    }
  };
`;

// Inject finishPhase before handleSiguienteClick
c = c.replace('const handleSiguienteClick = async () => {', finishLogic + '\n  const handleSiguienteClick = async () => {');

// Replace irAPaso(6) with finishPhase()
c = c.replace(/irAPaso\(6\);/g, 'finishPhase();');

// Also update the step < 5 logic:
/*
    if (step < 7) {
      siguientePaso();
    } else {
      setIsFinishing(true);
      ...
    }
*/
// to:
/*
    if (step < 5) {
      siguientePaso();
    } else {
      finishPhase();
    }
*/
c = c.replace(/if \(step < 5\) \{\s*siguientePaso\(\);\s*\} else \{\s*setIsFinishing\(true\);[\s\S]*?\}\s*\}/, 'if (step < 5) {\n      siguientePaso();\n    } else {\n      finishPhase();\n    }');

// Finally, remove `case 6:` and `case 7:` completely from `getPasoContent`
// We'll just replace `case 6: return renderVideoStep("6. Layout del Negocio", "layout", "Crear Layout");`
// And `case 7: { ... }` up to the end of `getPasoContent` with just the `default` if needed, or simply delete them.
// We can use a regex that matches `case 6:` up to the end of `case 7:` block.
c = c.replace(/case 6: return renderVideoStep\("6\. Layout del Negocio", "layout", "Crear Layout"\);[\s\S]*?default: return null;\s*\}/, 'default: return null;\n    }');

fs.writeFileSync('src/pages/Fase8_Operacion.jsx', c);
console.log("Screens 6 and 7 removed and finish logic updated");
