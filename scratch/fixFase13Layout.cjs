const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/pages/Fase13_DocumentoIA.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace totalPasos
content = content.replace(/totalPasos={3}/g, 'totalPasos={2}');

// Update onSiguiente
content = content.replace(/onSiguiente={null}/g, 'onSiguiente={step === 1 ? () => setStep(2) : null}');

// Fix weird characters in tabs
content = content.replace(/label: 'Configuraci[^']*'/g, "label: 'Configuración'");

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Updated Fase13_DocumentoIA layout props.");
