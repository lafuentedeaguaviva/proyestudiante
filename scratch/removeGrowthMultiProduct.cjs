const fs = require('fs');
const path = require('path');

// 1. FASE 10
const fileFase10 = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content10 = fs.readFileSync(fileFase10, 'utf8');

content10 = content10.replace(/const multiplicador = 1 \+ \(\(mes - 1\) \* 0\.13\);/g, 'const multiplicador = 1;');
content10 = content10.replace(/La demanda mensual de cada producto crecerá un 13% estimado por mes automáticamente\./g, 'La demanda mensual de cada producto se mantendrá constante según la demanda inicial estimada.');

fs.writeFileSync(fileFase10, content10, 'utf8');


// 2. FASE 13
const fileFase13 = 'd:/estudiante/plataforma-gamificada/src/pages/Fase13_DocumentoIA.jsx';
let content13 = fs.readFileSync(fileFase13, 'utf8');

const regexFase13Vars = /const cfTotal = capitalOperacion\.filter[\s\S]*?(?=const formattedVan)/;
const replacementFase13Vars = `const cfTotal = capitalOperacion.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
        const cvGlobal = capitalOperacion.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
        
        const totalProdMensual = (pDT10.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
        const fijoPorUnidad = cfTotal / totalProdMensual;
        const variableGlobalPorUnidad = cvGlobal / totalProdMensual;

        const numMeses = parseInt(pDT10.mesesProyeccion) || 6;
        const flujos = [];
        for (let m = 1; m <= numMeses; m++) {
          let ingresosTotalesMes = 0;
          let gastosVarsMes = 0;
          const multiplicador = 1;

          (pDT10.productos || []).forEach(prod => {
            const prodBase = parseFloat(prod.produccionMensual) || 0;
            const unidades = Math.round(prodBase * multiplicador);

            const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
            const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
            const costoUnitarioTotal = cvUnitario + fijoPorUnidad;

            const margen = parseFloat(prod.margenGanancia ?? pDT10.porcentajeGanancia ?? 30);
            const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
            const precioFacturado = precioSinFactura / 0.84;

            ingresosTotalesMes += (unidades * precioFacturado);
            gastosVarsMes += (unidades * cvUnitario);
          });

          const uBruta = ingresosTotalesMes - gastosVarsMes - cfTotal;
          const impuestos = ingresosTotalesMes * 0.16;
          const uNeta = uBruta - impuestos;
          flujos.push(uNeta);
        }
        
        const totalInversion = capitalInversion.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
        const tasaTMAR = parseFloat(pDT10.tasaDescuento) || 13;
        const tasaDescuentoMensual = tasaTMAR / 100;
        
        let vanCalc = -totalInversion;
        flujos.forEach((flujo, index) => {
          vanCalc += flujo / Math.pow(1 + tasaDescuentoMensual, index + 1);
        });
        
        let tirCalc = 0;
        if (totalInversion > 0 && flujos.some(f => f > 0)) {
          let low = -0.5;
          let high = 1.0;
          for (let i = 0; i < 100; i++) {
            let mid = (low + high) / 2;
            let npv = -totalInversion;
            flujos.forEach((flujo, index) => {
              npv += flujo / Math.pow(1 + mid, index + 1);
            });
            if (npv > 0) low = mid;
            else high = mid;
          }
          tirCalc = low * 100;
        }

        `;
if (content13.match(regexFase13Vars)) {
  content13 = content13.replace(regexFase13Vars, replacementFase13Vars);
  fs.writeFileSync(fileFase13, content13, 'utf8');
}


// 3. DOCX GENERATOR
const fileDocx = 'd:/estudiante/plataforma-gamificada/src/lib/docxGenerator.js';
let contentDocx = fs.readFileSync(fileDocx, 'utf8');

