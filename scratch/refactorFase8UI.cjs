const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/Fase8_Operacion.jsx');
let content = fs.readFileSync(targetPath, 'utf-8');

// Agregar LoadingSpinner y StepNavigation si no están
if (!content.includes("LoadingSpinner")) {
  content = content.replace(
    "import React",
    "import React"
  );
  content = content.replace(
    "import { useFase8Controller }",
    "import LoadingSpinner from '../components/ui/LoadingSpinner';\nimport StepNavigation from '../components/ui/StepNavigation';\nimport { useFase8Controller }"
  );
}

// Reemplazar Loading
content = content.replace(
  /if \(cargando\) return <div style=\{\{ padding: '2rem', textAlign: 'center' \}\}>Cargando datos de la Fase 5\.\.\.<\/div>;/g,
  `if (cargando) return <LoadingSpinner text="Cargando datos..." className="min-h-screen" />;`
);

// Reemplazar estilo hardcodeado en la zona de drop
content = content.replace(
  /style=\{\{maxHeight: '500px'\}\}/g,
  `className="max-h-[500px]"`
);

// Reemplazar botones de navegación finales
content = content.replace(
  /<div className="mt-12 pt-8 border-t border-slate-200 flex justify-end">\s*<button\s*onClick=\{finalizar\}\s*disabled=\{guardando\}\s*className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"\s*>\s*\{guardando \? 'Guardando\.\.\.' : 'Guardar y Finalizar Fase 8'\}\s*<\/button>\s*<\/div>/g,
  `<StepNavigation 
      onFinalizar={finalizar} 
      step={step} 
      totalSteps={7} 
      nextText={guardando ? 'Guardando...' : 'Guardar y Finalizar Fase 8'} 
    />`
);

// Otros reemplazos comunes
content = content.replace(
  /style=\{\{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' \}\}/g,
  `className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center"`
);

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Fase 8 styles partially refactored to Tailwind.");
