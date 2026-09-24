const fs = require('fs');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the "Costos Mat." tab from the `tabs` array
content = content.replace(/\{ id: 3, icon: <Package size=\{16\} \/>, label: 'Costos Mat\.' \},\s*/, '');

// 2. Adjust tab ids in the tabs array for tabs > 3
const tabsRegex = /\{ id: (\d+),/g;
content = content.replace(tabsRegex, (match, p1) => {
    let id = parseInt(p1);
    if (id > 3) {
        return `{ id: ${id - 1},`;
    }
    return match;
});

// 3. Remove "case 3: return (" and its closing div
// Since case 3 was inserted, it looks like:
// case 3: return (
//   <div className="animate-fade-in w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
// ...
//       );
//       case 4: return (
// Wait, case 4 is "Capital de Trabajo", and it also has a container.
// I will extract the contents of case 3 (the two columns) and case 4, and merge them into a new case 3!

const c3StartIdx = content.indexOf('case 3: return (');
const c4StartIdx = content.indexOf('case 4: return (');
const c5StartIdx = content.indexOf('case 5: return (');

if (c3StartIdx !== -1 && c4StartIdx !== -1 && c5StartIdx !== -1) {
    const case3Str = content.substring(c3StartIdx, c4StartIdx);
    const case4Str = content.substring(c4StartIdx, c5StartIdx);

    // case3Str has the Caja de Herramientas and Materiales table
    // case4Str has the Capital de Trabajo header, Infraestructura, and Personal tables
    
    // In case3Str, replace "Costos de Materiales e Insumos" header with "Capital de Trabajo"
    let newCase3Str = case3Str.replace(
        '<h2 className="text-2xl font-black text-slate-800">Costos de Materiales e Insumos</h2>\n                <p className="text-slate-500 font-medium">Determina el costo unitario por producto o servicio.</p>',
        '<h2 className="text-2xl font-black text-slate-800">Capital de Trabajo</h2>\n                <p className="text-slate-500 font-medium">Gastos operativos mensuales (Materiales, Infraestructura y Personal).</p>'
    );

    // Now, insert the Infraestructura and Personal tables from case4Str into newCase3Str
    // case4Str has a <div className="grid grid-cols-1 gap-6"> ... </div> containing them
    // It starts after `Total Mensual de Materiales e Insumos`
    const gridMatch = case4Str.match(/<div className="grid grid-cols-1 gap-6">[\s\S]*?<\/div>\s*<\/div>\s*\);\s*$/);
    if (gridMatch) {
        // Insert the grid right before the closing </div></div>); of newCase3Str
        newCase3Str = newCase3Str.replace(/<\/div>\s*<\/div>\s*\);\s*$/, `\n              ${gridMatch[0]}\n            </div>\n          </div>\n        );\n`);
    }

    // Replace old case 3 and case 4 with new case 3
    content = content.substring(0, c3StartIdx) + newCase3Str + content.substring(c5StartIdx);
}

// 4. Renumber all cases
let count = 1;
content = content.replace(/case \d+:/g, () => `case ${count++}:`);

// 5. Update totalPasos to 18
content = content.replace(/totalPasos=\{19\}/g, 'totalPasos={18}');

fs.writeFileSync(file, content);
console.log('Restored Capital de Trabajo and removed Costos Mat.');
