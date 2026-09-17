import React, { useEffect } from 'react';
import { PlayCircle } from 'lucide-react';

const Paso5_VideoCaracteristicas = ({ setAyudanteText }) => {
  useEffect(() => {
    setAyudanteText("Las características son la parte técnica y descriptiva de lo que ofreces. Mira este video para entender cómo detallarlas correctamente.");
  }, [setAyudanteText]);

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '0.5rem' }}>
          ¿Qué tiene y de qué está hecho?
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Aprende a desglosar tu Producto o Servicio en sus partes fundamentales.
        </p>
      </div>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <div style={{ 
          width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '0.5rem', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem',
          border: '2px dashed #cbd5e1'
        }}>
          <PlayCircle size={64} color="#94a3b8" />
          <span style={{ color: '#475569' }}>[ Video: Características Técnicas y Descriptivas ]</span>
        </div>
      </div>
    </div>
  );
};

export default Paso5_VideoCaracteristicas;
