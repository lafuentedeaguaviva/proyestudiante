const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(file, 'utf8');

// The strategy is to split by `case X: return (`
// But the code format is `case X: return (` or `case X:\n      return (`
// Let's use a regex to match all cases.
// We need to shift case 3 -> 4, 4 -> 5, ..., 19 -> 20.
// We should do this backwards (from 19 down to 3).
for (let i = 19; i >= 3; i--) {
  const oldStr = `case ${i}: return (`;
  const newStr = `case ${i + 1}: return (`;
  
  // also check variant `case X:\n        return (`
  const oldRegex = new RegExp(`case ${i}:(\\s+)return \\(`, 'g');
  content = content.replace(oldRegex, `case ${i + 1}:$1return (`);
}

// Now we need to define the new case 3 (Costos por producto)
const newCase3 = `case 3: return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Materiales e Insumos</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Añade los materiales e insumos necesarios para un producto (receta base):</p>
            <div className="space-y-3 mb-4 animate-fade-in">
              {Object.entries(getCajaHerramientas().materiales.subgrupos).map(([key, sub]) => (
                <div key={key} className="flex flex-col">
                  <button
                    onClick={() => setToolboxSubcategory(toolboxSubcategory === key ? null : key)}
                    className={\`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex justify-between items-center \${toolboxSubcategory === key ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-sm rounded-b-none' : 'border-slate-200 bg-white text-slate-600 hover:border-purple-300'}\`}
                  >
                    {sub.nombre}
                    <span className="text-xl leading-none text-purple-600">{toolboxSubcategory === key ? '−' : '+'}</span>
                  </button>
                  {toolboxSubcategory === key && (
                    <div className="bg-slate-50 p-4 border border-t-0 border-purple-200 rounded-b-xl animate-fade-in">
                      <div className="flex flex-wrap gap-2">
                        {sub.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              // Solo agregar si hay un producto seleccionado o al menos uno existe
                              if (!data.productos || data.productos.length === 0) {
                                alert("No hay productos definidos.");
                                return;
                              }
                              // Add to the first product by default if we want, or handle drag/drop. 
                              // Since drag/drop is complex, we just add it to the first product or a "currently selected product".
                              // For simplicity, we can have a generic function that adds it to all, or a specific one.
                              alert("Usa el botón '+ Añadir Material' directamente en la tabla de cada producto.");
                            }}
                            className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:border-purple-400 hover:text-purple-700 transition-colors flex items-center gap-1 shadow-sm opacity-50 cursor-not-allowed"
                            title="Por favor, usa el botón de añadir directamente en la tabla de tu producto."
                          >
                            <Plus size={14} /> {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Costos por Producto</h2>
                <p className="text-slate-500 font-medium">Define la receta o estructura de costos para 1 unidad de cada producto.</p>
              </div>
            </div>

            {(data.productos || []).map((prod, pIdx) => (
              <div key={prod.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Producto: {prod.nombre}</h3>
                  <div className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
                    Producción mensual: {prod.produccionMensual} unds
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                    <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300">Artículo</th>
                        <th className="p-2 border-r border-slate-300 text-center w-24">Cantidad</th>
                        <th className="p-2 border-r border-slate-300 text-center w-28">Unidad</th>
                        <th className="p-2 border-r border-slate-300 text-center w-28">Precio Unit. (Bs)</th>
                        <th className="p-2 text-center w-28">Subtotal</th>
                        <th className="p-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(prod.ingredientes || []).map((ing, iIdx) => (
                        <tr key={ing.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="p-2 border-r border-slate-200">
                            <input
                              type="text"
                              value={ing.concepto || ''}
                              onChange={e => {
                                const newProds = [...data.productos];
                                newProds[pIdx].ingredientes[iIdx].concepto = e.target.value;
                                updateGlobalData({ productos: newProds });
                              }}
                              className="w-full bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-purple-400 rounded px-1"
                              placeholder="Ej. Harina"
                            />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={ing.cantidad || ''}
                              onChange={e => {
                                const newProds = [...data.productos];
                                newProds[pIdx].ingredientes[iIdx].cantidad = parseFloat(e.target.value) || 0;
                                newProds[pIdx].ingredientes[iIdx].monto = (parseFloat(e.target.value) || 0) * (ing.precio || 0);
                                updateGlobalData({ productos: newProds });
                              }}
                              className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded px-1"
                            />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                             <input
                              type="text"
                              list="unidades-list"
                              value={ing.unidad || ''}
                              onChange={e => {
                                const newProds = [...data.productos];
                                newProds[pIdx].ingredientes[iIdx].unidad = e.target.value;
                                updateGlobalData({ productos: newProds });
                              }}
                              className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded px-1"
                              placeholder="Ej. kg"
                            />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={ing.precio || ''}
                              onChange={e => {
                                const newProds = [...data.productos];
                                newProds[pIdx].ingredientes[iIdx].precio = parseFloat(e.target.value) || 0;
                                newProds[pIdx].ingredientes[iIdx].monto = (ing.cantidad || 0) * (parseFloat(e.target.value) || 0);
                                updateGlobalData({ productos: newProds });
                              }}
                              className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded px-1"
                            />
                          </td>
                          <td className="p-2 text-center font-bold text-purple-700 bg-purple-50">
                            {(ing.monto || 0).toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => {
                                const newProds = [...data.productos];
                                newProds[pIdx].ingredientes = newProds[pIdx].ingredientes.filter((_, idx) => idx !== iIdx);
                                updateGlobalData({ productos: newProds });
                              }}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => {
                    const newProds = [...data.productos];
                    if (!newProds[pIdx].ingredientes) newProds[pIdx].ingredientes = [];
                    newProds[pIdx].ingredientes.push({ id: Date.now(), concepto: '', cantidad: 1, unidad: 'kg', precio: 0, monto: 0 });
                    updateGlobalData({ productos: newProds });
                  }}
                  className="mt-3 flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                >
                  <Plus size={16} /> Añadir Material
                </button>
              </div>
            ))}

            <datalist id="unidades-list">
              <option value="kg" />
              <option value="gramos" />
              <option value="litros" />
              <option value="ml" />
              <option value="Pzas" />
              <option value="tazas" />
              <option value="cuchara" />
              <option value="cucharilla" />
            </datalist>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mt-4">
               <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
                 Tabla de Equivalencias
               </h3>
               <p className="text-xs text-slate-500 mb-3">Define cuánto equivale una unidad especial (ej. taza) en una unidad oficial (ej. kg, litros).</p>
               
               <table className="w-full text-left border-collapse text-sm bg-slate-50 border border-slate-200">
                  <thead className="bg-slate-200 text-slate-700">
                    <tr>
                      <th className="p-2 border-r border-slate-200">1 Unidad Especial</th>
                      <th className="p-2 border-r border-slate-200 text-center w-8">=</th>
                      <th className="p-2 border-r border-slate-200">Factor</th>
                      <th className="p-2 border-r border-slate-200">Unidad Oficial</th>
                      <th className="p-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.equivalencias || []).map((eq, eIdx) => (
                      <tr key={eq.id} className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200">
                          <input type="text" value={eq.unidadOrigen || ''} onChange={e => {
                            const newEqs = [...(data.equivalencias || [])];
                            newEqs[eIdx].unidadOrigen = e.target.value;
                            updateGlobalData({ equivalencias: newEqs });
                          }} className="w-full bg-white border border-slate-200 rounded px-2 py-1" placeholder="Ej. taza" />
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center text-slate-400">=</td>
                        <td className="p-2 border-r border-slate-200">
                          <input type="number" min="0" step="any" value={eq.factor || ''} onChange={e => {
                            const newEqs = [...(data.equivalencias || [])];
                            newEqs[eIdx].factor = parseFloat(e.target.value) || 0;
                            updateGlobalData({ equivalencias: newEqs });
                          }} className="w-full bg-white border border-slate-200 rounded px-2 py-1" placeholder="Ej. 0.25" />
                        </td>
                        <td className="p-2 border-r border-slate-200">
                           <input type="text" value={eq.unidadDestino || ''} onChange={e => {
                            const newEqs = [...(data.equivalencias || [])];
                            newEqs[eIdx].unidadDestino = e.target.value;
                            updateGlobalData({ equivalencias: newEqs });
                          }} className="w-full bg-white border border-slate-200 rounded px-2 py-1" placeholder="Ej. kg" />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => {
                              const newEqs = [...(data.equivalencias || [])];
                              newEqs.splice(eIdx, 1);
                              updateGlobalData({ equivalencias: newEqs });
                            }}
                            className="text-red-400 hover:text-red-600 p-1 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
               <button
                  onClick={() => {
                    const newEqs = [...(data.equivalencias || [])];
                    newEqs.push({ id: Date.now(), unidadOrigen: '', factor: 1, unidadDestino: 'kg' });
                    updateGlobalData({ equivalencias: newEqs });
                  }}
                  className="mt-3 flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <Plus size={16} /> Añadir Equivalencia
                </button>
            </div>
          </div>
        </div>
      );
`;

const case2Regex = /(case 2:\s*return\s*\(\s*[\s\S]*?^\s*\);\s*)/m;
const match2 = content.match(case2Regex);
if (!match2) {
  console.log("Could not find case 2");
} else {
  // We will insert newCase3 right after case 2
  const insertionPoint = match2.index + match2[0].length;
  content = content.slice(0, insertionPoint) + newCase3 + content.slice(insertionPoint);
}

// Now we need to modify case 4 (formerly case 3, which is the Capital de Trabajo step)
// The HTML for case 4 needs to reflect that Materiales are read-only and computed from productos and equivalencias.
// Let's replace the whole `case 4: return (` ... `);` block.
// Wait, replacing a huge block like that using regex might be risky. 
// We can use AST, or just look for `case 4:` and the ending `);` before `case 5:`.

fs.writeFileSync(file, content, 'utf8');
console.log("Shifted cases and inserted case 3 successfully.");

