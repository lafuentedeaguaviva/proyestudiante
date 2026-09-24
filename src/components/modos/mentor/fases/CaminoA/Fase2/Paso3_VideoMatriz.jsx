import React from 'react';
import { motion } from 'framer-motion';
import YoutubePlayer from '../../../../../ui/YoutubePlayer';

const Paso3_VideoMatriz = ({ setAyudanteText, onComplete }) => {
  React.useEffect(() => {
    setAyudanteText("Si imprimiste tu encuesta, ahora debemos pasar esos datos al sistema. Aprende cómo tabular y ordenar tus resultados en este video.");
  }, []);

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Paso 3: Matriz de Datos</h2>
      <p style={{ color: '#475569', marginBottom: '2rem' }}>Aprende cómo organizar las respuestas de papel en nuestra matriz digital.</p>
      
      <div style={{ background: '#000', borderRadius: '1rem', padding: '1rem', border: '1px solid #cbd5e1', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <YoutubePlayer 
            videoKey="video_fase_2"
            fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Video Matriz"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '0.5rem' }}
          />
        </div>
      </div>

      <button 
        onClick={onComplete}
        style={{ padding: '1rem 3rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Entendido, codificar encuesta
      </button>
    </div>
  );
};

export default Paso3_VideoMatriz;
