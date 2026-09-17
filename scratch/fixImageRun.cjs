const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/docxGenerator.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace new ImageRun({ data: base64ToUint8Array(X), transformation: { width: Y, height: Z } })
// with new ImageRun({ type: "png", data: base64ToUint8Array(X), transformation: { width: Y, height: Z } })

content = content.replace(/new ImageRun\(\{\s*data: base64ToUint8Array/g, 'new ImageRun({ type: "png", data: base64ToUint8Array');

fs.writeFileSync(filePath, content);
console.log('Added type: "png" to ImageRun calls');
