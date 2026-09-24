const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/components/ui/SidebarFases.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(/'Explicaci[^']* de la Matriz', /g, "");

fs.writeFileSync(filePath, content, 'utf-8');
console.log("SidebarFases updated for Fase 2.");
