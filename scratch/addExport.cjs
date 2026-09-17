const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase9_Estructura.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import if it doesn't exist
if (!content.includes('htmlToImage')) {
  content = content.replace(
    "import { Plus, Trash2, Users, FileText, ChevronRight, TrendingUp, Settings, Megaphone, Monitor, X, Network, Briefcase } from 'lucide-react';",
    "import { Plus, Trash2, Users, FileText, ChevronRight, TrendingUp, Settings, Megaphone, Monitor, X, Network, Briefcase, Download } from 'lucide-react';\nimport * as htmlToImage from 'html-to-image';"
  );
}

// 2. Add the exportarImagen function
if (!content.includes('const exportarImagen = async () => {')) {
  content = content.replace(
    'const deleteNode = (id) => {',
    `const exportarImagen = async () => {
    const node = document.getElementById('organigrama-export');
    if (!node) return;
    try {
      const dataUrl = await htmlToImage.toPng(node, { 
        backgroundColor: '#f8fafc',
        pixelRatio: 2
      });
      const link = document.createElement('a');
      link.download = 'organigrama.png';
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert('Error al exportar la imagen');
    }
  };

  const deleteNode = (id) => {`
  );
}

// 3. Add id="organigrama-export" to the arbol div
content = content.replace(
  '<div className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-10 flex flex-col items-center min-h-[750px] relative overflow-x-auto overflow-y-hidden gap-12 w-full">',
  '<div id="organigrama-export" className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-10 flex flex-col items-center min-h-[750px] relative overflow-x-auto overflow-y-hidden gap-12 w-full">'
);

// 4. Add the download button inside the arbol view.
// Let's add it right after the ) : (
content = content.replace(
  ') : (',
  `) : (
              <div className="relative w-full">
                <button onClick={exportarImagen} className="absolute right-4 top-4 z-50 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all">
                  <Download size={16} /> Descargar Imagen
                </button>`
);

// And we need to close that new <div className="relative w-full"> at the very end of the arbol view
// Let's find where the arbol view ends. It ends with:
//               {funcionarios.length === 0 && areas.length === 0 && !lider && (
//                 ...
//               )}
//             </div>
//           )}
// I'll just replace `            </div>\n          )}` with `            </div>\n            </div>\n          )}`
content = content.replace(
  '            </div>\n          )}',
  '            </div>\n            </div>\n          )}'
);

fs.writeFileSync(filePath, content);
console.log('Added exportarImagen feature');
