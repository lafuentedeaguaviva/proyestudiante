const fs = require('fs');

['5_EstrategiaMarketing', '6_LocalizacionDistribucion', '8_Operacion', '9_Estructura'].forEach(fase => {
  const path = `src/pages/Fase${fase}.jsx`;
  let code = fs.readFileSync(path, 'utf8');
  
  if (!code.includes("import YoutubePlayer from '../components/ui/YoutubePlayer';")) {
    // Insert after "import React"
    code = code.replace(/import React.*?;\n/, match => match + "import YoutubePlayer from '../components/ui/YoutubePlayer';\n");
    fs.writeFileSync(path, code);
    console.log(`Added YoutubePlayer to Fase${fase}`);
  }
});
