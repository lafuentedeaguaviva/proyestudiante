const fs = require('fs');
const path = require('path');
const dir = 'd:/estudiante/plataforma-gamificada/src/pages';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Fase') && f.endsWith('.jsx'));

for (let file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // We want to replace navigate('/fase/X') with navigate('/fase/X/intro')
  // EXCEPTION: If the file is navigating to its own phase (like Fase5_Onboarding navigating to Fase 5), it might be correct to skip the intro. But usually, they want the intro for the NEXT phase.
  // Actually, let's just blindly replace all navigate('/fase/X') with navigate('/fase/X/intro')
  // We match navigate('/fase/123') but NOT navigate('/fase/123/intro')
  
  let modified = false;
  content = content.replace(/navigate\(['"`]\/fase\/(\d+)['"`]\)/g, (match, p1) => {
    modified = true;
    return `navigate('/fase/${p1}/intro')`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
