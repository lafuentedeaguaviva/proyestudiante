const fs = require('fs');
const path = require('path');

const dir = 'd:/estudiante/plataforma-gamificada/src/components/fases/CaminoA/Fase3/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') && f !== 'Brujula.jsx');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace main container background from dark to light
  content = content.replace(/background: 'rgba\(30, 41, 59, 0.7\)'/g, "background: 'white'");
  
  // Container text color: white -> slate-900 for the main wrapper
  content = content.replace(/color: 'white'/g, "color: '#0f172a'");
  
  // Replace borders
  content = content.replace(/border: '1px solid rgba\(255,255,255,0.1\)'/g, "border: '1px solid #e2e8f0'");
  content = content.replace(/border: '1px solid #475569'/g, "border: '1px solid #cbd5e1'");
  content = content.replace(/border: '2px dashed #475569'/g, "border: '2px dashed #cbd5e1'");
  
  // Subheadings/Paragraphs
  content = content.replace(/color: '#cbd5e1'/g, "color: '#64748b'");
  
  // Labels (were #94a3b8)
  content = content.replace(/color: '#94a3b8'/g, "color: '#475569'");
  
  // Inputs background (were #1e293b)
  content = content.replace(/background: '#1e293b'/g, "background: '#f8fafc'");
  
  // Special buttons or specific elements (like table headers or rows)
  content = content.replace(/background: '#334155'/g, "background: '#f1f5f9'");
  content = content.replace(/borderBottom: '1px solid rgba\(255,255,255,0.1\)'/g, "borderBottom: '1px solid #e2e8f0'");
  content = content.replace(/background: '#0f172a'/g, "background: 'white'");
  
  // Fix specifically the inputs color from white (changed above) to dark
  // Wait, if input used color: 'white', it was replaced by color: '#0f172a' globally, which is correct for inputs too!

  // Fix button text colors if they got changed from white to #0f172a
  // e.g. color: '#0f172a', ... background: '#3b82f6'
  // Actually, I'll just change the blue and green buttons back to white text
  content = content.replace(/color: '#0f172a', border: 'none', background: '#3b82f6'/g, "color: 'white', border: 'none', background: '#3b82f6'");
  content = content.replace(/background: guardando \? '#94a3b8' : '#10b981', color: '#0f172a'/g, "background: guardando ? '#cbd5e1' : '#10b981', color: 'white'");

  // Yellow headings: color: '#facc15' -> color: '#ca8a04' (Mentor uses dark yellow)
  content = content.replace(/color: '#facc15'/g, "color: '#ca8a04'");
  
  // For the video placeholder icon color
  content = content.replace(/color="#64748b"/g, "color=\"#94a3b8\""); // well, icon color is fine.
  
  // Video placeholder background: '#000' -> let's keep '#000' but it was inside a flex with 'background: '#000''
  // Actually, wait, it was: background: '#000' -> that is fine for videos.
  
  // Box shadows
  content = content.replace(/boxShadow: '0 4px 6px -1px rgba\(0,0,0,0.5\)'/g, "boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'");

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Styles updated in all files.');
