import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, MapPin, CheckCircle, Lock, ChevronRight, User, Coins } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SidebarFases = () => {
  const { perfil } = useAuth();
  const isMentor = localStorage.getItem('temp_entorno_seleccionado') === '55555555-5555-5555-5555-555555555555' || window.location.pathname.toLowerCase().includes('mentor');
  const [isOpen, setIsOpen] = useState(false);
  const [maxFaseDB, setMaxFaseDB] = useState(0); // Para guardar la fase máxima desde la BD
  const [maxPasoFaseActual, setMaxPasoFaseActual] = useState(1); // Paso máximo alcanzado en la fase actual
  const [fasesActivas, setFasesActivas] = useState([]);
  const [loadingMapa, setLoadingMapa] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Consulta a la BD para la fase máxima alcanzada y asignar mapa estático
  useEffect(() => {
    const fetchMaxFase = async () => {
      const { supabase } = await import('../../lib/supabaseClient');
      const proyecto_id = localStorage.getItem('temp_proyecto_id');
      
      // Si hay un proyecto activo en este dispositivo, consultamos su estado real en la BD
      if (proyecto_id) {
        const { data } = await supabase
          .from('proyecto_usuario')
          .select('fase_actual, paso_actual')
          .eq('id', proyecto_id)
          .single();
          
        if (data && data.fase_actual !== undefined) {
          setMaxFaseDB(parseInt(data.fase_actual, 10));
          // Usamos el paso_actual almacenado nativamente en proyecto_usuario (si es 0, usamos 1 como base)
          setMaxPasoFaseActual(parseInt(data.paso_actual, 10) || 1);
        }
      } else {
        // Fallback: Si no hay proyecto creado (ej: Fase 0), usamos 0 o 1
        setMaxFaseDB(isMentor ? 0 : 1);
      }

      // Mapa estático según el entorno Mentor / general
      const mapaEstatico = [
        { id: 0, titulo: 'El Inicio del Viaje', path: '/fase/0', pasos: ['Bienvenida', 'Video', 'Cuestionario Orientador', 'Elección de Camino'] },
        { id: 1, titulo: 'Encontrar la idea', path: '/fase/1', pasos: ['Video', 'Selección de Área', 'Observación del Entorno', 'Análisis de Fricciones', 'Guía: Brainstorming Efectivo', 'Lluvia de Ideas', 'Matriz de Batalla', 'Idea Ganadora y Pitch'] },
        { id: 2, titulo: 'Validación de la Idea', path: '/fase/2', pasos: ['Video', 'Introducción a la Validación', 'Diseño de la Encuesta', 'Explicación de la Matriz', 'Codificación de Preguntas', 'Tabulación de Resultados', 'Análisis de Resultados', 'Resumen IA'] },
        { id: 3, titulo: 'Público Objetivo', path: '/fase/3', pasos: ['Video', 'Público Objetivo'] },
        { id: 4, titulo: 'Diseño de producto o servicio', path: '/fase/4', pasos: ['Video', 'Qué vas a vender', 'Características', 'Beneficios', 'Empaque', 'Presentación', 'Demanda Potencial', 'Resumen IA'] },
        { id: 5, titulo: 'La Estrategia de Marketing', path: '/fase/5', pasos: ['Video', 'Análisis de competencia', 'Tu Ventaja Competitiva', 'Análisis del entorno', 'Estrategia de promoción', 'Resumen IA'] },
        { id: 6, titulo: 'Localización y Distribución', path: '/fase/6', pasos: ['Video', 'Identificación', 'Canales', 'Elección Lugar', 'Croquis', 'Pagos', 'Plan Acción', 'Resumen IA'] },
        { id: 7, titulo: 'Planteamiento del Emprendimiento', path: '/fase/7', pasos: ['Video', 'Diagnóstico del contexto', 'Objetivos', 'Misión', 'Visión', 'Justificación', 'Resumen IA'] },
        { id: 8, titulo: 'La Operación', path: '/fase/8', pasos: ['Video', 'Definir Pasos', 'Revisión de Procesos', 'Clasificación de Procesos'] },
        { id: 9, titulo: 'Estructura Organizacional', path: '/fase/9', pasos: ['Video', 'Organigrama', 'Roles', 'Resumen IA'] },
        { id: 10, titulo: 'Viabilidad y Sostenibilidad', path: '/fase/10', pasos: ['Video', 'Cap. Inversión', 'Costos por Prod.', 'Cap. Trabajo', 'Resumen', 'Costos', 'Precio Venta', 'Proy. Gan', 'Proy. Gastos', 'Utilidad', 'Equilibrio', 'VAN y TIR'] },
        { id: 11, titulo: 'Consolidación del Documento', path: '/fase/11', pasos: ['Video', 'Intro', 'Resultados', 'Conclusiones', 'Agradecimientos', 'Dedicatoria', 'Resumen IA'] },
        { id: 12, titulo: 'Proyecto de Vida', path: '/fase/12', pasos: ['Video', 'Alineación', 'Metas', 'Equilibrio', 'Legado', 'Resumen IA'] },
        { id: 13, titulo: 'Documento Final IA', path: '/fase/13', pasos: ['Video', 'Configuración IA', 'Documento Generado'] }
      ];

      // Filtrar o ajustar si es necesario según isMentor (aunque como mentor usualmente se ven todas)
      setFasesActivas(mapaEstatico);
      setLoadingMapa(false);
    };
    fetchMaxFase();
  }, [isOpen, isMentor]);
  
  // Dynamic Styles
  const theme = {
    primary: isMentor ? '#ca8a04' : 'var(--theme-detective-primary)',
    surface: isMentor ? '#f8fafc' : 'var(--theme-detective-surface)',
    border: isMentor ? '#e2e8f0' : 'var(--theme-detective-border)',
    textMain: isMentor ? '#0f172a' : 'white',
    textSub: isMentor ? '#475569' : '#cbd5e1',
    line: isMentor ? '#cbd5e1' : '#334155',
    success: isMentor ? '#16a34a' : 'var(--color-success)',
    btnHover: isMentor ? '#fefce8' : 'rgba(255,255,255,0.05)'
  };

  const handleNavegar = (path) => {
    if (location.pathname !== path) {
      navigate(path);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '80px',
          left: '0',
          background: theme.primary,
          color: 'white',
          border: 'none',
          padding: '0.75rem 1rem 0.75rem 0.5rem',
          borderRadius: '0 1rem 1rem 0',
          cursor: 'pointer',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Map size={20} />
        <span style={{ fontWeight: 'bold' }}>Mapa de Fases</span>
        <ChevronRight size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: isMentor ? 'rgba(15, 23, 42, 0.3)' : 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 50
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '320px',
              background: theme.surface,
              borderRight: `1px solid ${theme.border}`,
              zIndex: 60,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '25px 0 50px -12px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin color={theme.primary} size={24} />
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: theme.textMain }}>Mapa del Proyecto</h2>
              </div>
              <button 
                onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                title="Volver a mis proyectos"
              >
                Salir
              </button>
            </div>
            
            <div style={{ padding: '1.5rem', flex: 1 }}>
              {fasesActivas.map((fase, idx) => {
                const isActive = location.pathname.includes(fase.path);
                const searchParams = new URLSearchParams(location.search);
                const currentPaso = parseInt(searchParams.get('paso')) || 1;
                
                // Una fase está desbloqueada si su ID es menor o igual a la máxima fase guardada en BD
                const isUnlocked = fase.id <= maxFaseDB;
                const isPast = fase.id < maxFaseDB; // Visualmente marcada como "ya pasada" si es menor a la máxima
                
                return (
                  <div key={fase.id} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    {idx < fasesActivas.length - 1 && (
                      <div style={{ position: 'absolute', top: '30px', left: '15px', bottom: '-20px', width: '2px', background: isUnlocked && !isActive ? theme.success : theme.line, zIndex: 1 }} />
                    )}
                    
                    <button 
                      disabled={!isUnlocked}
                      onClick={() => {
                          if (fase.id > 0) {
                            navigate(`/fase/${fase.id}/intro`);
                          } else {
                            navigate(`${fase.path}?paso=1`);
                          }
                          setIsOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        background: 'transparent',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        padding: '0.5rem 0',
                        position: 'relative',
                        zIndex: 2,
                        opacity: isUnlocked ? 1 : 0.5
                      }}
                    >
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        background: isActive ? theme.primary : isPast ? theme.success : (isMentor ? '#f1f5f9' : '#1e293b'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `2px solid ${isActive ? theme.primary : isPast ? theme.success : theme.line}`,
                        color: isActive || isPast ? 'white' : theme.textSub,
                        boxShadow: isActive ? `0 0 10px ${theme.primary}80` : 'none'
                      }}>
                        {isPast && !isActive ? <CheckCircle size={16} /> : <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{fase.id}</span>}
                      </div>
                      <div>
                        <div style={{ color: isActive ? theme.textMain : isUnlocked ? theme.textSub : theme.textSub, fontWeight: isActive ? 'bold' : 'normal', fontSize: '1.05rem' }}>
                          {fase.id > 0 ? `Fase ${fase.id}: ${fase.titulo}` : fase.titulo}
                        </div>
                      </div>
                    </button>
                    
                    <div style={{ paddingLeft: '3rem', marginTop: '0.5rem', display: isUnlocked ? 'block' : 'none' }}>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {fase.pasos.map((paso, pIdx) => {
                          const pasoNumber = pIdx + 1;
                          const isCurrentStep = isActive && currentPaso === pasoNumber;
                          
                          // Lógica: Mostrar todas las pestañas, pero bloquear las futuras
                          let isUnlockedPaso = true;
                          if (fase.id > maxFaseDB) isUnlockedPaso = false;
                          else if (fase.id === maxFaseDB && pasoNumber > maxPasoFaseActual) isUnlockedPaso = false;

                          return (
                            <li key={pIdx} style={{ marginBottom: '0.5rem' }}>
                              <button
                                disabled={!isUnlockedPaso}
                                onClick={(e) => {
                                  if (!isUnlockedPaso) return;
                                  e.stopPropagation();
                                  navigate(`${fase.path}?paso=${pasoNumber}`);
                                  setIsOpen(false);
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  padding: 0,
                                  color: isCurrentStep ? theme.primary : isUnlockedPaso ? theme.textSub : 'rgba(150, 150, 150, 0.4)',
                                  fontWeight: isCurrentStep ? 'bold' : 'normal',
                                  fontSize: '0.875rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  cursor: isUnlockedPaso ? 'pointer' : 'not-allowed',
                                  textAlign: 'left',
                                  width: '100%',
                                  transition: 'color 0.2s'
                                }}
                                onMouseOver={(e) => { if(isUnlockedPaso && !isCurrentStep) e.currentTarget.style.color = theme.primary; }}
                                onMouseOut={(e) => { if(isUnlockedPaso && !isCurrentStep) e.currentTarget.style.color = theme.textSub; }}
                              >
                                <div style={{ 
                                  width: '8px', 
                                  height: '8px', 
                                  borderRadius: '50%', 
                                  background: isCurrentStep ? theme.primary : 'transparent',
                                  border: `1px solid ${isCurrentStep ? theme.primary : isUnlockedPaso ? theme.textSub : 'rgba(150, 150, 150, 0.4)'}`
                                }} />
                                {paso}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}



            {/* Widget de Usuario y EduCoins al final del Sidebar */}
            <div style={{
              padding: '1.25rem',
              borderTop: `1px solid ${theme.border}`,
              background: isMentor ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
              marginTop: 'auto'
            }}>
              <button
                onClick={() => {
                  navigate('/dashboard'); // Redirigir al dashboard
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  transition: 'background 0.2s',
                  marginBottom: '1rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = isMentor ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 'bold'
                }}>
                  <User size={20} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ color: theme.textMain, fontWeight: 'bold', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {perfil?.nombre_completo || 'Mi Perfil'}
                  </div>
                  <div style={{ color: theme.textSub, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {perfil?.email || 'Ver mi cuenta'}
                  </div>
                </div>
                <ChevronRight size={16} color={theme.textSub} />
              </button>

              {/* Barra de progreso EduCoins */}
              <div style={{ padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fcd34d', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <Coins size={16} />
                    <span>EduCoins</span>
                  </div>
                  <span style={{ color: theme.textMain, fontWeight: 'bold', fontSize: '0.9rem' }}>{perfil?.educoins ?? 0}</span>
                </div>
                
                <div style={{ width: '100%', height: '8px', background: isMentor ? '#e2e8f0' : 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((perfil?.educoins ?? 0) / 100) * 100)}%` }}
                    transition={{ duration: 1, type: 'spring' }}
                    style={{ 
                      height: '100%', 
                      background: (perfil?.educoins ?? 0) > 20 ? '#fcd34d' : '#ef4444',
                      borderRadius: '4px'
                    }} 
                  />
                </div>
                <div style={{ textAlign: 'right', marginTop: '0.25rem', fontSize: '0.75rem', color: theme.textSub }}>
                  {(perfil?.educoins ?? 0) === 0 ? 'Sin monedas (IA Bloqueada)' : 'Quedan monedas'}
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarFases;
