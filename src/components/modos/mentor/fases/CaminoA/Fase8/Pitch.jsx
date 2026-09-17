import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, PlayCircle, Trophy, CheckCircle2 } from 'lucide-react';

export default function Pitch({ setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [pitchText, setPitchText] = useState('');

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 8: El Discurso del Éxito!<br/><br/>Redacta tu Pitch. Tienes 3 minutos para convencer al jurado de que tu proyecto es increíble.`);
    } else if (step === 2) {
      setAyudanteText(`¡Teleprompter Listo! 🎙️<br/><br/>Practica tu discurso en voz alta. Imagina que ya eres un emprendedor exitoso.`);
    } else if (step === 3) {
      setAyudanteText(`¡MISIÓN CUMPLIDA! 🏆<br/><br/>Has completado todas las Fases del Emprendimiento Productivo. ¡Felicidades!`);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (step === 1 && !pitchText.trim()) return;
    setStep(prev => prev + 1);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {/* PASO 1: REDACCIÓN DEL PITCH */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Mic size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Escribe tu Discurso (Pitch)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Estructura: 1. El Problema, 2. Tu Solución, 3. Por qué tú.</p>
            
            <textarea 
              value={pitchText}
              onChange={e => setPitchText(e.target.value)}
              placeholder="Ej: ¿Sabían que el 80% de los estudiantes no comen bien? Nosotros somos la solución..."
              style={{ width: '100%', height: '200px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!pitchText.trim()}>
              Cargar Teleprompter <PlayCircle style={{ display: 'inline', marginLeft: '0.5rem' }} />
            </button>
          </motion.div>
        )}

        {/* PASO 2: PRÁCTICA (TELEPROMPTER) */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <PlayCircle size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Teleprompter</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Lee tu discurso en voz alta y mide tu tiempo.</p>
            
            <div style={{ background: 'black', padding: '3rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--accent)', textAlign: 'center' }}>
              <p style={{ color: '#0f172a', fontSize: '2rem', lineHeight: '1.5' }}>
                {pitchText}
              </p>
            </div>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '3rem', width: '100%' }}>
              Finalizar Práctica
            </button>
          </motion.div>
        )}

        {/* PASO 3: FASE COMPLETADA - FIN DEL JUEGO */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <Trophy size={100} color="gold" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '4rem', color: 'gold', marginBottom: '1rem' }}>¡Lo Lograste!</h2>
            <p style={{ color: '#0f172a', fontSize: '1.5rem', marginBottom: '3rem' }}>Has completado las 8 fases del Camino del Emprendedor.</p>
            
            <button className="btn-primary" onClick={handleComplete} style={{ width: '100%', fontSize: '1.5rem', padding: '1.5rem' }}>
              Ir al Salón de la Fama
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
