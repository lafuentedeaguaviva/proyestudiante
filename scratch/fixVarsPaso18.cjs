const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the block we injected previously and append totalInversion
const anchor = `    const utilidadMensual = ingresos - egresos;`;
const newCode = `    const utilidadMensual = ingresos - egresos;
    
    const totalInversion = data?.inversiones?.filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;`;

if (content.includes(anchor) && !content.includes('const totalInversion = data')) {
  content = content.replace(anchor, newCode);
  fs.writeFileSync(filePath, content);
  console.log('Added totalInversion to global financial metrics');
} else {
  console.log('Could not find anchor or already injected');
}
