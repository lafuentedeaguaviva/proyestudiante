const fs = require('fs');

const path = 'src/pages/Fase9_Estructura.jsx';
let code = fs.readFileSync(path, 'utf8');

// There are three "case 4: return (" 
// Let's replace the first one with "case 2:"
code = code.replace(/case 4: return \(/, "case 2: return (");

// Now the second one will be the first "case 4: return (" found by replace
code = code.replace(/case 4: return \(/, "case 3: return (");

fs.writeFileSync(path, code);

console.log("Fase 9 Fixed");
