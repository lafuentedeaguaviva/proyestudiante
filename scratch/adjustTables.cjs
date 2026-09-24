const fs = require('fs');
const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex11 = /case 11: \{[\s\S]*?(?=case 12: return)/;
const replacement11 = `case 11: {
        return (
          <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Cálculo de Proyección de ganancias</h2>
                <p className="text-slate-500 font-medium">Así se verán tus ingresos estimados en los próximos meses por producto.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg text-center mb-8">
              <h3 className="text-xl font-bold text-blue-100 mb-4">Configuración de Proyección</h3>
              <div className="flex justify-center items-center gap-8">
                <div>
                  <label className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-2 block">Meses a Proyectar</label>
                  <input type="number" min="1" max="24" className="w-48 mx-auto bg-white/10 p-3 rounded-xl border border-white/20 font-bold text-white focus:border-white focus:bg-white/20 outline-none text-3xl text-center" value={data.mesesProyeccion || 6} onChange={e => updateGlobalData({ mesesProyeccion: e.target.value === '' ? '' : (parseInt(e.target.value) || 1) })} />
                </div>
              </div>
              <p className="text-blue-200 text-sm mt-4">La demanda mensual de cada producto crecerá un 13% estimado por mes automáticamente.</p>
            </div>

            <div className="flex flex-col gap-8">
              {(data.productos || []).map(prod => {
                 const totalFijos = data.inversiones?.filter(i => i.comportamiento === 'fijo').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
                 const totalVariablesGlo = data.inversiones?.filter(i => i.comportamiento === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
                 const totalProdMensual = (data.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
                 const fijoPorUnidad = totalFijos / totalProdMensual;
                 const variableGlobalPorUnidad = totalVariablesGlo / totalProdMensual;

                 const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                 const costoUnitario = costoMaterialesUnitario + fijoPorUnidad + variableGlobalPorUnidad;
                 const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                 const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
                 const precioFacturado = precioSinFactura / 0.84;
                 
                 const prodBase = prod.produccionMensual || 0;
                 const precio = precioFacturado;

                 return (
                   <div key={prod.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                      <div className="bg-slate-50 p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <h4 className="font-black text-xl text-slate-800">Producto: <span className="text-indigo-600">{prod.nombre || 'Sin nombre'}</span></h4>
                        <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-bold w-fit">Demanda Inicial: {prodBase} u/mes</span>
                      </div>
                      <div className="overflow-x-auto pb-2">
                        <table className="w-full text-left bg-white min-w-[700px]">
                          <thead className="bg-slate-100/50">
                            <tr>
                              <th className="p-4 sm:p-5 text-slate-600 font-bold border-b border-r border-slate-200 w-[200px] sticky left-0 z-20 bg-slate-100">Meses</th>
                              {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                                <th key={mes} className="p-4 sm:p-5 text-slate-600 font-bold text-center border-b border-slate-200 min-w-[120px]">Mes {mes}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-base">
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 sm:p-5 font-bold text-slate-700 border-r border-slate-200 sticky left-0 z-10 bg-white">Unidades Vendidas</td>
                              {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                                const multiplicador = 1 + ((mes - 1) * 0.13);
                                const unidades = Math.round(prodBase * multiplicador);
                                return <td key={mes} className="p-4 sm:p-5 text-slate-600 text-center font-medium">{unidades}</td>;
                              })}
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 sm:p-5 font-bold text-slate-700 border-r border-slate-200 sticky left-0 z-10 bg-white">Precio (Bs.)</td>
                              {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                                <td key={mes} className="p-4 sm:p-5 text-slate-600 text-center font-medium">{precio.toFixed(2)}</td>
                              ))}
                            </tr>
                            <tr className="hover:bg-emerald-50 transition-colors bg-emerald-50/40">
                              <td className="p-4 sm:p-5 font-bold text-emerald-800 border-r border-slate-200 sticky left-0 z-10 bg-emerald-50">Ingresos (Bs.)</td>
                              {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                                const multiplicador = 1 + ((mes - 1) * 0.13);
                                const unidades = Math.round(prodBase * multiplicador);
                                const ingresos = unidades * precio;
                                return <td key={mes} className="p-4 sm:p-5 font-black text-emerald-600 text-center whitespace-nowrap text-lg">Bs. {ingresos.toFixed(2)}</td>;
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                   </div>
                 );
               })}
             </div>
             
             <div className="mt-10 bg-emerald-600 rounded-3xl overflow-hidden shadow-xl border-2 border-emerald-500">
                <div className="bg-emerald-700 p-5 text-white">
                   <h3 className="font-black text-2xl text-center">INGRESO TOTAL CONSOLIDADO (Todos los productos)</h3>
                </div>
                <div className="overflow-x-auto pb-2">
                  <table className="w-full text-left bg-emerald-600 text-white min-w-[700px]">
                    <thead>
                      <tr>
                        <th className="p-5 font-bold border-b border-emerald-500 w-[200px] sticky left-0 z-20 bg-emerald-700">Meses</th>
                        {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                          <th key={mes} className="p-5 font-bold text-center border-b border-emerald-500 min-w-[120px]">Mes {mes}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-5 font-black border-r border-emerald-500 text-emerald-100 sticky left-0 z-10 bg-emerald-600 text-lg">Total Ingresos (Bs.)</td>
                        {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                           let totalIngresos = 0;
                           (data.productos || []).forEach(prod => {
                             const totalFijos = data.inversiones?.filter(i => i.comportamiento === 'fijo').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
                             const totalVariablesGlo = data.inversiones?.filter(i => i.comportamiento === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
                             const totalProdMensual = (data.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
                             const fijoPorUnidad = totalFijos / totalProdMensual;
                             const variableGlobalPorUnidad = totalVariablesGlo / totalProdMensual;

                             const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                             const costoUnitario = costoMaterialesUnitario + fijoPorUnidad + variableGlobalPorUnidad;
                             const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                             const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
                             const precioFacturado = precioSinFactura / 0.84;
                             
                             const prodBase = prod.produccionMensual || 0;
                             const multiplicador = 1 + ((mes - 1) * 0.13);
                             const unidades = Math.round(prodBase * multiplicador);
                             totalIngresos += unidades * precioFacturado;
                           });
                           return <td key={mes} className="p-5 font-black text-white text-center text-xl whitespace-nowrap">Bs. {totalIngresos.toFixed(2)}</td>;
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        );
      }
`;

const regex13 = /case 13: return \([\s\S]*?(?=case 14: return)/;
const replacement13 = `case 13: {
        const totalFijos = data.inversiones?.filter(i => i.comportamiento === 'fijo').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
        const totalVariablesGlo = data.inversiones?.filter(i => i.comportamiento === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
        const totalProdMensual = (data.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
        const variableGlobalPorUnidad = totalVariablesGlo / totalProdMensual;

        return (
          <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl text-red-600">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Cálculo de Proyección de gastos</h2>
                <p className="text-slate-500 font-medium">Así se verán tus gastos estimados en los próximos meses, consolidando todos tus productos.</p>
              </div>
            </div>

            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md min-w-[800px]">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-5 text-slate-600 font-bold border-b border-r border-slate-200 bg-slate-200/60 min-w-[220px] sticky left-0 z-20">Meses</th>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                      <th key={mes} className="p-5 text-slate-600 font-bold text-center border-b border-slate-200 min-w-[140px]">Mes {mes}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-base">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 font-bold text-slate-700 border-r border-slate-200 bg-slate-50 sticky left-0 z-10">Costos Fijos Totales (Bs.)</td>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                      <td key={mes} className="p-5 text-slate-600 text-center font-medium">{totalFijos.toFixed(2)}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 font-bold text-slate-700 border-r border-slate-200 bg-slate-50 sticky left-0 z-10">Costos Variables Totales (Bs.)</td>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                      let varsMensual = 0;
                      (data.productos || []).forEach(prod => {
                        const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                        const prodBase = prod.produccionMensual || 0;
                        const multiplicador = 1 + ((mes - 1) * 0.13);
                        const unidades = Math.round(prodBase * multiplicador);
                        varsMensual += (unidades * (costoMaterialesUnitario + variableGlobalPorUnidad));
                      });
                      return <td key={mes} className="p-5 text-slate-600 text-center font-medium">{varsMensual.toFixed(2)}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-red-50 transition-colors bg-red-50/50">
                    <td className="p-5 font-black text-red-800 border-r border-slate-200 bg-red-100/50 sticky left-0 z-10 text-lg">Gasto Total Consolidado</td>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                      let varsMensual = 0;
                      (data.productos || []).forEach(prod => {
                        const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                        const prodBase = prod.produccionMensual || 0;
                        const multiplicador = 1 + ((mes - 1) * 0.13);
                        const unidades = Math.round(prodBase * multiplicador);
                        varsMensual += (unidades * (costoMaterialesUnitario + variableGlobalPorUnidad));
                      });
                      const total = totalFijos + varsMensual;
                      return <td key={mes} className="p-5 font-black text-red-600 text-center whitespace-nowrap text-xl">Bs. {total.toFixed(2)}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }
`;

if (content.match(regex11)) content = content.replace(regex11, replacement11);
if (content.match(regex13)) content = content.replace(regex13, replacement13);
fs.writeFileSync(file, content, 'utf8');
console.log("Success");
