import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Play } from 'lucide-react';

const SplashScreenMentor = ({ 
  faseNumero, 
  titulo, 
  descripcion, 
  onComenzar 
}) => {
  return (
    <motion.div 
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', background: '#f8fafc', color: '#334155', fontFamily: 'system-ui, sans-serif' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ textAlign: 'center', maxWidth: '600px', background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}
      >
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fefce8', border: '2px solid #fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
          <Bot size={40} color="#ca8a04" />
        </div>

        <h2 style={{ color: '#ca8a04', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
          Fase {faseNumero}
        </h2>
        
        <h1 style={{ color: '#0f172a', fontSize: '2.5rem', marginTop: '0', marginBottom: '1.5rem', fontWeight: 800 }}>
          {titulo}
        </h1>
        
        <p style={{ color: '#475569', fontSize: '1.125rem', lineHeight: '1.6', textAlign: 'center' }}>
          {descripcion}
        </p>

        <motion.button
          onClick={onComenzar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ marginTop: '3rem', padding: '1rem 3rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(202, 138, 4, 0.4)' }}
        >
          <Play size={20} /> Comenzar Sesión
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreenMentor;
