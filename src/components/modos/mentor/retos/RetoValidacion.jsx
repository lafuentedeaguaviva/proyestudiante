import React from 'react';

const RetoValidacion = ({ onComplete }) => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Reto de Validación (Temporal)</h2>
      <button 
        onClick={() => onComplete && onComplete()}
        style={{ padding: '1rem', background: '#2563eb', color: 'white', borderRadius: '0.5rem' }}
      >
        Continuar
      </button>
    </div>
  );
};

export default RetoValidacion;
