import fs from 'fs';

const logPath = 'C:/Users/lafue/.gemini/antigravity-ide/brain/99fdab54-c13b-43c8-b432-b23fa928ca7f/.system_generated/logs/transcript.jsonl';
const logs = fs.readFileSync(logPath, 'utf-8').split('\n').filter(l => l.trim().length > 0).map(l => JSON.parse(l));

const toolResp = logs.find(l => l.type === 'ACTION_RESPONSE' || l.type === 'TOOL_RESPONSE' || (l.tool_calls && l.tool_calls.length > 0));
console.log(JSON.stringify(toolResp).substring(0, 500));

const viewFileResp = logs.find(l => JSON.stringify(l).includes('Showing lines '));
if (viewFileResp) {
    console.log("Found view file resp! Keys:", Object.keys(viewFileResp));
    console.log("Snippet:", JSON.stringify(viewFileResp).substring(0, 300));
}
