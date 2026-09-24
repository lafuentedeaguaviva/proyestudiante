const fs = require('fs');
const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const n = \[\.\.\.data\.productos\];/g, 
  "const n = [...(data.productos?.length ? data.productos : [{ id: Date.now(), nombre: '', demanda: 1, ingredientes: [] }])];"
);

fs.writeFileSync(file, c);
console.log('Fixed data.productos iterability in onChange handlers.');
