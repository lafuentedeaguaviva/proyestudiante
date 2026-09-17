const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase9_Estructura.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add organigrama and roles to destructuring
content = content.replace(
  /data, updateData,/,
  'data, updateData, organigrama, roles,'
);

// Replace data.organigrama with (data.organigrama || organigrama) ONLY IF IT'S NOT ALREADY REPLACED
// To be safer, just replace all occurrences of `data.organigrama` with `(data.organigrama || organigrama)`
content = content.replace(/data\.organigrama/g, '(data.organigrama || organigrama)');
content = content.replace(/data\.roles/g, '(data.roles || roles)');

// Replace updateGlobalData with updateData
content = content.replace(/updateGlobalData/g, 'updateData');

fs.writeFileSync(filePath, content);
console.log('Fixed Fase9_Estructura.jsx');
