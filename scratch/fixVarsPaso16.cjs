const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The anchor is where we previously injected:
const anchor = `    const numProdGlobal = parseInt(data?.produccionMensual) || 1;
    const costoVariableUnitario = cvTotal / numProdGlobal;`;

const newCode = `    const numProdGlobal = parseInt(data?.produccionMensual) || 1;
    const costoVariableUnitario = cvTotal / numProdGlobal;
    
    // Financial calculations needed for step 8, 12, 16...
    const numProd = parseInt(data?.produccionMensual) || 1;
    const costoTotalOp = data?.inversiones?.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo)).reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
    const costoUnitario = costoTotalOp / numProd;
    const margen = parseFloat(data?.porcentajeGanancia || 30);
    const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
    const precioFacturado = precioSinFactura / 0.84;

    const margenContribucion = precioFacturado - costoVariableUnitario;
    const puntoEquilibrio = margenContribucion > 0 ? Math.ceil(totalFijos / margenContribucion) : 0;
    const ingresos = numProd * precioFacturado;
    const egresos = totalFijos + (numProd * costoVariableUnitario);
    const utilidadMensual = ingresos - egresos;`;

content = content.replace(anchor, newCode);

// Optional: clean up duplicated variable declarations inside cases if any.
// Inside case 8, there are duplicate definitions of costoTotalOp, numProd, costoUnitario, margen, precioSinFactura, precioFacturado.
const case8Vars = `          const costoTotalOp = data.inversiones.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo)).reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
          const numProd = parseInt(data.produccionMensual) || 1;
          const costoUnitario = costoTotalOp / numProd;
          const margen = parseFloat(data.porcentajeGanancia || 30);
          const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
          const precioFacturado = precioSinFactura / 0.84;`;

content = content.replace(case8Vars, '// Using global financial variables');

fs.writeFileSync(filePath, content);
console.log('Injected global financial variables');
