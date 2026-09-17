import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

const Paso1_VideoPublico = ({ setAyudanteText, onComplete }) => {
  useEffect(() => {
    setAyudanteText("¡Bienvenido a la fase de Público Objetivo! Antes de definir a nuestro cliente, mira este video sobre cómo identificar a tu Público Objetivo.");
  }, [setAyudanteText]);

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '0.5rem' }}>
          ¿Quién es tu cliente ideal?
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          El primer paso para un negocio exitoso es saber a quién le vas a vender.
        </p>
      </div>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', textAlign: 'center' }}>
        
        {/* Placeholder de Video */}
        <div style={{ 
          width: '100%', 
          aspectRatio: '16/9', 
          background: '#000', 
          borderRadius: '0.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          border: '2px dashed #cbd5e1',
          marginBottom: '1.5rem'
        }}>
          <PlayCircle size={64} color="#94a3b8" />
          <span style={{ color: '#475569' }}>[ Espacio para el Video Explicativo ]</span>
        </div>

        <p style={{ color: '#64748b', lineHeight: '1.6', textAlign: 'left' }}>
          En el siguiente paso vamos a definir las características de tu cliente ideal. Si realizaste las encuestas en la Fase 2, usaremos esos datos para facilitarte el trabajo.
        </p>
      </div>

    </div>
  );
};

export default Paso1_VideoPublico;
