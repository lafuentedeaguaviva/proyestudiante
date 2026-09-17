const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/pages/Fase8_Operacion.jsx');
let content = fs.readFileSync(targetPath, 'utf-8');

const missingEnd = `
  return (
    <PasoLayout 
      faseTitle="Fase 8: La Operación"
      pasoActual={step}
      totalPasos={7}
      tabs={[
        { id: 1, icon: <Video size={18} />, label: 'Video Procesos' },
        { id: 2, icon: <List size={18} />, label: 'Listado Pasos' },
        { id: 3, icon: <CheckSquare size={18} />, label: 'Revisión' },
        { id: 4, icon: <Video size={18} />, label: 'Video Diagrama' },
        { id: 5, icon: <Network size={18} />, label: 'Diagrama' },
        { id: 6, icon: <Video size={18} />, label: 'Video Layout' },
        { id: 7, icon: <Map size={18} />, label: 'Layout' }
      ]}
      onTabClick={(id) => {
        irAPaso(id);
      }}
      onSiguiente={handleSiguienteClick}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={\`Estás en el paso \${step} de 7. \${step === 5 || step === 7 ? '¡Es hora de jugar y organizar todo!' : ''}\`}
      guardando={guardando}
    >
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          {getPasoContent()}
        </motion.div>
      </AnimatePresence>
    </PasoLayout>
  );
};

export default Fase8_Operacion;
`;

if (!content.includes('export default Fase8_Operacion')) {
  fs.writeFileSync(targetPath, content + missingEnd, 'utf-8');
  console.log("Restored end of Fase8_Operacion.jsx");
}

const f1Path = path.resolve(__dirname, '../src/pages/Fase1_Onboarding.jsx');
if (fs.existsSync(f1Path)) {
  let f1 = fs.readFileSync(f1Path, 'utf-8');
  if (f1.includes("const handleAceptarCaso")) {
    f1 = f1.replace(/const handleAceptarCaso = async \(\) => \{[\s\S]*?\}\s*;/g, "");
    fs.writeFileSync(f1Path, f1, 'utf-8');
    console.log("Removed duplicate handleAceptarCaso in Fase1");
  }
}
