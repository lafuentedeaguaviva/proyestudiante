import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, MessageSquare, Edit3, Shield, CheckCircle2 } from 'lucide-react';
import JuegoFoda from '../../../JuegoFoda';

export default function Diagnostico({ setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [diagnosticoData, setDiagnosticoData] = useState({
    encuestas: '',
    target: '',
    foda: null,
    redaccionProblema: ''
  });

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 2: Diagnóstico del Contexto!<br/><br/>Para que tu proyecto tenga éxito, necesitamos entender la realidad. Empecemos por salir al campo (virtualmente). ¿Qué 3 preguntas le harías a tus futuros clientes para saber si de verdad necesitan tu producto?`);
    } else if (step === 2) {
      setAyudanteText(`¡Excelentes preguntas! Ahora, ¿a quién se las harás? Define tu <b>Público Objetivo (Target)</b>. Edad, intereses, ocupación...`);
    } else if (step === 3) {
      setAyudanteText(`¡Genial! Conoces a tu cliente. Ahora haremos un <b>Análisis FODA</b> para prever cualquier obstáculo y aprovechar nuestras ventajas. ¡Juguemos!`);
    } else if (step === 4) {
      setAyudanteText(`¡Análisis completado! Finalmente, escribe la <b>Formulación del Problema</b>. ¿Cuál es el dolor principal que vas a resolver y cómo lo describirías en un párrafo formal?`);
    } else if (step === 5) {
      setAyudanteText(`¡Fase 2 Completada! 📊<br/><br/>Ya tenemos tu investigación de campo lista. Ahora tienes bases sólidas para avanzar.`);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (step === 1 && !diagnosticoData.encuestas.trim()) return;
    if (step === 2 && !diagnosticoData.target.trim()) return;
    if (step === 4 && !diagnosticoData.redaccionProblema.trim()) return;
    setStep(prev => prev + 1);
  };

  const handleFodaComplete = (fodaResult) => {
    setDiagnosticoData(prev => ({ ...prev, foda: fodaResult }));
    setStep(4);
  };

  const handleComplete = () => {
    onComplete(diagnosticoData);
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {/* PASO 1: ENCUESTAS IA */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <MessageSquare size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Módulo de Encuestas</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Genera preguntas clave para validar en campo.</p>
            
            <textarea 
              value={diagnosticoData.encuestas}
              onChange={e => setDiagnosticoData({...diagnosticoData, encuestas: e.target.value})}
              placeholder="Ej: 1. ¿Cuánto gasta mensualmente en...? 2. ¿Qué es lo que más le molesta de...?"
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!diagnosticoData.encuestas.trim()}>
              Guardar Preguntas
            </button>
          </motion.div>
        )}

        {/* PASO 2: TARGET GROUP */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Target size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Público Objetivo (Target)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>¿Quién es tu cliente ideal?</p>
            
            <textarea 
              value={diagnosticoData.target}
              onChange={e => setDiagnosticoData({...diagnosticoData, target: e.target.value})}
              placeholder="Ej: Estudiantes de 15 a 25 años que buscan comida rápida saludable..."
              style={{ width: '100%', height: '120px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!diagnosticoData.target.trim()}>
              Definir Cliente Ideal
            </button>
          </motion.div>
        )}

        {/* PASO 3: FODA */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-panel" style={{ padding: '3rem' }}>
             <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', color: 'gold' }}>Análisis FODA</h2>
            <JuegoFoda onComplete={handleFodaComplete} />
          </motion.div>
        )}

        {/* PASO 4: REDACCIÓN DEL PROBLEMA */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Edit3 size={60} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>Formulación del Problema</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Redacta el diagnóstico y el problema exacto a resolver.</p>
            
            <textarea 
              value={diagnosticoData.redaccionProblema}
              onChange={e => setDiagnosticoData({...diagnosticoData, redaccionProblema: e.target.value})}
              placeholder="Ej: Se ha observado que en la zona sur no existen alternativas saludables de comida rápida, provocando que los estudiantes gasten en productos dañinos..."
              style={{ width: '100%', height: '180px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!diagnosticoData.redaccionProblema.trim()}>
              Guardar Documento Base
            </button>
          </motion.div>
        )}

        {/* PASO 5: RESUMEN DE LA FASE */}
        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Shield size={60} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
              <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>Fase 2 Completada</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>📋 Encuestas Clave</h4>
                <p style={{ color: '#0f172a' }}>{diagnosticoData.encuestas}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>🎯 Target</h4>
                <p style={{ color: '#0f172a' }}>{diagnosticoData.target}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--danger)', fontSize: '1.2rem' }}>📝 Problema Definido</h4>
                <p style={{ color: '#0f172a' }}>{diagnosticoData.redaccionProblema}</p>
              </div>
            </div>

            <button className="btn-primary" onClick={handleComplete} style={{ marginTop: '3rem', width: '100%', fontSize: '1.3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 /> Finalizar Fase 2
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
