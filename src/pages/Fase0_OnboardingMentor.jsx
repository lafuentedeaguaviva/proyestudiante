import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, ChevronRight, FileText, CheckCircle, Bot } from 'lucide-react';
import { obtenerConfiguracionFase, crearProyectoMentor, guardarContenidoFase } from '../services/api';
import SidebarFases from '../components/ui/SidebarFases';
import SubMenuFases from '../components/ui/SubMenuFases';

const Fase0_OnboardingMentor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pasoQuery = searchParams.get('paso');
  // 0: Inicio, 1: Video, 2: Cuestionario, 3: Elección
  const [step, setStep] = useState(pasoQuery ? parseInt(pasoQuery) - 1 : 0);
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pasoQuery) {
      const p = parseInt(pasoQuery) - 1;
      if (p >= 0 && p <= 3) {
        setStep(p);
      }
    }
  }, [pasoQuery]);
  
  // Estado para el cuestionario
  const [respuestas, setRespuestas] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Estado para guardar
  const [guardando, setGuardando] = useState(false);
  const [caminoSugerido, setCaminoSugerido] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerConfiguracionFase('55555555-5555-5555-5555-555555555555', 0);
        setMentorData(data);
      } catch (err) {
        console.error("Excepción en fetchData", err);
        setErrorMsg(err.message || "Excepción desconocida");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRespuesta = (preguntaId, valor) => {
    setRespuestas(prev => ({ ...prev, [preguntaId]: valor }));
    if (currentQuestionIndex < mentorData.cuestionario.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calcularSugerencia();
      setStep(3);
    }
  };

  const calcularSugerencia = () => {
    let puntosPEP = 0;
    let puntosPI = 0;
    
    Object.values(respuestas).forEach(val => {
      if (val === 'PEP') puntosPEP++;
      if (val === 'PI') puntosPI++;
    });

    setCaminoSugerido(puntosPEP >= puntosPI ? 'PEP' : 'PI');
  };

  const handleElegirCamino = async (camino) => {
    setGuardando(true);
    try {
      // 1. Guardar en DB las respuestas del paso 2 (cuestionario)
      // Simularemos que ya tenemos un proyecto_id temporal para guardarlo, 
      // pero en este flujo el proyecto se crea en el paso 3.
      // Por ende, primero creamos el proyecto y luego le adjuntamos el contenido inicial.
      
      const nuevoProyecto = await crearProyectoMentor(camino);
      
      // Guardar en localstorage
      localStorage.setItem('temp_proyecto_id', nuevoProyecto.id);
      localStorage.setItem('expediente_tipo', camino);

      // Guardar las respuestas del cuestionario como contenido de la fase 0
      await guardarContenidoFase(0, 'cuestionario_onboarding', {
        respuestas: respuestas,
        sugerencia_sistema: caminoSugerido,
        eleccion_final: camino
      });

      setGuardando(false);
      navigate('/fase/1/intro');
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear tu proyecto.");
      setGuardando(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#334155' }}>Cargando a tu Mentor...</div>;
  }

  if (!mentorData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#dc2626', textAlign: 'center', padding: '2rem' }}>
        <h2>Error al cargar los datos del mentor</h2>
        <p>Asegúrate de haber ejecutado los scripts SQL para poblar la base de datos (Fase 0).</p>
        {errorMsg && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#fee2e2', border: '1px solid #f87171', borderRadius: '0.5rem', fontFamily: 'monospace', color: '#991b1b', maxWidth: '600px', wordBreak: 'break-all' }}>
            <strong>Detalle del error de Supabase:</strong><br/>
            {errorMsg}
          </div>
        )}
      </div>
    );
  }

  const { dialogos, cuestionario, teoria_caminos } = mentorData;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <SidebarFases />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Mentor Avatar Section */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(250, 204, 21, 0.4)' }}>
            <Bot size={40} color="#854d0e" />
          </div>
          <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '1rem', borderTopLeftRadius: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#ca8a04', fontSize: '1.1rem', fontWeight: 700 }}>El Mentor</h3>
            <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6, color: '#334155' }}>
              {step === 0 && dialogos.bienvenida}
              {step === 1 && dialogos.paso1_video}
              {step === 2 && dialogos.paso2_cuestionario}
              {step === 3 && dialogos.paso3_eleccion}
            </p>
          </div>
        </div>

        {step > 0 && (
          <SubMenuFases 
            tabs={[
              { id: 1, icon: <Play size={18} />, label: 'Video' },
              { id: 2, icon: <FileText size={18} />, label: 'Cuestionario' },
              { id: 3, icon: <CheckCircle size={18} />, label: 'Elección' }
            ]}
            currentStep={step}
            onTabClick={(id) => {
              setStep(id);
            }}
            color="#ca8a04"
          />
        )}

        {/* Dynamic Content based on Step */}
        <AnimatePresence mode="wait">
          
          {/* PASO 0: HERO INICIAL */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center', marginTop: '4rem' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Asistente de Selección de Camino</h1>
              <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                Estás a punto de iniciar tu proyecto. Responderemos unas breves preguntas para saber qué ruta (Emprendimiento o Innovación) se adapta mejor a ti.
              </p>
              <button 
                onClick={() => setStep(1)} 
                style={{ background: '#ca8a04', color: 'white', border: 'none', padding: '1.25rem 3rem', borderRadius: '3rem', fontSize: '1.5rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(202, 138, 4, 0.3)', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ¡Empecemos!
              </button>
            </motion.div>
          )}

          {/* PASO 1: VIDEO */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: '#f8fafc', opacity: 0.9 }}></div>
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, color: '#0f172a' }}>
                  <Play size={64} style={{ marginBottom: '1rem', color: '#ca8a04' }} />
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Video Introductorio</h2>
                  <p style={{ color: '#475569' }}>(Placeholder del video)</p>
                </div>
              </div>
              <div style={{ textAlign: 'right', marginTop: '2rem' }}>
                <button onClick={() => setStep(2)} style={{ background: '#ca8a04', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Continuar al Cuestionario <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* PASO 2: CUESTIONARIO */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Pregunta {currentQuestionIndex + 1} de {cuestionario.length}
                </div>
                <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginTop: 0, marginBottom: '2rem' }}>
                  {cuestionario[currentQuestionIndex].pregunta}
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cuestionario[currentQuestionIndex].opciones.map((opcion, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleRespuesta(cuestionario[currentQuestionIndex].id, opcion.valor)}
                      style={{ padding: '1.25rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '0.75rem', textAlign: 'left', fontSize: '1.1rem', cursor: 'pointer', color: '#334155', fontWeight: 500, transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ca8a04'; e.currentTarget.style.background = '#fefce8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                    >
                      {opcion.texto}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Base Teórica Expandible / Informativa */}
              <div style={{ background: '#fefce8', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #fef08a' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} /> Base Teórica de Referencia
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#a16207' }}>{teoria_caminos.PEP.titulo}</h5>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#713f12' }}>{teoria_caminos.PEP.base_teorica}</p>
                    <small style={{ color: '#a16207', fontStyle: 'italic' }}>{teoria_caminos.PEP.cita_apa}</small>
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#a16207' }}>{teoria_caminos.PI.titulo}</h5>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#713f12' }}>{teoria_caminos.PI.base_teorica}</p>
                    <small style={{ color: '#a16207', fontStyle: 'italic' }}>{teoria_caminos.PI.cita_apa}</small>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PASO 3: ELECCIÓN */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '1rem' }}>Resultados del Análisis</h2>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#dcfce7', color: '#166534', padding: '1rem 2rem', borderRadius: '2rem', fontWeight: 700, fontSize: '1.25rem' }}>
                  <CheckCircle size={24} /> 
                  Sugerencia del Mentor: {caminoSugerido === 'PEP' ? 'Proyecto de Emprendimiento Productivo (PEP)' : 'Proyecto de Innovación (PI)'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: caminoSugerido === 'PEP' ? '3px solid #ca8a04' : '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#0f172a' }}>{teoria_caminos.PEP.titulo}</h3>
                  <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>{teoria_caminos.PEP.base_teorica}</p>
                  <button 
                    disabled={guardando} 
                    onClick={() => handleElegirCamino('PEP')} 
                    style={{ width: '100%', padding: '1rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {guardando ? 'Generando Proyecto...' : 'Seleccionar Proyecto de Emprendimiento Productivo (PEP)'}
                  </button>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: caminoSugerido === 'PI' ? '3px solid #ca8a04' : '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#0f172a' }}>{teoria_caminos.PI.titulo}</h3>
                  <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>{teoria_caminos.PI.base_teorica}</p>
                  <button 
                    disabled={true} 
                    style={{ width: '100%', padding: '1rem', background: '#f8fafc', color: '#94a3b8', border: '2px dashed #cbd5e1', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 600, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    Módulo en Desarrollo (Próximamente)
                  </button>
                </motion.div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};

export default Fase0_OnboardingMentor;
