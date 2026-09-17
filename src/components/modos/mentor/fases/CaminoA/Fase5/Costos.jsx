import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Coins, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';

export default function Costos({ projectName = "tu proyecto", setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [costos, setCostos] = useState({
    inversion: 0,
    fijos: 0,
    variables: 0
  });

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase de Supervivencia Financiera!<br/><br/>Ninguna misión sobrevive sin recursos. ¿Cuánto oro (dinero) necesitas para comprar equipos o maquinaria inicial (Inversión)?`);
    } else if (step === 2) {
      setAyudanteText(`Bien, esa es tu Inversión Inicial. Ahora, ¿cuáles son los <b>Costos Fijos</b> mensuales? (Ej. Alquiler de tu base, internet, luz). ¡Cosas que pagas vendas o no vendas!`);
    } else if (step === 3) {
      setAyudanteText(`Y finalmente, los <b>Costos Variables</b>. ¿Cuánto te cuesta fabricar CADA unidad de tu producto o dar tu servicio?`);
    } else if (step === 4) {
      setAyudanteText(`¡Números calculados! 💰<br/><br/>Revisa tu Presupuesto de Batalla. Con estos datos aseguramos la rentabilidad de ${projectName}.`);
    }
  }, [step, projectName]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (step === 1 && costos.inversion <= 0) return;
    if (step === 2 && costos.fijos < 0) return;
    if (step === 3 && costos.variables < 0) return;
    setStep(prev => prev + 1);
  };

  const handleComplete = () => {
    onComplete(costos);
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {/* PASO 1: INVERSIÓN INICIAL */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Coins size={60} color="gold" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'gold' }}>Inversión Inicial</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Equipos, máquinas, licencias. Lo que necesitas antes de empezar.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <DollarSign size={40} color="var(--success)" />
              <input 
                type="number"
                min="0"
                value={costos.inversion || ''}
                onChange={e => setCostos({...costos, inversion: parseFloat(e.target.value) || 0})}
                placeholder="Ej: 5000"
                style={{ width: '200px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: '#0f172a', fontSize: '2rem', outline: 'none' }}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
              />
            </div>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '3rem', width: '100%' }} disabled={costos.inversion <= 0}>
              Fijar Inversión
            </button>
          </motion.div>
        )}

        {/* PASO 2: COSTOS FIJOS */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Calculator size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Costos Fijos (Mensuales)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Alquiler, sueldos base, servicios fijos.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <DollarSign size={40} color="var(--success)" />
              <input 
                type="number"
                min="0"
                value={costos.fijos || ''}
                onChange={e => setCostos({...costos, fijos: parseFloat(e.target.value) || 0})}
                placeholder="Ej: 1000"
                style={{ width: '200px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: '#0f172a', fontSize: '2rem', outline: 'none' }}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
              />
            </div>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '3rem', width: '100%' }} disabled={costos.fijos < 0}>
              Fijar Costos Fijos
            </button>
          </motion.div>
        )}

        {/* PASO 3: COSTOS VARIABLES */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <TrendingUp size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Costos Variables (Por Unidad)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Materia prima, empaques, envíos. Lo que cuesta producir UN producto.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <DollarSign size={40} color="var(--success)" />
              <input 
                type="number"
                min="0"
                value={costos.variables || ''}
                onChange={e => setCostos({...costos, variables: parseFloat(e.target.value) || 0})}
                placeholder="Ej: 15"
                style={{ width: '200px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: '#0f172a', fontSize: '2rem', outline: 'none' }}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
              />
            </div>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '3rem', width: '100%' }} disabled={costos.variables < 0}>
              Fijar Costos Variables
            </button>
          </motion.div>
        )}

        {/* PASO 4: RESULTADO PRESUPUESTO */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle size={80} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>Presupuesto de Batalla</h2>
            
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: 'var(--radius-lg)', marginTop: '2rem', textAlign: 'left', border: `1px solid var(--success)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Inversión Inicial:</span>
                <span style={{ color: 'gold', fontWeight: 'bold' }}>${costos.inversion.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Costos Fijos (Mes):</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${costos.fijos.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Costo Variable (Unidad):</span>
                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>${costos.variables.toFixed(2)}</span>
              </div>
            </div>

            <button className="btn-primary" onClick={handleComplete} style={{ marginTop: '3rem', width: '100%', fontSize: '1.3rem', background: 'var(--success)', border: 'none', color: '#000' }}>
              Completar Presupuesto
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
