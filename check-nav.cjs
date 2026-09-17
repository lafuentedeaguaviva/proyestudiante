const fs = require('fs');
const path = require('path');
const dir = 'd:/estudiante/plataforma-gamificada/src/pages';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Fase') && f.endsWith('.jsx'));

for (let file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const match = content.match(/navigate\(['"`]\/fase\/(\d+)['"`]\)/g);
  if (match) {
    console.log(`${file} contains direct navigation:`, match);
  }
}
