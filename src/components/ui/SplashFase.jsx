import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function SplashFase({ titulo, descripcion, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}
      className="glass-panel"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 style={{ fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '1.5rem', textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}>
          {titulo}
        </h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', lineHeight: '1.6' }}>
          {descripcion}
        </p>
      </motion.div>

      <motion.button
        onClick={onStart}
        className="btn-primary"
        style={{
          fontSize: '1.5rem',
          padding: '1rem 3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          borderRadius: 'var(--radius-full)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Comenzar Fase <Play size={24} fill="currentColor" />
      </motion.button>
    </motion.div>
  );
}
