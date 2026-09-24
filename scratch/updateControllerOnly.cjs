const fs = require('fs');

const controllerFile = 'd:/estudiante/plataforma-gamificada/src/controllers/useFase10Controller.js';
let c1 = fs.readFileSync(controllerFile, 'utf8');

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
console.log('Update successful');
