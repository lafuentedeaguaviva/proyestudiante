const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase9_Estructura.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Ensure we have robust fallbacks for organigrama and roles in the component
content = content.replace(
  'const nodosConsejo =',
  `
  // Robust fallbacks to prevent crashes
  const safeOrganigrama = Array.isArray(data?.organigrama) ? data.organigrama : (Array.isArray(organigrama) ? organigrama : [{ id: 'ceo', nombre: 'Gerente General', tipo: 'lider', parentId: null }]);
  const safeRoles = Array.isArray(data?.roles) ? data.roles : (Array.isArray(roles) ? roles : []);

  const nodosConsejo =`
);

// Replace all occurrences of (data.organigrama || organigrama) with safeOrganigrama
content = content.replace(/\(data\.organigrama \|\| organigrama\)/g, 'safeOrganigrama');

// Replace all occurrences of (data.roles || roles) with safeRoles
content = content.replace(/\(data\.roles \|\| roles\)/g, 'safeRoles');

fs.writeFileSync(filePath, content);
console.log('Fixed Fase9_Estructura.jsx with safe fallbacks');
