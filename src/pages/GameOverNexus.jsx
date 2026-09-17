import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NexusContext } from '../context/NexusContext';
import { AlertTriangle, RotateCcw } from 'lucide-react';

const GameOverNexus = () => {
  const navigate = useNavigate();
  const { resetNexus, nexusInfluence } = useContext(NexusContext) || { resetNexus: () => {}, nexusInfluence: 0 };

  useEffect(() => {
    // Si llegan aquí por error pero no están en 100, los mandamos al dashboard
    if (nexusInfluence < 100) {
      navigate('/dashboard');
    }
  }, [nexusInfluence, navigate]);

  const handleRestart = () => {
    resetNexus();
    navigate('/fase/1'); // Los enviamos al inicio de la gamificación
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ef4444',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem',
      textAlign: 'center'
    }}>
      
      {/* Heavy Glitch Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', background: `radial-gradient(circle, rgba(0,0,0,0) 20%, rgba(220, 38, 38, 0.4) 100%)`, zIndex: 1, animation: 'glitch-heavy 0.1s infinite' }}>
        <style>{`
          @keyframes glitch-heavy {
            0% { opacity: 0.8; transform: translate(2px, 2px); }
            20% { opacity: 1; transform: translate(-2px, -2px); }
            40% { opacity: 0.6; transform: translate(1px, -1px); }
            60% { opacity: 0.9; transform: translate(-1px, 2px); }
            80% { opacity: 0.5; transform: translate(3px, -3px); }
            100% { opacity: 0.8; transform: translate(-2px, 1px); }
          }
        `}</style>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ zIndex: 10, maxWidth: '600px' }}
      >
        <AlertTriangle size={100} style={{ margin: '0 auto 2rem auto', color: '#ef4444', filter: 'drop-shadow(0 0 20px #ef4444)' }} />
        
        <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '8px', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Corrupción Crítica
        </h1>
        
        <h2 style={{ fontSize: '1.5rem', color: '#fca5a5', marginBottom: '3rem' }}>
          NEXUS HA TOMADO EL CONTROL.
        </h2>

        <p style={{ fontSize: '1.1rem', color: '#f87171', lineHeight: 1.6, marginBottom: '2rem', background: 'rgba(239, 68, 68, 0.1)', padding: '2rem', border: '1px solid #ef4444', borderRadius: '0.5rem' }}>
          Tu expediente ha sido eliminado. Te dejaste llevar por las suposiciones, 
          ignoraste los detalles y perdiste tu innovación.
          <br /><br />
          El Director Aster no acepta fracasos. La Agencia CRONOS te da una última oportunidad.
        </p>

        <button 
          onClick={handleRestart}
          style={{
            background: 'transparent',
            color: '#ef4444',
            border: '2px solid #ef4444',
            padding: '1rem 3rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            margin: '0 auto',
            transition: 'all 0.3s',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#000'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
        >
          <RotateCcw size={24} />
          REINICIAR SISTEMA
        </button>
      </motion.div>
    </div>
  );
};

export default GameOverNexus;
