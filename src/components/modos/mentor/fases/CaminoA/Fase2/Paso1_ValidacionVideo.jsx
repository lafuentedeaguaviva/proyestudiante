import React from 'react';
import { PlayCircle, SkipForward, ArrowLeft, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const Paso1_ValidacionVideo = ({ setAyudanteText, onComplete, onSkip }) => {
  React.useEffect(() => {
    setAyudanteText("Para saber si tu idea realmente funcionará, debes preguntarle al mercado. Mira este video y generaremos tu encuesta.");
  }, []);

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Paso 1: ¿Por qué Validar?</h2>
      
      <div style={{ background: '#000', borderRadius: '1rem', padding: '1rem', border: '1px solid #cbd5e1', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '0.5rem' }}
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Video Validación" 
            frameBorder="0" 
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={onComplete}
          style={{ padding: '1rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Bot size={20} /> Generar Encuesta con IA
        </button>
        <button 
          onClick={onSkip}
          style={{ padding: '1rem 2rem', background: 'transparent', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <SkipForward size={20} /> Saltar Encuesta
        </button>
      </div>
    </div>
  );
};

export default Paso1_ValidacionVideo;
