import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, Download, CheckCircle2 } from 'lucide-react';

export default function Diapositivas({ setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 7: Preparando la Exposición!<br/><br/>Es hora de armar las diapositivas. Usa la herramienta para simular y descargar tu presentación.`);
    } else if (step === 2) {
      setAyudanteText(`¡Diapositivas Listas! 📊<br/><br/>Ya tienes tu apoyo visual para la defensa del proyecto.`);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {/* PASO 1: SIMULADOR DE DIAPOSITIVAS */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Presentation size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Generador de Diapositivas</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Revisa la estructura recomendada para tu exposición.</p>
            
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Slide 1:</strong> Portada (Título y Autores)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Slide 2:</strong> Problema y Justificación
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Slide 3:</strong> La Solución (Tu Producto/Servicio)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Slide 4:</strong> Análisis de Mercado (Target y Competencia)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Slide 5:</strong> Presupuesto y Rentabilidad
              </div>
            </div>
            
            <button className="btn-outline" onClick={() => setStep(2)} style={{ marginTop: '2rem', width: '100%' }}>
              Simular Descarga <Download style={{ display: 'inline', marginLeft: '0.5rem' }} size={20} />
            </button>
          </motion.div>
        )}

        {/* PASO 2: FASE COMPLETADA */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle2 size={80} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>¡Presentación Exportada!</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.2rem' }}>Imprime o proyecta estas diapositivas el día de tu defensa.</p>
            
            <button className="btn-primary" onClick={handleComplete} style={{ marginTop: '3rem', width: '100%', fontSize: '1.3rem' }}>
              Finalizar Fase 7
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
