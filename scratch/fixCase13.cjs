const fs = require('fs');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

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
              <table className="w-full text-left bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm min-w-[700px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-slate-500 font-bold border-b border-r border-slate-200 bg-slate-100/50 min-w-[200px] sticky left-0 z-10">Meses</th>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                      <th key={mes} className="p-4 text-slate-500 font-bold text-center border-b border-slate-200 min-w-[120px]">Mes {mes}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm sm:text-base">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/30 sticky left-0 z-10">Costos Fijos Totales (Bs.)</td>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                      <td key={mes} className="p-4 text-slate-600 text-center">{totalFijos.toFixed(2)}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/30 sticky left-0 z-10">Costos Variables Totales (Bs.)</td>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                      let varsMensual = 0;
                      (data.productos || []).forEach(prod => {
                        const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                        const prodBase = prod.produccionMensual || 0;
                        const multiplicador = 1 + ((mes - 1) * 0.13);
                        const unidades = Math.round(prodBase * multiplicador);
                        varsMensual += (unidades * (costoMaterialesUnitario + variableGlobalPorUnidad));
                      });
                      return <td key={mes} className="p-4 text-slate-600 text-center">{varsMensual.toFixed(2)}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors bg-red-50/30">
                    <td className="p-4 font-bold text-red-800 border-r border-slate-200 bg-red-100/30 sticky left-0 z-10">Gasto Total Consolidado (Bs.)</td>
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
                      return <td key={mes} className="p-4 font-black text-red-600 text-center whitespace-nowrap text-lg">Bs. {total.toFixed(2)}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }
`;

if (content.match(regex13)) {
  content = content.replace(regex13, replacement13);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Success");
} else {
  console.log("Regex 13 didn't match");
}
