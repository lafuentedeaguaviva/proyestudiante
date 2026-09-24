const fs = require('fs');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

// We need to find `case 3: return (` and `case 5: return (` to extract the entire block.
const c3Idx = content.indexOf('case 3: return (');
const c5Idx = content.indexOf('case 5: {'); // Actually, let's find the next case.
let nextCaseIdx = content.indexOf('case 5:', c3Idx);
if (nextCaseIdx === -1) nextCaseIdx = content.length; // fallback

const fullBlock = content.substring(c3Idx, nextCaseIdx);

// Extract the 3 main UI pieces from fullBlock
const toolboxMatch = fullBlock.match(/<div className="lg:w-1\/3 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">[\s\S]*?<\/div>\s*<\/div>\s*<div className="lg:w-2\/3 bg-white p-6 rounded-3xl shadow-xl">/);

const prodInputMatch = fullBlock.match(/<div className="flex justify-end mb-6">[\s\S]*?<\/div>\s*<\/div>\s*<div className="flex flex-col gap-6">/);

const tabla1Match = fullBlock.match(/<div>\s*<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-slate-200 pb-2 gap-4">[\s\S]*?Total Global: Costo Mensual de Materiales e Insumos[\s\S]*?<\/div>\s*<\/div>/);

// The grid is everything after <div className="grid grid-cols-1 gap-6"> until the end of the div
const gridStart = fullBlock.indexOf('<div className="grid grid-cols-1 gap-6">');
let gridMatch = '';
if (gridStart !== -1) {
    // Find the end of this grid by looking for the last </div> before case 4: or case 5:
    let gridEnd = fullBlock.indexOf(');\n      case 4:', gridStart);
    if (gridEnd === -1) gridEnd = fullBlock.indexOf(');\n      case 5:', gridStart);
    if (gridEnd !== -1) {
        gridMatch = fullBlock.substring(gridStart, gridEnd);
        // clean up extra closing tags if any
        gridMatch = gridMatch.trim();
        while (gridMatch.endsWith('</div>')) {
            gridMatch = gridMatch.substring(0, gridMatch.lastIndexOf('</div>')).trim();
        }
        // Restore the exact number of closing tags needed for the grid itself.
        // Actually, let's just let it be, the grid is simple:
        // <div className="grid grid-cols-1 gap-6">
        //   {/* TABLA 2 */} <div>...</div>
        //   {/* TABLA 3 */} <div>...</div>
        // </div>
        // Let's extract them directly:
        const t2Match = fullBlock.match(/\{\/\* TABLA 2: INFRAESTRUCTURA Y SERVICIOS \*\/\}[\s\S]*?<\/div>\s*<\/div>/);
        const t3Match = fullBlock.match(/\{\/\* TABLA 3: PERSONAL \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
        
        if (t2Match && t3Match) {
            gridMatch = `<div className="grid grid-cols-1 gap-6">\n${t2Match[0]}\n\n${t3Match[0]}\n</div>`;
        }
    }
}

if (prodInputMatch && tabla1Match && gridMatch && toolboxMatch) {
    let newCase3 = `case 3: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Costos de Materiales e Insumos</h2>
              <p className="text-slate-500 font-medium">Aclara qué es lo necesario por producto (determina el costo unitario por producto o servicio).</p>
            </div>
          </div>

          ${prodInputMatch[0]}
            ${tabla1Match[0]}
          </div>
        </div>
      );`;

    let newCase4 = `
      case 4: return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">
            ${toolboxMatch[0].substring(toolboxMatch[0].indexOf('<div className="flex items-center gap-2 mb-4">'), toolboxMatch[0].lastIndexOf('</div>\n          <div className="lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl">'))}
          </div>
          <div className="lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Capital de Trabajo</h2>
                <p className="text-slate-500 font-medium">Gastos operativos mensuales (Infraestructura y Personal).</p>
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-xl flex justify-between items-center border border-slate-200 mb-6">
              <span className="font-bold text-slate-700 block">Total Mensual de Materiales e Insumos (Calculado en el Paso anterior):</span>
              <span className="text-2xl font-black text-slate-800">
                Bs. {((data.productos || []).reduce((sum, p) => {
                  const unitCost = (p.ingredientes || []).reduce((acc, ing) => acc + ((parseFloat(ing.cantidad) || 0) * (parseFloat(ing.precio) || 0)), 0);
                  return sum + (unitCost * (parseInt(p.demanda) || 1));
                }, 0)).toFixed(2)}
              </span>
            </div>

            ${gridMatch}
          </div>
        </div>
      );\n`;

    content = content.substring(0, c3Idx) + newCase3 + newCase4 + content.substring(nextCaseIdx);
    fs.writeFileSync(file, content);
    console.log('Successfully rebuilt case 3 and 4');
} else {
    console.log('Failed to match one of the blocks');
}