const regexDocxVars = /\/\/ \-\-\- Cálculo Dinámico idéntico a la UI de Fase 10 \-\-\-[\s\S]*?(?=const preciosFin)/;
const replacementDocxVars = `// --- Cálculo Dinámico idéntico a la UI de Fase 10 ---
  const cfTotal = capitalOperacion.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  const cvGlobal = capitalOperacion.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  
  const totalProdMensual = (pDT[10]?.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
  const fijoPorUnidad = cfTotal / totalProdMensual;
  const variableGlobalPorUnidad = cvGlobal / totalProdMensual;

  const numMeses = parseInt(pDT[10]?.mesesProyeccion) || 6;
  const headerMeses = ["Meses", ...Array.from({ length: numMeses }, (_, i) => \`Mes \${i + 1}\`)];
  
  const rowUnidades = ["N° de unidades vendidas (Total)"];
  const rowPrecio = ["Precio Promedio (Bs.)"];
  const rowIngresos = ["Ingresos (Bs.)"];
  
  const rowCostosFijos = ["Costos Fijos (Bs.)"];
  const rowCostosVariables = ["Costos Variables (Bs.)"];
  const rowGastoTotal = ["Gasto Total (Bs.)"];

  const rowUtilidadBruta = ["Utilidad Bruta (Bs.)"];
  const rowImpuestos = ["Impuestos (IVA 13% + IT 3%)"];
  const rowUtilidadNeta = ["Utilidad Neta (Bs.)"];

  const flujos = [];
  
  for (let m = 1; m <= numMeses; m++) {
    const multiplicador = 1; // FLAT DEMAND
    
    let ingresosTotalesMes = 0;
    let gastosVarsMes = 0;
    let unidadesTotalesMes = 0;

    (pDT[10]?.productos || []).forEach(prod => {
      const prodBase = parseFloat(prod.produccionMensual) || 0;
      const unidades = Math.round(prodBase * multiplicador);
      unidadesTotalesMes += unidades;

      const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
      const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
      const costoUnitarioTotal = cvUnitario + fijoPorUnidad;

      const margen = parseFloat(prod.margenGanancia ?? pDT[10]?.porcentajeGanancia ?? 30);
      const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
      const precioFacturado = precioSinFactura / 0.84;

      ingresosTotalesMes += (unidades * precioFacturado);
      gastosVarsMes += (unidades * cvUnitario);
    });
    
    const gastosTotales = cfTotal + gastosVarsMes;
    const uBruta = ingresosTotalesMes - gastosTotales;
    const impuestos = ingresosTotalesMes * 0.16; // IVA 13% + IT 3%
    const uNeta = uBruta - impuestos;
    
    flujos.push(uNeta);
    
    const precioPromedio = unidadesTotalesMes > 0 ? (ingresosTotalesMes / unidadesTotalesMes) : 0;

    rowUnidades.push(String(unidadesTotalesMes));
    rowPrecio.push(formatCurrency(precioPromedio));
    rowIngresos.push(formatCurrency(ingresosTotalesMes));
    
    rowCostosFijos.push(formatCurrency(cfTotal));
    rowCostosVariables.push(formatCurrency(gastosVarsMes));
    rowGastoTotal.push(formatCurrency(gastosTotales));
    
    rowUtilidadBruta.push(formatCurrency(uBruta));
    rowImpuestos.push(formatCurrency(impuestos));
    rowUtilidadNeta.push(formatCurrency(uNeta));
  }
  
  // Punto de equilibrio Multi-producto (En valor monetario)
  let margenContribucionPonderado = 0;
  let puntoEquilibrioBs = 0;
  // Use first month as baseline
  const baselineIngresos = parseFloat(rowIngresos[1].replace('Bs. ', '')) || 0;
  const baselineVars = parseFloat(rowCostosVariables[1].replace('Bs. ', '')) || 0;
  
  if (baselineIngresos > 0) {
    margenContribucionPonderado = (baselineIngresos - baselineVars) / baselineIngresos;
  }
  if (margenContribucionPonderado > 0) {
    puntoEquilibrioBs = cfTotal / margenContribucionPonderado;
  }

  // VAN y TIR
  const totalInversion = capitalInversion.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  const inversionInicial = totalInversion;
  const tasaTMAR = parseFloat(pDT[10]?.tasaDescuento) || 13;
  const tasaDescuentoMensual = tasaTMAR / 100;
  
  let van = -inversionInicial;
  flujos.forEach((flujo, index) => {
    van += flujo / Math.pow(1 + tasaDescuentoMensual, index + 1);
  });
  
  let tir_mensual = 0;
  if (inversionInicial > 0 && flujos.some(f => f > 0)) {
    let low = -0.5;
    let high = 1.0;
    for (let i = 0; i < 100; i++) {
      let mid = (low + high) / 2;
      let npv = -inversionInicial;
      flujos.forEach((flujo, index) => {
        npv += flujo / Math.pow(1 + mid, index + 1);
      });
      if (npv > 0) low = mid;
      else high = mid;
    }
    tir_mensual = low * 100;
  }

  `;

if (contentDocx.match(regexDocxVars)) {
  contentDocx = contentDocx.replace(regexDocxVars, replacementDocxVars);
}

const regexPuntoEq = /createParagraph\(\`Unidades a vender por mes para no perder dinero: \$\{puntoEquilibrio\} unidades\.\`\),/;
const replacementPuntoEq = `createParagraph(\`Punto de Equilibrio (Ventas mensuales requeridas): \${formatCurrency(puntoEquilibrioBs)}.\`),`;

if (contentDocx.match(regexPuntoEq)) {
  contentDocx = contentDocx.replace(regexPuntoEq, replacementPuntoEq);
}

fs.writeFileSync(fileDocx, contentDocx, 'utf8');

console.log('Success');
