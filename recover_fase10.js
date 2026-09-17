import fs from 'fs';

const logPath = 'C:/Users/lafue/.gemini/antigravity-ide/brain/99fdab54-c13b-43c8-b432-b23fa928ca7f/.system_generated/logs/transcript.jsonl';
const logs = fs.readFileSync(logPath, 'utf-8').split('\n').filter(l => l.trim().length > 0).map(l => JSON.parse(l));

let extractedLines = {};

for (const step of logs) {
    if (step.type === 'VIEW_FILE' || step.type === 'TOOL_RESPONSE') {
        if (step.content && step.content.includes('Fase10_PlanFinanciero.jsx')) {
            const lines = step.content.split('\n');
            for (let i=0; i<lines.length; i++) {
                const match = lines[i].match(/^(\d+):\s(.*)$/);
                if (match) {
                    extractedLines[match[1]] = match[2];
                }
            }
        }
    }
}

let highestLine = 0;
for (const lineNum in extractedLines) {
    highestLine = Math.max(highestLine, parseInt(lineNum));
}

console.log(`Extracted ${Object.keys(extractedLines).length} lines. Highest line: ${highestLine}`);

let missing = [];
for (let i = 1; i <= highestLine; i++) {
    if (!extractedLines[i]) missing.push(i);
}

console.log(`Missing ${missing.length} lines.`);
if (missing.length > 0) {
    console.log(`E.g. ${missing.slice(0, 20).join(', ')}...`);
}

// Dump what we have to a JSON for inspection
fs.writeFileSync('d:/estudiante/plataforma-gamificada/recovered_lines.json', JSON.stringify(extractedLines, null, 2));

