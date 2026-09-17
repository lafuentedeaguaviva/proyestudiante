import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Zap, Megaphone, Network, CheckCircle2 } from 'lucide-react';

export default function DesarrolloComercial({ setAyudanteText, onComplete }) {
  const [step, setStep] = useState(1);
  const [comercialData, setComercialData] = useState({
    localizacion: '',
    competidores: '',
    diferenciador: '',
    promocion: '',
    organizacion: ''
  });

  useEffect(() => {
    if (step === 1) {
      setAyudanteText(`¡Fase 4: Desarrollo Comercial!<br/><br/>Empecemos por la <b>Localización Física</b>. ¿Dónde operará tu negocio y por qué es el lugar ideal?`);
    } else if (step === 2) {
      setAyudanteText(`Sigamos con el <b>Análisis de Mercado</b>. Identifica a tus competidores (Villanos) y escribe cuál es tu ventaja única (Súper Poder / Diferenciador).`);
    } else if (step === 3) {
      setAyudanteText(`¡Excelente! Ahora la <b>Estrategia de Promoción</b>. ¿Qué canales usarás para atraer a tus clientes? Redes sociales, volantes, alianzas...`);
    } else if (step === 4) {
      setAyudanteText(`Finalmente, la <b>Estructura Organizacional</b>. ¿Quién hará qué en tu equipo de trabajo?`);
    } else if (step === 5) {
      setAyudanteText(`¡Fase 4 Completada! 🏢<br/><br/>El núcleo de tu negocio está listo para operar en el mercado.`);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (step === 1 && !comercialData.localizacion.trim()) return;
    if (step === 2 && (!comercialData.competidores.trim() || !comercialData.diferenciador.trim())) return;
    if (step === 3 && !comercialData.promocion.trim()) return;
    if (step === 4 && !comercialData.organizacion.trim()) return;
    setStep(prev => prev + 1);
  };

  const handleComplete = () => {
    onComplete(comercialData);
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {/* PASO 1: LOCALIZACIÓN */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <MapPin size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Localización Estratégica</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Describe dónde se ubicará tu negocio (físico o virtual) y por qué.</p>
            
            <textarea 
              value={comercialData.localizacion}
              onChange={e => setComercialData({...comercialData, localizacion: e.target.value})}
              placeholder="Ej: Estaremos ubicados cerca de la universidad X porque nuestro público principal estudia allí..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!comercialData.localizacion.trim()}>
              Fijar Ubicación
            </button>
          </motion.div>
        )}

        {/* PASO 2: MERCADO Y DIFERENCIADOR */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Users size={60} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>Análisis de Mercado</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', textAlign: 'left' }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={20} color="var(--danger)"/> Competidores (Villanos)
                </label>
                <textarea 
                  value={comercialData.competidores}
                  onChange={e => setComercialData({...comercialData, competidores: e.target.value})}
                  placeholder="Ej: Food trucks cercanos, aplicaciones de delivery..."
                  style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.1rem', outline: 'none', resize: 'none' }}
                />
              </div>
              
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={20} color="gold"/> Diferenciador (Súper Poder)
                </label>
                <textarea 
                  value={comercialData.diferenciador}
                  onChange={e => setComercialData({...comercialData, diferenciador: e.target.value})}
                  placeholder="Ej: Ofrecemos comida rápida saludable a precios de estudiante."
                  style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.1rem', outline: 'none', resize: 'none' }}
                />
              </div>
            </div>
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!comercialData.competidores.trim() || !comercialData.diferenciador.trim()}>
              Confirmar Estrategia de Mercado
            </button>
          </motion.div>
        )}

        {/* PASO 3: PROMOCIÓN */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Megaphone size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Estrategia de Promoción</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>¿Cómo vas a dar a conocer tu producto o servicio?</p>
            
            <textarea 
              value={comercialData.promocion}
              onChange={e => setComercialData({...comercialData, promocion: e.target.value})}
              placeholder="Ej: Marketing en TikTok e Instagram, alianzas con centros de estudiantes..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!comercialData.promocion.trim()}>
              Establecer Promoción
            </button>
          </motion.div>
        )}

        {/* PASO 4: ESTRUCTURA ORGANIZACIONAL */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Network size={60} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Estructura Organizacional</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>Define los roles de tu equipo. ¿Quién se encarga de qué?</p>
            
            <textarea 
              value={comercialData.organizacion}
              onChange={e => setComercialData({...comercialData, organizacion: e.target.value})}
              placeholder="Ej: Juan (Ventas y Marketing), María (Producción), Pedro (Finanzas)..."
              style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none', resize: 'none' }}
            />
            
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '2rem', width: '100%' }} disabled={!comercialData.organizacion.trim()}>
              Armar Equipo
            </button>
          </motion.div>
        )}

        {/* PASO 5: RESUMEN DE LA FASE */}
        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <CheckCircle2 size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>Desarrollo Comercial Listo</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>📍 Localización</h4>
                <p style={{ color: '#0f172a' }}>{comercialData.localizacion}</p>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <h4 style={{ color: 'gold', fontSize: '1.2rem' }}>⚔️ Mercado</h4>
                <p style={{ color: '#0f172a' }}><strong>Competencia:</strong> {comercialData.competidores}</p>
                <p style={{ color: '#0f172a' }}><strong>Diferenciador:</strong> {comercialData.diferenciador}</p>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>📢 Promoción</h4>
                <p style={{ color: '#0f172a' }}>{comercialData.promocion}</p>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <h4 style={{ color: 'var(--success)', fontSize: '1.2rem' }}>👥 Equipo</h4>
                <p style={{ color: '#0f172a' }}>{comercialData.organizacion}</p>
              </div>
            </div>

            <button className="btn-primary" onClick={handleComplete} style={{ marginTop: '3rem', width: '100%', fontSize: '1.3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin /> Finalizar Fase 4
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
