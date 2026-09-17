import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Calendar, CheckCircle2 } from 'lucide-react';

export default function Prototipo({ setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [prototipoData, setPrototipoData] = useState({
    diseno: '',
    cronograma: ''
  });

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 4: Diseño del Prototipo!<br/><br/>Describe cómo funcionará tu tecnología. ¿Cuáles son sus características técnicas y su utilidad principal?`);
    } else if (step === 2) {
      setAyudanteText(`¡Excelente diseño! Ahora, ¿cuál es tu <b>Cronograma</b>? ¿Qué tareas harás cada semana para construirlo?`);
    } else if (step === 3) {
      setAyudanteText(`¡Diseño y planificación listos! ⚙️<br/><br/>Ya sabes qué construir y cuándo hacerlo.`);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (step === 1 && !prototipoData.diseno.trim()) return;
    if (step === 2 && !prototipoData.cronograma.trim()) return;
    
    if (step === 3) {
      onComplete(prototipoData);
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Cpu size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Diseño Técnico</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Describe las características físicas, componentes o módulos de software de tu invento.</p>
            
            <textarea 
              value={prototipoData.diseno}
              onChange={e => setPrototipoData({...prototipoData, diseno: e.target.value})}
              placeholder="Ej: Utilizará una placa ESP32 con conexión WiFi, un sensor de humedad de suelo capacitivo y una electroválvula..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!prototipoData.diseno.trim()}>
              Siguiente
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Calendar size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Cronograma</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Define los tiempos para fabricar tu prototipo.</p>
            
            <textarea 
              value={prototipoData.cronograma}
              onChange={e => setPrototipoData({...prototipoData, cronograma: e.target.value})}
              placeholder="Ej: Semana 1: Comprar piezas. Semana 2: Ensamblar circuito. Semana 3: Programar código. Semana 4: Pruebas de campo..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!prototipoData.cronograma.trim()}>
              Siguiente
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle2 size={60} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Fase Completada</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>El diseño del prototipo está definido.</p>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }}>
              Finalizar Fase 4
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
