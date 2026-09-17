import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Check, ArrowRight, Sparkles, Lightbulb } from 'lucide-react';

export default function Paso6AsistenteIA({ cuadros, ideaSeleccionada, setIdeaSeleccionada, onNext }) {
  const [loading, setLoading] = useState(true);
  const [problemasRefinados, setProblemasRefinados] = useState([]);

  useEffect(() => {
    // La IA procesa cada cuadro (frustración + solución) y lo estructura
    const timer = setTimeout(() => {
      const refinados = cuadros.map((c, index) => ({
        id: c.id,
        titulo: `Idea #${index + 1}: ${c.solucionUsuario ? c.solucionUsuario.slice(0, 30) : 'Solución'}...`,
        descripcion: `Problema: ${c.frustracion}\nSolución Propuesta: ${c.solucionUsuario}`,
        match: (95 - index * 5) + '%' // Simular score de la IA evaluando la coherencia problema-solución
      }));
      setProblemasRefinados(refinados);
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [cuadros]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ textAlign: 'center', padding: '4rem 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ display: 'inline-block', marginBottom: '2rem' }}>
              <Bot size={80} color="var(--accent)" />
            </motion.div>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>La IA está evaluando tus ideas...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Estructurando las frustraciones con sus respectivas soluciones.</p>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Sparkles color="var(--accent)" /> Ideas Estructuradas por IA
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center', marginBottom: '3rem' }}>
              Aquí están las frustraciones combinadas con tus soluciones. Selecciona la idea de negocio que tenga mayor potencial para generar tu cuestionario.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              {problemasRefinados.map(problema => {
                const isSelected = ideaSeleccionada?.id === problema.id;
                
                return (
                  <div 
                    key={problema.id}
                    onClick={() => setIdeaSeleccionada(problema)}
                    style={{
                      background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 'var(--radius-md)',
                      padding: '2rem',
                      position: 'relative',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary)', borderRadius: '50%', padding: '5px' }}>
                        <Check color="white" size={20} />
                      </div>
                    )}
                    <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      Potencial AI: {problema.match}
                    </span>
                    <h3 style={{ color: '#0f172a', fontSize: '1.4rem', marginBottom: '1rem', color: '#ef4444' }}>
                      {problema.titulo}
                    </h3>
                    <pre style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', fontFamily: 'inherit', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '4px' }}>
                      {problema.descripcion}
                    </pre>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                className="btn-primary" 
                onClick={onNext}
                disabled={!ideaSeleccionada}
                style={{ opacity: ideaSeleccionada ? 1 : 0.5, fontSize: '1.3rem', padding: '1rem 3rem' }}
              >
                Generar mi Cuestionario <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
