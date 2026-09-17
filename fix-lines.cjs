const fs = require('fs');
let content = fs.readFileSync('src/pages/Fase6_Distribucion.jsx', 'utf8');
let lines = content.split('\n');
lines.splice(87, 8); // Remove lines 88 to 95 (index 87 to 94)
fs.writeFileSync('src/pages/Fase6_Distribucion.jsx', lines.join('\n'));
