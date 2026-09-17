const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/fases/CaminoA/Fase3');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const pasos = [
  { n: 1, name: 'Paso1_VideoPublico' },
  { n: 2, name: 'Paso2_PublicoObjetivo' },
  { n: 3, name: 'Paso3_VideoProductoServicio' },
  { n: 4, name: 'Paso4_DisenoProducto' },
  { n: 5, name: 'Paso5_VideoCaracteristicas' },
  { n: 6, name: 'Paso6_Caracteristicas' },
  { n: 7, name: 'Paso7_BeneficiosCaracteristicas' },
  { n: 8, name: 'Paso8_VideoEmpaque' },
  { n: 9, name: 'Paso9_EmpaqueProducto' },
  { n: 10, name: 'Paso10_PresentacionServicio' },
  { n: 11, name: 'Paso11_VideoDemandaPotencial' },
  { n: 12, name: 'Paso12_DemandaPotencial' },
  { n: 13, name: 'Paso13_VideoDemandaInsatisfecha' },
  { n: 14, name: 'Paso14_DemandaInsatisfecha' },
  { n: 15, name: 'Paso15_VideoEstimacionDemanda' },
  { n: 16, name: 'Paso16_EstimacionDemanda' }
];

pasos.forEach(p => {
  const content = `import React from 'react';
import { motion } from 'framer-motion';

const ${p.name} = ({ setAyudanteText, onComplete, globalData, updateGlobalData }) => {
  React.useEffect(() => {
    setAyudanteText("Información sobre el ${p.name}.");
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Paso ${p.n}</h2>
      
      <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem', minHeight: '300px' }}>
        <p>Contenido del ${p.name}...</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={onComplete}
          style={{ padding: '1rem 3rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ${p.name};
`;
  fs.writeFileSync(path.join(dir, p.name + '.jsx'), content);
});

console.log('Archivos creados.');
