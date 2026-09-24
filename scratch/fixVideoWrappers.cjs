const fs = require('fs');
const path = require('path');

const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).map(f => path.join(dir, f));

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes("flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem'")) {
    const original = "<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>";
    const fixed = "<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>";
    code = code.replace(original, fixed);
    fs.writeFileSync(file, code);
    console.log('Fixed ' + file);
  }
}
