const fs = require('fs');

const fileDocx = 'd:/estudiante/plataforma-gamificada/src/lib/docxGenerator.js';
let contentDocx = fs.readFileSync(fileDocx, 'utf8');

// First, remove the assignment of preciosFin because it references undefined vars
const regexPreciosFin = /const preciosFin = \{[\s\S]*?\};/;
if (contentDocx.match(regexPreciosFin)) {
  contentDocx = contentDocx.replace(regexPreciosFin, '');
}

// Then, replace the hardcoded single-product sections with a multi-product table
const regexTables = /createHeading\("1\. Costo Unitario y Volumen", 4\),[\s\S]*?createSource\("Fuente: Elaboración propia\."\),/g;

const replacementTables = `createHeading("1. Estructura de Costos y Precios por Producto", 4),
          createCaption(\`Tabla \${tCount++}: Costos y Precios\`),
          createTable(
            ["Producto", "Demanda (mes)", "Costo (Bs.)", "Margen (%)", "Precio Final (Bs.)"],
            (pDT[10]?.productos && pDT[10].productos.length > 0 ? pDT[10].productos : [{nombre:"Ejemplo", produccionMensual:1, margenGanancia:30}]).map(prod => {
              const prodBase = parseFloat(prod.produccionMensual) || 0;
              const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
              const cvUnitario = costoMaterialesUnitario + (typeof variableGlobalPorUnidad !== 'undefined' ? variableGlobalPorUnidad : 0);
              const costoUnitarioTotal = cvUnitario + (typeof fijoPorUnidad !== 'undefined' ? fijoPorUnidad : 0);
              const m = parseFloat(prod.margenGanancia ?? pDT[10]?.porcentajeGanancia ?? 30);
              const pSinFac = m < 100 ? costoUnitarioTotal / (1 - (m / 100)) : costoUnitarioTotal;
              const pFac = pSinFac / 0.84;
              return [
                prod.nombre || "Producto",
                String(prodBase),
                formatCurrency(costoUnitarioTotal),
                String(m) + "%",
                formatCurrency(pFac)
              ];
            })
          ),
          createSource("Fuente: Elaboración propia."),`;

contentDocx = contentDocx.replace(regexTables, replacementTables);

fs.writeFileSync(fileDocx, contentDocx, 'utf8');
console.log('Success');
