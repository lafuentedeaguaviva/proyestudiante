const fs = require('fs');
let code = fs.readFileSync('src/pages/Fase9_Estructura.jsx', 'utf8');

const youtubeCase = `case 1: return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Video Estructura</h2>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <YoutubePlayer videoKey="video_fase_9" title="Estructura Organizacional" fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
            </div>
          </div>
        );
        `;

code = code.replace(/case 2: return \(/, youtubeCase + "case 2: return (");

fs.writeFileSync('src/pages/Fase9_Estructura.jsx', code);
console.log("Fase 9 Case 1 Added!");
