import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Bot, Zap, Award, Monitor, Leaf, Utensils, HeartPulse, BookOpen, Palette, MoreHorizontal, PlusCircle, Trash2, Video, Eye, AlertCircle, Lightbulb, Compass, Filter, Target, Wrench, Cpu } from 'lucide-react';
import SidebarFases from '../components/ui/SidebarFases';
import ConfirmModal from '../components/ui/ConfirmModal';
import CaratulaFase from '../components/ui/CaratulaFase';
import SubMenuFases from '../components/ui/SubMenuFases';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StepNavigation from '../components/ui/StepNavigation';
import YoutubePlayer from '../components/ui/YoutubePlayer';
import { useFase1Logic } from '../hooks/useFase1Logic';

const DavidStar = ({ size = 24, color = "currentColor", fill = "none", onClick, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={fill} 
    stroke={color} 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    onClick={onClick}
    style={style}
  >
    <polygon points="12 2 20.66 17 3.34 17" />
    <polygon points="12 22 3.34 7 20.66 7" />
  </svg>
);

const Fase1_EmprendimientoMentor = () => {
  const navigate = useNavigate();
  const logic = useFase1Logic();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [customName, setCustomName] = useState('');
  const [showDataPopup, setShowDataPopup] = useState(false);

  const confirmChange = (action, message) => {
    setModalAction(() => action);
    setModalMessage(message || 'Si cambias esta selección, los datos asociados podrían perderse. ¿Estás seguro?');
    setModalOpen(true);
  };

  const {
    step, setStep, mentorData, area, setArea, observaciones, setObservaciones,
    fricciones, setFricciones, ideasIA, setIdeasIA, ideasSeleccionadas, setIdeasSeleccionadas,
    generandoIA, evaluaciones, setEvaluaciones, ideaGanadora, setIdeaGanadora,
    nombresSugeridos, setNombresSugeridos, nombreElegido, setNombreElegido, 
    pitchGenerado, setPitchGenerado, generandoPitch,
    handleSiguiente, solicitarIdeasIA, solicitarNombresIA, solicitarPitchIA, 
    actualizarIdeasSeleccionadas, actualizarIdeasIA,
    autoGuardar, guardarYFinalizar, currentDialog, generarFraseProblema,
    resumenGuardado, generandoResumen, guardarIdeaGanadoraParcial
  } = logic;

  useEffect(() => {
    if (step === 7 && ideaGanadora && nombresSugeridos.length === 0) {
      solicitarNombresIA(ideaGanadora);
    }
  }, [step, ideaGanadora, nombresSugeridos, solicitarNombresIA]);

  const handleEditIdea = (idx, newText) => {
    const oldText = ideasIA[idx];
    const newIdeas = [...ideasIA];
    newIdeas[idx] = newText;
    setIdeasIA(newIdeas);

    if (ideasSeleccionadas.includes(oldText)) {
      setIdeasSeleccionadas(ideasSeleccionadas.map(i => i === oldText ? newText : i));
    }
    
    // Si la idea tenía evaluaciones en la batalla, transferirlas a la nueva llave
    if (evaluaciones && evaluaciones[oldText]) {
      const nuevasEvaluaciones = { ...evaluaciones };
      nuevasEvaluaciones[newText] = nuevasEvaluaciones[oldText];
      delete nuevasEvaluaciones[oldText];
      setEvaluaciones(nuevasEvaluaciones);
      logic.actualizarEvaluaciones(nuevasEvaluaciones);
    }
  };

  if (logic.loading) {
    return <LoadingSpinner text="Cargando a tu Mentor..." className="min-h-screen" />;
  }

  if (!logic.mentorData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
        <h2>Error: No se encontraron los datos del mentor.</h2>
        <p>Asegúrate de haber ejecutado los scripts SQL para poblar la base de datos (Fase 1).</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <SidebarFases />
      <ConfirmModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={() => {
          if (modalAction) modalAction();
          setModalOpen(false);
        }} 
        message={modalMessage} 
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {step === 0 && (
          <CaratulaFase
            faseNumber={1}
            titulo="Encontrar la idea"
            descripcion="Aprende a observar tu entorno para detectar problemas reales y convertirlos en ideas de negocio valiosas."
            icono={Zap}
            colorPrincipal="#ca8a04"
            onStart={() => logic.handleSiguiente()}
          />
        )}

        {step > 0 && (
          <>
            {/* Mentor Avatar Section */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '3rem' }}>
              <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(250,204,21,0.4)', flexShrink: 0 }}>
                <Bot size={40} color="#854d0e" />
              </div>
              <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '1rem', borderTopLeftRadius: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#ca8a04', fontSize: '1.1rem', fontWeight: 700 }}>El Mentor</h3>
                <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6, color: '#334155' }}>{currentDialog()}</p>
              </div>
            </div>

            {/* Progress Bar & Tabs */}
            <SubMenuFases 
              tabs={[
                { id: 1, icon: <Monitor size={18} />, label: 'Área' },
                { id: 2, icon: <Video size={18} />, label: 'Problemas' },
                { id: 3, icon: <Eye size={18} />, label: 'Observación' },
                { id: 4, icon: <Video size={18} />, label: 'Soluciones' },
                { id: 5, icon: <AlertCircle size={18} />, label: 'Fricciones' },
                { id: 6, icon: <Video size={18} />, label: 'Ideación' },
                { id: 7, icon: <Lightbulb size={18} />, label: 'Ideas' },
                { id: 8, icon: <Video size={18} />, label: 'Evaluación' },
                { id: 9, icon: <Zap size={18} />, label: 'Batalla' },
                { id: 10, icon: <Award size={18} />, label: 'Ganadora' }
              ]}
              currentStep={step}
              onTabClick={async (id) => {
                await logic.autoGuardar();
                logic.handleSetStep(id);
              }}
              color="#ca8a04"
            />

        {/* Flujo Principal */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <AnimatePresence mode="wait">
            
            {/* 1. Área */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>Selecciona tu Área</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { nombre: 'Tecnología', icon: <Monitor size={32} /> },
                    { nombre: 'Medio Ambiente', icon: <Leaf size={32} /> },
                    { nombre: 'Gastronomía', icon: <Utensils size={32} /> },
                    { nombre: 'Salud', icon: <HeartPulse size={32} /> },
                    { nombre: 'Educación', icon: <BookOpen size={32} /> },
                    { nombre: 'Arte y Diseño', icon: <Palette size={32} /> },
                    { nombre: 'Mecánica', icon: <Wrench size={32} /> },
                    { nombre: 'Computación', icon: <Cpu size={32} /> },
                    { nombre: 'Otro', icon: <MoreHorizontal size={32} /> }
                  ].map((cat) => (
                    <div 
                      key={cat.nombre}
                      onClick={() => {
                        if (area !== '' && area !== cat.nombre && !['Otro', ''].includes(area)) {
                          confirmChange(
                            () => setArea(cat.nombre), 
                            "Si cambias el área, las ideas y problemas que hayas detectado podrían perder sentido. ¿Estás seguro de cambiar el área?"
                          );
                        } else {
                          setArea(cat.nombre);
                        }
                      }}
                      style={{ 
                        background: area === cat.nombre || (cat.nombre === 'Otro' && !['Tecnología', 'Medio Ambiente', 'Gastronomía', 'Salud', 'Educación', 'Arte y Diseño', 'Mecánica', 'Computación'].includes(area) && area !== '') ? '#fefce8' : '#f8fafc', 
                        border: area === cat.nombre || (cat.nombre === 'Otro' && !['Tecnología', 'Medio Ambiente', 'Gastronomía', 'Salud', 'Educación', 'Arte y Diseño', 'Mecánica', 'Computación'].includes(area) && area !== '') ? '2px solid #ca8a04' : '2px solid #e2e8f0', 
                        borderRadius: '1rem', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', color: area === cat.nombre ? '#ca8a04' : '#64748b'
                      }}
                    >
                      {cat.icon}
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.nombre}</span>
                    </div>
                  ))}
                </div>

                {(!['Tecnología', 'Medio Ambiente', 'Gastronomía', 'Salud', 'Educación', 'Arte y Diseño', 'Mecánica', 'Computación', ''].includes(area) || area === 'Otro') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '1.5rem' }}>
                    <input 
                      type="text" 
                      value={area === 'Otro' ? '' : area} 
                      onChange={e => setArea(e.target.value)} 
                      onBlur={autoGuardar}
                      placeholder="Escribe tu área específica..."
                      style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '0.5rem', border: '2px solid #ca8a04', outline: 'none' }}
                      autoFocus
                    />
                  </motion.div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '2rem' }}>
                   
                  <button 
                  disabled={!area || area === 'Otro'}
                  onClick={handleSiguiente} 
                  style={{ padding: '1rem 2rem', background: (!area || area === 'Otro') ? '#cbd5e1' : '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: (!area || area === 'Otro') ? 'not-allowed' : 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  Continuar
                </button>
                </div>
              </motion.div>
            )}

            {/* 2. Recurso Observación */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a' }}>{mentorData.teoria_caminos?.recursos?.observacion?.titulo || "El arte de observar"}</h3>
                <div style={{ marginBottom: '2rem' }}>
                  <YoutubePlayer 
                    videoKey="video_fase_1"
                    fallbackUrl={mentorData.teoria_caminos?.recursos?.observacion?.url || "https://www.youtube.com/embed/T6mvaB7tZ9U"}
                    title="Observación del Entorno"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  <button onClick={handleSiguiente} style={{ padding: '1rem 2rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>Entendido, a la acción</button>
                </div>
              </motion.div>
            )}

            {/* 3. Formulario de Observación */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '2rem' }}>Observación del Entorno</h2>
                
                {observaciones.map((obs, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', position: 'relative' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      Problema detectado {idx + 1}
                      {observaciones.length > 1 && (
                        <button 
                          onClick={() => setObservaciones(observaciones.filter((_, i) => i !== idx))}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Trash2 size={18} /> Eliminar
                        </button>
                      )}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>1. El Protagonista: ¿Quién tiene este problema?</label>
                        <input type="text" value={obs.protagonista} onChange={e => { const newObs = [...observaciones]; newObs[idx].protagonista = e.target.value; setObservaciones(newObs); }} onBlur={autoGuardar} placeholder="Ej: Jóvenes estudiantes universitarios..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', marginTop: '0.5rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>2. El Contexto: ¿En qué momento o situación ocurre?</label>
                        <input type="text" value={obs.contexto} onChange={e => { const newObs = [...observaciones]; newObs[idx].contexto = e.target.value; setObservaciones(newObs); }} onBlur={autoGuardar} placeholder="Ej: Durante la época de exámenes..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', marginTop: '0.5rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>3. El Dolor: ¿Qué problema o necesidad específica sufren?</label>
                        <input type="text" value={obs.dolor} onChange={e => { const newObs = [...observaciones]; newObs[idx].dolor = e.target.value; setObservaciones(newObs); }} onBlur={autoGuardar} placeholder="Ej: No tienen tiempo para preparar comida saludable..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', marginTop: '0.5rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>4. La Tarea (Job): ¿Qué intentan lograr en realidad?</label>
                        <input type="text" value={obs.tarea} onChange={e => { const newObs = [...observaciones]; newObs[idx].tarea = e.target.value; setObservaciones(newObs); }} onBlur={autoGuardar} placeholder="Ej: Alimentarse bien sin perder horas de estudio..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', marginTop: '0.5rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => setObservaciones([...observaciones, { protagonista: '', contexto: '', dolor: '', tarea: '' }])}
                  style={{ width: '100%', padding: '1.5rem', background: 'transparent', border: '2px dashed #ca8a04', color: '#ca8a04', borderRadius: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.1rem', transition: 'all 0.2s', marginTop: '1rem' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fefce8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <PlusCircle size={20} /> Añadir otro problema
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  <button 
                  onClick={handleSiguiente} 
                  style={{ padding: '1rem 2rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  Siguiente
                </button>
                </div>
              </motion.div>
            )}


            {/* 4. Formulario de Fricciones */}
            {step === 4 && (
              <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '2rem' }}>Análisis de Fricciones</h2>
                
                {observaciones.map((obs, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.3rem' }}>
                      Fricciones del Problema {idx + 1}
                    </h3>
                    <div style={{ padding: '1.5rem', background: '#e2e8f0', borderRadius: '1rem', marginBottom: '2rem', fontSize: '1.1rem', fontStyle: 'italic', color: '#334155' }}>
                      "{generarFraseProblema(obs)}"
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>5. Solución Actual: ¿Cómo lo resuelven hoy?</label>
                        <input type="text" value={fricciones[idx]?.solucionActual || ''} onChange={e => { const newF = [...fricciones]; if(!newF[idx]) newF[idx] = {solucionActual: '', friccion: '', solucionIdeal: ''}; newF[idx].solucionActual = e.target.value; setFricciones(newF); }} onBlur={autoGuardar} placeholder="Ej: Piden comida chatarra a domicilio..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', marginTop: '0.5rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>6. Fricción: ¿Por qué esa solución es frustrante?</label>
                        <input type="text" value={fricciones[idx]?.friccion || ''} onChange={e => { const newF = [...fricciones]; if(!newF[idx]) newF[idx] = {solucionActual: '', friccion: '', solucionIdeal: ''}; newF[idx].friccion = e.target.value; setFricciones(newF); }} onBlur={autoGuardar} placeholder="Ej: Es caro y les hace sentir cansados/pesados..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', marginTop: '0.5rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>7. La Solución Ideal: ¿Qué tendría que tener tu idea para hacerlos felices?</label>
                        <input type="text" value={fricciones[idx]?.solucionIdeal || ''} onChange={e => { const newF = [...fricciones]; if(!newF[idx]) newF[idx] = {solucionActual: '', friccion: '', solucionIdeal: ''}; newF[idx].solucionIdeal = e.target.value; setFricciones(newF); }} onBlur={autoGuardar} placeholder="Ej: Comida sana, rápida, barata y que llegue directo a la U..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', marginTop: '0.5rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  <button onClick={handleSiguiente} style={{ padding: '1rem 2rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>Siguiente</button>
                </div>
              </motion.div>
            )}


            {/* 5. Lluvia de Ideas */}
            {step === 5 && (
              <motion.div key="s7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '1rem' }}>Lluvia de Ideas y Asistencia IA</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.1rem' }}>Selecciona hasta 3 ideas geniales para llevar a la batalla final.</p>
                
                {generandoIA ? (
                  <div style={{ textAlign: 'center', padding: '2rem', background: '#fefce8', borderRadius: '1rem' }}>
                    <Zap size={32} color="#ca8a04" style={{ animation: 'pulse 2s infinite' }} />
                    <p style={{ fontWeight: 'bold', color: '#854d0e', marginTop: '1rem' }}>El Asistente IA está analizando tu dolor y solución ideal...</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                      <button 
                        onClick={logic.solicitarIdeasIA}
                        style={{ padding: '0.75rem 1.5rem', background: '#fefce8', color: '#ca8a04', border: '1px solid #fef08a', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fef08a'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fefce8'; }}
                      >
                        <Zap size={18} /> Volver a generar ideas
                      </button>
                    </div>
                    {ideasIA.map((idea, idx) => (
                      <div key={idx} 
                           style={{ 
                             padding: '0.5rem 1rem', 
                             background: ideasSeleccionadas.includes(idea) ? '#fefce8' : 'white', 
                             border: ideasSeleccionadas.includes(idea) ? '2px solid #ca8a04' : '1px solid #e2e8f0', 
                             borderRadius: '0.5rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '1rem'
                           }}>
                        <textarea
                          value={idea}
                          onChange={(e) => handleEditIdea(idx, e.target.value)}
                          onBlur={() => {
                            actualizarIdeasIA(ideasIA);
                            if (ideasSeleccionadas.includes(idea)) {
                              actualizarIdeasSeleccionadas(ideasSeleccionadas);
                            }
                          }}
                          rows={4}
                          style={{
                            flex: 1,
                            border: 'none',
                            background: 'transparent',
                            fontSize: '1rem',
                            color: '#334155',
                            outline: 'none',
                            width: '100%',
                            padding: '0.5rem',
                            resize: 'vertical',
                            minHeight: '100px',
                            lineHeight: '1.5'
                          }}
                        />
                        <button
                           onClick={() => {
                             if (ideasSeleccionadas.includes(idea)) {
                               confirmChange(
                                 () => logic.actualizarIdeasSeleccionadas(ideasSeleccionadas.filter(i => i !== idea)),
                                 "Si desmarcas esta idea, se quitará de tus opciones para la Batalla. ¿Estás seguro?"
                               );
                             } else if (ideasSeleccionadas.length < 3) {
                               logic.actualizarIdeasSeleccionadas([...ideasSeleccionadas, idea]);
                             }
                           }}
                           style={{
                             background: 'transparent',
                             border: 'none',
                             cursor: 'pointer',
                             padding: '0.5rem'
                           }}
                        >
                          {ideasSeleccionadas.includes(idea) ? <CheckCircle color="#ca8a04" size={28} /> : <div style={{width: 24, height: 24, borderRadius: '50%', border: '2px solid #cbd5e1'}} />}
                        </button>
                      </div>
                    ))}
                    {/* Botón de Asistencia IA removido a petición del usuario */}
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  <button 
                  disabled={ideasSeleccionadas.length === 0} 
                  onClick={handleSiguiente} 
                  style={{ padding: '1rem 2rem', background: ideasSeleccionadas.length > 0 ? '#ca8a04' : '#cbd5e1', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: ideasSeleccionadas.length > 0 ? 'pointer' : 'not-allowed' }}>
                  Llevar {ideasSeleccionadas.length} idea(s) a la Batalla
                </button>
                </div>
              </motion.div>
            )}


            {/* 6. Matriz de Batalla */}
            {step === 6 && (
              <motion.div key="s9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2>Matriz de Batalla (Max: 25 pts)</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Puntúa cada idea de 0 (Nada) a 5 (Mucho) en los siguientes criterios.</p>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', background: 'white' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0' }}>Criterio</th>
                        {ideasSeleccionadas.map((idea, i) => (
                          <th key={i} style={{ padding: '1rem', borderBottom: '2px solid #e2e8f0', minWidth: '200px', maxWidth: '300px' }}>
                            <div style={{ color: '#ca8a04', marginBottom: '0.25rem' }}>Idea {i+1}</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#475569', lineHeight: '1.4' }}>{idea}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'Demanda', question: '1. ¿La gente lo compraría?', label: '(Demanda)' },
                        { key: 'Ingresos', question: '2. ¿Puede dejar buen dinero?', label: '(Ingresos estimados)' },
                        { key: 'Recursos', question: '3. ¿Puedo hacerlo con lo que tengo?', label: '(Tiempo, dinero, habilidades)' },
                        { key: 'Pasión', question: '4. ¿Me gusta hacer esto?', label: '(Pasión)' },
                        { key: 'Escalabilidad', question: '5. ¿Puedo crecer después?', label: '(Escalabilidad)' }
                      ].map((c) => (
                        <tr key={c.key} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '1rem', color: '#334155' }}>
                            <div style={{ fontWeight: 'bold' }}>{c.question}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{c.label}</div>
                          </td>
                          {ideasSeleccionadas.map((idea, i) => (
                            <td key={i} style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                  <DavidStar 
                                    key={star} 
                                    size={24} 
                                    onClick={() => {
                                      const nuevasEvaluaciones = {
                                        ...evaluaciones,
                                        [idea]: { ...evaluaciones[idea], [c.key]: star }
                                      };
                                      logic.actualizarEvaluaciones(nuevasEvaluaciones);
                                    }}
                                    fill={(evaluaciones[idea]?.[c.key] || 0) >= star ? '#ca8a04' : 'transparent'}
                                    color={(evaluaciones[idea]?.[c.key] || 0) >= star ? '#ca8a04' : '#cbd5e1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                  />
                                ))}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr style={{ background: '#fefce8', fontWeight: 'bold' }}>
                        <td style={{ padding: '1rem', color: '#ca8a04' }}>TOTAL (25)</td>
                        {ideasSeleccionadas.map((idea, i) => {
                          const total = ['Demanda', 'Ingresos', 'Recursos', 'Pasión', 'Escalabilidad']
                            .reduce((sum, crit) => sum + (evaluaciones[idea]?.[crit] || 0), 0);
                          return <td key={i} style={{ padding: '1rem', color: '#ca8a04', fontSize: '1.2rem' }}>{total}</td>;
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  <button 
                  onClick={async () => {
                    let max = -1;
                    let ganadora = null;
                    ideasSeleccionadas.forEach(idea => {
                      const total = ['Demanda', 'Ingresos', 'Recursos', 'Pasión', 'Escalabilidad']
                            .reduce((sum, crit) => sum + (evaluaciones[idea]?.[crit] || 0), 0);
                      if (total > max) { max = total; ganadora = idea; }
                    });
                    
                    await guardarIdeaGanadoraParcial(ganadora);
                    
                    handleSiguiente();
                    solicitarNombresIA(ganadora);
                  }} 
                  style={{ padding: '1rem 2rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                  <Award size={20} />
                  Coronar Idea Ganadora
                </button>
                </div>
              </motion.div>
            )}

            {/* 7. Pitch & Nombres */}
            {step === 7 && (
              <motion.div key="s10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <Award size={64} color="#ca8a04" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ color: '#ca8a04', margin: 0 }}>¡Habemus Ganadora!</h2>
                  <p style={{ fontSize: '1.2rem', color: '#334155', marginTop: '1rem', padding: '1.5rem', background: '#fefce8', borderRadius: '0.5rem', border: '1px solid #fef08a' }}>
                    {ideaGanadora}
                  </p>
                </div>

                <h3>Sugerencias de Nombres</h3>
                <p style={{ color: '#64748b' }}>Selecciona el nombre que más te guste para tu proyecto.</p>
                {nombresSugeridos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                     <Zap size={32} color="#ca8a04" style={{ animation: 'pulse 2s infinite' }} />
                     <p>Generando nombres impactantes...</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {nombresSugeridos.map((item, i) => {
                      const nombreStr = typeof item === 'object' ? item.nombre : item;
                      const representa = typeof item === 'object' ? item.representa : '';
                      return (
                        <div key={i} 
                             onClick={() => {
                               if (nombreElegido !== '' && nombreElegido !== nombreStr) {
                                 confirmChange(() => {
                                   setNombreElegido(nombreStr);
                                   solicitarPitchIA(nombreStr);
                                 }, "Si cambias el nombre, el Pitch actual se perderá y se generará uno nuevo. ¿Estás seguro?");
                               } else if (nombreElegido !== nombreStr) {
                                 setNombreElegido(nombreStr);
                                 solicitarPitchIA(nombreStr);
                               }
                             }}
                             style={{ padding: '1rem', textAlign: 'center', border: nombreElegido === nombreStr ? '2px solid #ca8a04' : '1px solid #cbd5e1', background: nombreElegido === nombreStr ? '#fefce8' : 'white', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a' }}>{nombreStr}</div>
                          {representa && <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>{representa}</div>}
                        </div>
                      );
                    })}
                    
                    {/* Tarjeta para nombre personalizado */}
                    <div 
                         style={{ padding: '1rem', textAlign: 'center', border: nombreElegido === customName && customName !== '' ? '2px solid #ca8a04' : '1px dashed #cbd5e1', background: nombreElegido === customName && customName !== '' ? '#fefce8' : 'transparent', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                         onClick={() => {
                             if (customName !== '') {
                                 if (nombreElegido !== '' && nombreElegido !== customName) {
                                     confirmChange(() => {
                                         setNombreElegido(customName);
                                         solicitarPitchIA(customName);
                                     }, "Si cambias el nombre, el Pitch actual se perderá y se generará uno nuevo. ¿Estás seguro?");
                                 } else if (nombreElegido !== customName) {
                                     setNombreElegido(customName);
                                     solicitarPitchIA(customName);
                                 }
                             }
                         }}
                    >
                         <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a' }}>
                             <input 
                                 type="text" 
                                 placeholder="O ingresa tu propio nombre..." 
                                 value={customName}
                                 onChange={(e) => setCustomName(e.target.value)}
                                 onClick={(e) => e.stopPropagation()}
                                 style={{ width: '100%', padding: '0.5rem', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '0.25rem', outline: 'none', background: 'transparent' }}
                             />
                         </div>
                         <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>Nombre personalizado</div>
                         {customName && nombreElegido !== customName && (
                             <button 
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     if (nombreElegido !== '') {
                                         confirmChange(() => {
                                             setNombreElegido(customName);
                                             solicitarPitchIA(customName);
                                         }, "Si cambias el nombre, el Pitch actual se perderá y se generará uno nuevo. ¿Estás seguro?");
                                     } else {
                                         setNombreElegido(customName);
                                         solicitarPitchIA(customName);
                                     }
                                 }}
                                 style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f8fafc', color: '#0f172a', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                 Elegir este nombre
                             </button>
                         )}
                    </div>
                  </div>
                )}

                {nombreElegido && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h3>Discurso de Presentación (Pitch)</h3>
                    {generandoPitch ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                        <Zap size={24} color="#ca8a04" style={{ animation: 'pulse 2s infinite', marginBottom: '0.5rem' }} />
                        <p style={{ color: '#64748b' }}>Redactando tu discurso comercial...</p>
                      </div>
                    ) : (
                      <textarea
                        value={pitchGenerado}
                        onChange={(e) => logic.setPitchGenerado(e.target.value)}
                        rows={6}
                        style={{
                          width: '100%',
                          background: 'white', 
                          border: '1px solid #e2e8f0',
                          borderLeft: '4px solid #ca8a04', 
                          padding: '1.5rem', 
                          borderRadius: '0.5rem', 
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
                          fontSize: '1.1rem', 
                          lineHeight: 1.6, 
                          fontStyle: 'italic', 
                          color: '#334155',
                          resize: 'vertical',
                          outline: 'none'
                        }}
                      />
                    )}
                  </motion.div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  {resumenGuardado ? (
                    <button 
                      onClick={() => setShowDataPopup(true)} 
                      style={{ padding: '1rem 2rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', transition: 'all 0.2s' }}
                    >
                      Ver Datos Guardados
                    </button>
                  ) : (
                    <button 
                      onClick={async () => {
                        await guardarYFinalizar();
                        setShowDataPopup(true);
                      }} 
                      disabled={!nombreElegido || generandoPitch}
                      style={{ padding: '1rem 2rem', background: (!nombreElegido || generandoPitch) ? '#cbd5e1' : '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: (!nombreElegido || generandoPitch) ? 'not-allowed' : 'pointer', fontSize: '1.2rem', fontWeight: 'bold', transition: 'all 0.2s' }}
                    >
                      ¡Guardar y Finalizar Fase 1!
                    </button>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          
          
        </div>
          </>
        )}

      </div>

      {/* Popup de Datos Guardados */}
      {showDataPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
            
            <button 
              onClick={() => setShowDataPopup(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              title="Cerrar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 style={{ color: '#ca8a04', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={28} />
              Datos Guardados
            </h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Estos datos clave se han guardado internamente para usarlos en las siguientes fases:</p>
            
            {generandoResumen ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Zap size={32} color="#ca8a04" style={{ animation: 'pulse 2s infinite', marginBottom: '1rem' }} />
                <p style={{ color: '#854d0e', fontWeight: 'bold' }}>La IA está redactando el resumen final de tu idea...</p>
              </div>
            ) : (
              <>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>El Problema:</strong>
                  <span style={{ color: '#334155' }}>{resumenGuardado?.problema || observaciones[0]?.dolor || 'No definido'}</span>
                </div>
                
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>Solución (Producto/Servicio):</strong>
                  <span style={{ color: '#334155' }}>{resumenGuardado?.solucion || ideaGanadora || 'No definido'}</span>
                </div>
                
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>Protagonista (Público Objetivo):</strong>
                  <span style={{ color: '#334155' }}>{resumenGuardado?.protagonista || observaciones[0]?.protagonista || 'No definido'}</span>
                </div>
                
                <button 
                  onClick={() => {
                    setShowDataPopup(false);
                    navigate('/fase/2/intro');
                  }}
                  style={{ padding: '1rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  Continuar a Fase 2
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Fase1_EmprendimientoMentor;
