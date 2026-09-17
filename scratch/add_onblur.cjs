const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('Fase') && f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('setPendingSave') && !content.includes('onBlur={() =>')) {
    // Wrap children of PasoLayout or DetectiveLayout
    content = content.replace(/(<PasoLayout[^>]*>|<DetectiveLayout[^>]*>)([\s\S]*?)(<\/(PasoLayout|DetectiveLayout)>)/, 
      "$1\n      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>\n$2\n      </div>\n$3"
    );
    changed = true;
  }

  // Also verify that AnimatePresence without mode="wait" is killed
  const syncAnimateRegex = /<AnimatePresence>(?![\s\S]*?mode="wait")/g;
  if (syncAnimateRegex.test(content)) {
    content = content.replace(/<AnimatePresence>/g, "<div className=\"animate-presence-removed\">");
    content = content.replace(/<\/AnimatePresence>/g, "</div>");
    content = content.replace(/<motion\.div[^>]*>/g, "<div>");
    content = content.replace(/<\/motion\.div>/g, "</div>");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed onBlur for ${file}`);
  }
});
