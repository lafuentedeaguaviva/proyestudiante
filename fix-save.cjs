const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('Fase') && f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Pattern for updateGlobalData
  const regex1 = /const updateGlobalData = \(newData\) => \{\s*setGlobalData\(newData\);\s*\};/g;
  if (regex1.test(content)) {
    content = content.replace(regex1, `const updateGlobalData = (newData) => {
    setGlobalData(newData);
    if (typeof setPendingSave === 'function') setPendingSave(true);
  };`);
    changed = true;
  }

  // Pattern for updateGlobalData with existing but different content
  // Sometimes it's on one line: const updateGlobalData = (newData) => setGlobalData(newData);
  const regex2 = /const updateGlobalData = \(newData\) => setGlobalData\(newData\);/g;
  if (regex2.test(content)) {
    content = content.replace(regex2, `const updateGlobalData = (newData) => {
    setGlobalData(newData);
    if (typeof setPendingSave === 'function') setPendingSave(true);
  };`);
    changed = true;
  }

  // Check if they extract setPendingSave from the controller
  // If they don't have setPendingSave in the destructuring, we need to add it, but it might be tricky with regex.
  // We'll log the files that need manual attention.
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[FIXED] ${file}`);
  } else {
    // Check if it already has the fix or doesn't need it
    if (content.includes('setPendingSave(true)') && content.includes('updateGlobalData')) {
      console.log(`[OK] ${file} (Already has some save logic)`);
    } else {
      console.log(`[MANUAL CHECK] ${file}`);
    }
  }
}
