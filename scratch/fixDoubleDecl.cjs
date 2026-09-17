const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase9_Estructura.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the duplicated safeOrganigrama block
const blockToReplace = `  // Robust fallbacks to prevent crashes
  const safeOrganigrama = Array.isArray(data?.organigrama) ? data.organigrama : (Array.isArray(organigrama) ? organigrama : [{ id: 'ceo', nombre: 'Gerente General', tipo: 'lider', parentId: null }]);
  const safeRoles = Array.isArray(data?.roles) ? data.roles : (Array.isArray(roles) ? roles : []);

  // Robust fallbacks to prevent crashes
  const safeOrganigrama = Array.isArray(data?.organigrama) ? data.organigrama : (Array.isArray(organigrama) ? organigrama : [{ id: 'ceo', nombre: 'Gerente General', tipo: 'lider', parentId: null }]);
  const safeRoles = Array.isArray(data?.roles) ? data.roles : (Array.isArray(roles) ? roles : []);`;

const replacement = `  // Robust fallbacks to prevent crashes
  const safeOrganigrama = Array.isArray(data?.organigrama) ? data.organigrama : (Array.isArray(organigrama) ? organigrama : [{ id: 'ceo', nombre: 'Gerente General', tipo: 'lider', parentId: null }]);
  const safeRoles = Array.isArray(data?.roles) ? data.roles : (Array.isArray(roles) ? roles : []);`;

content = content.replace(blockToReplace, replacement);

fs.writeFileSync(filePath, content);
console.log('Fixed double declarations in Fase9_Estructura.jsx');
