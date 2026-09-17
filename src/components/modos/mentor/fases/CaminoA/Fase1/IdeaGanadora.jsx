import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Bot, Sparkles, CheckCircle, PenTool, AlignLeft, Sparkle } from 'lucide-react';

export default function IdeaGanadora({ ganadora, setAyudanteText, onCompleteFinal }) {
  const [fase, setFase] = useState('analyzing'); // 'analyzing' | 'feedback' | 'title' | 'description'
  
  const [tituloProyecto, setTituloProyecto] = useState('');
  const [descripcionProyecto, setDescripcionProyecto] = useState('');

  const [nombresIA, setNombresIA] = useState([]);
  const [descripcionesIA, setDescripcionesIA] = useState([]);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  // Simular análisis de IA inicial
  useEffect(() => {
    if (fase === 'analyzing') {
      setAyudanteText(`¡Tenemos una ganadora! 🏆<br/><br/>Ahora la estoy analizando con mis motores de Inteligencia Artificial para darte retroalimentación experta sobre cómo ejecutarla...`);
      const timer = setTimeout(() => {
        setFase('feedback');
      }, 3500); // Simular 3.5 segundos de carga de IA
      return () => clearTimeout(timer);
    }
    
    if (fase === 'feedback') {
      setAyudanteText(`¡Análisis completo! ✨<br/><br/>He evaluado tu idea y te he preparado algunas sugerencias para hacerla aún más innovadora y rentable. Léelas con atención.`);
    }

    if (fase === 'title') {
      setAyudanteText(`¡Llegó el momento del bautizo! 📝<br/><br/>Basado en todo lo que hemos definido, escribe el Título Oficial de tu Emprendimiento. ¡Puedes pedirme ayuda si no se te ocurre nada!`);
    }

    if (fase === 'description') {
      setAyudanteText(`¡Excelente nombre! 🚀<br/><br/>Ahora, redacta un breve resumen o "pitch" de tu proyecto. ¿Qué hace y para quién es? Pídeme ideas si lo necesitas.`);
    }
  }, [fase, setAyudanteText]);

  if (!ganadora) return <div style={{ color: '#0f172a', textAlign: 'center' }}>No hay idea ganadora. Regresa a la batalla.</div>;

  const handleFinish = () => {
    if (tituloProyecto.trim() && descripcionProyecto.trim()) {
      onCompleteFinal(tituloProyecto.trim(), descripcionProyecto.trim());
    }
  };

  const generarNombres = () => {
    setIsGeneratingTitle(true);
    setTimeout(() => {
      // Nombres estáticos de ejemplo basados en la idea (simulado)
      setNombresIA([
        "Eco" + ganadora.texto.split(" ")[0].substring(0, 5) + " Innova",
        "Smart Solutions 360",
        "Pro" + ganadora.texto.split(" ").slice(-1)[0] + " Tech"
      ]);
      setIsGeneratingTitle(false);
    }, 1500);
  };

  const generarDescripciones = () => {
    setIsGeneratingDesc(true);
    setTimeout(() => {
      // Descripciones estáticas de ejemplo (simulado)
      setDescripcionesIA([
        `${tituloProyecto} es una plataforma innovadora diseñada para transformar el proceso de "${ganadora.texto}", optimizando recursos y entregando un valor superior al cliente.`,
        `Nuestro proyecto, ${tituloProyecto}, aborda directamente la necesidad de "${ganadora.texto}". Utilizando tecnología moderna, buscamos resolver este problema local con un enfoque escalable y sostenible.`
      ]);
      setIsGeneratingDesc(false);
    }, 1500);
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* SECCIÓN 1: ANALIZANDO (LOADING IA) */}
      <AnimatePresence mode="wait">
        {fase === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              style={{ display: 'inline-block', marginBottom: '2rem' }}
            >
              <Bot size={80} color="var(--accent)" />
            </motion.div>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>IA Analizando Viabilidad...</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Consultando bases de datos de emprendimiento y analizando "{ganadora.texto}"</p>
            
            {/* Barra de progreso simulada */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '3rem', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: '0%' }} 
                animate={{ width: '100%' }} 
                transition={{ duration: 3.5 }}
                style={{ height: '100%', background: 'var(--accent)' }}
              />
            </div>
          </motion.div>
        )}

        {/* SECCIÓN 2: FEEDBACK DE LA IA */}
        {(fase === 'feedback' || fase === 'title' || fase === 'description') && (
          <motion.div key="feedback" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '3rem' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <Trophy size={60} color="gold" style={{ margin: '0 auto 1rem auto' }} />
              <h2 style={{ fontSize: '2.5rem', color: 'gold', marginBottom: '1rem' }}>¡Tu Idea Ganadora!</h2>
              <h3 style={{ fontSize: '1.8rem', background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '2px solid gold' }}>
                "{ganadora.texto}"
              </h3>
              <p style={{ fontSize: '1.2rem', color: 'var(--primary)', marginTop: '1rem' }}>Puntaje de Viabilidad: <strong>{ganadora.total} / 30</strong></p>
            </div>

            {fase === 'feedback' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                  <Sparkles color="var(--accent)" />
                  <h3 style={{ fontSize: '1.5rem', color: '#0f172a' }}>Reporte de Inteligencia Artificial</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}><CheckCircle size={18} style={{ display: 'inline', verticalAlign: 'middle' }}/> Viabilidad</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>Esta idea tiene excelente potencial. Resuelve un problema claro del entorno y aprovecha tus conocimientos actuales.</p>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>💡 Sugerencia de Innovación</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>Intenta agregarle un modelo de suscripción mensual o un componente digital (ej: reservas por WhatsApp) para diferenciarte de la competencia.</p>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button className="btn-primary" style={{ fontSize: '1.3rem', padding: '1rem 3rem' }} onClick={() => setFase('title')}>
                    Excelente, continuemos <ArrowRight style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '0.5rem' }}/>
                  </button>
                </div>
              </motion.div>
            )}

            {/* SECCIÓN 3: DEFINIR EL TÍTULO */}
            {fase === 'title' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '3rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <PenTool size={40} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '1rem' }}>Bautiza tu Emprendimiento</h3>
                  
                  <input 
                    type="text" 
                    placeholder="Ej: EcoRiego Solutions, Dulce Amanecer..."
                    value={tituloProyecto}
                    onChange={(e) => setTituloProyecto(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      padding: '1.5rem',
                      fontSize: '1.5rem',
                      textAlign: 'center',
                      background: 'rgba(0,0,0,0.5)',
                      border: '2px solid var(--primary)',
                      borderRadius: 'var(--radius-lg)',
                      color: '#0f172a',
                      outline: 'none',
                      marginBottom: '1rem'
                    }}
                  />
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <button onClick={generarNombres} disabled={isGeneratingTitle} style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkle size={16} /> {isGeneratingTitle ? 'Generando...' : 'Generar ideas de Título con IA'}
                    </button>
                  </div>

                  {nombresIA.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                      {nombresIA.map((nombre, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setTituloProyecto(nombre)}
                          style={{ background: 'rgba(217, 70, 239, 0.1)', border: '1px solid var(--accent)', padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', color: '#0f172a' }}
                        >
                          {nombre}
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <button 
                      className="btn-primary" 
                      onClick={() => setFase('description')}
                      disabled={!tituloProyecto.trim()}
                      style={{ opacity: tituloProyecto.trim() ? 1 : 0.5, fontSize: '1.3rem', padding: '1rem 3rem' }}
                    >
                      Continuar a la Descripción <ArrowRight style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '0.5rem' }}/>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECCIÓN 4: DEFINIR LA DESCRIPCIÓN */}
            {fase === 'description' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '3rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <AlignLeft size={40} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '1rem' }}>Descripción de "{tituloProyecto}"</h3>
                  
                  <textarea 
                    placeholder="Escribe un breve resumen de qué trata tu emprendimiento, a quién va dirigido y por qué es genial..."
                    value={descripcionProyecto}
                    onChange={(e) => setDescripcionProyecto(e.target.value)}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '1.5rem',
                      fontSize: '1.2rem',
                      background: 'rgba(0,0,0,0.5)',
                      border: '2px solid var(--accent)',
                      borderRadius: 'var(--radius-lg)',
                      color: '#0f172a',
                      outline: 'none',
                      marginBottom: '1rem',
                      resize: 'none'
                    }}
                  />
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <button onClick={generarDescripciones} disabled={isGeneratingDesc} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkle size={16} /> {isGeneratingDesc ? 'Generando...' : 'Generar Descripción con IA'}
                    </button>
                  </div>

                  {descripcionesIA.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                      {descripcionesIA.map((desc, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setDescripcionProyecto(desc)}
                          style={{ width: '100%', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', padding: '1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', color: '#0f172a', textAlign: 'left' }}
                        >
                          {desc}
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <button 
                      className="btn-primary" 
                      onClick={handleFinish}
                      disabled={!descripcionProyecto.trim()}
                      style={{ opacity: descripcionProyecto.trim() ? 1 : 0.5, fontSize: '1.3rem', padding: '1rem 3rem' }}
                    >
                      Guardar y Finalizar Fase 1 <CheckCircle style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '0.5rem' }}/>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
