import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Swords, ArrowRight, Bot, CheckSquare, Square } from 'lucide-react';
import YoutubePlayer from '../../../../../ui/YoutubePlayer';

export default function LluviaIdeas({ camino, setAyudanteText, onComplete, initialIdeas = [] }) {
  const [vista, setVista] = useState('video'); // 'video' | 'inputs' | 'loading_ai' | 'selection'
  const [ideasUsuario, setIdeasUsuario] = useState(initialIdeas);
  const [nuevaIdea, setNuevaIdea] = useState('');
  
  // Estado para la IA
  const [ideasIA, setIdeasIA] = useState([]);
  const [ideasSeleccionadas, setIdeasSeleccionadas] = useState([]);

  useEffect(() => {
    if (vista === 'video') {
      setAyudanteText(`¡Fase 1 Iniciada!<br/><br/>Ya que elegiste <b>${camino}</b>, es hora de la Lluvia de Ideas. Pero primero, mira este video para saber cómo hacerlo correctamente.`);
    } else if (vista === 'inputs') {
      setAyudanteText(`¡A crear!<br/><br/>Escribe todas las soluciones que se te ocurran (mínimo 2) y presiona 'Agregar'. ¡No hay ideas malas!`);
    } else if (vista === 'loading_ai') {
      setAyudanteText(`¡Excelente trabajo!<br/><br/>Ahora la IA tomará tus ideas, las mejorará y generará más opciones basadas en tu rubro...`);
      
      // Simular tiempo de la IA y generar ideas
      const timer = setTimeout(() => {
        generarIdeasIA();
        setVista('selection');
      }, 3500);
      return () => clearTimeout(timer);
    } else if (vista === 'selection') {
      setAyudanteText(`¡Magia pura! ✨<br/><br/>He reformulado tus ideas y agregado nuevas. Selecciona un máximo de 5 ideas con mayor potencial para llevarlas a la Batalla.`);
    }
  }, [camino, setAyudanteText, vista]);

  const handleAddIdea = () => {
    if (nuevaIdea.trim()) {
      setIdeasUsuario([...ideasUsuario, { id: Date.now().toString(), texto: nuevaIdea }]);
      setNuevaIdea('');
    }
  };

  const handleDelete = (idToRemove) => {
    setIdeasUsuario(ideasUsuario.filter(i => i.id !== idToRemove));
  };

  const generarIdeasIA = () => {
    // Tomar las ideas del usuario y reformularlas con la estructura solicitada
    const reformuladas = ideasUsuario.map((idea, index) => ({
      id: `ai-${index}`,
      texto: `Mi producto/servicio ("${idea.texto}") ayuda a los clientes potenciales a lograr sus metas más rápido sin tener que sufrir las demoras actuales.`
    }));

    // Ideas generadas aleatoriamente para llegar a 10, siguiendo la estructura estricta
    const mockNuevas = [
      "Mi aplicación móvil ayuda a personas ocupadas a lograr solicitar servicios a domicilio sin tener que sufrir largas esperas al teléfono.",
      "Mi sistema de suscripción ayuda a familias a lograr tener productos frescos semanales sin tener que sufrir viajes constantes al mercado.",
      "Mi consultoría especializada ayuda a pequeños comercios a lograr digitalizar sus ventas sin tener que sufrir el alto costo de agencias enormes.",
      "Mi plataforma web ayuda a técnicos independientes a lograr conseguir más clientes sin tener que sufrir pagando publicidad cara.",
      "Mi red colaborativa ayuda a emprendedores a lograr distribuir sus productos sin tener que sufrir las altas comisiones de los couriers tradicionales."
    ];

    let combinadas = [...reformuladas];
    let i = 0;
    while (combinadas.length < 10 && i < mockNuevas.length) {
      combinadas.push({
        id: `ai-new-${i}`,
        texto: mockNuevas[i]
      });
      i++;
    }

    setIdeasIA(combinadas);
  };

  const toggleSelection = (idea) => {
    const isSelected = ideasSeleccionadas.find(i => i.id === idea.id);
    
    if (isSelected) {
      setIdeasSeleccionadas(ideasSeleccionadas.filter(i => i.id !== idea.id));
    } else {
      if (ideasSeleccionadas.length < 5) {
        setIdeasSeleccionadas([...ideasSeleccionadas, idea]);
      } else {
        alert("¡Solo puedes seleccionar un máximo de 5 ideas para la Batalla!");
      }
    }
  };

  const handleFinalContinue = () => {
    if (ideasSeleccionadas.length >= 2 && ideasSeleccionadas.length <= 5) {
      onComplete(ideasSeleccionadas);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {/* PANTALLA 1: VIDEO */}
        {vista === 'video' && (
          <motion.div key="video-view" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Lightbulb size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Lluvia de Ideas</h2>
            
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>🎥 Antes de empezar, mira cómo hacer una Lluvia de Ideas:</h3>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '2px solid rgba(255,255,255,0.1)' }}>
                <YoutubePlayer 
                  videoKey="video_f2_lluvia"
                  fallbackUrl="https://www.youtube.com/embed/yFjK8zFhN0k"
                  title="Tutorial Brainstorming"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.1rem' }}>
                Anota todas las ideas que se te ocurran basándote en los problemas que observaste. ¡No hay ideas malas en este punto!
              </p>
            </div>

            <button 
              className="btn-primary" 
              style={{ fontSize: '1.3rem', padding: '1rem 3rem' }} 
              onClick={() => setVista('inputs')}
            >
              Comenzar a escribir ideas <ArrowRight style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '0.5rem' }}/>
            </button>
          </motion.div>
        )}

        {/* PANTALLA 2: INPUTS */}
        {vista === 'inputs' && (
          <motion.div key="inputs-view" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Tus Ideas</h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <input 
                type="text" 
                value={nuevaIdea}
                onChange={e => setNuevaIdea(e.target.value)}
                placeholder="Ej: Crear un sistema de riego automatizado con Arduino..."
                style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#0f172a', fontSize: '1.2rem', outline: 'none' }}
                onKeyDown={e => e.key === 'Enter' && handleAddIdea()}
              />
              <button className="btn-primary" onClick={handleAddIdea}>Agregar Idea</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <AnimatePresence>
                {ideasUsuario.map((idea, idx) => (
                  <motion.div 
                    key={idea.id} 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div><span style={{ color: 'var(--primary)', fontWeight: 'bold', marginRight: '1rem' }}>#{idx + 1}</span> {idea.texto}</div>
                    <button onClick={() => handleDelete(idea.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {ideasUsuario.length >= 2 && (
              <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className="btn-primary" 
                style={{ marginTop: '3rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '3rem auto 0 auto', background: 'linear-gradient(45deg, var(--accent), #d946ef)', border: 'none', boxShadow: '0 0 20px rgba(217, 70, 239, 0.4)' }}
                onClick={() => setVista('loading_ai')}
              >
                <Bot /> Potenciar con Inteligencia Artificial
              </motion.button>
            )}
          </motion.div>
        )}

        {/* PANTALLA 3: LOADING IA */}
        {vista === 'loading_ai' && (
           <motion.div key="loading-ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
               style={{ display: 'inline-block', marginBottom: '2rem' }}
             >
               <Bot size={80} color="var(--accent)" />
             </motion.div>
             <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>IA Reformulando tus ideas...</h2>
             <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Mejorando tus propuestas y agregando nuevas perspectivas al listado.</p>
             
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

        {/* PANTALLA 4: SELECCIÓN FINAL */}
        {vista === 'selection' && (
          <motion.div key="selection-view" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>Selecciona tus Favoritas</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              La IA ha pulido tus ideas y generado nuevas alternativas. Elige <strong>entre 2 y 5 ideas</strong> para llevarlas a la Batalla. Llevas {ideasSeleccionadas.length}/5.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
              {ideasIA.map((idea) => {
                const isSelected = ideasSeleccionadas.find(i => i.id === idea.id);
                return (
                  <motion.div 
                    key={idea.id} 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleSelection(idea)}
                    style={{ 
                      background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', 
                      border: isSelected ? '2px solid var(--success)' : '1px solid rgba(255,255,255,0.1)',
                      padding: '1.5rem', 
                      borderRadius: 'var(--radius-md)', 
                      fontSize: '1.1rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ color: isSelected ? 'var(--success)' : 'rgba(255,255,255,0.5)' }}>
                      {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                    </div>
                    <div style={{ color: isSelected ? 'white' : 'var(--text-secondary)' }}>
                      {idea.texto}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div style={{ marginTop: '3rem' }}>
              <button 
                className="btn-primary" 
                disabled={ideasSeleccionadas.length < 2 || ideasSeleccionadas.length > 5}
                onClick={handleFinalContinue}
                style={{ 
                  opacity: (ideasSeleccionadas.length >= 2 && ideasSeleccionadas.length <= 5) ? 1 : 0.5,
                  fontSize: '1.3rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  margin: '0 auto' 
                }}
              >
                <Swords /> Llevar Seleccionadas a la Batalla
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
