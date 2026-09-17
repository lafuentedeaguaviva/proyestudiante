const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Inject the metrics right before switch(step)
const metricsCode = `    const inversionesLoc = data?.inversiones || [];
    const costosOpeGlobal = inversionesLoc.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo));
    const cfTotal = costosOpeGlobal.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
    const cvTotal = costosOpeGlobal.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
    const totalFijos = cfTotal;
    const numProdGlobal = parseInt(data?.produccionMensual) || 1;
    const costoVariableUnitario = cvTotal / numProdGlobal;

    switch(step) {`;

content = content.replace('    switch(step) {', metricsCode);

// 2. Remove the duplicated definitions inside case 6:
content = content.replace(
  "        const cfTotal = costosOpe.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);\n        const cvTotal = costosOpe.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);\n",
  ""
);

fs.writeFileSync(filePath, content);
console.log('Fixed undefined variables across cases in Fase 10');
