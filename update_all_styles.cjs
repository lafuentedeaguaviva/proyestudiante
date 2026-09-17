const fs = require('fs');
const path = require('path');

function replaceStylesInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // PAGE WRAPPERS
  content = content.replace(/background: '#0f172a', borderRadius: '1rem', padding: '1rem', boxShadow: '0 10px 15px -3px rgba\(0,0,0,0.3\)', border: '1px solid #1e293b'/g, "background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'");
  content = content.replace(/background: '#0f172a', padding: '0.5rem', borderRadius: '1rem', border: '1px solid #334155'/g, "background: 'white', padding: '0.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0'");
  // Dashboard special dark wrapper
  content = content.replace(/background: '#0f172a'/g, "background: '#f8fafc'");

  // COMPONENTS
  content = content.replace(/background: 'rgba\(30, 41, 59, 0.7\)'/g, "background: 'white'");
  content = content.replace(/background: 'rgba\(30, 41, 59, 0.5\)'/g, "background: 'white'");

  // text color
  content = content.replace(/color: 'white'/g, "color: '#0f172a'");
  content = content.replace(/color: '#cbd5e1'/g, "color: '#64748b'");
  content = content.replace(/color: '#94a3b8'/g, "color: '#475569'");

  // Fix tabs conditional text
  content = content.replace(/color: step === t.id \? '#0f172a' : '#64748b'/g, "color: step === t.id ? 'white' : '#64748b'");

  // Fix button text colors for specific backgrounds (reverting the white->0f172a replacement)
  content = content.replace(/background: '([#A-Za-z0-9]+)', color: '#0f172a'/g, (match, p1) => {
    if (p1 === '#3b82f6' || p1 === '#10b981' || p1 === '#ca8a04' || p1 === '#ef4444' || p1 === '#dc2626') {
      return `background: '${p1}', color: 'white'`;
    }
    return match;
  });
  content = content.replace(/color: '#0f172a', border: 'none', background: '([#A-Za-z0-9]+)'/g, (match, p1) => {
    if (p1 === '#3b82f6' || p1 === '#10b981' || p1 === '#ca8a04' || p1 === '#ef4444' || p1 === '#dc2626') {
      return `color: 'white', border: 'none', background: '${p1}'`;
    }
    return match;
  });

  // Specifically fix conditional buttons in Fase 1
  content = content.replace(/background: \(\!area \|\| area === 'Otro'\) \? '#cbd5e1' : '#ca8a04', color: '#0f172a'/g, "background: (!area || area === 'Otro') ? '#cbd5e1' : '#ca8a04', color: 'white'");
  content = content.replace(/background: ideasSeleccionadas.length > 0 \? '#ca8a04' : '#cbd5e1', color: '#0f172a'/g, "background: ideasSeleccionadas.length > 0 ? '#ca8a04' : '#cbd5e1', color: 'white'");
  content = content.replace(/background: guardando \? '#cbd5e1' : '#10b981', color: '#0f172a'/g, "background: guardando ? '#cbd5e1' : '#10b981', color: 'white'");

  // borders
  content = content.replace(/border: '1px solid rgba\(255,255,255,0.1\)'/g, "border: '1px solid #e2e8f0'");
  content = content.replace(/border: '1px solid rgba\(255,255,255,0.05\)'/g, "border: '1px solid #e2e8f0'");
  content = content.replace(/borderBottom: '1px solid rgba\(255,255,255,0.05\)'/g, "borderBottom: '1px solid #e2e8f0'");
  content = content.replace(/border: '1px solid #475569'/g, "border: '1px solid #cbd5e1'");
  content = content.replace(/border: '2px dashed #475569'/g, "border: '2px dashed #cbd5e1'");
  content = content.replace(/border: '1px solid #334155'/g, "border: '1px solid #cbd5e1'");
  content = content.replace(/borderBottom: '1px solid #334155'/g, "borderBottom: '1px solid #cbd5e1'");
  content = content.replace(/border: '1px dashed #334155'/g, "border: '1px dashed #cbd5e1'");

  // inputs background
  content = content.replace(/background: '#1e293b'/g, "background: '#f8fafc'");

  // specific accents
  content = content.replace(/color: '#facc15'/g, "color: '#ca8a04'");
  content = content.replace(/color: '#34d399'/g, "color: '#059669'");

  // shadows
  content = content.replace(/boxShadow: '0 4px 6px -1px rgba\(0,0,0,0.5\)'/g, "boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function processDir(dir) {
  let changed = 0;
  if (!fs.existsSync(dir)) return 0;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      changed += processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      if (replaceStylesInFile(fullPath)) {
        changed++;
        console.log("Updated: " + fullPath);
      }
    }
  }
  return changed;
}

const pagesChanged = processDir('d:/estudiante/plataforma-gamificada/src/pages/');
const compsChanged = processDir('d:/estudiante/plataforma-gamificada/src/components/fases/');

console.log(`Total files updated: ${pagesChanged + compsChanged}`);
