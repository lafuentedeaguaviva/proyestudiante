const fs = require('fs');
const path = require('path');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

// Find which case holds "Calculadora: Precio de Venta"
const searchStr = 'Calculadora: Precio de Venta';
let caseNum = -1;

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].trim().match(/^case (\d+): \{$/);
  if (match) {
    let j = i;
    while (j < lines.length && !lines[j].trim().match(/^case \d+:/)) {
      if (lines[j].includes(searchStr)) {
        caseNum = parseInt(match[1]);
        break;
      }
      j++;
    }
  }
}

console.log(`Found target at case ${caseNum}`);

if (caseNum !== -1) {
    const idxStart = content.indexOf(`case ${caseNum}: {`);
    const idxEnd = content.indexOf(`case ${caseNum+1}:`);
    
    if (idxStart !== -1 && idxEnd !== -1) {
        const oldCase = content.substring(idxStart, idxEnd);
        
        const newCase = `case ${caseNum}: {
      const productos = data.productos || [];
      const totalDemanda = productos.reduce((sum, p) => sum + (parseInt(p.demanda) || 0), 0) || 1;
      
      const costosFijos = data.inversiones.filter(i => (i.comportamiento || (i.tipo === 'materiales' ? 'variable' : 'fijo')) === 'fijo')
                            .reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
                            
      const cfuGeneral = costosFijos / totalDemanda;

      const handleUpdateMargen = (id, margen) => {
        const pList = [...productos];
        const pIdx = pList.findIndex(p => p.id === id);
        if (pIdx !== -1) {
          pList[pIdx].porcentajeGanancia = margen;
          updateGlobalData({ productos: pList });
        }
      };

      return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Calculadora: Precio de Venta por Producto</h2>
              <p className="text-slate-500 font-medium">Asigna un margen individual y calcula el precio de venta de cada producto.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center shadow-sm">
            <div>
              <span className="font-bold text-slate-700 block text-sm">Costos Fijos Totales (Alquiler, Luz, etc): Bs. {costosFijos.toFixed(2)}</span>
              <span className="text-xs text-slate-500">Demanda Total Mensual de todos los productos: {totalDemanda} u.</span>
            </div>
            <div className="text-indigo-700 font-black text-lg mt-2 md:mt-0 bg-indigo-100 px-4 py-2 rounded-lg border border-indigo-200 text-center">
              <span className="block text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Costo Fijo Unitario</span>
              Bs. {cfuGeneral.toFixed(2)} / unidad
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {productos.length === 0 && (
              <div className="text-center p-8 bg-slate-50 rounded-xl text-slate-500 font-medium">
                No hay productos registrados. Vuelve al Paso 3 para añadir productos.
              </div>
            )}
            {productos.map(p => {
              const cvu = (p.ingredientes || []).reduce((acc, ing) => acc + ((parseFloat(ing.cantidad) || 0) * (parseFloat(ing.precio) || 0)), 0);
              const cu = cvu + cfuGeneral;
              const margen = parseFloat(p.porcentajeGanancia !== undefined ? p.porcentajeGanancia : 30);
              const precioSinFactura = margen < 100 ? cu / (1 - (margen / 100)) : cu;
              const precioFacturado = precioSinFactura / 0.84;

              return (
                <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
                  
                  {/* Detalles del Producto */}
                  <div className="flex-1 flex flex-col gap-3">
                    <h3 className="font-black text-xl text-slate-800 border-b border-slate-100 pb-2">{p.nombre}</h3>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 font-medium">Costo Variable (Receta)</span>
                      <span className="font-bold text-slate-700">Bs. {cvu.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 font-medium">Costo Fijo Unitario (CFU)</span>
                      <span className="font-bold text-slate-700">Bs. {cfuGeneral.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg mt-1 border border-slate-100">
                      <span className="text-indigo-800 font-bold">Costo Unitario Total</span>
                      <span className="font-black text-indigo-700">Bs. {cu.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Proyección de Precio */}
                  <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center gap-4">
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-slate-600 font-bold text-sm">Margen de Ganancia (%)</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0" max="99"
                          className="w-20 bg-slate-50 p-1.5 rounded-lg border border-slate-200 font-bold text-md focus:border-indigo-400 outline-none text-center text-indigo-700"
                          value={p.porcentajeGanancia !== undefined ? p.porcentajeGanancia : 30}
                          onChange={e => handleUpdateMargen(p.id, e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))}
                        />
                        <span className="font-bold text-slate-500">%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-2">
                      <span className="text-slate-500 font-bold text-sm">Precio (Sin Factura)</span>
                      <span className="font-black text-slate-700 text-lg">Bs. {precioSinFactura.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center bg-indigo-600 p-3 rounded-xl shadow-md text-white">
                      <div>
                        <span className="font-bold text-sm block">Precio Facturado</span>
                        <span className="text-[10px] text-indigo-200 block leading-tight">(IVA+IT ÷ 0.84)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-2xl block">Bs. {precioFacturado.toFixed(2)}</span>
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

        content = content.replace(oldCase, newCase);
        fs.writeFileSync(file, content);
        console.log("Successfully replaced the price calculation case!");
    }
}
