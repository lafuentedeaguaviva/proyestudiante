const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/controllers/useDashboardController.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the incorrect user checks
content = content.replace(/\(user\?\.educoins \|\| user\?\.perfil\?\.educoins \|\| 0\)/g, "(perfil?.educoins || 0)");

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Updated useDashboardController variables");
