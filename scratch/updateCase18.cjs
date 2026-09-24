const fs = require('fs');
const path = require('path');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /case 18: return \([\s\S]*?(?=case 19:)/;
const match = content.match(regex);

if (match) {
    const oldCase = match[0];
    const newCase = `case 18: {
      const productos = data.productos || [];
      const totalDemanda = productos.reduce((sum, p) => sum + (parseInt(p.demanda) || 0), 0) || 1;
      
      const costosFijos = data.inversiones.filter(i => (i.comportamiento || (i.tipo === 'materiales' ? 'variable' : 'fijo')) === 'fijo')
                            .reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
      const cfuGeneral = costosFijos / totalDemanda;

      let wacm = 0; // Weighted Average Contribution Margin
      let ingresosMensuales = 0;
      let cvTotales = 0;

      productos.forEach(p => {
        const demanda = parseInt(p.demanda) || 0;
        const cvu = (p.ingredientes || []).reduce((acc, ing) => acc + ((parseFloat(ing.cantidad) || 0) * (parseFloat(ing.precio) || 0)), 0);
        const cu = cvu + cfuGeneral;
        const margen = parseFloat(p.porcentajeGanancia !== undefined ? p.porcentajeGanancia : 30);
        const precioSinFactura = margen < 100 ? cu / (1 - (margen / 100)) : cu;
        const precioFacturado = precioSinFactura / 0.84;
        
        const margenContribucionUnitario = precioFacturado - cvu;
        const peso = totalDemanda > 0 ? (demanda / totalDemanda) : 0;
        
        wacm += (margenContribucionUnitario * peso);
        ingresosMensuales += (precioFacturado * demanda);
        cvTotales += (cvu * demanda);
      });

      const puntoEquilibrioUnidades = wacm > 0 ? Math.ceil(costosFijos / wacm) : 0;
      const utilidadMensual = ingresosMensuales - (costosFijos + cvTotales);

      return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Cálculo de Punto de equilibrio</h2>
              <p className="text-slate-500 font-medium">Descubre cuántas unidades en total necesitas vender al mes para no perder dinero.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={100} /></div>
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Punto de Equilibrio Mensual</label>
              <p className="text-sm text-slate-400 mb-4 relative z-10">Unidades totales a vender para cubrir costos</p>
              <div className="text-5xl font-black text-blue-600 relative z-10">
                {wacm > 0 ? puntoEquilibrioUnidades : '---'}
              </div>
              <span className="text-slate-500 font-bold mt-2 relative z-10">unidades / mes (Global)</span>
            </div>

            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Proyección de Utilidad Neta</h3>

              <div className="mb-4">
                <span className="text-slate-400 text-sm">Ventas Estimadas Totales:</span>
                <span className="ml-2 font-bold text-white">{totalDemanda} unidades/mes</span>
              </div>

              <div className={\`p-4 rounded-xl border-2 \${utilidadMensual > 0 ? 'bg-emerald-900/50 border-emerald-500/50' : utilidadMensual < 0 ? 'bg-red-900/50 border-red-500/50' : 'bg-slate-800 border-slate-600'} transition-colors\`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-300">Utilidad Neta Mensual:</span>
                  <span className={\`text-2xl font-black \${utilidadMensual > 0 ? 'text-emerald-400' : utilidadMensual < 0 ? 'text-red-400' : 'text-slate-400'}\`}>
                    Bs. {utilidadMensual.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-4">
             <h3 className="text-blue-800 font-bold mb-2">Desglose de Equilibrio Sugerido por Producto</h3>
             <p className="text-sm text-blue-700 mb-4">Si alcanzas el punto de equilibrio global de <strong>{puntoEquilibrioUnidades}</strong> unidades, así deberían distribuirse según su porcentaje de demanda:</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {productos.map(p => {
                  const peso = totalDemanda > 0 ? ((parseInt(p.demanda) || 0) / totalDemanda) : 0;
                  const req = Math.round(puntoEquilibrioUnidades * peso);
                  return (
                    <div key={p.id} className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm flex justify-between items-center">
                      <span className="font-bold text-slate-700 truncate mr-2" title={p.nombre}>{p.nombre}</span>
                      <span className="text-blue-600 font-black">{req} u.</span>
                    </div>
                  );
               })}
             </div>
          </div>
        </div>
      );
    }
`;
    content = content.replace(oldCase, newCase);
    fs.writeFileSync(file, content);
    console.log("Updated case 18");
} else {
    console.log("RegExp didn't match case 18.");
}
