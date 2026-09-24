const fs = require('fs');

const fileFase10 = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(fileFase10, 'utf8');

const regexUpdate = /updateGlobalData\(\{[\s\S]*?inversiones: res\.inversiones \|\| data\.inversiones \|\| \[\],[\s\S]*?productos: res\.productos \|\| data\.productos \|\| \[\],[\s\S]*?tasaDescuento: 13[\s\S]*?\}\);/g;

const replacement = `let mergedProductos = data.productos || [];
        if (res.productos && res.productos.length > 0) {
          mergedProductos = (data.productos || []).map(prod => {
            const aiProd = res.productos.find(p => p.nombre?.toLowerCase() === prod.nombre?.toLowerCase() || p.id === prod.id);
            if (aiProd) {
              return {
                ...prod,
                produccionMensual: aiProd.produccionMensual ?? prod.produccionMensual,
                margenGanancia: aiProd.margenGanancia ?? prod.margenGanancia,
                ingredientes: aiProd.ingredientes || prod.ingredientes || []
              };
            }
            return prod;
          });

          // Add any new products the AI invented
          const newProducts = res.productos.filter(aiProd => 
            !(data.productos || []).some(p => p.nombre?.toLowerCase() === aiProd.nombre?.toLowerCase() || p.id === aiProd.id)
          );
          mergedProductos = [...mergedProductos, ...newProducts];
        }

        updateGlobalData({
          ...data,
          inversiones: res.inversiones || data.inversiones || [],
          productos: mergedProductos,
          tasaDescuento: 13
        });`;

if (content.match(regexUpdate)) {
  content = content.replace(regexUpdate, replacement);
  
  // ALso update line 151 where it sends `i.nombre` to AI, it should be `i.concepto`
  const regexPrompt = /\(p\.ingredientes \|\| \[\]\)\.map\(i => \`\$\{i\.nombre\} \(Bs\.\$\{i\.monto\}\)\`\)/g;
  content = content.replace(regexPrompt, "(p.ingredientes || []).map(i => `${i.concepto || i.nombre} (Bs.${i.monto})`)");
  
  fs.writeFileSync(fileFase10, content, 'utf8');
  console.log("Fase10 updated to merge AI products and use concepto in prompt.");
} else {
  console.log("Could not find regex in Fase10");
}
