const fs = require('fs');

const fileDocx = 'd:/estudiante/plataforma-gamificada/src/lib/docxGenerator.js';
let contentDocx = fs.readFileSync(fileDocx, 'utf8');

const regexCvTotal = /cvTotal/g;

if (contentDocx.match(regexCvTotal)) {
  contentDocx = contentDocx.replace(regexCvTotal, 'cvGlobal');
  fs.writeFileSync(fileDocx, contentDocx, 'utf8');
  console.log("cvTotal replaced with cvGlobal in docxGenerator.js");
} else {
  console.log("Could not find cvTotal");
}
