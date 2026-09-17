import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Play } from 'lucide-react';

const Fase3_Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', background: '#f8fafc', color: '#334155', fontFamily: 'system-ui, sans-serif' }}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', maxWidth: '600px', background: 'white', padding: '4rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}
      >
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fefce8', border: '2px solid #fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
          <Bot size={40} color="#ca8a04" />
        </div>

        <h2 style={{ color: '#ca8a04', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1rem' }}>
          Fase 3
        </h2>
        
        <h1 style={{ color: '#0f172a', fontSize: '3rem', marginTop: '0', marginBottom: '2rem', fontWeight: 800 }}>
          Público Objetivo
        </h1>
        
        <p style={{ color: '#475569', fontSize: '1.25rem', lineHeight: '1.8', textAlign: 'center', marginBottom: '3rem' }}>
          Es hora de definir exactamente a quién le vendes tu solución. Analizaremos tu segmento de clientes, sus dolores y cómo tu producto encaja en sus vidas.
        </p>

        <motion.button
          onClick={() => navigate('/fase/3?paso=1')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ padding: '1.25rem 3rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '3rem', fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 15px -3px rgba(202, 138, 4, 0.4)' }}
        >
          <Play size={24} /> Comenzar Fase 3
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Fase3_Onboarding;
