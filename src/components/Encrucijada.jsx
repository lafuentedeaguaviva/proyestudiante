import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Zap, ArrowLeft, ArrowRight, Play, CheckCircle, ExternalLink, Lightbulb } from 'lucide-react';

import PanelRecursos from './ui/PanelRecursos';

export default function Encrucijada({ onDecide, initialStep = 1, onStepChange }) {
  const [step, setStep] = useState(initialStep);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Recursos de la Encrucijada
  const recursosEncrucijada = [
    { id: 1, type: 'video', title: 'Innovación vs Emprendimiento', url: 'https://www.youtube.com/embed/jZ0y9F6Y9g0', videoKey: 'video_fase_0' },
    { id: 2, type: 'pista', title: 'Pista del Asistente', content: '¿Te gusta crear máquinas y mejorar procesos? Ve por Innovación. ¿Te gusta la idea de generar dinero y encontrar nichos de mercado? Ve por Emprendimiento.' },
    { id: 3, type: 'foto', title: 'Diagrama de Diferencias', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop' }
  ];

  useEffect(() => {
    if (initialStep !== step) {
      setStep(initialStep);
    }
  }, [initialStep]);

  const handleSetStep = (newStep) => {
    setStep(newStep);
    if (onStepChange) onStepChange(newStep);
  };
  
  // Para el paso 4
  const [decisionAnswers, setDecisionAnswers] = useState({});
  const [projectName, setProjectName] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const options = [
    {
      id: 'A',
      title: 'Emprendimiento Productivo',
      icon: <Briefcase size={80} color="var(--primary)" />,
      desc: 'He visto una necesidad en el mercado y quiero crear un negocio, vender un producto y generar ganancias económicas.',
      color: 'var(--primary)',
      bg: 'rgba(59, 130, 246, 0.1)'
    },
    {
      id: 'B',
      title: 'Proyecto de Innovación',
      icon: <Zap size={80} color="var(--accent)" />,
      desc: 'He visto que un proceso falla o es lento. Quiero inventar, mejorar o construir una herramienta tecnológica para solucionarlo.',
      color: 'var(--accent)',
      bg: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  const handleQuizSubmit = (answer) => {
    setQuizAnswered(true);
    if (answer === 'correct') {
      setQuizResult('¡Correcto! El emprendimiento busca satisfacer una necesidad del mercado, mientras que la innovación busca crear nuevas formas de solucionar un problema.');
    } else {
      setQuizResult('No exactamente. Recuerda: La innovación crea algo nuevo o mejora un proceso, el emprendimiento se enfoca en crear un negocio rentable basado en una necesidad.');
    }
  };

  const handleDecisionSubmit = () => {
    const randomId = Math.floor(Math.random() * 9000) + 1000;
    setProjectName(`Proyecto #${randomId}`);
    
    // Calcular recomendación
    let score = 0;
    if (decisionAnswers.q1 === 'emp') score++;
    if (decisionAnswers.q2 === 'emp') score++;
    
    if (score === 2) {
      setRecommendation("A");
    } else if (score === 0) {
      setRecommendation("B");
    } else {
      setRecommendation("MIXED");
    }
  };

  const handleDecideFinal = (optionId) => {
    // Aquí podríamos pasar el nombre del proyecto si onDecide lo soportara
    onDecide(optionId, projectName);
  };

  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
      
      <PanelRecursos recursos={recursosEncrucijada} />
      
      <AnimatePresence mode="wait">
        {/* PASO 1: VIDEO EXPLICATIVO */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>La Gran Encrucijada</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              Antes de tomar tu decisión, veamos este video corto para entender qué significa realmente hacer un Emprendimiento Productivo vs una Innovación Tecnológica.
            </p>
            
            <div style={{ padding: '2rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🎥 Video Explicativo</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Haz clic en el botón flotante de <strong>Recursos Disponibles</strong> (abajo a la derecha) para ver el video sobre las diferencias entre Innovación y Emprendimiento, junto con más material de apoyo.</p>
            </div>

            <button onClick={() => handleSetStep(2)} className="btn-primary" style={{ marginTop: '2rem', padding: '1rem 3rem', fontSize: '1.2rem' }}>
              Ya revisé los recursos, Continuar <ArrowRight size={20} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </button>
          </motion.div>
        )}

        {/* PASO 2: PREGUNTAS DE REFUERZO */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>¿Qué aprendimos?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Selecciona la afirmación correcta basándote en el video:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => handleQuizSubmit('correct')} 
                disabled={quizAnswered}
                style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--primary)', borderRadius: 'var(--radius)', color: 'white', textAlign: 'left', cursor: quizAnswered ? 'default' : 'pointer' }}
              >
                La innovación se trata de inventar o mejorar radicalmente un proceso, mientras que el emprendimiento es crear un modelo de negocio rentable.
              </button>
              <button 
                onClick={() => handleQuizSubmit('incorrect')} 
                disabled={quizAnswered}
                style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--primary)', borderRadius: 'var(--radius)', color: 'white', textAlign: 'left', cursor: quizAnswered ? 'default' : 'pointer' }}
              >
                Son exactamente lo mismo; cualquier negocio nuevo es una innovación tecnológica.
              </button>
            </div>

            {quizAnswered && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderLeft: '4px solid var(--success)', borderRadius: 'var(--radius)' }}>
                <CheckCircle color="var(--success)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                <span>{quizResult}</span>
              </motion.div>
            )}

            {quizAnswered && (
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => handleSetStep(1)} className="btn-outline">
                  <ArrowLeft size={20} style={{ display: 'inline', verticalAlign: 'middle' }} /> Atrás
                </button>
                <button onClick={() => handleSetStep(3)} className="btn-primary">
                  Siguiente Paso <ArrowRight size={20} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </button>
              </div>
            )}
            {!quizAnswered && (
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => handleSetStep(1)} className="btn-outline">
                  <ArrowLeft size={20} style={{ display: 'inline', verticalAlign: 'middle' }} /> Atrás
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* PASO 3: MATERIAL RECOMENDADO */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Casos de Éxito para Inspirarte</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Antes de decidir, mira cómo otros lo lograron en sus respectivos campos.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
              <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', borderRadius: 'var(--radius)' }}>
                <h3><Briefcase size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Emprendimiento</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>Cómo una cafetería local se convirtió en una franquicia millonaria identificando su nicho de mercado.</p>
                <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Leer Artículo <ExternalLink size={15}/></a>
              </div>
              <div style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--accent)', borderRadius: 'var(--radius)' }}>
                <h3><Zap size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Innovación</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>La historia detrás de la app que revolucionó la forma en que los agricultores miden la humedad de la tierra.</p>
                <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Ver Documental <ExternalLink size={15}/></a>
              </div>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => handleSetStep(2)} className="btn-outline">
                <ArrowLeft size={20} style={{ display: 'inline', verticalAlign: 'middle' }} /> Atrás
              </button>
              <button onClick={() => handleSetStep(4)} className="btn-primary">
                Continuar a la Decisión <ArrowRight size={20} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </button>
            </div>
          </motion.div>
        )}

        {/* PASO 4: PREGUNTAS DE DECISIÓN Y GUARDADO GENÉRICO */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1.5rem' }}><Lightbulb style={{ display: 'inline', verticalAlign: 'middle' }} color="var(--accent)" /> Reflexión Final</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Responde honestamente, esto te ayudará a elegir tu camino.</p>

            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>1. ¿Qué te motiva más?</p>
              <select onChange={(e) => setDecisionAnswers({...decisionAnswers, q1: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', color: 'white', borderRadius: 'var(--radius)' }}>
                <option value="">Selecciona una opción...</option>
                <option value="emp">Vender un producto o servicio y generar ingresos rápidamente.</option>
                <option value="inn">Crear algo que no existe para resolver un problema complejo.</option>
              </select>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>2. ¿A qué estarías dispuesto a dedicarle más tiempo?</p>
              <select onChange={(e) => setDecisionAnswers({...decisionAnswers, q2: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', color: 'white', borderRadius: 'var(--radius)' }}>
                <option value="">Selecciona una opción...</option>
                <option value="emp">A entender clientes, marketing y ventas.</option>
                <option value="inn">A investigar, desarrollar tecnología y probar prototipos.</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => handleSetStep(3)} className="btn-outline">
                <ArrowLeft size={20} style={{ display: 'inline', verticalAlign: 'middle' }} /> Atrás
              </button>
              <button 
                onClick={() => {
                  handleDecisionSubmit();
                  handleSetStep(5);
                }} 
                disabled={!decisionAnswers.q1 || !decisionAnswers.q2}
                className="btn-primary" 
                style={{ opacity: (!decisionAnswers.q1 || !decisionAnswers.q2) ? 0.5 : 1 }}
              >
                Confirmar Respuestas <ArrowRight size={20} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </button>
            </div>
          </motion.div>
        )}

        {/* PASO 5: ELECCIÓN FINAL */}
        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'white' }}>Toma tu Decisión</h2>
              
              {/* Sección de Recomendación */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                style={{ 
                  marginTop: '1.5rem', 
                  marginBottom: '1.5rem',
                  padding: '1.5rem', 
                  background: 'rgba(59, 130, 246, 0.15)', 
                  border: '1px solid var(--primary)', 
                  borderRadius: 'var(--radius-lg)' 
                }}
              >
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Lightbulb size={24} /> Recomendación de la IA
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {recommendation === 'A' && "Basado en tus respuestas, tienes un perfil fuertemente inclinado hacia los negocios y las ventas. Te recomendamos elegir el Emprendimiento Productivo (Camino A)."}
                  {recommendation === 'B' && "Basado en tus respuestas, tienes un perfil altamente técnico e inventivo. Te recomendamos elegir el Proyecto de Innovación (Camino B)."}
                  {recommendation === 'MIXED' && "Basado en tus respuestas, tienes un perfil híbrido. Tienes habilidades tanto para los negocios como para la invención técnica. ¡Cualquiera de los dos caminos será excelente para ti!"}
                </p>
              </motion.div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '1rem' }}>
                Sin importar nuestra recomendación, el poder está en tus manos. Es hora de elegir el rumbo para tu <strong style={{ color: 'var(--primary)' }}>{projectName}</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {options.map((opt, i) => (
                <motion.div
                  key={opt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10, boxShadow: `0 10px 30px ${opt.bg}` }}
                  className="glass-panel"
                  style={{ 
                    flex: '1 1 300px', 
                    padding: '3rem 2rem', 
                    cursor: 'pointer',
                    borderTop: `4px solid ${opt.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '350px'
                  }}
                  onClick={() => handleDecideFinal(opt.id)}
                >
                  <div style={{ marginBottom: '1.5rem' }}>{opt.icon}</div>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: opt.color }}>{opt.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>{opt.desc}</p>
                  
                  <button 
                    style={{
                      marginTop: '2rem',
                      background: opt.color,
                      color: 'white',
                      border: 'none',
                      padding: '0.8rem 2rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    Elegir este Camino
                  </button>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <button onClick={() => handleSetStep(4)} className="btn-outline">
                <ArrowLeft size={20} style={{ display: 'inline', verticalAlign: 'middle' }} /> Volver a la Reflexión
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
