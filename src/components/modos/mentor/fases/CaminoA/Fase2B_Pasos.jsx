import React from 'react';
import { motion } from 'framer-motion';

export default function Fase2B_Pasos({ setAyudanteText, onComplete }) {
  React.useEffect(() => {
    setAyudanteText("Investigaremos a fondo la falla técnica de la máquina o proceso.");
  }, [setAyudanteText]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Diagnóstico del Contexto Productivo</h2>
      <p style={{ marginBottom: '2rem' }}>Este módulo agrupará la investigación de campo, público objetivo y redacción del problema para el Camino B.</p>
      
      <div style={{ padding: '2rem', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
        <p>🚧 En construcción 🚧</p>
      </div>

      <button className="btn-primary" onClick={() => onComplete({ diagnosticoB: true })}>
        Completar Diagnóstico Técnico
      </button>
    </motion.div>
  );
}
