import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Shield, Rocket, BookOpen, Check } from 'lucide-react';

const SeleccionMundo = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  // IDs quemados según nuestro seed de schema.sql
  const mundos = [
    { 
      id: '11111111-1111-1111-1111-111111111111',
      rol: 'El Mentor', 
      icon: <BookOpen size={32} />, 
      color: '#3b82f6',
      bg: '#eff6ff',
      border: '#bfdbfe',
      desc: 'Guía y sabiduría para emprendedores en su camino.'
    }
  ];

  const handleSeleccion = () => {
    if (!selectedId) return;
    // Guardamos la selección temporalmente para que la Fase 0 la consuma
    localStorage.setItem('temp_entorno_seleccionado', selectedId);
    navigate('/fase/0');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '4rem 2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}
        >
          Elige tu Destino
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '3rem' }}
        >
          Bienvenido al simulador. Tu perfil psicológico determinará el tipo de desafíos que enfrentarás.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {mundos.map((mundo, idx) => {
            const isSelected = selectedId === mundo.id;
            return (
              <motion.div
                key={mundo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedId(mundo.id)}
                style={{
                  backgroundColor: isSelected ? mundo.bg : 'white',
                  border: `2px solid ${isSelected ? mundo.color : '#e2e8f0'}`,
                  borderRadius: '1rem',
                  padding: '2rem 1.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 10px 15px -3px ${mundo.color}40` : '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
                whileHover={{ y: -5 }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: mundo.color }}>
                    <Check size={24} strokeWidth={3} />
                  </div>
                )}
                
                <div style={{ color: mundo.color, marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  {mundo.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>{mundo.rol}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>{mundo.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          disabled={!selectedId}
          onClick={handleSeleccion}
          style={{
            padding: '1rem 3rem',
            backgroundColor: selectedId ? '#0f172a' : '#cbd5e1',
            color: '#0f172a',
            border: 'none',
            borderRadius: '2rem',
            fontSize: '1.125rem',
            fontWeight: 700,
            cursor: selectedId ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s'
          }}
        >
          Confirmar y Adentrarse al Simulador
        </motion.button>
      </div>
    </div>
  );
};

export default SeleccionMundo;
