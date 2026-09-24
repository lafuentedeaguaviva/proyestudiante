import React, { useEffect } from 'react';
import YoutubePlayer from '../../../../../ui/YoutubePlayer';

const Paso3_VideoProductoServicio = ({ setAyudanteText, onComplete }) => {
  useEffect(() => {
    setAyudanteText("¿Vas a crear algo que se pueda tocar o vas a brindar tu tiempo y habilidades? Mira este video para entender la diferencia entre Producto y Servicio.");
  }, [setAyudanteText]);

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '0.5rem' }}>
          Diseño del Producto o Servicio
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Conoce las diferencias clave antes de definir lo que vas a vender.
        </p>
      </div>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', textAlign: 'center' }}>
        <YoutubePlayer 
          videoKey="video_fase_4"
          fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Video Fase 4"
        />
      </div>
    </div>
  );
};

export default Paso3_VideoProductoServicio;
