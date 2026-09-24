const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Shift cases 3..19 to 4..20
for (let i = 19; i >= 3; i--) {
  const oldStr = `case ${i}:`;
  const newStr = `case ${i + 1}:`;
  const regex = new RegExp(`case\\s+${i}:`, 'g');
  content = content.replace(regex, newStr);
}

// 2. Insert new case 3 after case 2
const case2Regex = /(case 2:\s*return\s*\(\s*[\s\S]*?^\s*\);\s*)/m;
const match2 = content.match(case2Regex);
if (!match2) {
  console.log("Could not find case 2");
  process.exit(1);
}

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
                            onClick={() => alert("Usa el botón '+ Añadir Material' directamente en la tabla de cada producto.")}
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
                            <input type="text" value={ing.concepto || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].concepto = e.target.value; updateGlobalData({ productos: newProds }); }} className="w-full bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-purple-400 rounded px-1" placeholder="Ej. Harina" />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input type="number" min="0" step="any" value={ing.cantidad || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].cantidad = parseFloat(e.target.value) || 0; newProds[pIdx].ingredientes[iIdx].monto = (parseFloat(e.target.value) || 0) * (ing.precio || 0); updateGlobalData({ productos: newProds }); }} className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded px-1" />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                             <input type="text" list="unidades-list" value={ing.unidad || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].unidad = e.target.value; updateGlobalData({ productos: newProds }); }} className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded px-1" placeholder="Ej. kg" />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input type="number" min="0" step="any" value={ing.precio || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].precio = parseFloat(e.target.value) || 0; newProds[pIdx].ingredientes[iIdx].monto = (ing.cantidad || 0) * (parseFloat(e.target.value) || 0); updateGlobalData({ productos: newProds }); }} className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded px-1" />
                          </td>
                          <td className="p-2 text-center font-bold text-purple-700 bg-purple-50">{(ing.monto || 0).toFixed(2)}</td>
                          <td className="p-2 text-center"><button onClick={() => { const newProds = [...data.productos]; newProds[pIdx].ingredientes = newProds[pIdx].ingredientes.filter((_, idx) => idx !== iIdx); updateGlobalData({ productos: newProds }); }} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={16} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={() => { const newProds = [...data.productos]; if (!newProds[pIdx].ingredientes) newProds[pIdx].ingredientes = []; newProds[pIdx].ingredientes.push({ id: Date.now(), concepto: '', cantidad: 1, unidad: 'kg', precio: 0, monto: 0 }); updateGlobalData({ productos: newProds }); }} className="mt-3 flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors"><Plus size={16} /> Añadir Material</button>
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
               <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Tabla de Equivalencias</h3>
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
                        <td className="p-2 border-r border-slate-200"><input type="text" value={eq.unidadOrigen || ''} onChange={e => { const newEqs = [...(data.equivalencias || [])]; newEqs[eIdx].unidadOrigen = e.target.value; updateGlobalData({ equivalencias: newEqs }); }} className="w-full bg-white border border-slate-200 rounded px-2 py-1" placeholder="Ej. taza" /></td>
                        <td className="p-2 border-r border-slate-200 text-center text-slate-400">=</td>
                        <td className="p-2 border-r border-slate-200"><input type="number" min="0" step="any" value={eq.factor || ''} onChange={e => { const newEqs = [...(data.equivalencias || [])]; newEqs[eIdx].factor = parseFloat(e.target.value) || 0; updateGlobalData({ equivalencias: newEqs }); }} className="w-full bg-white border border-slate-200 rounded px-2 py-1" placeholder="Ej. 0.25" /></td>
                        <td className="p-2 border-r border-slate-200"><input type="text" value={eq.unidadDestino || ''} onChange={e => { const newEqs = [...(data.equivalencias || [])]; newEqs[eIdx].unidadDestino = e.target.value; updateGlobalData({ equivalencias: newEqs }); }} className="w-full bg-white border border-slate-200 rounded px-2 py-1" placeholder="Ej. kg" /></td>
                        <td className="p-2 text-center"><button onClick={() => { const newEqs = [...(data.equivalencias || [])]; newEqs.splice(eIdx, 1); updateGlobalData({ equivalencias: newEqs }); }} className="text-red-400 hover:text-red-600 p-1 rounded"><Trash2 size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
               <button onClick={() => { const newEqs = [...(data.equivalencias || [])]; newEqs.push({ id: Date.now(), unidadOrigen: '', factor: 1, unidadDestino: 'kg' }); updateGlobalData({ equivalencias: newEqs }); }} className="mt-3 flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"><Plus size={16} /> Añadir Equivalencia</button>
            </div>
          </div>
        </div>
      );
