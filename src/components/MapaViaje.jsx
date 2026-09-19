import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, X, Lock, CheckCircle2, User, Users, Rocket, Target, Star, Play, Coins, FileText, Presentation, Mic, ChevronDown, Megaphone, MapPin, Settings, Network, TrendingUp, Heart, Bot } from 'lucide-react';

export default function MapaViaje({ isOpen, onClose, faseActiva, maxFaseDesbloqueada, jumpToPhase, caminoElegido }) {
  
  const [expandedId, setExpandedId] = useState(null);

  const niveles = [
    { id: 0, title: 'El Inicio del Viaje', icon: <User />, pasos: ['Bienvenida', 'Video', 'Cuestionario Orientador', 'Elección de Camino'] },
    { 
      id: 1, 
      title: 'Fase 1: Encontrar la idea', 
      icon: <Rocket />, 
      pasos: ['Selección de Área', 'Video: El Arte de observar problemas', 'Observación del Entorno', 'Video: ¿Por qué fallan las soluciones?', 'Análisis de Fricciones', 'Guía: Brainstorming Efectivo', 'Lluvia de Ideas', 'Video: Evaluación objetiva', 'Matriz de Batalla', 'Idea Ganadora y Pitch'] 
    },
    { 
      id: 2, 
      title: 'Fase 2: Validación de la Idea', 
      icon: <Target />, 
      pasos: ['Introducción a la Validación', 'Diseño de la Encuesta', 'Explicación de la Matriz', 'Codificación de Preguntas', 'Tabulación de Resultados', 'Análisis de Resultados', 'Resumen IA'] 
    },
    { id: 3, title: 'Fase 3: Público Objetivo', icon: <Users />, pasos: ['Video Público Objetivo', 'Público Objetivo'] },
    { 
      id: 4, 
      title: 'Fase 4: Diseño de producto', 
      icon: <Star />, 
      pasos: ['Video Diseño Producto/Servicio', 'Qué vas a vender', 'Video Características', 'Características', 'Beneficios', 'Video Empaque', 'Empaque', 'Presentación', 'Video Demanda Potencial', 'Demanda Potencial', 'Resumen IA'] 
    },
    { 
      id: 5, 
      title: 'Fase 5: Estrategia de Marketing', 
      icon: <Megaphone />, 
      pasos: ['1. Video: Análisis de competencia', '2. Análisis de competencia', '3. Video: Ventaja competitiva', '4. Tu Ventaja Competitiva', '5. Video: Análisis del entorno', '6. Análisis del entorno (Factores externos)', '7. Video: Estrategia de promoción', '8. Estrategia de promoción', '9. Resumen IA'] 
    },
    { 
      id: 6, 
      title: 'Fase 6: Localización', 
      icon: <Truck />, 
      pasos: ['Video Localización', 'Identificación', 'Canales', 'Elección Lugar', 'Croquis', 'Pagos', 'Video Plan Dist.', 'Plan Acción', 'Resumen IA'] 
    },
    { id: 7, title: 'Fase 7: Planteamiento', icon: <CheckCircle2 />, pasos: [
        'Video Diagnóstico', 'Diagnóstico del contexto',
        'Video Objetivos', 'Objetivos',
        'Video Misión', 'Misión',
        'Video Visión', 'Visión',
        'Video Justificación', 'Justificación',
        'Resumen IA'
    ] },
    { id: 8, title: 'Fase 8: La Operación', icon: <Settings />, pasos: ['1. Video: Listado de procesos', '2. Definir Pasos', '3. Revisión de Procesos', '4. Video: Diagrama de Procesos', '5. Juego: Clasificación de Procesos', '6. Video: Layout del Negocio', '7. Juego: Zonas de Trabajo'] },
    { id: 9, title: 'Fase 9: Estructura Org.', icon: <Network />, pasos: ['Organigrama', 'Roles'] },
    { id: 10, title: 'Fase 10: Viabilidad', icon: <TrendingUp />, pasos: ['Inversión Inicial', 'Costos Fijos y Variables', 'Precios y Equilibrio', 'Video Utilidad', 'Utilidad e Impuestos', 'Video Equilibrio', 'Punto de Equilibrio', 'Video Evaluación', 'VAN y TIR'] },
    { id: 11, title: 'Fase 11: Consolidación del Documento', icon: <FileText />, pasos: ['Intro', 'Resultados', 'Conclusiones', 'Agradecimientos', 'Dedicatoria', 'Resumen IA'] },
    { id: 12, title: 'Fase 12: Proyecto de Vida', icon: <Heart />, pasos: ['Alineación', 'Metas', 'Equilibrio', 'Legado', 'Resumen IA'] },
    { id: 13, title: 'Fase 13: Documento Final IA', icon: <Bot />, pasos: ['Configuración IA'] }
  ];

  const checkStatus = (nivelId) => {
    if (faseActiva === nivelId) return 'current';
    if (nivelId <= maxFaseDesbloqueada) return 'unlocked';
    return 'locked';
  };

  const handleCardClick = (nivelId, status) => {
    if (status === 'locked') return;
    if (expandedId === nivelId) {
      setExpandedId(null);
    } else {
      setExpandedId(nivelId);
    }
  };

  const handlePasoNavigate = (nivelId, pasoId, e) => {
    e.stopPropagation();
    jumpToPhase(nivelId, pasoId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.95)', zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            overflowY: 'auto', padding: '2rem 0'
          }}
        >
          <button onClick={onClose} style={{ position: 'fixed', top: '2rem', right: '3rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', zIndex: 110 }}>
            <X size={40} />
          </button>
          
          <h2 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
            <Map size={40} /> Mapa del Emprendedor
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', width: '100%', maxWidth: '1200px', gap: '1.5rem', justifyContent: 'center', padding: '0 2rem' }}>
            {niveles.map((nivel, idx) => {
              const status = checkStatus(nivel.id);
              const isExpanded = expandedId === nivel.id;
              
              return (
                <motion.div
                  key={nivel.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleCardClick(nivel.id, status)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '120px',
                    borderRadius: 'var(--radius-lg)',
                    background: status === 'current' ? 'var(--primary)' : status === 'unlocked' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: status === 'current' ? '2px solid white' : status === 'unlocked' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: isExpanded ? 'flex-start' : 'center',
                    cursor: status === 'locked' ? 'not-allowed' : 'pointer',
                    boxShadow: status === 'current' ? '0 0 30px var(--primary)' : 'none',
                    opacity: status === 'locked' ? 0.5 : 1,
                    padding: '1.5rem 1rem',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={status !== 'locked' ? { scale: 1.02 } : {}}
                >
                  <div style={{ color: status === 'current' ? 'white' : status === 'unlocked' ? 'var(--primary)' : 'rgba(255,255,255,0.3)', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    {status === 'locked' ? <Lock size={30} /> : nivel.icon}
                  </div>
                  <span style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{nivel.title}</span>
                  
                  {status !== 'locked' && (
                    <ChevronDown size={15} style={{ color: 'white', marginTop: '0.5rem', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                  )}

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', width: '100%', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                      >
                        {nivel.pasos.map((pasoTitle, pasoIndex) => (
                          <button
                            key={pasoIndex}
                            onClick={(e) => handlePasoNavigate(nivel.id, pasoIndex, e)}
                            style={{
                              padding: '0.5rem',
                              background: 'rgba(0,0,0,0.3)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: 'white',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.3)'}
                          >
                            Paso {pasoIndex + 1}: {pasoTitle}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              )
            })}
          </div>
          
        </motion.div>
      )}
    </AnimatePresence>
  );
}
