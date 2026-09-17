const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase9_Estructura.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The safeOrganigrama appears twice, one right after another, maybe with a comment.
// Let's just remove the first instance of it.
content = content.replace(/const safeOrganigrama = Array\.isArray\(data\?\.organigrama\) \? data\.organigrama : \(Array\.isArray\(organigrama\) \? organigrama : \[\{ id: 'ceo', nombre: 'Gerente General', tipo: 'lider', parentId: null \}\]\);\s*/, '');
content = content.replace(/const safeRoles = Array\.isArray\(data\?\.roles\) \? data\.roles : \(Array\.isArray\(roles\) \? roles : \[\]\);\s*/, '');

fs.writeFileSync(filePath, content);
console.log('Removed one duplicate declaration');
