import React, { useEffect } from 'react';

const Paso7_BeneficiosCaracteristicas = ({ setAyudanteText, globalData, updateGlobalData }) => {
  useEffect(() => {
    setAyudanteText("A la gente no le importa de qué está hecho tu producto, le importa para qué le sirve. Escribe el beneficio de cada característica.");
  }, [setAyudanteText]);

  const { tipoNegocio, caracteristicasProducto = [], caracteristicasServicio = [] } = globalData;

  const handleProdChange = (id, value) => {
    const updated = caracteristicasProducto.map(c => c.id === id ? { ...c, beneficio: value } : c);
    updateGlobalData({ caracteristicasProducto: updated });
  };

  const handleServChange = (id, value) => {
    const updated = caracteristicasServicio.map(c => c.id === id ? { ...c, beneficio: value } : c);
    updateGlobalData({ caracteristicasServicio: updated });
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1',
    background: '#f8fafc', color: '#0f172a', fontSize: '0.95rem'
  };

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '1.5rem', textAlign: 'center' }}>
        Beneficios de cada Característica
      </h2>

      {!tipoNegocio && (
        <div style={{ textAlign: 'center', color: '#f87171' }}>
          Vuelve al Paso 4 para seleccionar el tipo de negocio.
        </div>
      )}

      {(tipoNegocio === 'Producto' || tipoNegocio === 'Ambos') && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Beneficios del Producto</h3>
          {caracteristicasProducto.length === 0 ? (
            <p style={{ color: '#475569' }}>No has añadido características en el paso anterior.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {caracteristicasProducto.map(c => (
                <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold', color: '#64748b' }}>
                    {c.nombre || '(Sin nombre)'}
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={c.beneficio} 
                      onChange={e => handleProdChange(c.id, e.target.value)} 
                      style={inputStyle} 
                      placeholder="¿De qué le sirve esto al cliente?" 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(tipoNegocio === 'Servicio' || tipoNegocio === 'Ambos') && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#c084fc', marginBottom: '1rem' }}>Beneficios del Servicio</h3>
          {caracteristicasServicio.length === 0 ? (
            <p style={{ color: '#475569' }}>No has añadido servicios en el paso anterior.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {caracteristicasServicio.map(c => (
                <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold', color: '#64748b' }}>
                    {c.nombre || '(Sin nombre)'}
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={c.beneficio} 
                      onChange={e => handleServChange(c.id, e.target.value)} 
                      style={inputStyle} 
                      placeholder="¿Qué ventaja le da este servicio al cliente?" 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Paso7_BeneficiosCaracteristicas;
