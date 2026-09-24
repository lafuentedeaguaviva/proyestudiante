const fs = require('fs');
let c = fs.readFileSync('src/pages/Fase10_PlanFinanciero.jsx', 'utf8');

c = c.replaceAll(
  "data.inversiones?.filter(i => i.comportamiento === 'fijo')",
  "data.inversiones?.filter(i => i.tipo === 'operativo' && i.comportamiento !== 'variable')"
);

c = c.replaceAll(
  "data.inversiones?.filter(i => i.comportamiento === 'variable')",
  "data.inversiones?.filter(i => i.tipo === 'operativo' && i.comportamiento === 'variable')"
);

fs.writeFileSync('src/pages/Fase10_PlanFinanciero.jsx', c);
console.log("Done");
