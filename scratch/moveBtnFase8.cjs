const fs = require('fs');
let c = fs.readFileSync('src/pages/Fase8_Operacion.jsx', 'utf8');

// Remove the top button block first (if not already removed by previous command)
c = c.replace(/\{data\.pasosProduccion && data\.pasosProduccion\.length > 0 && \(\s*<div className="flex justify-end mb-4">\s*<button[\s\S]*?<Eraser size=\{16\} \/> Borrar Todos\s*<\/button>\s*<\/div>\s*\)\}/, '');

const target = `<div className="flex flex-col sm:flex-row gap-4 mt-6">`;
const replacement = `<div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button 
              onClick={() => updateGlobalData({ pasosProduccion: [] })}
              className="py-3 px-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              title="Borrar Todos los Pasos"
            >
              <Eraser size={20} />
            </button>`;

c = c.replace(target, replacement);
fs.writeFileSync('src/pages/Fase8_Operacion.jsx', c);
console.log("Updated Fase8 button location");
