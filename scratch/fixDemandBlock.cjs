const fs = require('fs');

const jsxFile = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let c2 = fs.readFileSync(jsxFile, 'utf8');

const regexDem = /<div className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Demanda Mensual<\/div>[\s\S]*?<div className="flex items-center gap-2">[\s\S]*?<\/div>\n.*?<\/div>/;

c2 = c2.replace(regexDem, '');
c2 = c2.replace(/prod\.demanda \|\| 1/g, 'demandaPotencialFase4');
c2 = c2.replace(/parseInt\(p\.demanda\) \|\| 1/g, 'demandaPotencialFase4');

fs.writeFileSync(jsxFile, c2);
console.log('Update successful');
