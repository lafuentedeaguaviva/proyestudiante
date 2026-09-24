const fs = require('fs');

const f = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(f, 'utf8');

const c3 = fs.readFileSync('d:/estudiante/plataforma-gamificada/scratch/c3.txt', 'utf8');
const c4 = fs.readFileSync('d:/estudiante/plataforma-gamificada/scratch/c4.txt', 'utf8');

// Fix c3 by adding the missing divs
const c3Fixed = c3.replace('      );\n', '      </div>\n    </div>\n      );\n');

// Extract just case 4 from c4.txt
const case4End = c4.indexOf('      case 5: {');
let c4Only = c4;
if (case4End !== -1) {
    c4Only = c4.substring(0, case4End);
}

// Find boundaries in Fase10_PlanFinanciero.jsx
// We need to replace everything from `case 3: return (` up to `case 5: {`
const c3Start = content.indexOf('case 3: return (');
const c5Start = content.indexOf('case 5: {');

if (c3Start !== -1 && c5Start !== -1) {
    const pre = content.substring(0, c3Start);
    const post = content.substring(c5Start);
    
    fs.writeFileSync(f, pre + c3Fixed + c4Only + post);
    console.log('Successfully fixed cases 3 and 4!');
} else {
    console.log('Failed to find boundaries in main file.');
}
