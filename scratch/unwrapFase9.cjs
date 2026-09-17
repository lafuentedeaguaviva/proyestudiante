const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase9_Estructura.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The try block starts with "try {" and ends with "} catch (err) {"
// I will just remove the try { and the whole catch block.
const tryIndex = content.indexOf('try {');
if (tryIndex !== -1) {
  const tryStart = tryIndex;
  const tryEnd = content.indexOf('{', tryStart) + 1;
  content = content.substring(0, tryStart) + content.substring(tryEnd);
  
  const catchIndex = content.lastIndexOf('} catch (err) {');
  if (catchIndex !== -1) {
    const catchEnd = content.lastIndexOf(');', content.lastIndexOf('}')) + 3; // roughly after the return ();
    const finalBracket = content.lastIndexOf('}', catchEnd) + 1; // the closing bracket of the catch block
    
    // Actually, it's easier to just do a string replace of the exact catch block I injected.
    const catchBlock = `} catch (err) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error in Fase9</h2>
        <pre>{err.message}</pre>
        <pre>{err.stack}</pre>
      </div>
    );
  }`;
    content = content.replace(catchBlock, '');
  }
}

fs.writeFileSync(filePath, content);
console.log('Removed try catch');
