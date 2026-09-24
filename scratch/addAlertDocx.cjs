const fs = require('fs');

const fileDocx = 'd:/estudiante/plataforma-gamificada/src/lib/docxGenerator.js';
let contentDocx = fs.readFileSync(fileDocx, 'utf8');

const regexCatch = /} catch \(error\) \{\s*console\.error\("Error al generar docx", error\);\s*\}/g;
const replacementCatch = `} catch (error) {
    console.error("Error al generar docx", error);
    alert("Error al generar docx: " + error.message + "\\n" + error.stack);
  }`;

if (contentDocx.match(regexCatch)) {
  contentDocx = contentDocx.replace(regexCatch, replacementCatch);
  fs.writeFileSync(fileDocx, contentDocx, 'utf8');
  console.log("Alert added to catch block.");
} else {
  console.log("Could not find catch block");
}
