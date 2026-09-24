const fs = require('fs');
const path = require('path');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /case 12: \{[\s\S]*?(?=case 13:)/;
const match = content.match(regex);

if (match) {
    const oldCase = match[0];
    const newCase = `case 12: {
      const productos = data.productos || [];
      const totalDemanda = productos.reduce((sum, p) => sum + (parseInt(p.demanda) || 0), 0) || 1;
      
      const costosFijos = data.inversiones.filter(i => (i.comportamiento || (i.tipo === 'materiales' ? 'variable' : 'fijo')) === 'fijo')
                            .reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
      const cfuGeneral = costosFijos / totalDemanda;

      // Calculate total monthly income based on fixed demand
      const ingresosMensuales = productos.reduce((sum, p) => {
        const cvu = (p.ingredientes || []).reduce((acc, ing) => acc + ((parseFloat(ing.cantidad) || 0) * (parseFloat(ing.precio) || 0)), 0);
        const cu = cvu + cfuGeneral;
        const margen = parseFloat(p.porcentajeGanancia !== undefined ? p.porcentajeGanancia : 30);
        const precioSinFactura = margen < 100 ? cu / (1 - (margen / 100)) : cu;
        const precioFacturado = precioSinFactura / 0.84;
        
        return sum + (precioFacturado * (parseInt(p.demanda) || 0));
      }, 0);

      return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Cálculo de Proyección de Ingresos</h2>
              <p className="text-slate-500 font-medium">Proyección de ingresos asumiendo demanda constante.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg text-center mb-8">
            <h3 className="text-2xl font-bold text-blue-100 mb-6">Proyección de Ingresos por Producto</h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-4">
              <div>
                <label className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-2 block">Meses a Proyectar</label>
                <input type="number" min="1" max="24" className="w-48 mx-auto bg-white/10 p-4 rounded-xl border border-white/20 font-bold text-white focus:border-white focus:bg-white/20 outline-none text-4xl text-center" value={data.mesesProyeccion || 6} onChange={e => updateGlobalData({ mesesProyeccion: e.target.value === '' ? '' : (parseInt(e.target.value) || 1) })} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm min-w-[700px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-slate-500 font-bold border-b border-r border-slate-200 bg-slate-100/50 min-w-[250px] sticky left-0 z-10">Concepto</th>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                    <th key={mes} className="p-4 text-slate-500 font-bold text-center border-b border-slate-200">Mes {mes}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/30 sticky left-0 z-10">Unidades Totales Estimadas</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                    <td key={mes} className="p-4 text-slate-600 text-center">{totalDemanda} u.</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50 transition-colors bg-emerald-50/30">
                  <td className="p-4 font-bold text-emerald-800 border-r border-slate-200 bg-emerald-100/30 sticky left-0 z-10">Ingresos Totales (Bs.)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                    <td key={mes} className="p-4 font-bold text-emerald-600 text-center whitespace-nowrap">Bs. {ingresosMensuales.toFixed(2)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
`;
    content = content.replace(oldCase, newCase);
    fs.writeFileSync(file, content);
    console.log("Updated case 12");
} else {
    console.log("RegExp didn't match.");
}
