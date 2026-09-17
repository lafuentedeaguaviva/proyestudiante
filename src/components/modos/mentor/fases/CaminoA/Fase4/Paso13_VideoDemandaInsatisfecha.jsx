import React, { useEffect } from 'react';
import { PlayCircle } from 'lucide-react';

const Paso13_VideoDemandaInsatisfecha = ({ setAyudanteText }) => {
  useEffect(() => {
    setAyudanteText("¿Hay gente que quiere comprar algo pero no encuentra quién se lo venda? Eso es la demanda insatisfecha. Mira este corto video.");
  }, [setAyudanteText]);

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '0.5rem' }}>
          La Demanda Insatisfecha
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Encontrar huecos en el mercado es tu mejor oportunidad.
        </p>
      </div>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <div style={{ 
          width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '0.5rem', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem',
          border: '2px dashed #cbd5e1'
        }}>
          <PlayCircle size={64} color="#94a3b8" />
          <span style={{ color: '#475569' }}>[ Video: Cómo identificar la demanda insatisfecha ]</span>
        </div>
      </div>
    </div>
  );
};

export default Paso13_VideoDemandaInsatisfecha;
