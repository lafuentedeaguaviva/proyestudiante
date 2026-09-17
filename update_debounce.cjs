const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

if (!fs.existsSync(pagesDir)) {
  console.error("Directory not found:", pagesDir);
  process.exit(1);
}

const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('Fase') && f.endsWith('.jsx'));
let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We are looking for the debounce setTimeout:
  // }, 1000);
  // We should be careful to only replace it if it's related to the auto-save.
  // The auto-save block usually looks like:
  // const saveTimer = setTimeout(async () => { ... }, 1000);
  // We can use a regex to safely replace 1000 with 4000 inside the auto-save block.
  
  const regex = /(const saveTimer = setTimeout\([^]*?\}, )1000(\);)/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '$14000$2');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
    updatedCount++;
  } else {
    // try a slightly different regex if they named it differently, like `setTimeout` with 1000
    // let's just look for any `setTimeout` that is 1000 and has pendingSave or autoSave around
    const fallbackRegex = /(setTimeout\([^]*?\}, )1000(\);)/g;
    if (fallbackRegex.test(content) && content.includes('guardarContenidoFase')) {
        content = content.replace(fallbackRegex, '$14000$2');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated with fallback ${file}`);
        updatedCount++;
    }
  }
}

console.log(`Total files updated: ${updatedCount}`);
