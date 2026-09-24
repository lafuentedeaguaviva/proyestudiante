import React, { useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare, AlertTriangle, Lightbulb } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarFases from '../components/ui/SidebarFases';
import { NexusContext } from '../context/NexusContext';
import { useAuth } from '../context/AuthContext';

/**
 * Layout "El Caso Zero" / Agencia Kronos
 * Soporta a los personajes: ADA, Director Noctis, Nyx, El Archivista, El Espectro
 */
const DetectiveLayout = ({ children, personajeHablando, canGoBack = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nexusInfluence, nexusMessage } = useContext(NexusContext) || { nexusInfluence: 0, nexusMessage: null };
  const { perfil } = useAuth();

  useEffect(() => {
    // En Modo Mentor, desactivamos la redirección a gameover y la mecánica de Nexus
    // if (nexusInfluence >= 100 && location.pathname !== '/gameover') {
    //   navigate('/gameover');
    // }
  }, [nexusInfluence, location.pathname, navigate]);

  // Función para obtener colores y estilos según el rol del personaje
  const getEstiloPersonaje = (rol) => {
    switch (rol) {
      case 'villano':
        return { color: 'var(--color-error)', icon: <AlertTriangle size={16} />, shadow: 'rgba(239, 68, 68, 0.5)', border: 'var(--color-error)' };
      case 'ayudante':
        return { color: 'var(--color-success)', icon: <MessageSquare size={16} />, shadow: 'rgba(16, 185, 129, 0.5)', border: 'var(--color-success)' };
      case 'inspiracion':
        return { color: '#D946EF', icon: <Lightbulb size={16} />, shadow: 'rgba(217, 70, 239, 0.5)', border: '#D946EF' }; // Fuchsia
      case 'mentor':
      default:
        return { color: 'var(--theme-detective-primary)', icon: <MessageSquare size={16} />, shadow: 'var(--theme-detective-primary-glow)', border: 'var(--theme-detective-primary)' };
    }
  };

  const estiloActual = personajeHablando ? getEstiloPersonaje(personajeHablando.rol) : getEstiloPersonaje('mentor');

  // Determinar si hay alerta de NEXUS
  const isNexusDanger = nexusInfluence >= 80;
  const isNexusWarning = nexusInfluence >= 50 && nexusInfluence < 80;
  const nexusColor = isNexusDanger ? '#ef4444' : (isNexusWarning ? '#f59e0b' : '#3b82f6');

  // Determinar tipo de animación por personaje
  const getTipoAnimacion = (nombre) => {
    if (!nombre) return 'bubble';
    if (nombre.includes('ORION')) return 'typewriter';
    if (nombre.includes('Aster') || nombre.includes('Sombra')) return 'shadow';
    return 'bubble'; // default
  };

  const tipoAnim = personajeHablando ? getTipoAnimacion(personajeHablando.nombre) : 'bubble';

  // Leer tipo de expediente
  const expedienteTipo = localStorage.getItem('expediente_tipo') || 'DESCONOCIDO';

  return (
    <div className="theme-detective" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Red Glitch Overlay if Danger (Desactivado en Modo Mentor) */}
      {/* {isNexusDanger && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', background: `radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(239, 68, 68, ${nexusInfluence / 300}) 100%)`, zIndex: 999, animation: 'glitch-anim 2s infinite' }}>
          <style>{`
            @keyframes glitch-anim {
              0% { opacity: 0.5; }
              50% { opacity: 1; }
              100% { opacity: 0.5; }
            }
          `}</style>
        </div>
      )} */}

      <SidebarFases />
      
      {/* HEADER / NAVIGATION */}
      <header style={{ 
        padding: 'var(--spacing-md) var(--spacing-xl)', 
        display: 'flex', 
        alignItems: 'center',
        borderBottom: '1px solid var(--theme-detective-border)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {canGoBack && (
          <button 
            className="btn-detective-secondary"
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', border: 'none' }}
          >
            <ArrowLeft size={20} />
            <span>Atrás</span>
          </button>
        )}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {/* Oculto en Modo Mentor */}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Monedero Virtual EduCoins */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.4rem 1rem', borderRadius: '2rem', boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)', backdropFilter: 'blur(5px)' }}>
            <span style={{ fontSize: '1.2rem' }}>🪙</span>
            <span style={{ color: '#fcd34d', fontWeight: '900', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px' }}>
              {perfil?.educoins ?? 0}
            </span>
          </div>

          <div style={{ fontWeight: 800, letterSpacing: '4px', color: expedienteTipo === 'PEP' ? '#3b82f6' : (expedienteTipo === 'PI' ? '#10b981' : '#52525b'), fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            EXPEDIENTE: {expedienteTipo}
          </div>
        </div>
      </header>

      {/* NEXUS TOAST MESSAGE */}
      <AnimatePresence>
        {nexusMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: '#7f1d1d', color: '#fca5a5', padding: '1rem 2rem', borderRadius: '4px', zIndex: 100, border: '1px solid #ef4444', fontFamily: 'monospace', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)' }}
          >
            <AlertTriangle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            {nexusMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: 'var(--spacing-xl)', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* AVATAR DIALOG BAR (Top, less square) */}
        <AnimatePresence>
          {personajeHablando && personajeHablando.dialogo && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              style={{
                width: '100%',
                backgroundColor: tipoAnim === 'shadow' ? 'transparent' : 'rgba(15, 23, 42, 0.7)',
                border: tipoAnim === 'shadow' ? 'none' : `1px solid ${estiloActual.border}`,
                borderLeft: tipoAnim === 'shadow' ? 'none' : `4px solid ${estiloActual.border}`,
                borderBottomRightRadius: tipoAnim === 'shadow' ? '0' : '2rem',
                borderTopLeftRadius: tipoAnim === 'shadow' ? '0' : '1rem',
                padding: tipoAnim === 'shadow' ? '0' : 'var(--spacing-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                boxShadow: tipoAnim === 'shadow' ? 'none' : `0 10px 30px -10px ${estiloActual.shadow}`,
                backdropFilter: tipoAnim === 'shadow' ? 'none' : 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative corner cutout effect */}
              {tipoAnim !== 'shadow' && (
                <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.05) 50%)' }} />
              )}

              {personajeHablando.avatarSrc && (
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: tipoAnim === 'shadow' ? '50%' : '1rem', 
                  overflow: 'hidden', 
                  border: `2px solid ${estiloActual.border}`,
                  boxShadow: `0 0 15px ${estiloActual.shadow}`,
                  flexShrink: 0,
                  transform: tipoAnim === 'shadow' ? 'none' : 'rotate(-3deg)',
                  opacity: tipoAnim === 'shadow' ? 0.7 : 1,
                  filter: tipoAnim === 'shadow' ? 'blur(1px)' : 'none'
                }}>
                  <img src={personajeHablando.avatarSrc} alt={personajeHablando.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: estiloActual.color, 
                  fontWeight: 800, 
                  marginBottom: 'var(--spacing-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '0.875rem',
                  opacity: tipoAnim === 'shadow' ? 0.5 : 1
                }}>
                  {estiloActual.icon}
                  {personajeHablando.nombre}
                </div>
                
                {/* Text Animations */}
                {tipoAnim === 'shadow' && (
                  <motion.div 
                    initial={{ filter: 'blur(10px)', opacity: 0 }}
                    animate={{ filter: 'blur(0px)', opacity: 1 }}
                    transition={{ duration: 3 }}
                    style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#a1a1aa', fontStyle: 'italic', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}
                  >
                    "{personajeHablando.dialogo}"
                  </motion.div>
                )}

                {tipoAnim === 'typewriter' && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e2e8f0', fontFamily: 'monospace' }}
                  >
                    {personajeHablando.dialogo.split("").map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.05, delay: index * 0.02 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      style={{ display: 'inline-block', width: '8px', height: '1.1rem', background: '#3b82f6', marginLeft: '4px', verticalAlign: 'middle' }}
                    />
                  </motion.div>
                )}

                {tipoAnim === 'bubble' && (
                  <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#0f172a', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '1rem', borderTopLeftRadius: '0', display: 'inline-block', fontWeight: 'bold' }}>
                    "{personajeHablando.dialogo}"
                  </div>
                )}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

    </div>
  );
};

export default DetectiveLayout;
