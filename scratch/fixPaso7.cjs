const fs = require('fs');
let c = fs.readFileSync('src/pages/Fase10_PlanFinanciero.jsx', 'utf8');

c = c.replaceAll(
  "const costosOpe = data.inversiones.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo));",
  "const costosOpe = data.inversiones.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo));"
);

c = c.replaceAll(
  "const cfTotal = costosOpe.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);",
  "const cfTotal = totalFijos;"
);

c = c.replaceAll(
  "const cvTotal = costosOpe.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);",
  "const cvTotal = costosVariablesTotalesMes;"
);

c = c.replaceAll(
  "{costosOpe.map(renderAutoCostRow)}",
  `{costosOpe.map(renderAutoCostRow)}
                  {/* Fila de Materiales Automática */}
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <td className="p-3 font-medium text-slate-700 border-r border-slate-100">
                      <span className="block">Materiales e Insumos (Totales según demanda)</span>
                      <span className="text-xs text-slate-400 uppercase">Automático (Paso 3 y 4)</span>
                    </td>
                    <td className="p-3 border-r border-slate-100 text-center">
                      <div className="px-3 py-1.5 rounded-xl text-sm font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">Costo Variable</div>
                    </td>
                    <td className="p-3 text-right font-bold text-indigo-600 bg-slate-50/50">
                      {(costosVariablesTotalesMes - totalVariablesGlo).toFixed(2)}
                    </td>
                  </tr>`
);


fs.writeFileSync('src/pages/Fase10_PlanFinanciero.jsx', c);
console.log("Fixed cfTotal, cvTotal and added Materiales automatic row");
