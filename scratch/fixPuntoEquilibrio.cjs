const fs = require('fs');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

const regexCalculations = /const getPasoContent = \(\) => \{[\s\S]*?(?=switch \(step\))/;

const replacementCalculations = `const getPasoContent = () => {
    // ---- MULTI-PRODUCT FINANCIAL CALCULATIONS ----
    
    // 1. Fixed and Global Variable Costs from 'inversiones'
    const totalFijos = data.inversiones?.filter(i => i.comportamiento === 'fijo').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
    const totalVariablesGlo = data.inversiones?.filter(i => i.comportamiento === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
    
    // 2. Compute aggregate monthly demand
    const totalProdMensual = (data.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
    
    // 3. Apportion fixed and global variable costs per unit
    const fijoPorUnidad = totalFijos / totalProdMensual;
    const variableGlobalPorUnidad = totalVariablesGlo / totalProdMensual;

    // 4. Calculate total Revenues and Variable Costs for the month
    let ingresosTotalesMes = 0;
    let costosVariablesTotalesMes = 0;
    let egresosTotalesMes = totalFijos;

    (data.productos || []).forEach(prod => {
      // Unit costs for this product
      const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
      const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
      const costoUnitarioTotal = cvUnitario + fijoPorUnidad;
      
      // Price calculation
      const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
      const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
      const precioFacturado = precioSinFactura / 0.84;
      
      const prodBase = prod.produccionMensual || 0;
      
      ingresosTotalesMes += (prodBase * precioFacturado);
      costosVariablesTotalesMes += (prodBase * cvUnitario);
      egresosTotalesMes += (prodBase * cvUnitario);
    });

    const utilidadMensual = ingresosTotalesMes - egresosTotalesMes;

    // 5. Break-Even Point (Multi-Product using Weighted Contribution Margin)
    // Formula: Break Even Sales (Bs) = Fixed Costs / Contribution Margin Ratio
    // Contribution Margin Ratio = (Total Sales - Total Variable Costs) / Total Sales
    let margenContribucionPonderado = 0;
    let puntoEquilibrioBs = 0;
    
    if (ingresosTotalesMes > 0) {
      margenContribucionPonderado = (ingresosTotalesMes - costosVariablesTotalesMes) / ingresosTotalesMes;
    }
    
    if (margenContribucionPonderado > 0) {
      puntoEquilibrioBs = totalFijos / margenContribucionPonderado;
    }

    const totalInversion = data?.inversiones?.filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;

    `;

const regex15 = /case 15: return \([\s\S]*?(?=case 16: return)/;
const replacement15 = `case 15: return (
        <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Cálculo de Utilidad Neta</h2>
              <p className="text-slate-500 font-medium">Restando impuestos a tus ganancias consolidadas.</p>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm min-w-[700px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 sm:p-5 text-slate-500 font-bold border-b border-r border-slate-200 bg-slate-100/50 min-w-[250px] sticky left-0 z-20">Meses</th>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                    <th key={mes} className="p-4 sm:p-5 text-slate-500 font-bold text-center border-b border-slate-200">Mes {mes}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-base">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 border-r border-slate-200 bg-slate-50 sticky left-0 z-10">Utilidad Bruta Global (Bs.)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    let uBrutaMes = 0;
                    const multiplicador = 1 + ((mes - 1) * 0.13);
                    (data.productos || []).forEach(prod => {
                      const prodBase = prod.produccionMensual || 0;
                      const unidades = Math.round(prodBase * multiplicador);
                      
                      const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                      const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
                      const costoUnitarioTotal = cvUnitario + fijoPorUnidad;
                      const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                      const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
                      const precioFacturado = precioSinFactura / 0.84;
                      
                      const ingresos = unidades * precioFacturado;
                      const gastosVars = unidades * cvUnitario;
                      uBrutaMes += (ingresos - gastosVars);
                    });
                    uBrutaMes -= totalFijos;
                    return <td key={mes} className={\`p-4 sm:p-5 font-bold text-center \${uBrutaMes >= 0 ? 'text-slate-600' : 'text-red-500'}\`}>{uBrutaMes.toFixed(2)}</td>;
                  })}
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 border-r border-slate-200 bg-slate-50 sticky left-0 z-10">Impuestos Totales (IVA 13% + IT 3%)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    let ingresosMes = 0;
                    const multiplicador = 1 + ((mes - 1) * 0.13);
                    (data.productos || []).forEach(prod => {
                      const prodBase = prod.produccionMensual || 0;
                      const unidades = Math.round(prodBase * multiplicador);
                      
                      const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                      const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
                      const costoUnitarioTotal = cvUnitario + fijoPorUnidad;
                      const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                      const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
                      const precioFacturado = precioSinFactura / 0.84;
                      
                      ingresosMes += (unidades * precioFacturado);
                    });
                    const impuestos = ingresosMes * 0.16;
                    return <td key={mes} className="p-4 sm:p-5 text-red-500 text-center font-medium">-{impuestos.toFixed(2)}</td>;
                  })}
                </tr>
                <tr className="hover:bg-amber-50 transition-colors bg-amber-50/40">
                  <td className="p-4 sm:p-5 font-black text-amber-800 border-r border-slate-200 bg-amber-100/50 sticky left-0 z-10 text-lg">Utilidad Neta Consolidada</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    let ingresosMes = 0;
                    let gastosVarsMes = 0;
                    const multiplicador = 1 + ((mes - 1) * 0.13);
                    (data.productos || []).forEach(prod => {
                      const prodBase = prod.produccionMensual || 0;
                      const unidades = Math.round(prodBase * multiplicador);
                      
                      const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                      const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
                      const costoUnitarioTotal = cvUnitario + fijoPorUnidad;
                      const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                      const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
                      const precioFacturado = precioSinFactura / 0.84;
                      
                      ingresosMes += (unidades * precioFacturado);
                      gastosVarsMes += (unidades * cvUnitario);
                    });
                    const uBruta = ingresosMes - gastosVarsMes - totalFijos;
                    const impuestos = ingresosMes * 0.16;
                    const uNeta = uBruta - impuestos;
                    return <td key={mes} className={\`p-4 sm:p-5 font-black text-center whitespace-nowrap text-xl \${uNeta >= 0 ? 'text-amber-600' : 'text-red-600'}\`}>Bs. {uNeta.toFixed(2)}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
`;

const regex17 = /case 17: return \([\s\S]*?(?=case 18: return)/;
const replacement17 = `case 17: return (
        <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Punto de Equilibrio (Multiproducto)</h2>
              <p className="text-slate-500 font-medium">Descubre cuánto debes facturar al mes en total para no perder dinero.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={150} /></div>
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Punto de Equilibrio Global</label>
              <p className="text-sm text-slate-400 mb-4 relative z-10">Ingresos mínimos mensuales para cubrir costos</p>
              <div className="text-4xl sm:text-5xl font-black text-blue-600 relative z-10">
                {margenContribucionPonderado > 0 ? \`Bs. \${puntoEquilibrioBs.toFixed(2)}\` : '---'}
              </div>
              <span className="text-slate-500 font-bold mt-2 relative z-10">al mes</span>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-center border border-slate-700">
              <h3 className="text-xl font-bold text-blue-400 mb-6">Estado Actual (Mes 1)</h3>

              <div className="mb-4 bg-slate-800/50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 text-sm">Ventas Totales Esperadas:</span>
                  <span className="font-bold text-white">Bs. {ingresosTotalesMes.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div className={\`bg-blue-500 h-2.5 rounded-full\`} style={{ width: \`\${Math.min(100, (ingresosTotalesMes / (puntoEquilibrioBs || 1)) * 100)}%\` }}></div>
                </div>
              </div>

              <div className={\`p-5 rounded-2xl border-2 \${utilidadMensual > 0 ? 'bg-emerald-900/40 border-emerald-500/50' : utilidadMensual < 0 ? 'bg-red-900/40 border-red-500/50' : 'bg-slate-800 border-slate-600'} transition-colors\`}>
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-300">Utilidad Bruta (antes de IVA):</span>
                  <span className={\`text-3xl font-black \${utilidadMensual > 0 ? 'text-emerald-400' : utilidadMensual < 0 ? 'text-red-400' : 'text-slate-400'}\`}>
                    Bs. {utilidadMensual.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
`;

const regex19 = /case 19: \{[\s\S]*?(?=default: return)/;
const replacement19 = `case 19: {
        const inversionInicial = totalInversion;

        // Calculate consolidated Net Cash Flows for VAN and TIR
        const flujos = Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
          let ingresosMes = 0;
          let gastosVarsMes = 0;
          const multiplicador = 1 + ((mes - 1) * 0.13);
          
          (data.productos || []).forEach(prod => {
            const prodBase = prod.produccionMensual || 0;
            const unidades = Math.round(prodBase * multiplicador);
            
            const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
            const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
            const costoUnitarioTotal = cvUnitario + fijoPorUnidad;
            const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
            const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
            const precioFacturado = precioSinFactura / 0.84;
            
            ingresosMes += (unidades * precioFacturado);
            gastosVarsMes += (unidades * cvUnitario);
          });
          
          const uBruta = ingresosMes - gastosVarsMes - totalFijos;
          const impuestos = ingresosMes * 0.16;
          return uBruta - impuestos;
        });

        const tasaTMAR = (data.tasaDescuento !== undefined && data.tasaDescuento !== '' && data.tasaDescuento !== null) ? parseFloat(data.tasaDescuento) : 13;
        const tasaDescuentoMensual = tasaTMAR / 100;

        let van = -inversionInicial;
        flujos.forEach((flujo, index) => {
          van += flujo / Math.pow(1 + tasaDescuentoMensual, index + 1);
        });

        let tir = 0;
        let tir_mensual = 0;
        if (inversionInicial > 0 && flujos.some(f => f > 0)) {
          let low = -0.5; 
          let high = 1.0; 
          for (let i = 0; i < 100; i++) {
            let mid = (low + high) / 2;
            let npv = -inversionInicial;
            flujos.forEach((flujo, index) => {
              npv += flujo / Math.pow(1 + mid, index + 1);
            });
            if (npv > 0) low = mid;
            else high = mid;
          }
          tir = low;
          tir_mensual = tir * 100;
        }

        return (
          <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Evaluación Financiera: VAN y TIR</h2>
                <p className="text-slate-500 font-medium">Calcula si el proyecto multiproducto genera valor real.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-8">
              <button 
                onClick={handleLimpiarTablas}
                className="px-6 py-3.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Trash2 size={20} /> Limpiar todas las tablas
              </button>

              <button 
                onClick={handleGenerarIA}
                disabled={isGeneratingIA}
                className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none w-full sm:w-auto"
              >
                {isGeneratingIA ? (
                  <>
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> Autocompletar con IA
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl text-center mb-8 border border-purple-600">
              <h3 className="text-xl font-bold text-purple-100 mb-4">Tasa de Descuento (TMAR)</h3>
              <p className="text-sm text-purple-200 mb-6 max-w-xl mx-auto">¿Cuánto porcentaje de rentabilidad mensual le exiges a tu portafolio de productos?</p>
              <div className="flex items-center justify-center gap-2">
                <input type="number" min="0" max="100" className="w-32 bg-white/10 p-4 rounded-xl border border-white/20 font-black text-white focus:border-white focus:bg-white/20 outline-none text-4xl text-center shadow-inner" value={data.tasaDescuento === 0 ? 0 : (data.tasaDescuento || 13)} onChange={e => updateGlobalData({ tasaDescuento: e.target.value === '' ? '' : (parseFloat(e.target.value) || 0) })} />
                <span className="text-3xl font-bold text-purple-200">% / mes</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden shadow-sm">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Valor Actual Neto (VAN)</div>
                <div className="text-slate-400 text-sm mb-4">Mide cuánto dinero 'extra' generas en valor de hoy. Debe ser mayor a cero.</div>
                <div className={\`text-4xl sm:text-5xl font-black \${van >= 0 ? 'text-emerald-500' : 'text-red-500'}\`}>
                  Bs. {van.toFixed(2)}
                </div>
                <div className="mt-6 font-bold text-sm">
                  {van > 0
                    ? <span className="text-emerald-700 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-200">¡El proyecto es Rentable! 🎉</span>
                    : <span className="text-red-700 bg-red-100 px-4 py-2 rounded-full border border-red-200">El proyecto destruye valor ⚠️</span>
                  }
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden shadow-sm">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Tasa Interna de Retorno (TIR)</div>
                <div className="text-slate-400 text-sm mb-4">Es la rentabilidad real mensual que te da el proyecto. Debe ser mayor a la TMAR.</div>
                <div className={\`text-4xl sm:text-5xl font-black \${tir_mensual >= tasaTMAR ? 'text-emerald-500' : 'text-red-500'}\`}>
                  {tir_mensual.toFixed(2)} %
                </div>
                <div className="mt-6 font-bold text-sm">
                  {tir_mensual >= tasaTMAR
                    ? <span className="text-emerald-700 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-200">Rinde más de lo exigido 🚀</span>
                    : <span className="text-red-700 bg-red-100 px-4 py-2 rounded-full border border-red-200">No alcanza la tasa exigida 📉</span>
                  }
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end pb-8">
              <button 
                onClick={handleFinalizar}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xl shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <CheckCircle2 size={28} /> Finalizar Plan Financiero
              </button>
            </div>
          </div>
        );
      }
`;

if (content.match(regexCalculations)) content = content.replace(regexCalculations, replacementCalculations);
if (content.match(regex15)) content = content.replace(regex15, replacement15);
if (content.match(regex17)) content = content.replace(regex17, replacement17);
if (content.match(regex19)) content = content.replace(regex19, replacement19);

fs.writeFileSync(file, content, 'utf8');
console.log("Success");