`;

const insertionPoint = match2.index + match2[0].length;
content = content.slice(0, insertionPoint) + newCase3 + content.slice(insertionPoint);

// 3. Now replace the contents of new case 4 (which is the old case 3).
const case4StartRegex = /case 4:\s*return\s*\(/;
const match4Start = content.match(case4StartRegex);
if (!match4Start) {
  console.log("Could not find case 4");
  process.exit(1);
}

// Find case 5 to know where case 4 ends
const case5StartRegex = /case 5:\s*(return\s*\(|{)/;
const match5Start = content.match(case5StartRegex);
if (!match5Start) {
  console.log("Could not find case 5");
  process.exit(1);
}

const case4End = match5Start.index;

const newCase4 = `case 4: {
        const consolidados = [];
        let totalMaterialesMensual = 0;
        
        (data.productos || []).forEach(prod => {
          const prodMensual = prod.produccionMensual || 0;
          (prod.ingredientes || []).forEach(ing => {
            const reqTotal = (ing.cantidad || 0) * prodMensual;
            let unidadFinal = ing.unidad || 'unds';
            let reqConvertido = reqTotal;
            
            if (data.equivalencias && data.equivalencias.length > 0) {
              const eq = data.equivalencias.find(e => e.unidadOrigen?.toLowerCase() === ing.unidad?.toLowerCase());
              if (eq) {
                reqConvertido = reqTotal * (eq.factor || 1);
                unidadFinal = eq.unidadDestino || unidadFinal;
              }
            }
            
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
                          <button key={idx} onClick={() => { const tipo = toolboxCategory; updateGlobalData({ inversiones: [...data.inversiones, { id: Date.now() + idx, concepto: item, cantidad: 1, precio: 0, monto: 0, tipo }] }); }} className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:border-amber-400 hover:text-amber-700 transition-colors flex items-center gap-1 shadow-sm"><Plus size={14} /> {item}</button>
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
              <div className="p-3 bg-amber-100 rounded-xl text-amber-600"><Wallet size={24} /></div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Capital de Trabajo</h2>
                <p className="text-slate-500 font-medium">Gastos operativos mensuales para producción y funcionamiento.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col gap-6">

                {/* TABLA 1: MATERIALES E INSUMOS */}
                <div>
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">a. Determinamos los costos de materiales e insumos mensuales.</h3>
                  <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm mb-4 border border-amber-200"><Info size={16} className="inline mr-2 -mt-0.5" />Esta tabla se calcula automáticamente en base a las recetas por producto y sus demandas.</div>
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
                            <td className="p-2 text-center text-amber-700 font-bold bg-amber-50">{(inv.costoTotal || 0).toFixed(2)}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan="5" className="p-4 text-center text-slate-400">No hay materiales definidos. Regresa a la pestaña anterior para añadir recetas.</td></tr>
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
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">b. Detallemos los costos de infraestructura y servicios.</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                      <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                        <tr><th className="p-2 border-r border-slate-300">Concepto</th><th className="p-2 text-center w-32">Costo Mensual</th><th className="p-2 w-10"></th></tr>
                      </thead>
                      <tbody>
                        {data.inversiones.filter(i => i.tipo === 'infraestructura').map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="p-2 border-r border-slate-200 font-medium">{inv.concepto}</td>
                            <td className="p-2 border-r border-slate-200"><input type="number" min="0" step="any" value={inv.precio || ''} onChange={e => { const v = parseFloat(e.target.value) || 0; updateGlobalData({ inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, precio: v, monto: v } : item) }); }} className="w-full bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1 text-center" /></td>
                            <td className="p-2 text-center"><button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={16} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100">
                        <tr>
                          <td className="p-2 text-right font-bold text-slate-800 border-r border-slate-300">TOTAL INFRAESTRUCTURA:</td>
                          <td className="p-2 text-center font-bold text-slate-800" colSpan="2">{data.inversiones.filter(i => i.tipo === 'infraestructura').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* TABLA 3: PERSONAL */}
                <div>
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2 flex items-center justify-between"><span>c. ¿Cuánto nos cuesta el personal?</span></h3>
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
                            <td className="p-2 border-r border-slate-200 font-medium"><input type="text" value={inv.concepto || ''} onChange={e => updateGlobalData({ inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, concepto: e.target.value } : item) })} className="w-full bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1" placeholder="Ej. Vendedor" /></td>
                            <td className="p-2 border-r border-slate-200"><input type="number" min="1" value={inv.cantidad || ''} onChange={e => { const q = parseInt(e.target.value) || 0; updateGlobalData({ inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, cantidad: q, monto: q * (item.precio || 0) } : item) }); }} className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1" /></td>
                            <td className="p-2 border-r border-slate-200"><input type="number" min="0" step="any" value={inv.precio || ''} onChange={e => { const p = parseFloat(e.target.value) || 0; updateGlobalData({ inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, precio: p, monto: (item.cantidad || 0) * p } : item) }); }} className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1" /></td>
                            <td className="p-2 text-center font-bold text-slate-800 bg-slate-50 border-r border-slate-200">{(inv.monto || 0).toFixed(2)}</td>
                            <td className="p-2 text-center"><button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={16} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100">
                        <tr>
                          <td colSpan="3" className="p-2 text-right font-bold text-slate-800 border-r border-slate-300">TOTAL PERSONAL:</td>
                          <td className="p-2 text-center font-bold text-slate-800" colSpan="2">{data.inversiones.filter(i => i.tipo === 'personal').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="mt-8 bg-slate-800 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg">
                  <div><span className="block text-slate-300 font-medium">Subtotal Capital de Trabajo</span><span className="text-sm text-slate-400">Materiales + Infraestructura + Personal (Mensualizado)</span></div>
                  <div className="text-3xl md:text-4xl font-black text-amber-400">
                    Bs. {(totalMaterialesMensual + data.inversiones.filter(i => i.tipo === 'infraestructura' || i.tipo === 'personal').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0)).toFixed(2)}
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
console.log("Replaced and shifted everything successfully.");
