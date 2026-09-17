const fs = require('fs');
let content = fs.readFileSync('src/pages/Fase6_Distribucion.jsx', 'utf8');

const regex = /return \([\s\S]*?export default Fase6_Distribucion;/m;

const newContent = `return (
    <PasoLayout 
      faseTitle="Fase 6: Distribución"
      pasoActual={step}
      totalPasos={10}
      tabs={[
        { id: 1, icon: <Video size={18} />, label: 'Video Distribución' },
        { id: 2, icon: <Truck size={18} />, label: 'Canales Distribución' },
        { id: 3, icon: <MapPin size={18} />, label: 'Elección Lugar' },
        { id: 4, icon: <Video size={18} />, label: 'Video Entrega' },
        { id: 5, icon: <Package size={18} />, label: 'Logística' },
        { id: 6, icon: <CreditCard size={18} />, label: 'Pagos' },
        { id: 7, icon: <Wrench size={18} />, label: 'Necesidades Dist.' },
        { id: 8, icon: <Video size={18} />, label: 'Video Plan Dist.' },
        { id: 9, icon: <ClipboardList size={18} />, label: 'Plan Acción' },
        { id: 10, icon: <DollarSign size={18} />, label: 'Presupuesto' }
      ]}
      onTabClick={(id) => {
        setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={() => irAPaso(step + 1)}
      onAnterior={step > 1 ? () => irAPaso(step - 1) : null}
      mentorText={\`Estás en el paso \${step} de 10. Revisa que los datos estén correctos antes de continuar.\`}
      guardando={guardando}
    >
      <AnimatePresence>
        <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
          {getPasoContent()}
        </motion.div>
      </AnimatePresence>
    </PasoLayout>
  );
};

export default Fase6_Distribucion;`;

content = content.replace(regex, newContent);
fs.writeFileSync('src/pages/Fase6_Distribucion.jsx', content);
