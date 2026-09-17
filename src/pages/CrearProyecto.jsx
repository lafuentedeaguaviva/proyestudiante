import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Shield, Rocket, BookOpen, Lightbulb, ArrowLeft } from 'lucide-react';
import MundoCard from '../components/Dashboard/MundoCard';

const mundos = [
  { id: '55555555-5555-5555-5555-555555555555', rol: 'El Mentor', icon: <Lightbulb size={40} />, color: '#ca8a04', desc: 'Asistencia directa y funcional, sin simulaciones ni juegos de rol.' }
];

const CrearProyecto = () => {
  const navigate = useNavigate();

  const handleCrearProyecto = (mundoId) => {
    localStorage.setItem('temp_entorno_seleccionado', mundoId);
    if (mundoId === '55555555-5555-5555-5555-555555555555') {
      navigate('/fase/0');
    } else {
      navigate('/fase/1');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-background)', padding: 'var(--spacing-4xl) var(--spacing-2xl)', fontFamily: 'var(--font-family-base)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background elements */}
      <motion.div 
        animate={{ y: [0, -30, 0], scale: [1, 1.05, 1], rotate: [0, 5, 0] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '-10%', left: '-10%', width: '600px', height: '600px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-full)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} 
      />
      <motion.div 
        animate={{ y: [0, 40, 0], scale: [1, 1.1, 1], rotate: [0, -5, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '700px', height: '700px', background: 'var(--color-secondary-light)', borderRadius: 'var(--radius-full)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} 
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', fontWeight: 600 }}
        >
          <ArrowLeft size={20} /> Volver
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--spacing-4xl)' }}>
          <h2 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-black)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-md)', letterSpacing: '-0.02em' }}>
            Elige tu Arquetipo Operativo
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-3xl)' }}>
            Selecciona el entorno y la metodología que guiará tu nueva misión.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-xl)' }}>
            {mundos.map((mundo, idx) => (
              <MundoCard 
                key={mundo.id} 
                mundo={mundo} 
                idx={idx} 
                onClick={handleCrearProyecto} 
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CrearProyecto;
