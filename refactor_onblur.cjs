const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('Fase') && f.endsWith('.jsx'));

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Change debounce from 4000 to 500
  if (content.includes('}, 4000);')) {
    content = content.replace(/}, 4000\);/g, '}, 500);');
    changed = true;
  }

  // 2. Remove setPendingSave(true); from updateGlobalData
  const updateGlobalDataRegex = /(const updateGlobalData = \(newData\) => \{\s*setGlobalData\(prev => \(\{ \.\.\.prev, \.\.\.newData \}\)\);\s*)setPendingSave\(true\);/g;
  if (updateGlobalDataRegex.test(content)) {
    content = content.replace(updateGlobalDataRegex, '$1');
    changed = true;
  }

  // 3. Add onBlur to the main wrapper div
  // The common pattern is: <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
  // We want to make sure we don't add it multiple times.
  const divRegex = /(<div\s*)(style=\{\{\s*background:\s*'white',\s*borderRadius:\s*'1rem',\s*padding:\s*'1rem')/g;
  if (divRegex.test(content) && !content.includes('onBlur={() => setPendingSave(true)}')) {
    content = content.replace(divRegex, '$1onBlur={() => setPendingSave(true)} $2');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
    updatedCount++;
  }
}

console.log(`Total files updated: ${updatedCount}`);
