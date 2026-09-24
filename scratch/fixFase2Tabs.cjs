const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/pages/Fase2_ValidacionIdea.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add import for SubMenuFases
if (!content.includes('SubMenuFases')) {
  content = content.replace(
    "import SidebarFases from '../components/ui/SidebarFases';",
    "import SidebarFases from '../components/ui/SidebarFases';\nimport SubMenuFases from '../components/ui/SubMenuFases';"
  );
}

// 2. Replace manual tabs mapping
const regexTarget = /<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', background: 'white',[\s\S]*?<\/div>/;
const replacement = `<SubMenuFases tabs={tabs} currentStep={step} onTabClick={(id) => irAPaso(id)} maxStep={7} />`;

if (regexTarget.test(content)) {
  content = content.replace(regexTarget, replacement);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Successfully replaced tabs with SubMenuFases in Fase2.");
} else {
  console.log("Regex did not match.");
}
