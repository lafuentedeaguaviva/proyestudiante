const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/docxGenerator.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\["INVERSI[\s\S]*?N TOTAL", formatCurrency\(ttotal\), "100%"\]/g, '["INVERSION TOTAL", formatCurrency(ttotal), "100%"]');

fs.writeFileSync(filePath, content);
console.log('Fixed INVERSION TOTAL typo');
