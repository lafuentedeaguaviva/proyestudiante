const fs = require('fs');
let c = fs.readFileSync('src/pages/Fase10_PlanFinanciero.jsx', 'utf8');
if (!c.includes('import YoutubePlayer')) {
    c = c.replace(/import PasoLayout.*?;/m, "import PasoLayout from '../layouts/PasoLayout';\nimport YoutubePlayer from '../components/ui/YoutubePlayer';");
    fs.writeFileSync('src/pages/Fase10_PlanFinanciero.jsx', c);
}
