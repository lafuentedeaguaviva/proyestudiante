const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/docxGenerator.js');
let content = fs.readFileSync(filePath, 'utf8');

// Comment out TableOfContents
content = content.replace(/new TableOfContents\([^)]+\),/g, '/* Removed TOC */');
content = content.replace(/new TableOfContents\([\s\S]*?\}\),/g, '/* Removed TOC */');

fs.writeFileSync(filePath, content);
console.log('Removed TOC');
