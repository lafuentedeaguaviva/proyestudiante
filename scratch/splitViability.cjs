const fs = require('fs');

// 1. Update Fase13_DocumentoIA.jsx
const fileFase13 = 'd:/estudiante/plataforma-gamificada/src/pages/Fase13_DocumentoIA.jsx';
let contentFase13 = fs.readFileSync(fileFase13, 'utf8');

const regexResultadosF13 = /const resultadosText = \([\s\S]*?mejorados\['resultados'\] = resultadosText;/;
const replacementResultadosF13 = `const v = datosTotales[11]?.viabilidad || {};
        mejorados['viabilidad_comercial'] = v.viabilidadComercial || '';
        mejorados['viabilidad_tecnica'] = v.viabilidadTecnica || '';
        mejorados['viabilidad_legal'] = v.viabilidadLegal || '';`;

if (contentFase13.match(regexResultadosF13)) {
  contentFase13 = contentFase13.replace(regexResultadosF13, replacementResultadosF13);
}

// Now replace the addOrPushIA for resultados
const regexAddResultados = /addOrPushIA\('resultados',\s*'',\s*'Resumen de resultados.*?\);/i;
// wait, where is addOrPushIA('resultados',...) in Fase13?
// Let's check where it is. If it's not there, maybe it's just 'mejorados'.
// Let me just regex replace anything that looks like addOrPushIA('resultados',...);
// Actually, let's write a script that does it safely.
