const fs = require('fs');
const path = require('path');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\/\/ Financial calculations needed for step 8, 12, 16\.\.\.[\s\S]*?(?=const totalInversion =)/;
const match = content.match(regex);

if (match) {
    const oldCode = match[0];
    const newCode = `// Financial calculations needed for step 8, 12, 16...
    const numProd = parseInt(data?.produccionMensual) || 1;
    
    // Nueva lógica multiproducto global
    const productosParaGlobal = data?.productos || [];
    const totalDemandaGlobal = productosParaGlobal.reduce((sum, p) => sum + (parseInt(p.demanda) || 0), 0) || 1;
    const costosFijosGlobal = (data?.inversiones || []).filter(i => (i.comportamiento || (i.tipo === 'materiales' ? 'variable' : 'fijo')) === 'fijo')
                            .reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
    const cfuGlobal = costosFijosGlobal / totalDemandaGlobal;

    let wacmGlobal = 0;
    let ingresosMensualesGlobal = 0;
    let cvTotalesGlobal = 0;
    let costoUnitarioTotalPonderado = 0;

    productosParaGlobal.forEach(p => {
        const demanda = parseInt(p.demanda) || 0;
        const cvu = (p.ingredientes || []).reduce((acc, ing) => acc + ((parseFloat(ing.cantidad) || 0) * (parseFloat(ing.precio) || 0)), 0);
        const cu = cvu + cfuGlobal;
        const margen = parseFloat(p.porcentajeGanancia !== undefined ? p.porcentajeGanancia : 30);
        const precioSinFactura = margen < 100 ? cu / (1 - (margen / 100)) : cu;
        const precioFacturado = precioSinFactura / 0.84;
        
        const margenContribucionUnitario = precioFacturado - cvu;
        const peso = totalDemandaGlobal > 0 ? (demanda / totalDemandaGlobal) : 0;
        
        wacmGlobal += (margenContribucionUnitario * peso);
        costoUnitarioTotalPonderado += (cu * peso);
        ingresosMensualesGlobal += (precioFacturado * demanda);
        cvTotalesGlobal += (cvu * demanda);
    });

    const precioVentaEfectivo = totalDemandaGlobal > 0 ? (ingresosMensualesGlobal / totalDemandaGlobal) : 0;
    const margenContribucion = wacmGlobal;
    const puntoEquilibrio = wacmGlobal > 0 ? Math.ceil(costosFijosGlobal / wacmGlobal) : 0;
    const ingresos = ingresosMensualesGlobal;
    const egresos = costosFijosGlobal + cvTotalesGlobal;
    const utilidadMensual = ingresos - egresos;
    const costoVariableUnitario = totalDemandaGlobal > 0 ? (cvTotalesGlobal / totalDemandaGlobal) : 0;
    const costoUnitario = costoUnitarioTotalPonderado;

    `;

    content = content.replace(oldCode, newCode);
    fs.writeFileSync(file, content);
    console.log("Updated global financial calculations!");
} else {
    console.log("RegExp didn't match the global variables.");
}
