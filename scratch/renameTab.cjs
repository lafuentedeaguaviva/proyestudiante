const fs = require('fs');
const file = 'src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/label: 'Recetas y Prod.'/g, "label: 'Costos por Prod.'");
fs.writeFileSync(file, content, 'utf8');
console.log("Renamed tab successfully.");
