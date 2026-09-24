const fs = require('fs');
let c = fs.readFileSync('src/services/api.js', 'utf8');

c = c.replace(
  'Ejemplo: [{"texto": "Comprar ingredientes", "categoriaCorrecta": "almacenamiento"}, {"texto": "Hornear la masa", "categoriaCorrecta": "operacion"}]."',
  'LIMITA LA LISTA A UN MÁXIMO ABSOLUTO DE 10 PASOS. Ejemplo: [{"texto": "Comprar ingredientes", "categoriaCorrecta": "almacenamiento"}]."'
);

fs.writeFileSync('src/services/api.js', c);
console.log("Updated api.js prompt");
