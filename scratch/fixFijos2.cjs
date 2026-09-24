const fs = require('fs');
let c = fs.readFileSync('src/pages/Fase10_PlanFinanciero.jsx', 'utf8');

c = c.replaceAll(
  "data.inversiones?.filter(i => i.tipo === 'operativo' && i.comportamiento !== 'variable')",
  "data.inversiones?.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo) && (i.comportamiento || 'fijo') !== 'variable')"
);

c = c.replaceAll(
  "data.inversiones?.filter(i => i.tipo === 'operativo' && i.comportamiento === 'variable')",
  "data.inversiones?.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo) && (i.comportamiento || 'fijo') === 'variable')"
);

fs.writeFileSync('src/pages/Fase10_PlanFinanciero.jsx', c);
console.log("Fixed globally totalFijos and totalVariablesGlo");
