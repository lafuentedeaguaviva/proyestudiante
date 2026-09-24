const fs = require('fs');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /case 9: \{[\s\S]*?(?=case 10: return)/;
const replacement = `case 9: {
        const totalFijos = data.inversiones?.filter(i => i.comportamiento === 'fijo').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
        const totalVariablesGlo = data.inversiones?.filter(i => i.comportamiento === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
        const totalProdMensual = (data.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
        const fijoPorUnidad = totalFijos / totalProdMensual;
        const variableGlobalPorUnidad = totalVariablesGlo / totalProdMensual;

        return (
          <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 hidden sm:block">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">Calculadora: Precio de Venta</h2>
                <p className="text-sm sm:text-base text-slate-500 font-medium">El sistema ha prorrateado tus costos operativos automáticamente.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-slate-200">
               <div className="flex flex-col">
                 <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Producción Global</span>
                 <span className="text-base sm:text-lg font-black text-slate-700">{totalProdMensual} unds/mes</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Fijos Totales</span>
                 <span className="text-base sm:text-lg font-black text-slate-700">Bs. {totalFijos.toFixed(2)}</span>
               </div>
               <div className="flex flex-col sm:text-right bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                 <span className="text-[10px] sm:text-xs font-bold text-indigo-500 uppercase tracking-wider">Fijo por Unidad</span>
                 <span className="text-lg sm:text-xl font-black text-indigo-700">Bs. {fijoPorUnidad.toFixed(2)}</span>
               </div>
            </div>

            <div className="flex flex-col gap-6">
              {(data.productos || []).map((prod, pIdx) => {
                const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                const costoUnitario = costoMaterialesUnitario + fijoPorUnidad + variableGlobalPorUnidad;
                const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
                const precioFacturado = precioSinFactura / 0.84;

                return (
                  <div key={prod.id} className="rounded-2xl p-4 sm:p-6 bg-white shadow-md border-t border-r border-b border-l-[6px] border-slate-200 border-l-indigo-500">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 border-b border-slate-100 pb-3 gap-2">
                      <h3 className="font-black text-xl text-slate-800 leading-tight">Producto: <span className="text-indigo-600">{prod.nombre || 'Sin nombre'}</span></h3>
                      <span className="text-xs sm:text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">Prod: {prod.produccionMensual || 0} u/mes</span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm sm:text-base"><div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-black">1</div> Costo Unitario</h4>
                        
                        <div className="flex justify-between text-xs sm:text-sm text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
                          <span>Materiales e Ingredientes</span>
                          <span className="font-bold text-emerald-600">Bs. {costoMaterialesUnitario.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
                          <span>Porción de Costo Fijo</span>
                          <span className="font-bold">Bs. {fijoPorUnidad.toFixed(2)}</span>
                        </div>
                        {variableGlobalPorUnidad > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
                            <span>Variables Globales</span>
                            <span className="font-bold">Bs. {variableGlobalPorUnidad.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center bg-indigo-50 p-3 sm:p-4 rounded-xl border border-indigo-100 mt-1">
                          <span className="text-indigo-900 font-bold text-sm sm:text-base">Costo Total (CU)</span>
                          <span className="font-black text-indigo-700 text-lg sm:text-xl">Bs. {costoUnitario.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm sm:text-base"><div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">2</div> Proyección de Precio</h4>
                        
                        <div className="flex justify-between items-center bg-white p-2 sm:p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-600 font-bold text-xs sm:text-sm">Margen de Ganancia</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number" min="0" max="99"
                              className="w-16 bg-slate-50 p-1.5 rounded-lg border border-slate-300 font-black text-sm focus:border-indigo-500 outline-none text-center text-indigo-700"
                              value={prod.margenGanancia ?? data.porcentajeGanancia ?? 30}
                              onChange={e => {
                                const newProds = [...data.productos];
                                newProds[pIdx].margenGanancia = parseFloat(e.target.value) || 0;
                                updateGlobalData({ productos: newProds });
                              }}
                            />
                            <span className="font-black text-slate-400 text-sm">%</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 font-medium text-xs sm:text-sm">Precio (Sin factura)</span>
                          <span className="font-black text-slate-700 text-base sm:text-lg">Bs. {precioSinFactura.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center bg-indigo-600 p-3 sm:p-4 rounded-xl shadow-md text-white mt-1">
                          <span className="font-bold text-sm sm:text-base leading-tight">Precio Final<br/><span className="text-[10px] sm:text-xs text-indigo-200 font-normal">Facturado (13% IVA + 3% IT)</span></span>
                          <span className="font-black text-xl sm:text-2xl">Bs. {precioFacturado.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      `;

if(content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Success");
} else {
  console.log("Not found regex");
}
