const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file currently has:
//     switch(step) {
//       case 1: return ( ... );
//       case 18: {

// We need to inject case 2 through 17.
const missingCases = `
      case 2: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Capital de Inversión</h2>
          <p className="text-slate-500 mb-6">Agrega tus activos fijos y diferidos.</p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
             <p className="text-center text-slate-500 py-8">Registra aquí la maquinaria, muebles y gastos legales.</p>
             <button onClick={() => updateGlobalData({inversiones: [...(data.inversiones||[]), {id: Date.now(), concepto: 'Nuevo Activo', tipo: 'fijo', monto: 0}]})} className="w-full py-3 bg-purple-100 text-purple-700 font-bold rounded-xl mt-4 hover:bg-purple-200 transition-colors">+ Añadir Activo</button>
             
             <div className="mt-6 space-y-3">
               {(data.inversiones||[]).filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').map(inv => (
                 <div key={inv.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200">
                    <input type="text" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2" value={inv.concepto} onChange={(e) => {
                      const newInv = [...data.inversiones];
                      const idx = newInv.findIndex(x => x.id === inv.id);
                      if (idx > -1) newInv[idx].concepto = e.target.value;
                      updateGlobalData({inversiones: newInv});
                    }} />
                    <input type="number" className="w-32 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2" value={inv.monto} onChange={(e) => {
                      const newInv = [...data.inversiones];
                      const idx = newInv.findIndex(x => x.id === inv.id);
                      if (idx > -1) newInv[idx].monto = parseFloat(e.target.value)||0;
                      updateGlobalData({inversiones: newInv});
                    }} />
                    <button onClick={() => updateGlobalData({inversiones: data.inversiones.filter(x => x.id !== inv.id)})} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                 </div>
               ))}
             </div>
          </div>
        </div>
      );
      case 3: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Capital de Trabajo</h2>
          <p className="text-slate-500 mb-6">Dinero necesario para operar los primeros meses.</p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
             <p className="text-center text-slate-500 py-8">Registra insumos, sueldos y servicios básicos.</p>
             <button onClick={() => updateGlobalData({inversiones: [...(data.inversiones||[]), {id: Date.now(), concepto: 'Gasto Operativo', tipo: 'materiales', monto: 0}]})} className="w-full py-3 bg-purple-100 text-purple-700 font-bold rounded-xl mt-4 hover:bg-purple-200 transition-colors">+ Añadir Gasto</button>
             
             <div className="mt-6 space-y-3">
               {(data.inversiones||[]).filter(i => ['materiales','infraestructura','personal'].includes(i.tipo)).map(inv => (
                 <div key={inv.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200">
                    <input type="text" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2" value={inv.concepto} onChange={(e) => {
                      const newInv = [...data.inversiones];
                      const idx = newInv.findIndex(x => x.id === inv.id);
                      if (idx > -1) newInv[idx].concepto = e.target.value;
                      updateGlobalData({inversiones: newInv});
                    }} />
                    <input type="number" className="w-32 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2" value={inv.monto} onChange={(e) => {
                      const newInv = [...data.inversiones];
                      const idx = newInv.findIndex(x => x.id === inv.id);
                      if (idx > -1) newInv[idx].monto = parseFloat(e.target.value)||0;
                      updateGlobalData({inversiones: newInv});
                    }} />
                    <button onClick={() => updateGlobalData({inversiones: data.inversiones.filter(x => x.id !== inv.id)})} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                 </div>
               ))}
             </div>
          </div>
        </div>
      );
      case 4: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Resumen de Inversión</h2>
          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 bg-indigo-50 rounded-2xl">
                <h3 className="text-indigo-800 font-bold mb-2">Inversión Fija y Diferida</h3>
                <p className="text-3xl font-black text-indigo-600">Bs. {totalInversion.toFixed(2)}</p>
             </div>
             <div className="p-6 bg-emerald-50 rounded-2xl">
                <h3 className="text-emerald-800 font-bold mb-2">Capital de Trabajo</h3>
                <p className="text-3xl font-black text-emerald-600">Bs. {costoTotalOp.toFixed(2)}</p>
             </div>
          </div>
        </div>
      );
      case 5: case 7: case 9: case 11: case 13: case 15: case 17: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto text-center py-20">
          <Play size={64} className="mx-auto text-purple-300 mb-6" />
          <h2 className="text-2xl font-black text-slate-800 mb-4">Video Explicativo</h2>
          <p className="text-slate-500">Aquí va el video introductorio para esta sección.</p>
        </div>
      );
      case 6: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Costos Operativos</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
             <div className="p-6 bg-red-50 rounded-2xl">
                <h3 className="text-red-800 font-bold mb-2">Costos Fijos Totales</h3>
                <p className="text-3xl font-black text-red-600">Bs. {totalFijos.toFixed(2)}</p>
             </div>
             <div className="p-6 bg-orange-50 rounded-2xl">
                <h3 className="text-orange-800 font-bold mb-2">Costos Variables Totales</h3>
                <p className="text-3xl font-black text-orange-600">Bs. {cvTotal.toFixed(2)}</p>
             </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Producción Mensual Estimada (unidades)</label>
            <input type="number" className="w-full p-3 border border-slate-200 rounded-xl" value={data.produccionMensual || 1} onChange={e => updateGlobalData({produccionMensual: parseInt(e.target.value)||1})} />
          </div>
        </div>
      );
      case 8: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Fijación de Precio</h2>
          <div className="bg-slate-50 p-6 rounded-2xl mb-6">
             <p className="text-slate-600 mb-2">Costo Unitario: <strong>Bs. {costoUnitario.toFixed(2)}</strong></p>
             <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Margen de Ganancia (%)</label>
             <input type="number" className="w-full p-3 border border-slate-200 rounded-xl" value={data.porcentajeGanancia || 30} onChange={e => updateGlobalData({porcentajeGanancia: parseFloat(e.target.value)||0})} />
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 bg-indigo-50 rounded-2xl">
                <h3 className="text-indigo-800 font-bold mb-2">Precio Sin Factura</h3>
                <p className="text-3xl font-black text-indigo-600">Bs. {precioSinFactura.toFixed(2)}</p>
             </div>
             <div className="p-6 bg-emerald-50 rounded-2xl">
                <h3 className="text-emerald-800 font-bold mb-2">Precio Con Factura (IVA)</h3>
                <p className="text-3xl font-black text-emerald-600">Bs. {precioFacturado.toFixed(2)}</p>
             </div>
          </div>
        </div>
      );
      case 10: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Proyección de Ingresos</h2>
          <div className="p-6 bg-emerald-50 rounded-2xl text-center">
            <h3 className="text-emerald-800 font-bold mb-2">Ingresos Mensuales Estimados</h3>
            <p className="text-4xl font-black text-emerald-600">Bs. {ingresos.toFixed(2)}</p>
            <p className="text-sm text-emerald-700 mt-2">({numProd} unidades a Bs. {precioFacturado.toFixed(2)})</p>
          </div>
        </div>
      );
      case 12: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Proyección de Egresos</h2>
          <div className="p-6 bg-red-50 rounded-2xl text-center">
            <h3 className="text-red-800 font-bold mb-2">Egresos Mensuales Estimados</h3>
            <p className="text-4xl font-black text-red-600">Bs. {egresos.toFixed(2)}</p>
            <p className="text-sm text-red-700 mt-2">(Costos fijos + Costos variables totales)</p>
          </div>
        </div>
      );
      case 14: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Utilidad Mensual</h2>
          <div className={\`p-6 rounded-2xl text-center \${utilidadMensual > 0 ? 'bg-emerald-50' : 'bg-red-50'}\`}>
            <h3 className={\`font-bold mb-2 \${utilidadMensual > 0 ? 'text-emerald-800' : 'text-red-800'}\`}>Ganancia o Pérdida Neta</h3>
            <p className={\`text-4xl font-black \${utilidadMensual > 0 ? 'text-emerald-600' : 'text-red-600'}\`}>Bs. {utilidadMensual.toFixed(2)}</p>
          </div>
        </div>
      );
      case 16: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Punto de Equilibrio</h2>
          <p className="text-slate-600 mb-6">Unidades que debes vender al mes para no perder dinero.</p>
          <div className="p-8 bg-indigo-50 rounded-2xl text-center">
            <p className="text-6xl font-black text-indigo-600">{puntoEquilibrio}</p>
            <p className="text-indigo-800 font-bold mt-4">Unidades Mensuales</p>
          </div>
        </div>
      );
`;

const regex = /(case 1:\s*return \([\s\S]*?<\/div>\s*\);\s*)(case 18:\s*\{)/;
if (regex.test(content)) {
  content = content.replace(regex, '$1' + missingCases + '$2');
  fs.writeFileSync(filePath, content);
  console.log("Successfully rebuilt missing cases.");
} else {
  // Maybe it's missing case 1? Wait, user diff showed case 1 is there.
  console.log("Could not find insertion point.");
}

