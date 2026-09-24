const fs = require('fs');

const fileFase10 = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(fileFase10, 'utf8');

const regexFijos = /data\.inversiones\?\.filter\(i => i\.comportamiento === 'fijo'\)/g;
const replacementFijos = "data.inversiones?.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo) && (i.comportamiento || (i.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable')";

const regexVars = /data\.inversiones\?\.filter\(i => i\.comportamiento === 'variable'\)/g;
const replacementVars = "data.inversiones?.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo) && (i.comportamiento || (i.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable')";

content = content.replace(regexFijos, replacementFijos);
content = content.replace(regexVars, replacementVars);

fs.writeFileSync(fileFase10, content, 'utf8');

console.log("Success");
