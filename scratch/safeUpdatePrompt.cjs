const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/services/api.js');
let content = fs.readFileSync(filePath, 'utf-8');

const funcIndex = content.indexOf('export const generarNombresDeepSeek');
const nextFuncIndex = content.indexOf('export const generarPitchDeepSeek');

if (funcIndex !== -1 && nextFuncIndex !== -1) {
    let before = content.substring(0, funcIndex);
    let after = content.substring(nextFuncIndex);
    let funcBody = content.substring(funcIndex, nextFuncIndex);
    
    // In funcBody, do simple string replacements
    funcBody = funcBody.replace(
        "Responde",
        "Genera nombres creativos y atractivos estrictamente en ESPAÑOL. Responde"
    );
    
    funcBody = funcBody.replace(
        ".replace('{idea}', ideaGanadora);",
        ".replace('{idea}', ideaGanadora);\n      promptTexto += ' IMPORTANTE: Sugiere los nombres en ESPAÑOL.';"
    );
    
    funcBody = funcBody.replace(
        "genera 3 nombres atractivos y modernos.",
        "genera 3 nombres atractivos y modernos en ESPAÑOL."
    );

    content = before + funcBody + after;
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("api.js securely updated for Spanish names.");
} else {
    console.log("Functions not found.");
}
