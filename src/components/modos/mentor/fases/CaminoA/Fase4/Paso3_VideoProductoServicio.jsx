import React, { useEffect } from 'react';
import { PlayCircle } from 'lucide-react';

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
        <div style={{ 
          width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '0.5rem', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem',
          border: '2px dashed #cbd5e1', marginBottom: '1.5rem'
        }}>
          <PlayCircle size={64} color="#94a3b8" />
          <span style={{ color: '#475569' }}>[ Video: Diferencias entre Producto y Servicio ]</span>
        </div>
      </div>
    </div>
  );
};

export default Paso3_VideoProductoServicio;
