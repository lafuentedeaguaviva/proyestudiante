import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vibrate, FileText, CheckCircle2 } from 'lucide-react';

export default function Pruebas({ setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [pruebasData, setPruebasData] = useState({
    evaluacionImpacto: '',
    conclusiones: ''
  });

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 6: Pruebas y Presentación Final!<br/><br/>El prototipo está listo. Ahora, describe cómo harás la <b>Evaluación de Impacto</b> (¿Cómo medirás que realmente funciona y soluciona el problema?).`);
    } else if (step === 2) {
      setAyudanteText(`Excelente. Finalmente, redacta tus <b>Conclusiones</b> sobre el proyecto de innovación. ¿Qué aprendiste y cuáles son los siguientes pasos?`);
    } else if (step === 3) {
      setAyudanteText(`¡Datos guardados! 📝<br/><br/>Tu proyecto tecnológico está documentado de principio a fin.`);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (step === 1 && !pruebasData.evaluacionImpacto.trim()) return;
    if (step === 2 && !pruebasData.conclusiones.trim()) return;
    
    if (step === 3) {
      onComplete(pruebasData);
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Vibrate size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Evaluación de Impacto</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>¿Cómo medirás el éxito de tu tecnología en la vida real?</p>
            
            <textarea 
              value={pruebasData.evaluacionImpacto}
              onChange={e => setPruebasData({...pruebasData, evaluacionImpacto: e.target.value})}
              placeholder="Ej: Mediremos el consumo de agua del terreno durante 1 mes usando el prototipo vs 1 mes de riego manual..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!pruebasData.evaluacionImpacto.trim()}>
              Siguiente
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <FileText size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Conclusiones Finales</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Reflexión y siguientes pasos para el proyecto.</p>
            
            <textarea 
              value={pruebasData.conclusiones}
              onChange={e => setPruebasData({...pruebasData, conclusiones: e.target.value})}
              placeholder="Ej: Se concluye que la automatización del riego mediante sensores capacitivos es viable y reduce el desperdicio de agua en un 30%..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!pruebasData.conclusiones.trim()}>
              Siguiente
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle2 size={60} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Fase Completada</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Toda la investigación y diseño están validados.</p>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }}>
              Finalizar Fase 6
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
