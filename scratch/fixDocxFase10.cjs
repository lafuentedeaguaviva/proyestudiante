const fs = require('fs');
let c = fs.readFileSync('src/lib/docxGenerator.js', 'utf8');

// 1. Fix capitalOperacion
c = c.replaceAll(
  "const capitalOperacion = inversionesLoc.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo));",
  "const capitalOperacion = inversionesLoc.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo));"
);

// 2. Fix cfTotal and cvGlobal
c = c.replaceAll(
  "const cfTotal = capitalOperacion.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);",
  "const cfTotal = capitalOperacion.filter(inv => (inv.comportamiento || 'fijo') !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);"
);

c = c.replaceAll(
  "const cvGlobal = capitalOperacion.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);",
  "const cvGlobal = capitalOperacion.filter(inv => (inv.comportamiento || 'fijo') === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);"
);

// 3. Fix matInsumos (which is currently looking into capitalOperacion, which no longer has 'materiales')
c = c.replaceAll(
  "const matInsumos = capitalOperacion.filter(i => i.tipo === 'materiales');",
  `const matInsumos = [];
  (pDT[10]?.productos || []).forEach(prod => {
    (prod.ingredientes || []).forEach(ing => {
      matInsumos.push({
        concepto: \`\${ing.articulo} (\${prod.nombre})\`,
        cantidad: ing.cantidad * (parseFloat(prod.produccionMensual) || 1),
        precio: ing.precio,
        monto: ing.monto * (parseFloat(prod.produccionMensual) || 1),
        tipo: 'materiales'
      });
    });
  });`
);

// 4. In rowsEstructuraCostos, add the automatic materials row
c = c.replaceAll(
  `  const rowsEstructuraCostos = capitalOperacion.map(inv => {
    const isVariable = (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable';
    const tipoLabel = isVariable ? "Costo Variable" : "Costo Fijo";
    const desc = \`\${inv.concepto || "N/A"} (\${inv.tipo.toUpperCase()})\`;
    return [desc, tipoLabel, formatCurrency(inv.monto)];
  });`,
  `  const rowsEstructuraCostos = capitalOperacion.map(inv => {
    const isVariable = (inv.comportamiento || 'fijo') === 'variable';
    const tipoLabel = isVariable ? "Costo Variable" : "Costo Fijo";
    const desc = \`\${inv.concepto || "N/A"} (\${inv.tipo.toUpperCase()})\`;
    return [desc, tipoLabel, formatCurrency(inv.monto)];
  });
  
  // Agregar materiales dinámicos a la estructura de costos en el word
  const totalMaterialesGlobal = matInsumos.reduce((acc, curr) => acc + (curr.monto || 0), 0);
  if (totalMaterialesGlobal > 0) {
    rowsEstructuraCostos.push([
      "Materiales e Insumos (Por todos los productos)", 
      "Costo Variable", 
      formatCurrency(totalMaterialesGlobal)
    ]);
  }`
);

// 5. Fix the "TOTALES" line in docx to show the proper CV (which includes materials, like in Paso 7)
c = c.replaceAll(
  "createParagraph(`TOTALES -> CF: ${formatCurrency(cfTotal)} | CV: ${formatCurrency(cvGlobal)} | GLOBAL: ${formatCurrency(cfTotal + cvGlobal)}`, true, AlignmentType.RIGHT),",
  "createParagraph(`TOTALES -> CF: ${formatCurrency(cfTotal)} | CV: ${formatCurrency(cvGlobal + totalMaterialesGlobal)} | GLOBAL: ${formatCurrency(cfTotal + cvGlobal + totalMaterialesGlobal)}`, true, AlignmentType.RIGHT),"
);

fs.writeFileSync('src/lib/docxGenerator.js', c);
console.log("Fixed docxGenerator.js");
