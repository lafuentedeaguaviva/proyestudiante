import fs from 'fs';

const logPath = 'C:/Users/lafue/.gemini/antigravity-ide/brain/99fdab54-c13b-43c8-b432-b23fa928ca7f/.system_generated/logs/transcript.jsonl';
const text = fs.readFileSync(logPath, 'utf-8');

// Find all matches of "Showing lines "
const regex = /Showing lines \d+ to \d+.*?Fase10/g;
let match;
while ((match = regex.exec(text)) !== null) {
    console.log("Found match at index", match.index);
}

// Just extract any line that looks like "145: code"
const lines = text.split('\n');
let extracted = {};
for (const line of lines) {
    // some lines are json strings containing \n.
    // parse the json first!
    if (line.trim().startsWith('{')) {
        try {
            const obj = JSON.parse(line);
            if (obj.content && obj.content.includes('Fase10_PlanFinanciero.jsx')) {
                const parts = obj.content.split('\n');
                for (const p of parts) {
                    const m = p.match(/^(\d+):\s(.*)$/);
                    if (m) {
                        extracted[m[1]] = m[2];
                    }
                }
            }
            if (obj.tool_calls) {
                // look inside args
                for (const t of obj.tool_calls) {
                    if (t.args && t.args.ReplacementContent) {
                        console.log("Found a replacement content call");
                    }
                }
            }
        } catch(e) {}
    }
}
console.log(`Extracted ${Object.keys(extracted).length} lines total from brute force parsing.`);
