const fs = require('fs');
let content = fs.readFileSync('src/pages/Fase6_Distribucion.jsx', 'utf8');

content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$\{/g, '${');

fs.writeFileSync('src/pages/Fase6_Distribucion.jsx', content);
