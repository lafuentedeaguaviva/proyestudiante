const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(targetPath, 'utf-8');

// Agregar LoadingSpinner y StepNavigation si no están
if (!content.includes("LoadingSpinner")) {
  content = content.replace(
    "import React",
    "import React"
  );
  content = content.replace(
    "import { useFase10Controller }",
    "import LoadingSpinner from '../components/ui/LoadingSpinner';\nimport StepNavigation from '../components/ui/StepNavigation';\nimport { useFase10Controller }"
  );
}

// Reemplazar Loading
content = content.replace(
  /if \(cargando\) return \(\s*<div className="flex items-center justify-center min-h-screen">\s*<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"><\/div>\s*<\/div>\s*\);/g,
  `if (cargando) return <LoadingSpinner text="Cargando Plan Financiero..." className="min-h-screen" />;`
);

// Reemplazar botones de navegación finales
content = content.replace(
  /<div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">\s*<button\s*onClick=\{pasoAnterior\}\s*className="px-6 py-3 rounded-xl font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"\s*>\s*Atrás\s*<\/button>\s*<button\s*onClick=\{siguientePaso\}\s*className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500\/30 hover:shadow-blue-500\/50 hover:-translate-y-0\.5 transition-all"\s*>\s*\{step < 12 \? 'Siguiente' : 'Finalizar Plan Financiero'\}\s*<\/button>\s*<\/div>/g,
  `<StepNavigation 
      onAnterior={pasoAnterior} 
      onSiguiente={step < 12 ? siguientePaso : undefined} 
      onFinalizar={step === 12 ? siguientePaso : undefined} 
      step={step} 
      totalSteps={12} 
    />`
);

// Reemplazar la barra de navegacion paso a paso que no tiene el boton de Atras y usa if/else
content = content.replace(
  /<div className="flex justify-end mt-12 pt-8 border-t border-slate-200">\s*<button\s*onClick=\{siguientePaso\}\s*className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500\/30 hover:shadow-blue-500\/50 hover:-translate-y-0\.5 transition-all"\s*>\s*Continuar al Paso \{step \+ 1\}\s*<\/button>\s*<\/div>/g,
  `<StepNavigation 
      onSiguiente={siguientePaso} 
      step={step} 
      totalSteps={12} 
    />`
);

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Fase 10 refactored to use common UI components.");
