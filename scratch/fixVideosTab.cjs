const fs = require('fs');

// 1. Modificar api.js
let apiPath = 'src/services/api.js';
let apiContent = fs.readFileSync(apiPath, 'utf8');

const oldGuardarVideo = `export const guardarVideoConfig = async (videoKey, url, startStr, endStr) => {
  // Convertimos 'MM:SS' a segundos
  const timeToSeconds = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return parseInt(timeStr, 10) || null;
  };

  const configJson = JSON.stringify({
    url,
    start: timeToSeconds(startStr),
    end: timeToSeconds(endStr),
    startStr: startStr || '',
    endStr: endStr || ''
  });

  return await guardarPromptIA(0, videoKey, configJson);
};`;

const newGuardarVideo = `export const guardarVideoConfig = async (videoKey, url) => {
  const configJson = JSON.stringify({
    url,
    startStr: '',
    endStr: ''
  });

  return await guardarPromptIA(0, videoKey, configJson);
};`;

apiContent = apiContent.replace(oldGuardarVideo, newGuardarVideo);

const oldBuildEmbed = `export const buildYoutubeEmbedUrl = (config, fallbackUrl) => {
  let finalUrl = config?.url || fallbackUrl;
  
  if (!finalUrl) return '';

  // Extraer el ID del video de forma robusta
  const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|&v=)([^#&?]*).*/;
  const match = finalUrl.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;

  if (videoId) {
    finalUrl = \`https://www.youtube.com/embed/\${videoId}\`;
  } else {
    if (finalUrl.includes('watch?v=')) finalUrl = finalUrl.replace('watch?v=', 'embed/');
    else if (finalUrl.includes('youtu.be/')) finalUrl = finalUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    finalUrl = finalUrl.split('?')[0].split('&')[0];
  }

  const params = [];
  if (config?.start) params.push(\`start=\${config.start}\`);
  if (config?.end) params.push(\`end=\${config.end}\`);
  
  // Siempre agregar rel=0 y showinfo=0 para mejor UX
  params.push('rel=0');

  if (params.length > 0) {
    finalUrl += \`?\${params.join('&')}\`;
  }

  return finalUrl;
};`;

const newBuildEmbed = `export const buildYoutubeEmbedUrl = (config, fallbackUrl) => {
  let finalUrl = config?.url || fallbackUrl;
  
  if (!finalUrl) return '';

  // Si es un iframe embebido entero, sacamos el src
  const iframeMatch = finalUrl.match(/src=["'](.*?)["']/);
  if (iframeMatch && iframeMatch[1]) {
    finalUrl = iframeMatch[1];
  }

  // Extraer el ID del video de forma robusta
  const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|&v=)([^#&?]*).*/;
  const match = finalUrl.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;

  if (videoId) {
    finalUrl = \`https://www.youtube.com/embed/\${videoId}\`;
  } else {
    if (finalUrl.includes('watch?v=')) finalUrl = finalUrl.replace('watch?v=', 'embed/');
    else if (finalUrl.includes('youtu.be/')) finalUrl = finalUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    finalUrl = finalUrl.split('?')[0].split('&')[0];
  }

  const params = [];
  
  // Siempre agregar rel=0 para mejor UX
  params.push('rel=0');

  if (params.length > 0) {
    finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.join('&');
  }

  return finalUrl;
};`;

apiContent = apiContent.replace(oldBuildEmbed, newBuildEmbed);
fs.writeFileSync(apiPath, apiContent);
console.log('Modificado api.js');

// 2. Modificar VideosTab.jsx
let tabPath = 'src/components/admin/VideosTab.jsx';
let tabContent = fs.readFileSync(tabPath, 'utf8');

// Eliminar parámetros startStr y endStr de guardarVideoConfig
tabContent = tabContent.replace(
  `await guardarVideoConfig(videoKey, config.url, config.startStr, config.endStr);`,
  `await guardarVideoConfig(videoKey, config.url);`
);

// Remplazar UI
const oldUI = `                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Inicio (MM:SS)</label>
                      <input 
                        type="text" 
                        placeholder="00:00"
                        value={config.startStr}
                        onChange={(e) => handleChange(v.key, 'startStr', e.target.value)}
                        style={{ 
                          width: '100%', padding: '0.85rem', borderRadius: '0.75rem', 
                          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', 
                          color: '#f8fafc', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', textAlign: 'center'
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#60a5fa'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Fin (MM:SS)</label>
                      <input 
                        type="text" 
                        placeholder="Final"
                        value={config.endStr}
                        onChange={(e) => handleChange(v.key, 'endStr', e.target.value)}
                        style={{ 
                          width: '100%', padding: '0.85rem', borderRadius: '0.75rem', 
                          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', 
                          color: '#f8fafc', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', textAlign: 'center'
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#60a5fa'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      />
                    </div>
                  </div>`;

tabContent = tabContent.replace(oldUI, '');

tabContent = tabContent.replace(
  `placeholder="Ej: https://www.youtube.com/embed/fAymKnd8b44"`,
  `placeholder="Pega el enlace o el código de embebido (<iframe...)"`
);

tabContent = tabContent.replace(
  `<label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>URL del Video</label>`,
  `<label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Enlace o Código Embebido</label>`
);

fs.writeFileSync(tabPath, tabContent);
console.log('Modificado VideosTab.jsx');
