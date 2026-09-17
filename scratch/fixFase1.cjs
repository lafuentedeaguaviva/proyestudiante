const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/Fase1_Onboarding.jsx');
let content = fs.readFileSync(targetPath, 'utf-8');

// The file should have:
//   ];
//
//   useEffect(() => {
//     // Si queremos meter sonidos de estática de radio aquí, podríamos hacerlo.
//   }, []);
//
//   return (
//     <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', position: 'relative', overflow: 'hidden' }}>
//       
//       {/* Efecto de granulado / estática */}
//       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")', pointerEvents: 'none' }}></div>

const missingText = `  ];

  useEffect(() => {
    // Si queremos meter sonidos de estática de radio aquí, podríamos hacerlo.
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', position: 'relative', overflow: 'hidden' }}>
      
      {/* Efecto de granulado / estática */}
`;

if (!content.includes('minHeight: \'100vh\'')) {
  // Re-insert at the end of the dialogs array
  content = content.replace(
    /\{ personaje: 'Detective Lía Vega', avatar: '\/avatar_lia.png', color: '#10b981', tipo: 'bubble', texto: "No escuches a la máquina. NEXUS es real y está borrando nuestras ideas. Tienes que elegir una línea de investigación y resolver el caso antes de que nos alcance." \}/,
    `{ personaje: 'Detective Lía Vega', avatar: '/avatar_lia.png', color: '#10b981', tipo: 'bubble', texto: "No escuches a la máquina. NEXUS es real y está borrando nuestras ideas. Tienes que elegir una línea de investigación y resolver el caso antes de que nos alcance." }\n${missingText}`
  );
  fs.writeFileSync(targetPath, content, 'utf-8');
  console.log("Restored Fase1_Onboarding.jsx structure");
}
