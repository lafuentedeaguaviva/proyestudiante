const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Fase9_Estructura.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// I will just wrap the rendering in a try catch manually inside Fase9_Estructura.jsx.
// But it's easier to find the top of the component and the bottom.
const matchStart = content.indexOf('const Fase9_Estructura = () => {');
if (matchStart === -1) {
  console.log("Could not find start");
  process.exit(1);
}

const matchEnd = content.lastIndexOf('export default Fase9_Estructura;');

const startOfBody = content.indexOf('{', matchStart) + 1;
const endOfBody = content.lastIndexOf('}', matchEnd) - 1;

const body = content.substring(startOfBody, endOfBody);

const newBody = `
  try {
    ${body}
  } catch (err) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error in Fase9</h2>
        <pre>{err.message}</pre>
        <pre>{err.stack}</pre>
      </div>
    );
  }
`;

const newContent = content.substring(0, startOfBody) + newBody + content.substring(endOfBody);
fs.writeFileSync(filePath, newContent);
console.log('Wrapped Fase9_Estructura in try...catch');
