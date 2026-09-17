import React from 'react';
import { motion } from 'framer-motion';

export default function FODA({ setAyudanteText, onComplete }) {
  React.useEffect(() => {
    setAyudanteText("¡Hora de analizar! El FODA nos ayudará a ver las Fortalezas, Oportunidades, Debilidades y Amenazas de tu proyecto.");
  }, [setAyudanteText]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Análisis FODA</h2>
      <p style={{ marginBottom: '2rem' }}>Este es un módulo interactivo (en construcción) para arrastrar y soltar elementos de tu análisis FODA.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 'var(--radius)' }}>Fortalezas</div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 'var(--radius)' }}>Oportunidades</div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 'var(--radius)' }}>Debilidades</div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 'var(--radius)' }}>Amenazas</div>
      </div>

      <button className="btn-primary" onClick={() => onComplete({ foda: true })}>
        Completar FODA
      </button>
    </motion.div>
  );
}
