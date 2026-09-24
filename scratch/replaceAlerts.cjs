const fs = require('fs');
const path = require('path');

const files = [
  'src/controllers/useDashboardController.js',
  'src/components/ui/SidebarFases.jsx',
  'src/layouts/DetectiveLayout.jsx',
  'src/layouts/PasoLayout.jsx',
  'src/services/api.js'
];

files.forEach(file => {
  const p = path.join(__dirname, '..', file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    
    // Replace alert("...") and alert(\`...\`) with window.showCustomAlert
    // Regex matches alert( followed by string or backtick
    content = content.replace(/alert\((["'`].*?["'`])\)/g, 'window.showCustomAlert($1)');
    
    fs.writeFileSync(p, content, 'utf-8');
    console.log("Updated", file);
  }
});
