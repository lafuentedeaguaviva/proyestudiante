import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function FallaTecnica({ setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [fallaData, setFallaData] = useState({
    sector: '',
    cuelloBotella: '',
    ideaSolucion: '',
    tituloProyecto: ''
  });

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 1: Diagnóstico Técnico!<br/><br/>Toda innovación nace de un problema. ¿En qué sector o área técnica has notado deficiencias o procesos lentos?`);
    } else if (step === 2) {
      setAyudanteText(`Bien. Ahora, seamos específicos. ¿Cuál es exactamente el <b>Cuello de Botella</b> o la falla principal que frena el proceso?`);
    } else if (step === 3) {
      setAyudanteText(`¡Ahí está el problema! Ahora, haz una lluvia de ideas. ¿Cuál es tu <b>Idea Principal de Solución Tecnológica</b> para arreglar esa falla?`);
    } else if (step === 4) {
      setAyudanteText(`¡Excelente! Para terminar esta fase, dale un <b>Título Oficial</b> a tu Proyecto de Innovación.`);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (step === 1 && !fallaData.sector.trim()) return;
    if (step === 2 && !fallaData.cuelloBotella.trim()) return;
    if (step === 3 && !fallaData.ideaSolucion.trim()) return;
    if (step === 4 && !fallaData.tituloProyecto.trim()) return;
    
    if (step === 4) {
      onComplete(fallaData.tituloProyecto);
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Search size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sector Productivo</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Define el área donde vas a investigar.</p>
            
            <input 
              type="text"
              value={fallaData.sector}
              onChange={e => setFallaData({...fallaData, sector: e.target.value})}
              placeholder="Ej: Agricultura, Desarrollo de Software, Mecánica..."
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!fallaData.sector.trim()}>
              Continuar
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <AlertTriangle size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>El Cuello de Botella</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Describe la falla técnica exacta.</p>
            
            <textarea 
              value={fallaData.cuelloBotella}
              onChange={e => setFallaData({...fallaData, cuelloBotella: e.target.value})}
              placeholder="Ej: El riego manual desperdicia un 40% del agua y toma demasiado tiempo humano..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!fallaData.cuelloBotella.trim()}>
              Continuar
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Lightbulb size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>La Solución Tecnológica</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>¿Qué vas a inventar o mejorar para solucionarlo?</p>
            
            <textarea 
              value={fallaData.ideaSolucion}
              onChange={e => setFallaData({...fallaData, ideaSolucion: e.target.value})}
              placeholder="Ej: Desarrollar un sistema de riego automatizado con sensores Arduino de humedad..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!fallaData.ideaSolucion.trim()}>
              Continuar
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle2 size={60} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Bautiza tu Proyecto</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Dale un nombre formal e impactante.</p>
            
            <input 
              type="text"
              value={fallaData.tituloProyecto}
              onChange={e => setFallaData({...fallaData, tituloProyecto: e.target.value})}
              placeholder="Ej: Sistema Automatizado de Riego Inteligente (SARI)"
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', textAlign: 'center' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!fallaData.tituloProyecto.trim()}>
              Finalizar Fase 1
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
