import React from 'react';
import { motion } from 'framer-motion';

/**
 * Componente Reutilizable: Splash Screen / Inicio de Fase
 * Cumple con la regla UX global: "Que se note claramente que el usuario está empezando una nueva fase."
 */
const SplashScreen = ({ 
  faseNumero, 
  titulo, 
  descripcion, 
  avatarSrc, 
  onComenzar 
}) => {
  return (
    <motion.div 
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', background: '#0a0a0a', color: '#e5e5e5', fontFamily: 'monospace' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ textAlign: 'center', maxWidth: '700px', background: '#d4d4d8', padding: '3rem', borderRadius: '4px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
      >
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#dc2626', border: '3px solid #dc2626', padding: '0.25rem 0.5rem', transform: 'rotate(-5deg)', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.8 }}>
          Clasificado
        </div>
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: '#52525b', fontSize: '0.75rem', textAlign: 'left' }}>
          AGENCIA CRONOS<br/>
          INVESTIGACIONES ESTRATÉGICAS
        </div>

        <h2 style={{ color: '#18181b', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginTop: '3rem', fontSize: '1.25rem', borderBottom: '2px solid #52525b', paddingBottom: '0.5rem' }}>
          Expediente {faseNumero.toString().padStart(2, '0')}
        </h2>
        
        <h1 style={{ color: '#09090b', fontSize: '3rem', marginTop: '1.5rem', marginBottom: '1.5rem', fontFamily: 'serif' }}>
          {titulo}
        </h1>
        
        <p style={{ color: '#3f3f46', fontSize: '1.125rem', lineHeight: '1.6', textAlign: 'justify' }}>
          {descripcion}
        </p>

        {avatarSrc && (
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#71717a', fontSize: '0.875rem' }}>Anexo A:</span>
            <img 
              src={avatarSrc} 
              alt="Anexo" 
              style={{ 
                width: '100px', 
                height: '100px', 
                objectFit: 'cover',
                filter: 'grayscale(100%) contrast(120%)',
                border: '1px solid #71717a',
                padding: '4px',
                background: 'white'
              }} 
            />
          </div>
        )}

        <motion.button
          onClick={onComenzar}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ marginTop: '3rem', padding: '1rem 3rem', background: '#09090b', color: '#fafafa', border: 'none', fontSize: '1.125rem', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'monospace' }}
        >
          Abrir Expediente
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
