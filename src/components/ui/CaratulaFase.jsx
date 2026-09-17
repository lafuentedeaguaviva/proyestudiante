import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const CaratulaFase = ({ 
  faseNumber, 
  titulo, 
  descripcion, 
  icono: Icon, 
  colorPrincipal = '#ca8a04', // Color default para el Mentor
  onStart 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.5, type: 'spring', damping: 25 }}
      style={{
        width: '100%',
        minHeight: '65vh',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '400px', height: '400px', background: colorPrincipal, filter: 'blur(120px)', opacity: 0.15, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '300px', height: '300px', background: colorPrincipal, filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '800px' }}>
        
        {Icon && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{ 
              width: '120px', height: '120px', borderRadius: '50%', 
              background: `linear-gradient(135deg, ${colorPrincipal}15, ${colorPrincipal}30)`,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              boxShadow: `0 0 40px ${colorPrincipal}30, inset 0 0 20px rgba(255,255,255,0.5)`,
              border: `2px solid ${colorPrincipal}40`,
              marginBottom: '1rem'
            }}
          >
            <Icon size={56} color={colorPrincipal} strokeWidth={1.5} />
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span style={{ 
            fontSize: '1rem', fontWeight: 700, color: colorPrincipal, 
            textTransform: 'uppercase', letterSpacing: '3px',
            background: `${colorPrincipal}20`, padding: '0.5rem 1.25rem',
            borderRadius: '2rem', display: 'inline-block', marginBottom: '1rem'
          }}>
            Fase {faseNumber}
          </span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', margin: '0', lineHeight: 1.1, textWrap: 'balance' }}>
            {titulo}
          </h1>
        </motion.div>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: '1.25rem', color: '#475569', lineHeight: 1.6, margin: '1rem 0 2rem 0', textWrap: 'balance' }}
        >
          {descripcion}
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: `0 15px 30px -5px ${colorPrincipal}60` }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '1.25rem 3rem', fontSize: '1.25rem', fontWeight: 700,
            color: 'white', background: `linear-gradient(135deg, ${colorPrincipal}, #b47a03)`, // Oscurecemos un poco para el gradiente
            border: 'none', borderRadius: '3rem', cursor: 'pointer',
            transition: 'all 0.2s', textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          <Play fill="currentColor" size={24} />
          Comenzar Fase
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CaratulaFase;
