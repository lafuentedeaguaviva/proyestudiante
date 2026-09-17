const fs = require('fs');
let content = fs.readFileSync('Fase6_Distribucion.jsx', 'utf8');

// 1. Rename Component and fase title
content = content.replace(/Fase5_EstrategiaMarketing/g, 'Fase6_Distribucion');
content = content.replace(/Fase 5: La Estrategia de Marketing/g, 'Fase 6: Distribución');
content = content.replace(/Fase 5/g, 'Fase 6');

// 2. Fix state
content = content.replace(/competencia: \[\s*\{\s*id: 1, nombre: '', vende: '', precio: '', fortalezas: '', debilidades: ''\s*\}\s*\],\s*\/\/ Paso 4: Soluciones actuales\s*soluciones: \[\s*\{\s*id: 'casa', alternativa: 'Hacerlo en casa \/ Manualmente', porque: '', frustracion: ''\s*\},\s*\{\s*id: 'nada', alternativa: 'No comprar \/ Abstenerse', porque: '', frustracion: ''\s*\},\s*\{\s*id: 'sustituto', alternativa: 'Producto sustituto', porque: '', frustracion: ''\s*\},\s*\{\s*id: 'indirecto', alternativa: 'Competidores indirectos', porque: '', frustracion: ''\s*\}\s*\],\s*\/\/ Paso 6: Ventaja competitiva\s*ventajaProblema: '',\s*ventajaDiferente: '',\s*ventajaFrase: '',\s*ventajaCopian: '',\s*ventajaSostenibilidad: '',\s*\/\/ Paso 8: PESTEL\s*pestelPolitico: '', pestelEconomico: '', pestelSocial: '', pestelTecnologico: '', pestelAmbiental: '',\s*\/\/ Paso 10: Estrategia de Promocion\s*promoCanales: \[\],\s*promoOtroCanal: '',\s*promoMensaje: '',/g, '');

content = content.replace(/estrategia_marketing/g, 'distribucion');
content = content.replace(/obtenerContenidoFaseCompleto\(5\)/g, 'obtenerContenidoFaseCompleto(6)');
content = content.replace(/guardarContenidoFase\(5,/g, 'guardarContenidoFase(6,');
content = content.replace(/guardarContenidoFase\(6, 'paso_actual', 1\)/g, 'guardarContenidoFase(7, \'paso_actual\', 1)');
content = content.replace(/navigate\('\/fase\/6'\)/g, 'navigate(\'/fase/7\')');
content = content.replace(/if \(nPaso > 20\)/g, 'if (nPaso > 10)');
content = content.replace(/totalPasos=\{20\}/g, 'totalPasos={10}');

// 3. Shift tabs
const tabsMatch = content.match(/tabs=\{\[\s*(.*?)\s*\]\}/s);
if (tabsMatch) {
    let tabs = tabsMatch[1];
    let newTabs = tabs.split(/,\s*(?=\{ id:)/).filter(t => t.match(/id: (11|12|13|14|15|16|17|18|19|20)/)).join(',\n        ');
    for(let i=11; i<=20; i++) {
        newTabs = newTabs.replace(new RegExp('id: ' + i, 'g'), 'id: ' + (i-10));
    }
    content = content.replace(/tabs=\{\[\s*.*?\s*\]\}/s, 'tabs={[\\n        ' + newTabs + '\\n      ]}');
}

// 4. Shift switch cases
const pasoContentStart = content.indexOf('const getPasoContent');
const pasoContentEnd = content.indexOf('return (', pasoContentStart);
let block = content.substring(pasoContentStart, pasoContentEnd);

block = block.replace(/case 1:.*?case 11:/s, 'case 11:');

for (let i = 11; i <= 20; i++) {
    const regex = new RegExp('case ' + i + ':', 'g');
    block = block.replace(regex, 'case ' + (i - 10) + ':');
}
// replace "step + 1" for video step properly? Actually renderVideoStep uses step + 1, so it automatically shifts.

content = content.substring(0, pasoContentStart) + block + content.substring(pasoContentEnd);

fs.writeFileSync('Fase6_Distribucion.jsx', content);
