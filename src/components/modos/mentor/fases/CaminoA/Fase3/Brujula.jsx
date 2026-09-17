import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Eye, Heart, CheckCircle2 } from 'lucide-react';

export default function Brujula({ setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [brujulaData, setBrujulaData] = useState({
    objetivos: '',
    mision: '',
    vision: '',
    justificacion: ''
  });

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 3: La Brújula de tu Empresa! 🧭<br/><br/>Todo barco necesita un destino. Empecemos definiendo los <b>Objetivos</b> de tu emprendimiento: ¿Qué vas a vender exactamente y cómo planeas lograr tus primeras ventas?`);
    } else if (step === 2) {
      setAyudanteText(`El corazón de tu empresa: <b>Misión y Visión</b>.<br/><br/>La Misión es lo que haces hoy para tus clientes. La Visión es a dónde quieres llegar en 5 años.`);
    } else if (step === 3) {
      setAyudanteText(`Finalmente, la <b>Justificación Comercial</b>.<br/><br/>Convence a los inversionistas: ¿Por qué es un buen negocio y por qué la gente pagaría por esto?`);
    } else if (step === 4) {
      setAyudanteText(`¡Brújula Calibrada! 🧭<br/><br/>Tu empresa ya tiene una dirección clara y un propósito poderoso. Avanza al siguiente nivel.`);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (step === 1 && !brujulaData.objetivos.trim()) return;
    if (step === 2 && (!brujulaData.mision.trim() || !brujulaData.vision.trim())) return;
    if (step === 3 && !brujulaData.justificacion.trim()) return;
    setStep(prev => prev + 1);
  };

  const handleComplete = () => {
    onComplete(brujulaData);
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {/* PASO 1: OBJETIVOS */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Compass size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Objetivos Comerciales</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Define metas claras y alcanzables para empezar.</p>
            
            <textarea 
              value={brujulaData.objetivos}
              onChange={e => setBrujulaData({...brujulaData, objetivos: e.target.value})}
              placeholder="Ej: Lograr vender 100 unidades el primer mes mediante publicidad en redes sociales..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!brujulaData.objetivos.trim()}>
              Establecer Objetivos
            </button>
          </motion.div>
        )}

        {/* PASO 2: MISIÓN Y VISIÓN */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Eye size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Misión y Visión</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', textAlign: 'left' }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'block' }}>Misión (Tu propósito actual)</label>
                <textarea 
                  value={brujulaData.mision}
                  onChange={e => setBrujulaData({...brujulaData, mision: e.target.value})}
                  placeholder="Ej: Brindar alternativas alimenticias saludables y accesibles a los estudiantes locales."
                  style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.1rem', outline: 'none', resize: 'none' }}
                />
              </div>
              
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'block' }}>Visión (Tu sueño a 5 años)</label>
                <textarea 
                  value={brujulaData.vision}
                  onChange={e => setBrujulaData({...brujulaData, vision: e.target.value})}
                  placeholder="Ej: Convertirnos en la cadena de comida rápida saludable líder en todo el distrito."
                  style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.1rem', outline: 'none', resize: 'none' }}
                />
              </div>
            </div>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!brujulaData.mision.trim() || !brujulaData.vision.trim()}>
              Consolidar Identidad
            </button>
          </motion.div>
        )}

        {/* PASO 3: JUSTIFICACIÓN COMERCIAL */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Heart size={60} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>Justificación Comercial</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Argumenta por qué tu negocio va a ser un éxito y por qué es importante realizarlo.</p>
            
            <textarea 
              value={brujulaData.justificacion}
              onChange={e => setBrujulaData({...brujulaData, justificacion: e.target.value})}
              placeholder="Ej: Este emprendimiento es viable porque existe una demanda insatisfecha por comida rápida saludable, y nuestro método de producción nos permite altos márgenes de ganancia..."
              style={{ width: '100%', height: '180px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!brujulaData.justificacion.trim()}>
              Guardar Justificación
            </button>
          </motion.div>
        )}

        {/* PASO 4: RESUMEN DE LA FASE */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <CheckCircle2 size={60} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
              <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>Brújula Configurada</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>🎯 Objetivos</h4>
                <p style={{ color: '#0f172a' }}>{brujulaData.objetivos}</p>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>👁️ Misión y Visión</h4>
                <p style={{ color: '#0f172a', fontStyle: 'italic' }}>M: {brujulaData.mision}</p>
                <p style={{ color: '#0f172a', fontStyle: 'italic' }}>V: {brujulaData.vision}</p>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <h4 style={{ color: 'var(--danger)', fontSize: '1.2rem' }}>❤️ Justificación</h4>
                <p style={{ color: '#0f172a' }}>{brujulaData.justificacion}</p>
              </div>
            </div>

            <button className="btn-primary" onClick={handleComplete} style={{ marginTop: '3rem', width: '100%', fontSize: '1.3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <Compass /> Finalizar Fase 3
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
