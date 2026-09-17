const fs = require('fs');
let content = fs.readFileSync('d:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx', 'utf8');

const missingChunk = `            currentData.inversiones = currentData.inversiones.map(inv => {
              if (inv.tipo === 'fijo') {
                migrated = true;
                return { ...inv, tipo: 'infraestructura' };
              }
              if (inv.tipo === 'capitalTrabajo') {
                migrated = true;
                if (inv.concepto.toLowerCase().includes('sueldo') || inv.concepto.toLowerCase().includes('honorario')) {
                  return { ...inv, tipo: 'personal' };
                } else {
                  return { ...inv, tipo: 'materiales' };
                }
              }
              return inv;
            });
            if (migrated) setPendingSave(true);
          }
          
          const savedStep = parseInt(parsedFinanciero.paso_actual, 10);
          if (savedStep && !searchParams.get('paso')) {
            setSearchParams({ paso: savedStep });
            setStep(savedStep);
          }
        } else {
          // Fallback: Si no hay datos, al menos guardar que llegamos a la fase 10
          await guardarContenidoFase(10, 'paso_actual', searchParams.get('paso') ? parseInt(searchParams.get('paso')) : 1).catch(e => console.error(e));
        }

        if (guardadoF8 && guardadoF8.estructura) {
           const parsedF8 = typeof guardadoF8.estructura === 'string' ? JSON.parse(guardadoF8.estructura) : guardadoF8.estructura;
           if (parsedF8.roles && parsedF8.roles.length > 0) {
             const cargos = parsedF8.roles.map(r => \`Sueldo: \${r.cargo}\`);
             setRolesOrganigrama(cargos);
             setFase8Cargada(true);
             
             let newInversiones = [...(currentData.inversiones || [])];
             let changed = false;`;

content = content.replace(
  '            let migrated = false;\r\n             cargos.forEach((cargo, idx) => {',
  '            let migrated = false;\r\n' + missingChunk + '\r\n             cargos.forEach((cargo, idx) => {'
);
content = content.replace(
  '            let migrated = false;\n             cargos.forEach((cargo, idx) => {',
  '            let migrated = false;\n' + missingChunk + '\n             cargos.forEach((cargo, idx) => {'
);
fs.writeFileSync('d:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx', content);
console.log('Restored chunk');
