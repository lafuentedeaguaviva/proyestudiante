const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(file, 'utf8');

// Locate case 4
const case4StartRegex = /case 4:\s*return\s*\(/;
const match4Start = content.match(case4StartRegex);
if (!match4Start) {
  console.log("Could not find case 4");
  process.exit(1);
}

const case5StartRegex = /case 5:\s*return\s*\(/;
const match5Start = content.match(case5StartRegex);
if (!match5Start) {
  console.log("Could not find case 5");
  process.exit(1);
}

// Extract the exact portion of case 4
const case4End = match5Start.index;
const case4OldContent = content.slice(match4Start.index, case4End);

// What do we replace case 4 with?
const newCase4 = `case 4: {
        // Calculate consolidated materials based on products
        const consolidados = [];
        let totalMaterialesMensual = 0;
        
        (data.productos || []).forEach(prod => {
          const prodMensual = prod.produccionMensual || 0;
          (prod.ingredientes || []).forEach(ing => {
            const reqTotal = (ing.cantidad || 0) * prodMensual;
            let unidadFinal = ing.unidad || 'unds';
            let reqConvertido = reqTotal;
            
            // Apply equivalences
            if (data.equivalencias && data.equivalencias.length > 0) {
              const eq = data.equivalencias.find(e => e.unidadOrigen?.toLowerCase() === ing.unidad?.toLowerCase());
              if (eq) {
                reqConvertido = reqTotal * (eq.factor || 1);
                unidadFinal = eq.unidadDestino || unidadFinal;
              }
            }
            
            // For price, since we converted the quantity, we need to adapt the price if it was per unitOrigen
            // Or easier: subtotal is just subtotal per unit * production
            const costoTotal = (ing.monto || 0) * prodMensual;
            
            consolidados.push({
              id: ing.id + '-' + prod.id,
              producto: prod.nombre,
              articulo: ing.concepto,
              cantidad: reqConvertido,
              unidad: unidadFinal,
              costoTotal
            });
            totalMaterialesMensual += costoTotal;
          });
        });

        return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Caja de Herramientas</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Añade los elementos de tu capital de operación (Infraestructura y Personal):</p>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-medium">
              <button onClick={() => { setToolboxCategory('infraestructura'); setToolboxSubcategory(Object.keys(cajaHerramientas.infraestructura.subgrupos)[0]); }} className={\`flex-1 p-2 rounded-lg \${toolboxCategory === 'infraestructura' ? 'bg-white shadow-sm text-amber-700' : 'text-slate-500'}\`}>Infraestructura</button>
              <button onClick={() => { setToolboxCategory('personal'); setToolboxSubcategory(Object.keys(cajaHerramientas.personal.subgrupos)[0]); }} className={\`flex-1 p-2 rounded-lg \${toolboxCategory === 'personal' ? 'bg-white shadow-sm text-amber-700' : 'text-slate-500'}\`}>Personal</button>
            </div>

            <div className="space-y-3 mb-4 animate-fade-in">
              {toolboxCategory && cajaHerramientas[toolboxCategory] && Object.entries(getCajaHerramientas()[toolboxCategory].subgrupos).map(([key, sub]) => (
                <div key={key} className="flex flex-col">
                  <button
                    onClick={() => setToolboxSubcategory(toolboxSubcategory === key ? null : key)}
                    className={\`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex justify-between items-center \${toolboxSubcategory === key ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm rounded-b-none' : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300'}\`}
                  >
                    {sub.nombre}
                    <span className="text-xl leading-none text-amber-600">{toolboxSubcategory === key ? '−' : '+'}</span>
                  </button>
                  {toolboxSubcategory === key && (
                    <div className="bg-slate-50 p-4 border border-t-0 border-amber-200 rounded-b-xl animate-fade-in">
                      <div className="flex flex-wrap gap-2">
                        {sub.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              const tipo = toolboxCategory;
                              updateGlobalData({
                                inversiones: [...data.inversiones, { id: Date.now() + idx, concepto: item, cantidad: 1, precio: 0, monto: 0, tipo }]
                              });
                            }}
                            className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:border-amber-400 hover:text-amber-700 transition-colors flex items-center gap-1 shadow-sm"
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

          <div className="lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Capital de Trabajo</h2>
                <p className="text-slate-500 font-medium">Gastos operativos mensuales para producción y funcionamiento.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col gap-6">

                {/* TABLA 1: MATERIALES E INSUMOS (AUTOMATIZADO) */}
                <div>
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
                    a. Determinamos los costos de materiales e insumos mensuales.
                  </h3>
                  <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm mb-4 border border-amber-200">
                    <Info size={16} className="inline mr-2 -mt-0.5" />
                    Esta tabla se calcula automáticamente en base a las recetas por producto y sus demandas.
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                      <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">Producto Destino</th>
                          <th className="p-2 border-r border-slate-300">Artículos</th>
                          <th className="p-2 border-r border-slate-300 text-center w-24">Cant. Mensual</th>
                          <th className="p-2 border-r border-slate-300 text-center w-24">Unidad</th>
                          <th className="p-2 text-center w-32">Costo total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consolidados.length > 0 ? consolidados.map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-200">
                            <td className="p-2 border-r border-slate-200 font-medium text-slate-600">{inv.producto}</td>
                            <td className="p-2 border-r border-slate-200 font-medium">{inv.articulo}</td>
                            <td className="p-2 border-r border-slate-200 text-center">{inv.cantidad.toFixed(2)}</td>
                            <td className="p-2 border-r border-slate-200 text-center text-slate-500">{inv.unidad}</td>
                            <td className="p-2 text-center text-amber-700 font-bold bg-amber-50">
                              {(inv.costoTotal || 0).toFixed(2)}
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="5" className="p-4 text-center text-slate-400">
                              No hay materiales definidos. Regresa a la pestaña anterior para añadir recetas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-amber-100">
                        <tr>
                          <td colSpan="4" className="p-2 text-right font-bold text-slate-800">TOTAL MATERIALES:</td>
                          <td className="p-2 text-center font-black text-amber-700 text-lg">{totalMaterialesMensual.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* TABLA 2: INFRAESTRUCTURA */}
                <div>
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
                    b. Detallemos los costos de infraestructura y servicios.
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                      <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">Concepto</th>
                          <th className="p-2 text-center w-32">Costo Mensual</th>
                          <th className="p-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.inversiones.filter(i => i.tipo === 'infraestructura').map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="p-2 border-r border-slate-200 font-medium">{inv.concepto}</td>
                            <td className="p-2 border-r border-slate-200">
                              <input
                                type="number" min="0" step="any"
                                value={inv.precio || ''}
                                onChange={e => {
                                  const v = parseFloat(e.target.value) || 0;
                                  updateGlobalData({
                                    inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, precio: v, monto: v } : item)
                                  });
                                }}
                                className="w-full bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1 text-center"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100">
                        <tr>
                          <td className="p-2 text-right font-bold text-slate-800 border-r border-slate-300">TOTAL INFRAESTRUCTURA:</td>
                          <td className="p-2 text-center font-bold text-slate-800" colSpan="2">
                            {data.inversiones.filter(i => i.tipo === 'infraestructura').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* TABLA 3: PERSONAL */}
                <div>
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span>c. ¿Cuánto nos cuesta el personal?</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                      <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">Cargo</th>
                          <th className="p-2 border-r border-slate-300 text-center w-24"># Personas</th>
                          <th className="p-2 border-r border-slate-300 text-center w-32">Sueldo / mes</th>
                          <th className="p-2 text-center w-32">Costo total</th>
                          <th className="p-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.inversiones.filter(i => i.tipo === 'personal').map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="p-2 border-r border-slate-200 font-medium">
                              <input
                                type="text" value={inv.concepto || ''}
                                onChange={e => updateGlobalData({ inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, concepto: e.target.value } : item) })}
                                className="w-full bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1"
                                placeholder="Ej. Vendedor"
                              />
                            </td>
                            <td className="p-2 border-r border-slate-200">
                              <input
                                type="number" min="1"
                                value={inv.cantidad || ''}
                                onChange={e => {
                                  const q = parseInt(e.target.value) || 0;
                                  updateGlobalData({
                                    inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, cantidad: q, monto: q * (item.precio || 0) } : item)
                                  });
                                }}
                                className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1"
                              />
                            </td>
                            <td className="p-2 border-r border-slate-200">
                              <input
                                type="number" min="0" step="any"
                                value={inv.precio || ''}
                                onChange={e => {
                                  const p = parseFloat(e.target.value) || 0;
                                  updateGlobalData({
                                    inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, precio: p, monto: (item.cantidad || 0) * p } : item)
                                  });
                                }}
                                className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1"
                              />
                            </td>
                            <td className="p-2 text-center font-bold text-slate-800 bg-slate-50 border-r border-slate-200">
                              {(inv.monto || 0).toFixed(2)}
                            </td>
                            <td className="p-2 text-center">
                              <button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100">
                        <tr>
                          <td colSpan="3" className="p-2 text-right font-bold text-slate-800 border-r border-slate-300">TOTAL PERSONAL:</td>
                          <td className="p-2 text-center font-bold text-slate-800" colSpan="2">
                            {data.inversiones.filter(i => i.tipo === 'personal').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      }
`;

content = content.slice(0, match4Start.index) + newCase4 + content.slice(case4End);
fs.writeFileSync(file, content, 'utf8');
console.log("Replaced case 4 successfully.");
