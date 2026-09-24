const fs = require('fs');
const path = require('path');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

// SHIFT CASES:
// We need to shift cases from 18 down to 4.
for (let i = 18; i >= 4; i--) {
    const regexCase = new RegExp(`case ${i}:`);
    content = content.replace(regexCase, `case ${i+1}:`);
}

// NOW WE HAVE NO CASE 4, but case 4 has become case 5.
// We need to split case 3 into case 3 and case 4.
const tabla2Marker = '{/* TABLA 2: INFRAESTRUCTURA Y SERVICIOS */}';
const idxTabla2 = content.indexOf(tabla2Marker);

if (idxTabla2 !== -1) {
  const case4Start = `
          </div>
        </div>
      );
      case 4: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Wallet size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Capital de Trabajo</h2>
              <p className="text-slate-500 font-medium">Gastos operativos mensuales (Infraestructura y Personal).</p>
            </div>
          </div>
          
          <div className="bg-slate-100 p-4 rounded-xl flex justify-between items-center border border-slate-200 mb-6">
            <span className="font-bold text-slate-700 block">Total Mensual de Materiales e Insumos (Calculado en el Paso anterior):</span>
            <span className="text-2xl font-black text-slate-800">
              Bs. {((data.productos || []).reduce((sum, p) => {
                const unitCost = (p.ingredientes || []).reduce((acc, ing) => acc + ((parseFloat(ing.cantidad) || 0) * (parseFloat(ing.precio) || 0)), 0);
                return sum + (unitCost * (parseInt(p.demanda) || 1));
              }, 0)).toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
`;
  content = content.replace(tabla2Marker, case4Start + '\n' + tabla2Marker);
}

// Rename titles in step 3
content = content.replace('a. Determinamos los costos de materiales e insumos necesarios (Recetario por Producto)', 'a. Costo de Materiales e Insumos por Producto');
content = content.replace('Recetario / Insumos necesarios', 'Insumos necesarios');
content = content.replace('(Recetario por Producto)', '');

const step3Header = `<h2 className="text-2xl font-black text-slate-800">Capital de Trabajo</h2>`;
const step3NewHeader = `<h2 className="text-2xl font-black text-slate-800">Costos de Materiales e Insumos</h2>`;
const step3Desc = `<p className="text-slate-500 font-medium">Gastos operativos iniciales.</p>`;
const step3NewDesc = `<p className="text-slate-500 font-medium">Determina el costo unitario por producto o servicio.</p>`;

content = content.replace(step3Header, step3NewHeader);
content = content.replace(step3Desc, step3NewDesc);


// FIX TABS
const tabsRegex = /tabs=\{\[\s+([\s\S]*?)\s+\]\}/;
const matchTabs = content.match(tabsRegex);
if (matchTabs) {
  let tabsContent = matchTabs[1];
  
  // shift tab ids from 18 down to 4
  for (let i = 18; i >= 4; i--) {
      tabsContent = tabsContent.replace(`{ id: ${i},`, `{ id: ${i+1},`);
  }
  
  // Replace old tab 3
  tabsContent = tabsContent.replace(`{ id: 3, icon: <Package size={16} />, label: 'Cap. Trabajo' },`, `{ id: 3, icon: <Package size={16} />, label: 'Costos Mat.' },\n        { id: 4, icon: <Wallet size={16} />, label: 'Cap. Trabajo' },`);
  
  content = content.replace(tabsRegex, `tabs={[\n        ${tabsContent}\n      ]}`);
}

// UPDATE totalPasos
content = content.replace(/totalPasos=\{18\}/g, 'totalPasos={19}');
content = content.replace(/step < 18/g, 'step < 19');

// MENTOR TEXT UPDATE (shift mentor logic)
const mentorRegex = /step === (\d+) \?/g;
content = content.replace(mentorRegex, (match, p1) => {
    const num = parseInt(p1);
    if (num >= 4) {
        return `step === ${num + 1} ?`;
    }
    return match;
});

// Add mentor text for step 3 and 4
content = content.replace(`step === 3 ? "Ingresa aquí el capital de trabajo: materia prima, insumos, sueldos y gastos de arranque." :`, 
`step === 3 ? "Ingresa aquí los materiales e insumos necesarios para cada uno de tus productos o servicios." :\n              step === 4 ? "Ingresa aquí la infraestructura, servicios y el personal que necesitas mensualmente." :`);


fs.writeFileSync(file, content);
console.log('Fase10_PlanFinanciero.jsx successfully shifted from 18 to 19 steps.');
