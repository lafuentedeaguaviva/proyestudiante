const fs = require('fs');
let content = fs.readFileSync('src/pages/Fase5_EstrategiaMarketing.jsx', 'utf8');

content = content.replace(/<AnimatePresence mode="wait">/g, '<AnimatePresence>');
content = content.replace(/transition={{ duration: 0.3 }}/g, 'transition={{ duration: 0.15 }}');

fs.writeFileSync('src/pages/Fase5_EstrategiaMarketing.jsx', content);
