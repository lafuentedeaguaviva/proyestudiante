const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/components/ui/SidebarFases.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// The original map for 13:
// { id: 13, titulo: 'Documento Final IA', path: '/fase/13', pasos: ['Video', 'Configuracin IA', 'Documento Generado'] }
content = content.replace(/{ id: 13, titulo: 'Documento Final IA', path: '\/fase\/13', pasos: \['Video',/g, "{ id: 13, titulo: 'Documento Final IA', path: '/fase/13', pasos: [");

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Updated SidebarFases.jsx map for Fase 13.");
