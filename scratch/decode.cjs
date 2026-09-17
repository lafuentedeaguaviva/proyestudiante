const fs = require('fs');

const content = fs.readFileSync('scratch/original.txt', 'utf-8');
const objStart = content.indexOf('export const generarYDescargarWord');
if (objStart > -1) {
  let str = content.substring(objStart);
  
  let decoded = str.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  
  decoded = decoded.replace(/^\d+:\s/gm, '');
  
  fs.writeFileSync('scratch/original_decoded.js', decoded);
  console.log('Decoded successfully');
}
