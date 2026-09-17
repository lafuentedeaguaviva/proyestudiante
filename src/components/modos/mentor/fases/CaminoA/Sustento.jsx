import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, BookOpen, PenTool, CheckCircle2 } from 'lucide-react';

export default function Sustento({ setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [sustentoData, setSustentoData] = useState({
    objetivoGeneral: '',
    metodologia: '',
    marcoReferencial: ''
  });

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 3: Sustento Teórico y Metodológico!<br/><br/>Toda investigación necesita un rumbo. ¿Cuál es el <b>Objetivo General</b> de tu innovación? (Empieza con un verbo en infinitivo).`);
    } else if (step === 2) {
      setAyudanteText(`Ahora la <b>Metodología</b>. ¿Cómo vas a construir o investigar este prototipo? (Ej. SCRUM, Prototipado rápido, Método Científico).`);
    } else if (step === 3) {
      setAyudanteText(`Finalmente, el <b>Marco Referencial</b>. Escribe brevemente los conceptos teóricos clave que respaldan tu tecnología.`);
    } else if (step === 4) {
      setAyudanteText(`¡Sustento completo! 📚<br/><br/>Tu proyecto ahora tiene un fundamento sólido y académico.`);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (step === 1 && !sustentoData.objetivoGeneral.trim()) return;
    if (step === 2 && !sustentoData.metodologia.trim()) return;
    if (step === 3 && !sustentoData.marcoReferencial.trim()) return;
    
    if (step === 4) {
      onComplete(sustentoData);
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Target size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Objetivo General</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>¿Qué vas a lograr con este proyecto?</p>
            
            <textarea 
              value={sustentoData.objetivoGeneral}
              onChange={e => setSustentoData({...sustentoData, objetivoGeneral: e.target.value})}
              placeholder="Ej: Desarrollar un prototipo de riego automatizado para optimizar el consumo de agua..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!sustentoData.objetivoGeneral.trim()}>
              Siguiente
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <PenTool size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Metodología</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>¿Qué método usarás para construir el prototipo?</p>
            
            <textarea 
              value={sustentoData.metodologia}
              onChange={e => setSustentoData({...sustentoData, metodologia: e.target.value})}
              placeholder="Ej: Metodología ágil SCRUM, con iteraciones de prototipado semanal..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!sustentoData.metodologia.trim()}>
              Siguiente
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <BookOpen size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Marco Referencial</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Bases teóricas de tu proyecto.</p>
            
            <textarea 
              value={sustentoData.marcoReferencial}
              onChange={e => setSustentoData({...sustentoData, marcoReferencial: e.target.value})}
              placeholder="Ej: Principios de la electrónica, microcontroladores Arduino, conductividad de la tierra..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!sustentoData.marcoReferencial.trim()}>
              Siguiente
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle2 size={60} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Fase Completada</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>El diseño de la investigación está listo.</p>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }}>
              Finalizar Fase 3
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
