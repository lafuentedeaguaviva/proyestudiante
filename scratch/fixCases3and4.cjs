const fs = require('fs');
const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

// The file currently has `case 3:` which contains toolbox, materiales. Then ends with 2 missing divs, swallowing `case 4:`.
// Let's completely replace the entire section from `case 3: return (` to `case 5: {`.

const c3Start = content.indexOf('case 3: return (');
const c5Start = content.indexOf('case 5: {');

if (c3Start !== -1 && c5Start !== -1) {
    const fullBlock = content.substring(c3Start, c5Start);

    // Extract the pieces safely:
    // 1. Toolbox:
    const tbStart = fullBlock.indexOf('<div className="lg:w-1/3');
    const tbEndStr = '</div>\n          <div className="lg:w-2/3';
    const tbEnd = fullBlock.indexOf(tbEndStr);
    const toolboxHTML = fullBlock.substring(tbStart, tbEnd + 6); // include the </div>

    // 2. Produccion / mes (Input):
    const prodStart = fullBlock.indexOf('<div className="flex justify-end mb-6">');
    const prodEndStr = '</div>\n              </div>\n\n              <div className="flex flex-col gap-6">';
    const prodEnd = fullBlock.indexOf(prodEndStr);
    const prodHTML = fullBlock.substring(prodStart, prodEnd + 6);

    // 3. Tabla 1: Materiales
    const t1Start = fullBlock.indexOf('{/* TABLA 1: MATERIALES E INSUMOS (RECETARIO POR PRODUCTO) */}');
    const t1EndStr = 'Total Global: Costo Mensual de Materiales e Insumos</span>';
    const t1End = fullBlock.indexOf(t1EndStr);
    // Find the end of this div block. It ends with a span, then </div>, </div>, </div>
    // Let's just find the exact text we know is there from lines 718-727.
    const t1EndFullStr = '</span>\n                    </div>\n                  </div>';
    const t1EndFull = fullBlock.indexOf(t1EndFullStr, t1End);
    const tabla1HTML = fullBlock.substring(t1Start, t1EndFull + t1EndFullStr.length);

    // 4. Tabla 2 & 3 (Infraestructura y Personal)
    const gridStart = fullBlock.indexOf('<div className="grid grid-cols-1 gap-6">');
    // find the end of grid, which is before `);\n      case 5: {`
    // Wait, the block was swallowed, so `case 5:` is the next valid case.
    const gridEndStr = '</div>\n        </div>\n      );\n      case ';
    const gridEnd = fullBlock.indexOf(gridEndStr, gridStart);
    let gridHTML = '';
    if (gridEnd !== -1) {
        gridHTML = fullBlock.substring(gridStart, gridEnd);
    } else {
        // Fallback: search for last </div></div>);
        const fbEnd = fullBlock.lastIndexOf(');\n');
        const fbStart = fullBlock.lastIndexOf('</div>', fbEnd);
        gridHTML = fullBlock.substring(gridStart, fbStart);
    }
    // ensure gridHTML has the right closing divs
    // Let's just find t2 and t3 directly!
    const t2Start = fullBlock.indexOf('{/* TABLA 2: INFRAESTRUCTURA Y SERVICIOS */}');
    const t3Start = fullBlock.indexOf('{/* TABLA 3: PERSONAL */}');
    
    // We know t3 ends with `</div>\n                  </div>\n                </div>`
    const t3EndStr = '</span>\n                    </div>\n                  </div>\n                </div>';
    const t3EndIdx = fullBlock.indexOf(t3EndStr, t3Start);
    
    const t2HTML = fullBlock.substring(t2Start, t3Start);
    const t3HTML = fullBlock.substring(t3Start, t3EndIdx + t3EndStr.length);

    const safeGridHTML = `<div className="grid grid-cols-1 gap-6">\n${t2HTML}\n${t3HTML}\n</div>`;


    // NOW REBUILD NEW CASE 3:
    const newCase3 = `case 3: return (
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

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6">
            ${prodHTML}
            <div className="flex flex-col gap-6">
              ${tabla1HTML}
            </div>
          </div>
        </div>
      );`;

    // NOW REBUILD NEW CASE 4:
    const newCase4 = `
      case 4: return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          ${toolboxHTML}
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

            ${safeGridHTML}
          </div>
        </div>
      );\n      `;

    content = content.substring(0, c3Start) + newCase3 + newCase4 + content.substring(c5Start);

    fs.writeFileSync(file, content);
    console.log('Successfully rebuilt case 3 and 4 with balanced divs!');
} else {
    console.log('Failed to find case 3 or case 5 boundaries.');
}
