const fs = require('fs');
const f = 'src/pages/Fase10_PlanFinanciero.jsx';
let text = fs.readFileSync(f, 'utf8');
text = text.replace('const [cargandoConsejosIA, setCargandoConsejosIA] = useState(false);', "const [cargandoConsejosIA, setCargandoConsejosIA] = useState(false);\n  const [toolboxTargetProd, setToolboxTargetProd] = useState('');");
fs.writeFileSync(f, text, 'utf8');
console.log("Fixed missing state.");
