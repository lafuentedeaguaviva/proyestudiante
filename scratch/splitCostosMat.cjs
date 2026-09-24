const fs = require('fs');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update UNIDADES_MEDIDA
content = content.replace(
    /const UNIDADES_MEDIDA = \[\s*([\s\S]*?)\];/,
    "const UNIDADES_MEDIDA = [\n  'Kg', 'Gramos', 'Litros', 'Mililitros', \n  'Metros', 'Centímetros', 'Unidades', 'Piezas', 'Pzas', 'Vaso', 'Cucharilla', \n  'Horas', 'Servicios', 'Licencias', 'Cajas', 'Otro'\n];"
);

// 2. Add 'Costos Mat.' tab to the tabs array
// It should go after Cap. Inversión
const tabsMatch = content.match(/\{ id: 2, icon: <Wallet size=\{16\} \/>, label: 'Cap\. Inversión' \},/);
if (tabsMatch) {
    // First, shift IDs for everything after id 2
    let tabsAreaStart = content.indexOf('tabs={[');
    let tabsAreaEnd = content.indexOf(']}', tabsAreaStart);
    let tabsArea = content.substring(tabsAreaStart, tabsAreaEnd);
    
    // Reverse replacement to avoid overwriting (e.g. 18 to 19, then 17 to 18)
    for (let i = 20; i >= 3; i--) {
        tabsArea = tabsArea.replace(new RegExp(`\\{ id: ${i},`, 'g'), `{ id: ${i + 1},`);
    }
    
    // Now add id 3
    tabsArea = tabsArea.replace(
        /\{ id: 2, icon: <Wallet size=\{16\} \/>, label: 'Cap\. Inversión' \},/,
        `{ id: 2, icon: <Wallet size={16} />, label: 'Cap. Inversión' },\n        { id: 3, icon: <Package size={16} />, label: 'Costos Mat.' },`
    );
    
    content = content.substring(0, tabsAreaStart) + tabsArea + content.substring(tabsAreaEnd);
}

// 3. Extract the contents of case 3 and split it into case 3 and case 4
const c3StartIdx = content.indexOf('case 3: return (');
const c4StartIdx = content.indexOf('case 4: return (');

if (c3StartIdx !== -1 && c4StartIdx !== -1) {
    const case3Str = content.substring(c3StartIdx, c4StartIdx);
    
    // We need to split case3Str into Materiales (for case 3) and Capital de Trabajo (for case 4).
    // The current case3Str has:
    // <div className="animate-fade-in w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
    //   <div className="lg:w-1/3 ..."> (Caja de Herramientas) </div>
    //   <div className="lg:w-2/3 ...">
    //      <h2 ...>Capital de Trabajo</h2>
    //      ... production input ...
    //      <!-- TABLA 1: MATERIALES -->
    //      <div className="flex flex-col gap-6"> ... </div>
    //      <!-- TABLA 2: INFRAESTRUCTURA -->
    //      ... grid ...
    
    // Let's just regenerate them manually to ensure they are perfect.
    // I will extract the material table part.
    const prodInputMatch = case3Str.match(/<div className="flex justify-end mb-6">[\s\S]*?<\/div>\s*<\/div>\s*<div className="flex flex-col gap-6">/);
    const tabla1Match = case3Str.match(/<div>\s*<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-slate-200 pb-2 gap-4">[\s\S]*?Total Global: Costo Mensual de Materiales e Insumos[\s\S]*?<\/div>\s*<\/div>/);
    const tabla23Match = case3Str.match(/<div className="grid grid-cols-1 gap-6">[\s\S]*?<\/div>\s*<\/div>\s*\);\s*$/);
    const toolboxMatch = case3Str.match(/<div className="lg:w-1\/3 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">[\s\S]*?<\/div>\s*<\/div>\s*<div className="lg:w-2\/3 bg-white p-6 rounded-3xl shadow-xl">/);
    
    if (prodInputMatch && tabla1Match && tabla23Match && toolboxMatch) {
        // Build NEW Case 3 (Costos Mat.)
        // Just the materials table, no toolbox (full width)
        let newCase3 = `case 3: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Costos de Materiales e Insumos</h2>
              <p className="text-slate-500 font-medium">Aclara qué es lo necesario por producto (determina el costo unitario por producto o servicio).</p>
            </div>
          </div>

          ${prodInputMatch[0].replace('<div className="flex justify-end mb-6">', '<div className="flex justify-end mb-6">')}
            ${tabla1Match[0]}
          </div>
        </div>
      );\n      `;

        // Build NEW Case 4 (Capital de Trabajo)
        // Toolbox + Infraestructura + Personal
        let newCase4 = `case 4: return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">
            ${toolboxMatch[0].substring(toolboxMatch[0].indexOf('<div className="flex items-center gap-2 mb-4">'), toolboxMatch[0].lastIndexOf('</div>\n          <div className="lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl">'))}
          </div>
          <div className="lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Capital de Trabajo</h2>
                <p className="text-slate-500 font-medium">Gastos operativos mensuales (Infraestructura y Personal).</p>
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-xl flex justify-between items-center border border-slate-200 mb-6">
              <span className="font-bold text-slate-700 block">Total Mensual de Materiales e Insumos (Calculado en el Paso anterior):</span>
              <span className="text-2xl font-black text-slate-800">
                Bs. {((data.productos || []).reduce((sum, p) => {
                  const unitCost = (p.ingredientes || []).reduce((acc, ing) => acc + ((parseFloat(ing.cantidad) || 0) * (parseFloat(ing.precio) || 0)), 0);
                  return sum + (unitCost * (parseInt(p.demanda) || 1));
                }, 0)).toFixed(2)}
              </span>
            </div>

            ${tabla23Match[0]}`;

        // Replace case3Str in content
        content = content.substring(0, c3StartIdx) + newCase3 + newCase4 + content.substring(c4StartIdx);
    }
}

// 4. Renumber all cases
let count = 1;
content = content.replace(/case \d+:/g, () => `case ${count++}:`);

// 5. Update totalPasos to 19
content = content.replace(/totalPasos=\{18\}/g, 'totalPasos={19}');

fs.writeFileSync(file, content);
console.log('Split completed!');
