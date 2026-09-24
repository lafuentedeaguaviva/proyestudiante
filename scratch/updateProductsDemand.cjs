const fs = require('fs');

const controllerFile = 'd:/estudiante/plataforma-gamificada/src/controllers/useFase10Controller.js';
let c1 = fs.readFileSync(controllerFile, 'utf8');

// The `f4` variable is inside the `if (!dPot) { try { const f4 = await FaseModel.obtenerDatosFase(4); ...`
// But we want `f4` accessible to load products. Let's just load it explicitly at the end of the `try` block.
const injectProductsLogic = `
          const f4Products = await FaseModel.obtenerDatosFase(4);
          if (f4Products && f4Products.listaProductos && f4Products.listaProductos.length > 0 && (!data.productos || data.productos.length === 0)) {
            updateData({ 
              productos: f4Products.listaProductos.map(p => ({ 
                id: Date.now() + Math.random(), 
                nombre: p.nombre || p.nomProd || p.tipo || '', 
                ingredientes: [] 
              })) 
            });
          }
`;
c1 = c1.replace('// Fase 9: Organigrama', injectProductsLogic + '\n          // Fase 9: Organigrama');
fs.writeFileSync(controllerFile, c1);


const jsxFile = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let c2 = fs.readFileSync(jsxFile, 'utf8');

// 1. Remove Demanda Mensual input
const demandInputStart = c2.indexOf('<div className="flex items-center gap-2">');
const demandInputEnd = c2.indexOf('</div>', c2.indexOf('<span className="text-sm font-bold text-amber-700">unidades</span>')) + 6;
if (demandInputStart !== -1 && demandInputEnd !== -1) {
    c2 = c2.substring(0, demandInputStart) + c2.substring(demandInputEnd);
}

// 2. Change `prod.demanda` to `demandaPotencialFase4`
// Wait, `demandaPotencialFase4` is exposed by `useFase10Controller`.
// In Fase10_PlanFinanciero, it should be destructured from `controller`.
// `const { ... demandaPotencialFase4 } = controller;`
c2 = c2.replace('const { toolboxCategory, setToolboxCategory, toolboxSubcategory, setToolboxSubcategory, rolesOrganigrama, fase8Cargada, presupuestoFase6, step, irAPaso, siguientePaso, pasoAnterior } = controller;',
                'const { toolboxCategory, setToolboxCategory, toolboxSubcategory, setToolboxSubcategory, rolesOrganigrama, fase8Cargada, presupuestoFase6, step, irAPaso, siguientePaso, pasoAnterior, demandaPotencialFase4 } = controller;');

c2 = c2.replace(/prod\.demanda \|\| 1/g, 'demandaPotencialFase4');
c2 = c2.replace(/parseInt\(p\.demanda\) \|\| 1/g, 'demandaPotencialFase4');
// Also remove `<div className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Demanda Mensual</div>`
const demLabelStr = '<div className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Demanda Mensual</div>';
c2 = c2.replace(demLabelStr, '');

fs.writeFileSync(jsxFile, c2);
console.log('Update successful');
