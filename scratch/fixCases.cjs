const fs = require('fs');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(file, 'utf8');

// The regex will match from `case 4:` to right before `case 5:`
const regexCase4 = /case 4: return \([\s\S]*?(?=case 5: return)/;

if (content.match(regexCase4)) {
    content = content.replace(regexCase4, '');
    console.log("Deleted old case 4.");
} else {
    console.log("Old case 4 not found.");
}

// Now re-number all cases from 1
const regexCases = /case \d+:/g;
let count = 1;
content = content.replace(regexCases, (match) => {
    return `case ${count++}:`;
});

fs.writeFileSync(file, content);
console.log("Renumbered cases up to", count - 1);
