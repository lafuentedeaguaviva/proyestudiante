import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Wand2, CheckCircle2 } from 'lucide-react';

export default function Presentacion({ setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [presentacionData, setPresentacionData] = useState({
    conclusiones: '',
    resumenEjecutivo: ''
  });

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 6: La Recta Final!<br/><br/>Redactemos los <b>Resultados y Conclusiones</b>. Después de todo lo investigado y planeado, ¿cuál es tu conclusión final sobre la viabilidad del negocio?`);
    } else if (step === 2) {
      setAyudanteText(`¡Excelente conclusión! Ahora usaremos la IA para compilar tu <b>Resumen Ejecutivo</b>. Este es el documento clave que leerán los jurados.`);
    } else if (step === 3) {
      setAyudanteText(`¡Resumen Ejecutivo Listo! 📄<br/><br/>Toda tu empresa está ahora documentada profesionalmente.`);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const generarResumenIA = () => {
    // Simular generación de IA
    setTimeout(() => {
      setPresentacionData(prev => ({
        ...prev,
        resumenEjecutivo: "Este proyecto de emprendimiento productivo ha demostrado su viabilidad técnica y financiera. Identificando un nicho de mercado claro, con una ventaja competitiva definida y costos de operación controlados, se proyecta un alto retorno de inversión en el primer año de operaciones."
      }));
    }, 1500);
  };

  const handleNext = () => {
    if (step === 1 && !presentacionData.conclusiones.trim()) return;
    if (step === 1) generarResumenIA();
    setStep(prev => prev + 1);
  };

  const handleComplete = () => {
    onComplete(presentacionData);
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {/* PASO 1: CONCLUSIONES */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <FileText size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Conclusiones Finales</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Escribe tu reflexión final sobre el proyecto.</p>
            
            <textarea 
              value={presentacionData.conclusiones}
              onChange={e => setPresentacionData({...presentacionData, conclusiones: e.target.value})}
              placeholder="Ej: En conclusión, este proyecto resuelve una necesidad real del mercado y es rentable..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!presentacionData.conclusiones.trim()}>
              Generar Resumen Ejecutivo con IA <Wand2 style={{ display: 'inline', marginLeft: '0.5rem' }} />
            </button>
          </motion.div>
        )}

        {/* PASO 2: RESUMEN EJECUTIVO (IA) */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Wand2 size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Resumen Ejecutivo Generado</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Revisa y ajusta el documento final de presentación.</p>
            
            <textarea 
              value={presentacionData.resumenEjecutivo}
              onChange={e => setPresentacionData({...presentacionData, resumenEjecutivo: e.target.value})}
              placeholder="Generando..."
              style={{ width: '100%', height: '200px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!presentacionData.resumenEjecutivo.trim()}>
              Confirmar Resumen Final
            </button>
          </motion.div>
        )}

        {/* PASO 3: FASE COMPLETADA */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle2 size={80} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>¡Documentación Completada!</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.2rem' }}>Tu resumen ejecutivo está listo para ser incluido en el informe impreso.</p>
            
            <button className="btn-primary" onClick={handleComplete} style={{ marginTop: '3rem', width: '100%', fontSize: '1.3rem' }}>
              Finalizar Fase 6
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
