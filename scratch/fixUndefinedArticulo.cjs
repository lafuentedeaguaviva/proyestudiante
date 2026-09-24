const fs = require('fs');
let c = fs.readFileSync('src/lib/docxGenerator.js', 'utf8');

c = c.replaceAll(
  "concepto: `${ing.articulo} (${prod.nombre})`,",
  "concepto: `${ing.concepto} (${prod.nombre})`,"
);

fs.writeFileSync('src/lib/docxGenerator.js', c);
console.log("Fixed undefined articulo in docxGenerator.js");
