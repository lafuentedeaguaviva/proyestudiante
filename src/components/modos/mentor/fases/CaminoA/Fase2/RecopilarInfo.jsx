import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, Bot, CheckSquare, Send, HelpCircle } from 'lucide-react';
import YoutubePlayer from '../../../../../ui/YoutubePlayer';

export default function RecopilarInfo({ projectName, perfilIA, setAyudanteText, onComplete }) {
  const [fase, setFase] = useState('intro'); // 'intro' | 'loading_ai' | 'survey'
  const [preguntasGeneradas, setPreguntasGeneradas] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    if (fase === 'intro') {
      setAyudanteText(`¡Excelente!<br/><br/>Ya sabemos que nuestro público es <b>${perfilIA?.nombre || 'tu cliente ideal'}</b>. Ahora debemos salir a la calle (o a internet) y encuestarlos para validar nuestra idea.`);
    } else if (fase === 'loading_ai') {
      setAyudanteText(`Redactando la encuesta...<br/><br/>Estoy usando técnicas de validación de mercado para crear las preguntas exactas que debes hacer.`);
    } else if (fase === 'survey') {
      setAyudanteText(`¡Encuesta lista! 📋<br/><br/>Simulemos que sales a encuestar. Lee las preguntas y responde cómo crees que respondería la mayoría de tu público objetivo.`);
    }
  }, [fase, setAyudanteText, perfilIA]);

  const generarEncuesta = () => {
    setFase('loading_ai');
    setTimeout(() => {
      setPreguntasGeneradas([
        { id: 1, tipo: 'opcion', pregunta: `¿Con qué frecuencia experimentas el problema que resuelve ${projectName}?`, opciones: ['Todos los días', 'Algunas veces a la semana', 'Rara vez', 'Nunca'] },
        { id: 2, tipo: 'opcion', pregunta: `¿Cuánto estarías dispuesto a pagar por una solución efectiva?`, opciones: ['Poco, busco algo económico', 'Lo justo si realmente funciona', 'Pagaría un precio premium por calidad'] },
        { id: 3, tipo: 'texto', pregunta: `¿Qué es lo más importante para ti al elegir este tipo de producto/servicio?` },
        { id: 4, tipo: 'opcion', pregunta: `¿Actualmente usas alguna otra alternativa en el mercado?`, opciones: ['Sí, estoy satisfecho', 'Sí, pero quiero cambiar', 'No, no he encontrado nada'] },
      ]);
      setFase('survey');
    }, 3500);
  };

  const handleRespuestaChange = (idPregunta, valor) => {
    setRespuestas({ ...respuestas, [idPregunta]: valor });
  };

  const allAnswered = preguntasGeneradas.length > 0 && preguntasGeneradas.every(p => 
    respuestas[p.id] && respuestas[p.id].trim() !== ''
  );

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {/* FASE 1: INTRO */}
        {fase === 'intro' && (
          <motion.div key="intro-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <FileSearch size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Recopilación de Información</h2>
            
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(59, 130, 246, 0.3)', textAlign: 'left' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem', textAlign: 'center' }}>🎥 Aprende a hacer Encuestas de Mercado:</h3>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '2px solid rgba(255,255,255,0.1)' }}>
                <YoutubePlayer 
                  videoKey="video_fase_2"
                  fallbackUrl="https://www.youtube.com/embed/zM2a1B8Wb20"
                  title="Cómo hacer encuestas"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              Para tu proyecto <strong>{projectName}</strong>, necesitas validar si a la gente realmente le interesa. Vamos a generar una encuesta estructurada para tu público.
            </p>

            <button className="btn-primary" onClick={generarEncuesta} style={{ fontSize: '1.3rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileSearch /> Generar Encuesta de Mercado
            </button>
          </motion.div>
        )}

        {/* FASE 2: LOADING */}
        {fase === 'loading_ai' && (
          <motion.div key="loading-ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ display: 'inline-block', marginBottom: '2rem' }}>
              <FileSearch size={80} color="var(--accent)" />
            </motion.div>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>Estructurando Preguntas...</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Adaptando la metodología Lean Startup a tu proyecto.</p>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '3rem', overflow: 'hidden' }}>
              <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3.5 }} style={{ height: '100%', background: 'var(--accent)' }} />
            </div>
          </motion.div>
        )}

        {/* FASE 3: SURVEY */}
        {fase === 'survey' && (
          <motion.div key="survey-view" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', color: '#0f172a' }}>Tu Encuesta de Validación</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem', textAlign: 'center' }}>
              Simula que aplicaste esta encuesta a 10 personas de tu Público Objetivo. Ingresa los resultados mayoritarios.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
              {preguntasGeneradas.map((q, index) => (
                <div key={q.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HelpCircle size={20} /> {index + 1}. {q.pregunta}
                  </h4>
                  
                  {q.tipo === 'opcion' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.opciones.map(opt => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#0f172a', background: respuestas[q.id] === opt ? 'rgba(59, 130, 246, 0.2)' : 'transparent', padding: '0.5rem', borderRadius: '4px', transition: 'background 0.2s' }}>
                          <input 
                            type="radio" 
                            name={`pregunta_${q.id}`} 
                            value={opt} 
                            checked={respuestas[q.id] === opt}
                            onChange={() => handleRespuestaChange(q.id, opt)}
                            style={{ accentColor: 'var(--primary)', transform: 'scale(1.2)' }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea 
                      placeholder="Escribe el resumen de lo que respondería la mayoría..."
                      value={respuestas[q.id] || ''}
                      onChange={(e) => handleRespuestaChange(q.id, e.target.value)}
                      rows={3}
                      style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', color: '#0f172a', resize: 'none', outline: 'none' }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                className="btn-primary" 
                disabled={!allAnswered}
                onClick={() => onComplete(preguntasGeneradas, respuestas)}
                style={{ opacity: allAnswered ? 1 : 0.5, fontSize: '1.3rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Send /> Finalizar Encuesta
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
