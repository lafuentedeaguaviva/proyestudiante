const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/services/api.js');
let content = fs.readFileSync(filePath, 'utf-8');

const targetRegex = /let systemPrompt = "Eres un experto en branding[^;]+;\s+if \(promptTexto\) \{\s+promptTexto = promptTexto.replace\('\{ideaGanadora\}', ideaGanadora\).replace\('\{idea\}', ideaGanadora\);\s+\} else \{\s+promptTexto = `Bas.*?`[^;]+;\s+\}/s;

const replacement = `let systemPrompt = "Eres un experto en branding. Tu tarea es generar nombres para negocios. DEBES basarte ÚNICA Y EXCLUSIVAMENTE en la idea ganadora que se te proporciona. Genera nombres creativos y atractivos estrictamente en ESPAÑOL. Responde ÚNICAMENTE con un array JSON de 3 objetos, donde cada objeto tenga 'nombre' (el nombre creativo y corto) y 'representa' (una breve explicación de por qué es ideal para el negocio).";
    
    if (promptTexto) {
      promptTexto = promptTexto.replace('{ideaGanadora}', ideaGanadora).replace('{idea}', ideaGanadora);
      promptTexto += " IMPORTANTE: Sugiere los nombres en ESPAÑOL.";
    } else {
      promptTexto = \`Basándote ÚNICAMENTE en esta idea ganadora de negocio: "\${ideaGanadora}", genera 3 nombres atractivos y modernos en ESPAÑOL. No uses ninguna otra información externa. Responde solo con el array JSON: [{"nombre": "Nombre1", "representa": "Representa..."}, {"nombre": "Nombre2", "representa": "Representa..."}, {"nombre": "Nombre3", "representa": "Representa..."}].\`;
    }`;

content = content.replace(targetRegex, replacement);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Updated api.js to enforce Spanish names.");
