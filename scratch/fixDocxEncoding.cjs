const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/docxGenerator.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace weird unicode replacements
content = content.replace(/[\uFFFD\u00EF\u00BF\u00BD]/g, 'o'); // Replacement character
content = content.replace(/ǭ/g, 'a');
content = content.replace(/Ǹ/g, 'e');
content = content.replace(/ǧ/g, 'u');

// Fix common words manually if they were garbled
content = content.replace(/Inversi.n/g, 'Inversion');
content = content.replace(/Producci.n/g, 'Produccion');
content = content.replace(/Categora/g, 'Categoria');
content = content.replace(/C.lculo/g, 'Calculo');
content = content.replace(/p.rdidas/g, 'perdidas');
content = content.replace(/gr.ficos/gi, 'graficos');
content = content.replace(/Gr.ficos/gi, 'Graficos');
content = content.replace(/econ.mica/gi, 'economica');
content = content.replace(/Promoci.n/g, 'Promocion');
content = content.replace(/P.blico/g, 'Publico');
content = content.replace(/Operaci.n/g, 'Operacion');

fs.writeFileSync(filePath, content);
console.log('Sanitized special characters');
