const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const missingCases = `          {/* Columna Derecha: Lista de Inversiones */}
          <div className="lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl">
             <h3 className="font-bold text-slate-800 text-lg mb-4">Inversiones Seleccionadas</h3>
             <div className="space-y-3">
               {(data.inversiones||[]).filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').map(inv => (
                 <div key={inv.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <input type="text" className="flex-1 bg-transparent font-medium outline-none" value={inv.concepto} onChange={(e) => {
                      const newInv = [...data.inversiones];
                      const idx = newInv.findIndex(x => x.id === inv.id);
                      if (idx > -1) newInv[idx].concepto = e.target.value;
                      updateGlobalData({inversiones: newInv});
                    }} />
                    <div className="flex items-center gap-2">
                       <span className="text-slate-400 font-bold">Bs.</span>
                       <input type="number" className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right font-bold text-purple-700" value={inv.monto} onChange={(e) => {
                         const newInv = [...data.inversiones];
                         const idx = newInv.findIndex(x => x.id === inv.id);
                         if (idx > -1) newInv[idx].monto = parseFloat(e.target.value)||0;
                         updateGlobalData({inversiones: newInv});
                       }} />
                    </div>
                    <button onClick={() => updateGlobalData({inversiones: data.inversiones.filter(x => x.id !== inv.id)})} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                 </div>
               ))}
               {(!data.inversiones || data.inversiones.filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').length === 0) && (
                 <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                   <p className="text-slate-500 font-medium">No has añadido inversiones aún.</p>
                   <p className="text-sm text-slate-400 mt-1">Usa la caja de herramientas de la izquierda.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      );
      case 3: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Capital de Trabajo</h2>
          <p className="text-slate-500 mb-6">Dinero necesario para operar los primeros meses.</p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
             <p className="text-center text-slate-500 py-4">Registra insumos, sueldos y servicios básicos.</p>
             <button onClick={() => updateGlobalData({inversiones: [...(data.inversiones||[]), {id: Date.now(), concepto: 'Gasto Operativo', tipo: 'materiales', monto: 0}]})} className="w-full py-3 bg-purple-100 text-purple-700 font-bold rounded-xl mt-4 hover:bg-purple-200 transition-colors shadow-sm">+ Añadir Gasto Operativo</button>
             
             <div className="mt-6 space-y-3">
               {(data.inversiones||[]).filter(i => ['materiales','infraestructura','personal'].includes(i.tipo)).map(inv => (
                 <div key={inv.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <input type="text" className="flex-1 bg-transparent font-medium outline-none" value={inv.concepto} onChange={(e) => {
                      const newInv = [...data.inversiones];
                      const idx = newInv.findIndex(x => x.id === inv.id);
                      if (idx > -1) newInv[idx].concepto = e.target.value;
                      updateGlobalData({inversiones: newInv});
                    }} />
                    <div className="flex items-center gap-2">
                       <span className="text-slate-400 font-bold">Bs.</span>
                       <input type="number" className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right font-bold text-purple-700" value={inv.monto} onChange={(e) => {
                         const newInv = [...data.inversiones];
                         const idx = newInv.findIndex(x => x.id === inv.id);
                         if (idx > -1) newInv[idx].monto = parseFloat(e.target.value)||0;
                         updateGlobalData({inversiones: newInv});
                       }} />
                    </div>
                    <button onClick={() => updateGlobalData({inversiones: data.inversiones.filter(x => x.id !== inv.id)})} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                 </div>
               ))}
             </div>
          </div>
        </div>
      );
      case 4: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Resumen de Inversión Inicial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col justify-center">
                <h3 className="text-indigo-800 font-bold mb-2 uppercase text-xs tracking-wider">Inversión Fija y Diferida</h3>
                <p className="text-4xl font-black text-indigo-600">Bs. {totalInversion.toFixed(2)}</p>
             </div>
             <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col justify-center">
                <h3 className="text-emerald-800 font-bold mb-2 uppercase text-xs tracking-wider">Capital de Trabajo</h3>
                <p className="text-4xl font-black text-emerald-600">Bs. {costoTotalOp.toFixed(2)}</p>
             </div>
          </div>
          <div className="mt-8 p-6 bg-purple-600 rounded-2xl text-white text-center shadow-lg">
             <p className="text-purple-200 font-bold uppercase tracking-widest text-sm mb-2">Inversión Total Requerida</p>
             <p className="text-5xl font-black">Bs. {(totalInversion + costoTotalOp).toFixed(2)}</p>
          </div>
        </div>
      );
      case 5: case 7: case 9: case 11: case 13: case 15: case 17: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto text-center py-20">
          <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <Play size={48} className="ml-2" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">Video Explicativo</h2>
          <p className="text-slate-500 font-medium text-lg">Aprende los conceptos clave antes de continuar.</p>
        </div>
      );
      case 6: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Análisis de Costos Operativos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
                <h3 className="text-red-800 font-bold mb-2 uppercase text-xs tracking-wider">Costos Fijos Mensuales</h3>
                <p className="text-4xl font-black text-red-600">Bs. {totalFijos.toFixed(2)}</p>
             </div>
             <div className="p-6 bg-orange-50 border border-orange-100 rounded-2xl text-center">
                <h3 className="text-orange-800 font-bold mb-2 uppercase text-xs tracking-wider">Costos Variables Mensuales</h3>
                <p className="text-4xl font-black text-orange-600">Bs. {cvTotal.toFixed(2)}</p>
             </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <label className="block text-sm font-bold text-slate-700 mb-3">Producción Mensual Estimada (unidades)</label>
            <input type="number" className="w-full p-4 border border-slate-300 rounded-xl text-lg font-bold" value={data.produccionMensual || 1} onChange={e => updateGlobalData({produccionMensual: parseInt(e.target.value)||1})} />
            <p className="text-sm text-slate-500 mt-3">Tu costo variable unitario es de <strong>Bs. {costoVariableUnitario.toFixed(2)}</strong> por unidad.</p>
          </div>
        </div>
      );
      case 8: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Fijación de Precios</h2>
          <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200">
             <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
               <span className="text-slate-600 font-medium">Costo Unitario Total:</span>
               <span className="text-2xl font-black text-slate-800">Bs. {costoUnitario.toFixed(2)}</span>
             </div>
             <label className="block text-sm font-bold text-slate-700 mb-3">¿Qué margen de ganancia deseas? (%)</label>
             <input type="number" className="w-full p-4 border border-slate-300 rounded-xl text-xl font-bold text-purple-700" value={data.porcentajeGanancia || 30} onChange={e => updateGlobalData({porcentajeGanancia: parseFloat(e.target.value)||0})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
                <h3 className="text-indigo-800 font-bold mb-2 uppercase text-xs tracking-wider">Precio de Venta Sugerido</h3>
                <p className="text-4xl font-black text-indigo-600">Bs. {precioSinFactura.toFixed(2)}</p>
                <p className="text-xs text-indigo-500 mt-2">Sin impuestos (mercado informal)</p>
             </div>
             <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center shadow-md border-b-4 border-emerald-500">
                <h3 className="text-emerald-800 font-bold mb-2 uppercase text-xs tracking-wider">Precio Final al Público</h3>
                <p className="text-5xl font-black text-emerald-600">Bs. {precioFacturado.toFixed(2)}</p>
                <p className="text-xs text-emerald-700 mt-2 font-bold">Incluye margen + impuestos de ley</p>
             </div>
          </div>
        </div>
      );
      case 10: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Proyección de Ingresos Mensuales</h2>
          <div className="p-10 bg-emerald-50 rounded-3xl text-center border border-emerald-100 shadow-inner">
            <h3 className="text-emerald-800 font-bold mb-4 uppercase tracking-widest text-sm">Ventas Estimadas</h3>
            <p className="text-6xl font-black text-emerald-600 drop-shadow-sm">Bs. {ingresos.toFixed(2)}</p>
            <div className="mt-6 flex items-center justify-center gap-4 text-emerald-700 font-medium">
               <span>{numProd} unidades/mes</span>
               <span className="text-emerald-300">×</span>
               <span>Bs. {precioFacturado.toFixed(2)} c/u</span>
            </div>
          </div>
        </div>
      );
      case 12: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Proyección de Egresos Mensuales</h2>
          <div className="p-10 bg-red-50 rounded-3xl text-center border border-red-100 shadow-inner">
            <h3 className="text-red-800 font-bold mb-4 uppercase tracking-widest text-sm">Costos Operativos Totales</h3>
            <p className="text-6xl font-black text-red-600 drop-shadow-sm">Bs. {egresos.toFixed(2)}</p>
            <div className="mt-6 flex items-center justify-center gap-4 text-red-700 font-medium">
               <span>Bs. {totalFijos.toFixed(2)} (Fijos)</span>
               <span className="text-red-300">+</span>
               <span>Bs. {(numProd * costoVariableUnitario).toFixed(2)} (Variables)</span>
            </div>
          </div>
        </div>
      );
      case 14: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Utilidad Mensual Esperada</h2>
          <div className={\`p-10 rounded-3xl text-center shadow-inner border \${utilidadMensual > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}\`}>
            <h3 className={\`font-bold mb-4 uppercase tracking-widest text-sm \${utilidadMensual > 0 ? 'text-emerald-800' : 'text-red-800'}\`}>Resultado Neto (Ingresos - Egresos)</h3>
            <p className={\`text-6xl font-black drop-shadow-sm \${utilidadMensual > 0 ? 'text-emerald-600' : 'text-red-600'}\`}>
               {utilidadMensual > 0 ? '+' : ''}Bs. {utilidadMensual.toFixed(2)}
            </p>
            {utilidadMensual <= 0 && <p className="text-red-600 font-bold mt-4">⚠️ Estás perdiendo dinero. Ajusta tu precio o reduce costos.</p>}
          </div>
        </div>
      );
      case 16: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Punto de Equilibrio</h2>
          <p className="text-slate-500 mb-8 font-medium">El mínimo que debes vender cada mes solo para cubrir tus costos (sin ganar ni perder).</p>
          <div className="p-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-center shadow-xl text-white">
            <p className="text-blue-200 font-bold uppercase tracking-widest text-sm mb-4">Meta de Supervivencia</p>
            <p className="text-8xl font-black drop-shadow-lg">{puntoEquilibrio}</p>
            <p className="text-white font-medium text-xl mt-4">Unidades al mes</p>
          </div>
        </div>
      );
      case 18: {
        // Cálculo del VAN y TIR
        const inversionInicial = totalInversion + costoTotalOp;
        
        // Calcular flujos netos proyectados mensuales
        const flujos = Array.from({length: data.mesesProyeccion || 6}, (_, i) => i + 1).map(mes => {
            const multiplicador = 1 + ((mes - 1) * 0.10);
            const unidades = Math.round((data.produccionMensual || 0) * multiplicador);
            const ingresos = unidades * (precioFacturado || 0);
            const vars = unidades * costoVariableUnitario;
            const gastos = totalFijos + vars;
            const uBruta = ingresos - gastos;
            const impuestos = ingresos * 0.16;
            return uBruta - impuestos;
        });
        
        const tasaDescuentoMensual = (data.tasaDescuento || 0) / 100 / 12; // tasa anual llevada a mensual simple
        
        // VAN = -Inversion + Sumatoria(Flujo_n / (1+r)^n)
        let van = -inversionInicial;
        flujos.forEach((flujo, index) => {
            van += flujo / Math.pow(1 + tasaDescuentoMensual, index + 1);
        });

        // TIR aproximada (bisección simple)
        let tir = 0;
        let tir_anual = 0;
        if (inversionInicial > 0 && flujos.some(f => f > 0)) {
            let low = -0.5; // -50%
            let high = 1.0; // 100%
            for(let i=0; i<100; i++) {
                let mid = (low + high) / 2;
                let npv = -inversionInicial;
                flujos.forEach((flujo, index) => {
                    npv += flujo / Math.pow(1 + mid, index + 1);
                });
                if (npv > 0) low = mid;
                else high = mid;
            }
            tir = low;
            tir_anual = (Math.pow(1 + tir, 12) - 1) * 100;
        }

        return (
          <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                  <Calculator size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Evaluación Financiera: VAN y TIR</h2>
                  <p className="text-slate-500 font-medium">Calcula si el proyecto genera valor por encima de lo esperado.</p>
                </div>
              </div>
              
              <button 
                onClick={handleGenerarIA}
                disabled={isGeneratingIA}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[200px]"
              >
                {isGeneratingIA ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Autocompletar con IA
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-8 text-white shadow-lg text-center mb-8">
              <h3 className="text-2xl font-bold text-purple-100 mb-6">Tasa de Descuento (TMAR)</h3>
              <p className="text-sm text-purple-200 mb-4 max-w-xl mx-auto">¿Cuánto porcentaje de rentabilidad anual le exiges a este proyecto para que valga la pena el riesgo?</p>
              <div className="flex items-center justify-center gap-2">
                <input type="number" min="0" max="100" className="w-32 bg-white/10 p-4 rounded-xl border border-white/20 font-bold text-white focus:border-white focus:bg-white/20 outline-none text-4xl text-center" value={data.tasaDescuento === 0 ? 0 : (data.tasaDescuento || '')} onChange={e => updateGlobalData({ tasaDescuento: e.target.value === '' ? '' : (parseFloat(e.target.value) || 0) })} />
                <span className="text-4xl font-bold text-purple-200">% anual</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Valor Actual Neto (VAN)</div>
                <div className="text-slate-400 text-sm mb-4">Mide cuánto dinero 'extra' generas en valor de hoy. Debe ser mayor a cero.</div>
                <div className={\`text-4xl font-black \${van >= 0 ? 'text-emerald-500' : 'text-red-500'}\`}>
                  Bs. {van.toFixed(2)}
                </div>
                <div className="mt-4 font-bold text-sm">
                  {van > 0
                    ? <span className="text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">¡El proyecto es Rentable! 🎉</span>
                    : <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full">El proyecto destruye valor ⚠️</span>
                  }
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Tasa Interna de Retorno (TIR)</div>
                <div className="text-slate-400 text-sm mb-4">Es la rentabilidad real anual que te da el proyecto. Debe ser mayor a la TMAR.</div>
                <div className={\`text-4xl font-black \${tir_anual >= (data.tasaDescuento || 0) ? 'text-emerald-500' : 'text-red-500'}\`}>
                  {tir_anual.toFixed(2)} %
                </div>
                <div className="mt-4 font-bold text-sm">
                  {tir_anual >= (data.tasaDescuento || 0)
                    ? <span className="text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Rinde más de lo exigido 🚀</span>
                    : <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full">No alcanza la tasa exigida 📉</span>
                  }
                </div>
              </div>
            </div>

          </div>
        );
      }
`;

// Find everything from `          {/* Columna Derecha: Lista de Inversiones */}` down to the `default:` case
const startString = `          {/* Columna Derecha: Lista de Inversiones */}`;
const endString = `      default: return <div>Paso no definido</div>;`;

const startIndex = content.indexOf(startString);
const endIndex = content.indexOf(endString);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.substring(0, startIndex) + missingCases + '\n' + content.substring(endIndex);
  fs.writeFileSync(filePath, newContent);
  console.log("Successfully rebuilt missing cases.");
} else {
  console.log("Could not find insertion points.");
}
