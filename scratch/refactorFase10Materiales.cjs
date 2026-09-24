const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Update cajaHerramientas.materiales
const oldMateriales = `materiales: {
    nombre: 'Materiales e Insumos',
    subgrupos: {
      materiales: { nombre: 'Materiales', items: ['Materia prima principal', 'Componentes'] },
      insumos: { nombre: 'Insumos', items: ['Empaques y embalajes', 'Etiquetas', 'Pegamento', 'Insumos varios'] }
    }
  },`;
const newMateriales = `materiales: {
    nombre: 'Materiales e Insumos',
    subgrupos: {
      gastronomia: { nombre: 'Gastronomía', items: ['Harina', 'Azúcar', 'Aceite', 'Verduras', 'Carnes', 'Especias', 'Envases/Empaques'] },
      mecanica: { nombre: 'Mecánica / Manufactura', items: ['Acero/Metal', 'Pintura', 'Soldadura', 'Tornillos/Tuercas', 'Componentes eléctricos'] },
      tecnologia: { nombre: 'Tecnología / Software', items: ['Servidores (Hosting)', 'Dominio', 'Licencias', 'Placas/Microcontroladores'] },
      otros: { nombre: 'Otros Insumos Generales', items: ['Etiquetas', 'Cajas/Embalaje', 'Pegamento', 'Insumos varios'] }
    }
  },`;
content = content.replace(oldMateriales, newMateriales);

// 2. We need to insert a state for the selected product in the toolbox, but since we are inside a giant component, 
// we can just use a local variable or derive it from the DOM (not ideal in React).
// A better way is to add a useState at the top of the component: `const [toolboxTargetProd, setToolboxTargetProd] = useState('');`
if (!content.includes('const [toolboxTargetProd, setToolboxTargetProd] = useState')) {
  content = content.replace(
    /const \[toolboxSubcategory, setToolboxSubcategory\] = useState\(null\);/,
    "const [toolboxSubcategory, setToolboxSubcategory] = useState(null);\n  const [toolboxTargetProd, setToolboxTargetProd] = useState('');"
  );
}

