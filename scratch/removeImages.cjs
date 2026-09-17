const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/docxGenerator.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace ImageRun creation with just text for debugging
content = content.replace(/new ImageRun\(\{[^\}]+\}\)/g, 'new TextRun({ text: "[Imagen Generada por IA]", bold: true })');

fs.writeFileSync(filePath, content);
console.log('Removed ImageRun instances from docxGenerator.js');
