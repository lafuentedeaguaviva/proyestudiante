const fs = require('fs');

const f = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(f, 'utf8');

// 1. Remove Infraestructura and Personal from case 3 toolbox
const tbStart = content.indexOf('<button onClick={() => { setToolboxCategory(\'infraestructura\');');
const tbEnd = content.indexOf('</button>', content.indexOf('<button onClick={() => { setToolboxCategory(\'personal\');')) + 9;

if (tbStart !== -1 && tbEnd !== -1) {
    content = content.substring(0, tbStart) + content.substring(tbEnd);
}

// 2. Remove the "Producción o Servicios / mes" input
const prodInputStart = content.indexOf('<div className="flex justify-end mb-6">');
const prodInputEnd = content.indexOf('</div>\n              </div>', prodInputStart) + 28;

if (prodInputStart !== -1 && prodInputEnd !== -1) {
    content = content.substring(0, prodInputStart) + content.substring(prodInputEnd);
}

// 3. Ensure default product is shown. 
// We will replace `(data.productos || []).length === 0 ? (` 
// with `(data.productos && data.productos.length > 0 ? data.productos : [{ id: 'default', nombre: '', demanda: 1, ingredientes: [] }]).length === 0 ? (`
// Actually, no, if it's 0 we want it to render the map! So we just replace `(data.productos || []).map` with `(data.productos?.length ? data.productos : [{ id: 'default', nombre: '', demanda: 1, ingredientes: [] }]).map`
// Wait, the "No tienes productos" state should just be removed!
const emptyStateStart = content.indexOf('{(data.productos || []).length === 0 ? (');
const emptyStateEnd = content.indexOf(') : (\n                    <div className="space-y-6">');

if (emptyStateStart !== -1 && emptyStateEnd !== -1) {
    const afterEmptyState = emptyStateEnd + ') : (\n                    <div className="space-y-6">'.length;
    // Now we need to remove the closing `)}` of the ternary operator.
    // It's after `})} </div>`. Let's just do a manual string replace.
    let newContent = content.substring(0, emptyStateStart);
    newContent += '<div className="space-y-6">\n';
    
    let restOfContent = content.substring(afterEmptyState);
    // Replace `(data.productos || []).map` with `(data.productos?.length ? data.productos : [{ id: 'default', nombre: '', demanda: 1, ingredientes: [] }]).map`
    restOfContent = restOfContent.replace('(data.productos || []).map', '(data.productos?.length ? data.productos : [{ id: Date.now(), nombre: \'\', demanda: 1, ingredientes: [] }]).map');
    
    // Now find the `)}` that closed the ternary operator. It should be right after `<div className="mt-4 bg-slate-100`... no, it's before it!
    restOfContent = restOfContent.replace('                    </div>\n                  )}', '                    </div>');
    
    content = newContent + restOfContent;
}

fs.writeFileSync(f, content);
console.log('Successfully updated Fase10_PlanFinanciero.jsx');
