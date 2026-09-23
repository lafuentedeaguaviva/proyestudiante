const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/services/api.js');

let content = fs.readFileSync(file, 'utf8');

const target = `  // Asegurarnos de que usa formato embed
  if (finalUrl.includes('watch?v=')) {
    finalUrl = finalUrl.replace('watch?v=', 'embed/');
  } else if (finalUrl.includes('youtu.be/')) {
    finalUrl = finalUrl.replace('youtu.be/', 'www.youtube.com/embed/');
  }

  // Quitar parámetros existentes para no duplicar
  finalUrl = finalUrl.split('?')[0];`;

const replacement = `  // Extraer el ID del video de forma robusta
  const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|&v=)([^#&?]*).*/;
  const match = finalUrl.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;

  if (videoId) {
    finalUrl = \`https://www.youtube.com/embed/\${videoId}\`;
  } else {
    if (finalUrl.includes('watch?v=')) finalUrl = finalUrl.replace('watch?v=', 'embed/');
    else if (finalUrl.includes('youtu.be/')) finalUrl = finalUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    finalUrl = finalUrl.split('?')[0].split('&')[0];
  }`;

// Fix CRLF issues by standardizing
content = content.replace(/\r\n/g, '\n');
const targetLF = target.replace(/\r\n/g, '\n');

if (content.includes(targetLF)) {
  content = content.replace(targetLF, replacement);
  fs.writeFileSync(file, content);
  console.log('Success');
} else {
  console.log('Not found');
}
