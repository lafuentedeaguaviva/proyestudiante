const fs = require('fs');
let content = fs.readFileSync('src/pages/Fase6_Distribucion.jsx', 'utf8');

// Replace any broken unicode sequences or manually fix the known ones
content = content.replace(/Ubicacin/g, 'Ubicación');
content = content.replace(/\\Ubicaci\uFFFDn \\\$\{i\+1\}\\/g, '\Ubicación \\');

// To be safe, just clear any weird chars
content = content.replace(//g, '');

fs.writeFileSync('src/pages/Fase6_Distribucion.jsx', content);
