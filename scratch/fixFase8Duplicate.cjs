const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/Fase8_Operacion.jsx');
let content = fs.readFileSync(targetPath, 'utf-8');

// The block to remove is:
const blockToRemove = `  const handleSiguienteClick = () => {
    if (step === 5) {
      if (!mostrarDiagrama) {
        const pasosClasificados = data.pasosProduccion.filter(p => p.categoria);
        if (pasosClasificados.length < data.pasosProduccion.length) {
          alert("Debes clasificar todos los pasos antes de continuar.");
          return;
        }

        const resultado = evaluarClasificacionProcesosLocal(pasosClasificados);
        setResultadoVerificacion(resultado);
        
        const todosCorrectos = data.pasosProduccion.every(p => resultado[p.id]?.correcto);
        if (todosCorrectos) {
          setMostrarDiagrama(true);
        } else {
          if (window.confirm("Se han detectado sugerencias en tu clasificación. ¿Deseas revisarlas o continuar al diagrama de todas formas?")) {
            setMostrarDiagrama(true);
          }
        }
        return;
      } else {
        irAPaso(6);
        return;
      }
    }
    
    irAPaso(step + 1);
  };`;

if (content.indexOf(blockToRemove) !== content.lastIndexOf(blockToRemove) || content.includes(blockToRemove)) {
   // Wait, we just want to remove the exact match string, but maybe it has different whitespaces.
   // Let's split by line and remove from the second handleSiguienteClick to its closing brace.
}

const lines = content.split('\n');
let newLines = [];
let count = 0;
let removing = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const handleSiguienteClick = () => {')) {
    count++;
    if (count === 2) {
      removing = true;
    }
  }

  if (removing) {
    if (lines[i] === '  };') {
      removing = false; // We just skipped the end of the second function
    }
  } else {
    newLines.push(lines[i]);
  }
}

fs.writeFileSync(targetPath, newLines.join('\n'), 'utf-8');
console.log("Fase 8 duplicate function permanently removed.");
