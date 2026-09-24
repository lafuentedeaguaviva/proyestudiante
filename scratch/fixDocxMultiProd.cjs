const fs = require('fs');

const fileDocx = 'd:/estudiante/plataforma-gamificada/src/lib/docxGenerator.js';
let contentDocx = fs.readFileSync(fileDocx, 'utf8');

// The problematic string starts with "createHeading("1. Cálculo de Costo Unitario", 4),"
// Ends with "createHeading("4.4. Proyecciones Financieras", 2),"
const regexCostosPrecio = /createHeading\("1\. Cálculo de Costo Unitario", 4\),[\s\S]*?createSource\("Fuente: Elaboración propia\."\),\s*createHeading\("4\.4\. Proyecciones Financieras", 2\),/g;

// We will replace it with a Multi-Product table for Costos and Precios
const multiProductTables = `
          createHeading("1. Resumen de Precios por Producto", 4),
          createCaption(\`Tabla \${tCount++}: Precios Estimados\`),
          createTable(["Producto", "Costo Unitario", "Margen", "Precio (Sin Factura)", "Precio Facturado"], 
            (pDT[10]?.productos || []).map(p => {
              const costoMat = (p.ingredientes || []).reduce((a, b) => a + (b.monto || 0), 0);
              const cuTotal = costoMat + variableGlobalPorUnidad + fijoPorUnidad;
              const mg = parseFloat(p.margenGanancia ?? pDT[10]?.porcentajeGanancia ?? 30);
              const pSinFac = mg < 100 ? cuTotal / (1 - (mg/100)) : cuTotal;
              const pFac = pSinFac / 0.84;
              return [
                p.nombre || "Producto",
                \`Bs. \${formatCurrency(cuTotal)}\`,
                \`\${mg}%\`,
                \`Bs. \${formatCurrency(pSinFac)}\`,
                \`Bs. \${formatCurrency(pFac)}\`
              ];
            })
          ),
          createSource("Fuente: Elaboración propia."),
          
          createHeading("4.4. Proyecciones Financieras", 2),
`;

if (contentDocx.match(regexCostosPrecio)) {
  contentDocx = contentDocx.replace(regexCostosPrecio, multiProductTables);
  console.log("Replaced Costos/Precio tables.");
} else {
  console.log("Could not find regex for Costos/Precio");
}

// Fix Punto de Equilibrio
const regexPE = /createHeading\("4\.5\. Punto de Equilibrio", 2\),\s*createParagraph\(\`Punto de Equilibrio \(Ventas mensuales requeridas\): \$\{formatCurrency\(puntoEquilibrioBs\)\}\.\`\),/g;

const multiProductPE = `createHeading("4.5. Punto de Equilibrio", 2),
          createParagraph(\`El punto de equilibrio se alcanza cuando la utilidad neta acumulada en las proyecciones logra cubrir la inversión inicial.\`),`;

if (contentDocx.match(regexPE)) {
  contentDocx = contentDocx.replace(regexPE, multiProductPE);
  console.log("Replaced PE");
} else {
  console.log("Could not find regex for PE");
}

fs.writeFileSync(fileDocx, contentDocx, 'utf8');
console.log('Success');
