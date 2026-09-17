const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase9_Estructura.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The broken code:
const brokenPart = `(areas[0]?.id || lider?.id || 'ceo') : (
              <div className="relative w-full">
                <button onClick={exportarImagen} className="absolute right-4 top-4 z-50 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all">
                  <Download size={16} /> Descargar Imagen
                </button>nuevoTipo === 'lider' ? null : (lider?.id || 'ceo'));`;

// Revert it
content = content.replace(brokenPart, `(areas[0]?.id || lider?.id || 'ceo') : (nuevoTipo === 'lider' ? null : (lider?.id || 'ceo'));`);

// Now let's carefully place the export button where it REALLY belongs:
// Right after:
//           ) : (
//             <div id="organigrama-export" className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-10 flex flex-col items-center min-h-[750px] relative overflow-x-auto overflow-y-hidden gap-12 w-full">
// Wait, my previous script DID replace the id correctly for organigrama-export, I can use that as an anchor!
const anchor = `<div id="organigrama-export" className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-10 flex flex-col items-center min-h-[750px] relative overflow-x-auto overflow-y-hidden gap-12 w-full">`;

if (content.includes(anchor)) {
  content = content.replace(anchor, anchor + `
                <button onClick={exportarImagen} className="absolute right-8 top-8 z-50 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all border-2 border-indigo-400/50">
                  <Download size={18} /> Descargar Imagen
                </button>`);
}

// But wait, my script also did:
// content.replace('            </div>\\n          )}', '            </div>\\n            </div>\\n          )}');
// This was to close the <div className="relative w-full"> that I mistakenly injected. I should remove that extra closing tag.
// It's probably easier to just replace `</div>\n            </div>\n          )}` with `</div>\n          )}`
content = content.replace('            </div>\n            </div>\n          )}', '            </div>\n          )}');

fs.writeFileSync(filePath, content);
console.log('Fixed ternary injection error');