// 3. Replace case 3 completely to implement the new UI.
const case3Regex = /case 3:\s*return\s*\(\s*<div[\s\S]*?(?=case 4:\s*\{)/m;
const match3 = content.match(case3Regex);
if (!match3) {
  console.log("Could not find case 3");
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
            
            {data.productos && data.productos.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1">Añadir a Producto:</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:border-purple-400 outline-none"
                  value={toolboxTargetProd || data.productos[0]?.id || ''}
                  onChange={(e) => setToolboxTargetProd(e.target.value)}
                >
                  {data.productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
            )}

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
                              if (!data.productos || data.productos.length === 0) return alert('Primero debes crear productos en la Fase 4');
                              const targetId = toolboxTargetProd || data.productos[0].id;
                              const pIdx = data.productos.findIndex(p => p.id === targetId || p.id === parseInt(targetId));
                              if (pIdx >= 0) {
                                const newProds = [...data.productos];
                                if (!newProds[pIdx].ingredientes) newProds[pIdx].ingredientes = [];
                                newProds[pIdx].ingredientes.push({ id: Date.now() + idx, concepto: item, cantidad: 1, unidad: 'kg', precio: 0, monto: 0 });
                                updateGlobalData({ productos: newProds });
                              }
                            }}
                            className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:border-purple-400 hover:text-purple-700 transition-colors flex items-center gap-1 shadow-sm"
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
                        <th className="p-3 border-r border-slate-300 min-w-[150px]">Artículo</th>
                        <th className="p-3 border-r border-slate-300 text-center min-w-[100px]">Cantidad</th>
                        <th className="p-3 border-r border-slate-300 text-center min-w-[140px]">Unidad</th>
                        <th className="p-3 border-r border-slate-300 text-center min-w-[120px]">Precio Unit. (Bs)</th>
                        <th className="p-3 text-center min-w-[100px]">Subtotal</th>
                        <th className="p-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(prod.ingredientes || []).map((ing, iIdx) => (
                        <tr key={ing.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="p-2 border-r border-slate-200">
                            <input type="text" value={ing.concepto || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].concepto = e.target.value; updateGlobalData({ productos: newProds }); }} className="w-full p-2 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-purple-400 rounded" placeholder="Ej. Harina" />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input type="number" min="0" step="any" value={ing.cantidad || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].cantidad = parseFloat(e.target.value) || 0; newProds[pIdx].ingredientes[iIdx].monto = (parseFloat(e.target.value) || 0) * (ing.precio || 0); updateGlobalData({ productos: newProds }); }} className="w-full p-2 bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded" />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                             <div className="flex flex-col gap-1">
                               <select 
                                 value={['kg','gramos','litros','ml','Pzas','tazas','cuchara','cucharilla'].includes(ing.unidad) ? ing.unidad : (ing.unidad ? 'Otro' : 'kg')} 
                                 onChange={e => { 
                                   const newProds = [...data.productos]; 
                                   newProds[pIdx].ingredientes[iIdx].unidad = e.target.value === 'Otro' ? '' : e.target.value; 
                                   updateGlobalData({ productos: newProds }); 
                                 }} 
                                 className="w-full p-2 bg-transparent outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-purple-400 rounded"
                               >
                                  <option value="kg">kg</option>
                                  <option value="gramos">gramos</option>
                                  <option value="litros">litros</option>
                                  <option value="ml">ml</option>
                                  <option value="Pzas">Pzas / Unidades</option>
                                  <option value="tazas">tazas</option>
                                  <option value="cuchara">cuchara</option>
                                  <option value="cucharilla">cucharilla</option>
                                  <option value="Otro">Otra (Escribir)...</option>
                               </select>
                               {!['kg','gramos','litros','ml','Pzas','tazas','cuchara','cucharilla'].includes(ing.unidad) && (
                                 <input type="text" value={ing.unidad || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].unidad = e.target.value; updateGlobalData({ productos: newProds }); }} className="w-full p-2 bg-purple-50 text-purple-900 outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded border border-purple-200" placeholder="Escribe la unidad" autoFocus />
                               )}
                             </div>
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input type="number" min="0" step="any" value={ing.precio || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].precio = parseFloat(e.target.value) || 0; newProds[pIdx].ingredientes[iIdx].monto = (ing.cantidad || 0) * (parseFloat(e.target.value) || 0); updateGlobalData({ productos: newProds }); }} className="w-full p-2 bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded" />
                          </td>
                          <td className="p-2 text-center font-bold text-purple-700 bg-purple-50">{(ing.monto || 0).toFixed(2)}</td>
                          <td className="p-2 text-center"><button onClick={() => { const newProds = [...data.productos]; newProds[pIdx].ingredientes = newProds[pIdx].ingredientes.filter((_, idx) => idx !== iIdx); updateGlobalData({ productos: newProds }); }} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={18} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={() => { const newProds = [...data.productos]; if (!newProds[pIdx].ingredientes) newProds[pIdx].ingredientes = []; newProds[pIdx].ingredientes.push({ id: Date.now(), concepto: '', cantidad: 1, unidad: 'kg', precio: 0, monto: 0 }); updateGlobalData({ productos: newProds }); }} className="mt-3 flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors"><Plus size={16} /> Añadir Artículo</button>
              </div>
            ))}

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mt-4">
               <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Tabla de Equivalencias</h3>
               <p className="text-xs text-slate-500 mb-3">Define cuánto equivale una unidad especial (ej. taza) en una unidad oficial (ej. kg, litros).</p>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse text-sm bg-slate-50 border border-slate-200">
                    <thead className="bg-slate-200 text-slate-700">
                      <tr>
                        <th className="p-3 border-r border-slate-200 min-w-[120px]">1 Unidad Especial</th>
                        <th className="p-3 border-r border-slate-200 text-center w-8">=</th>
                        <th className="p-3 border-r border-slate-200 min-w-[100px]">Factor</th>
                        <th className="p-3 border-r border-slate-200 min-w-[120px]">Unidad Oficial</th>
                        <th className="p-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.equivalencias || []).map((eq, eIdx) => (
                        <tr key={eq.id} className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-200"><input type="text" value={eq.unidadOrigen || ''} onChange={e => { const newEqs = [...(data.equivalencias || [])]; newEqs[eIdx].unidadOrigen = e.target.value; updateGlobalData({ equivalencias: newEqs }); }} className="w-full p-2 bg-white border border-slate-200 rounded focus:border-purple-400 outline-none" placeholder="Ej. taza" /></td>
                          <td className="p-2 border-r border-slate-200 text-center text-slate-400 font-bold">=</td>
                          <td className="p-2 border-r border-slate-200"><input type="number" min="0" step="any" value={eq.factor || ''} onChange={e => { const newEqs = [...(data.equivalencias || [])]; newEqs[eIdx].factor = parseFloat(e.target.value) || 0; updateGlobalData({ equivalencias: newEqs }); }} className="w-full p-2 bg-white border border-slate-200 rounded focus:border-purple-400 outline-none" placeholder="Ej. 0.25" /></td>
                          <td className="p-2 border-r border-slate-200"><input type="text" value={eq.unidadDestino || ''} onChange={e => { const newEqs = [...(data.equivalencias || [])]; newEqs[eIdx].unidadDestino = e.target.value; updateGlobalData({ equivalencias: newEqs }); }} className="w-full p-2 bg-white border border-slate-200 rounded focus:border-purple-400 outline-none" placeholder="Ej. kg" /></td>
                          <td className="p-2 text-center"><button onClick={() => { const newEqs = [...(data.equivalencias || [])]; newEqs.splice(eIdx, 1); updateGlobalData({ equivalencias: newEqs }); }} className="text-red-400 hover:text-red-600 p-2 rounded"><Trash2 size={18} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
               <button onClick={() => { const newEqs = [...(data.equivalencias || [])]; newEqs.push({ id: Date.now(), unidadOrigen: '', factor: 1, unidadDestino: 'kg' }); updateGlobalData({ equivalencias: newEqs }); }} className="mt-3 flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"><Plus size={16} /> Añadir Equivalencia</button>
            </div>
          </div>
        </div>
      );
`;

content = content.replace(match3[0], newCase3);

fs.writeFileSync(file, content, 'utf8');
console.log("Refactored materials step successfully.");
