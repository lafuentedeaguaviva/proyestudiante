const fs = require('fs');
let c = fs.readFileSync('src/pages/Fase8_Operacion.jsx', 'utf8');

const target = '<div className="space-y-3 mb-4">';
const replacement = `{data.pasosProduccion && data.pasosProduccion.length > 0 && (
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => updateGlobalData({ pasosProduccion: [] })}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors font-medium text-sm"
              >
                <Eraser size={16} /> Borrar Todos
              </button>
            </div>
          )}

          <div className="space-y-3 mb-4">`;

c = c.replace(target, replacement);
fs.writeFileSync('src/pages/Fase8_Operacion.jsx', c);
console.log("Updated Fase8");
