import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageSearch, DollarSign, CheckCircle2 } from 'lucide-react';

export default function Fabricacion({ projectName = "tu prototipo", setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [fabricacionData, setFabricacionData] = useState({
    recursos: '',
    costoTotal: 0
  });

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 5: Presupuesto de Fabricación!<br/><br/>¿Qué necesitas para armar esto? Haz una <b>Lista de Recursos</b> materiales y herramientas.`);
    } else if (step === 2) {
      setAyudanteText(`Bien, tienes los materiales. Ahora investiga los precios. ¿Cuál es el <b>Costo Total</b> estimado para fabricar tu primer prototipo funcional?`);
    } else if (step === 3) {
      setAyudanteText(`¡Presupuesto calculado! 💰<br/><br/>Ya sabes cuánto te costará hacer realidad ${projectName}.`);
    }
  }, [step, projectName]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (step === 1 && !fabricacionData.recursos.trim()) return;
    if (step === 2 && fabricacionData.costoTotal <= 0) return;
    
    if (step === 3) {
      onComplete(fabricacionData);
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <PackageSearch size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Lista de Recursos</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Enumera los materiales y herramientas necesarias.</p>
            
            <textarea 
              value={fabricacionData.recursos}
              onChange={e => setFabricacionData({...fabricacionData, recursos: e.target.value})}
              placeholder="Ej: - 1 placa ESP32&#10;- 1 Sensor capacitivo&#10;- Cables Jumper&#10;- Impresora 3D para la carcasa..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!fabricacionData.recursos.trim()}>
              Siguiente
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <DollarSign size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Costo Total Estimado</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>¿Cuánto costarán todos los materiales juntos?</p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>$</span>
              <input 
                type="number"
                value={fabricacionData.costoTotal}
                onChange={e => setFabricacionData({...fabricacionData, costoTotal: Number(e.target.value)})}
                style={{ width: '200px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '2rem', outline: 'none', textAlign: 'center' }}
              />
            </div>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={fabricacionData.costoTotal <= 0}>
              Siguiente
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle2 size={60} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Fase Completada</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Conoces exactamente cuánto costará hacer el prototipo.</p>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }}>
              Finalizar Fase 5
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
