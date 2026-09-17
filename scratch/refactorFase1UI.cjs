const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/Fase1_EmprendimientoMentor.jsx');
let content = fs.readFileSync(targetPath, 'utf-8');

// 1. Agregar imports
if (!content.includes("LoadingSpinner")) {
  content = content.replace(
    "import SubMenuFases from '../components/ui/SubMenuFases';",
    "import SubMenuFases from '../components/ui/SubMenuFases';\nimport LoadingSpinner from '../components/ui/LoadingSpinner';\nimport StepNavigation from '../components/ui/StepNavigation';"
  );
}

// 2. Reemplazar Loading
content = content.replace(
  /if \(logic\.loading\) \{\s*return <div style=\{\{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' \}\}>Cargando a tu Mentor\.\.\.<\/div>;\s*\}/g,
  `if (logic.loading) {
    return <LoadingSpinner text="Cargando a tu Mentor..." className="min-h-screen" />;
  }`
);

// 3. Estilos Base (Wrapper Principal)
content = content.replace(
  /style=\{\{ minHeight: '100vh', background: '#f8fafc', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' \}\}/g,
  `className="min-h-screen bg-slate-50 p-8 font-sans"`
);

// 4. Botones Continuar/Siguiente (Seccion 1 a 10)
// Esto requiere cuidado porque hay múltiples botones hardcodeados, vamos a intentar mapear algunos
content = content.replace(
  /<div style=\{\{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '2rem' \}\}>\s*<button\s*disabled=\{!area \|\| area === 'Otro'\}\s*onClick=\{handleSiguiente\}\s*style=\{[^}]+\}\s*>\s*Continuar\s*<\/button>\s*<\/div>/g,
  `<div className="mt-8 flex justify-end">
    <StepNavigation 
      onSiguiente={handleSiguiente} 
      step={step} 
      totalSteps={10} 
      nextText="Continuar" 
    />
  </div>`
);

content = content.replace(
  /<div style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' \}\}>\s*\{step > 1 && \(\s*<button\s*onClick=\{logic\.handleAnterior\}[^>]+>\s*← Volver\s*<\/button>\s*\)\}\s*<button\s*onClick=\{handleSiguiente\}[^>]+>\s*(Entendido, a la acción|Siguiente)\s*<\/button>\s*<\/div>/g,
  (match, p1) => {
    return `<StepNavigation 
      onAnterior={logic.handleAnterior}
      onSiguiente={handleSiguiente}
      step={step}
      totalSteps={10}
      nextText="${p1}"
    />`;
  }
);

// 5. Botones de Step 7, 9, 10
content = content.replace(
  /<button\s*disabled=\{ideasSeleccionadas\.length === 0\}\s*onClick=\{handleSiguiente\}\s*style=\{[^}]+\}\s*>\s*Llevar \{ideasSeleccionadas\.length\} idea\(s\) a la Batalla\s*<\/button>/g,
  `<button 
    disabled={ideasSeleccionadas.length === 0} 
    onClick={handleSiguiente} 
    className={\`px-8 py-3 rounded-xl font-bold transition-all \${ideasSeleccionadas.length > 0 ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}\`}
  >
    Llevar {ideasSeleccionadas.length} idea(s) a la Batalla
  </button>`
);

content = content.replace(
  /<button\s*onClick=\{\(\) => \{\s*handleSiguiente\(\);\s*solicitarIdeasIA\(\);\s*\}\}\s*style=\{[^}]+\}\s*>\s*<Bot size=\{24\} \/> Entendido, generar ideas con IA\s*<\/button>/g,
  `<button 
    onClick={() => { handleSiguiente(); solicitarIdeasIA(); }} 
    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-yellow-600 text-white hover:bg-yellow-700 transition-all"
  >
    <Bot size={24} /> Entendido, generar ideas con IA
  </button>`
);

// 6. Mentor Avatar Box
content = content.replace(
  /style=\{\{ flex: 1, background: 'white', padding: '1\.5rem', borderRadius: '1rem', borderTopLeftRadius: 0, boxShadow: '0 4px 6px -1px rgba\(0, 0, 0, 0\.1\)', border: '1px solid #e2e8f0' \}\}/g,
  `className="flex-1 bg-white p-6 rounded-2xl rounded-tl-none shadow-md border border-slate-200"`
);

content = content.replace(
  /style=\{\{ width: '80px', height: '80px', borderRadius: '50%', background: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba\(250, 204, 21, 0\.4\)' \}\}/g,
  `className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(250,204,21,0.4)] shrink-0"`
);

content = content.replace(
  /style=\{\{ display: 'flex', gap: '1\.5rem', alignItems: 'flex-start', marginBottom: '3rem' \}\}/g,
  `className="flex gap-6 items-start mb-12"`
);

// 7. Area Grid & Cards
content = content.replace(
  /style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(auto-fit, minmax\(140px, 1fr\)\)', gap: '1rem', marginBottom: '1\.5rem' \}\}/g,
  `className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 mb-6"`
);

// 8. Contenedor Principal (Flujo Principal)
content = content.replace(
  /style=\{\{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba\(0,0,0,0\.1\)' \}\}/g,
  `className="bg-white p-8 rounded-2xl shadow-xl"`
);

// 9. Formularios (Observaciones / Fricciones)
content = content.replace(
  /style=\{\{ background: '#f8fafc', padding: '1\.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '1\.5rem', position: 'relative' \}\}/g,
  `className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6 relative"`
);

content = content.replace(
  /style=\{\{ background: '#f8fafc', padding: '1\.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '1\.5rem' \}\}/g,
  `className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6"`
);

content = content.replace(
  /style=\{\{ width: '100%', padding: '0\.75rem', borderRadius: '0\.5rem', border: '1px solid #cbd5e1', marginTop: '0\.5rem' \}\}/g,
  `className="w-full p-3 rounded-lg border border-slate-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"`
);

fs.writeFileSync(targetPath, content, 'utf-8');
console.log("Fase 1 styles partially refactored to Tailwind.");
