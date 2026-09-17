import React, { useEffect } from 'react';

const Paso14_DemandaInsatisfecha = ({ setAyudanteText, globalData, updateGlobalData }) => {
  useEffect(() => {
    setAyudanteText("Analiza a la competencia y descubre qué están haciendo mal o qué les falta hacer.");
  }, [setAyudanteText]);

  const handleChange = (e) => {
    updateGlobalData({ [e.target.name]: e.target.value });
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1',
    background: '#f8fafc', color: '#0f172a', marginTop: '0.5rem', fontSize: '1rem'
  };
  const labelStyle = { display: 'block', color: '#475569', fontWeight: 'bold', marginBottom: '0.25rem' };
  const groupStyle = { marginBottom: '1.5rem' };

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '1.5rem', textAlign: 'center' }}>
        Identifica la Demanda Insatisfecha
      </h2>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
        
        <div style={groupStyle}>
          <label style={labelStyle}>¿Cómo solucionan tu clientes su problema actualmente?</label>
          <input type="text" name="solucionActual" value={globalData.solucionActual} onChange={handleChange} style={inputStyle} placeholder="Ej. Comprando productos similares más caros o de mala calidad" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿De qué se quejan o por qué están insatisfechos con esa solución?</label>
          <textarea name="insatisfaccion" value={globalData.insatisfaccion} onChange={handleChange} style={{...inputStyle, minHeight: '80px'}} placeholder="Se quejan de que tarda mucho en llegar o el sabor no es bueno..." />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿Qué necesidad nueva has descubierto que nadie más atiende?</label>
          <input type="text" name="necesidadDescubierta" value={globalData.necesidadDescubierta} onChange={handleChange} style={inputStyle} placeholder="Ej. Quieren que el empaque sea retornable para no generar basura" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿Qué porción de esa demanda vas a cubrir tú? (En números, tu meta inicial)</label>
          <input type="text" name="cobertura" value={globalData.cobertura} onChange={handleChange} style={inputStyle} placeholder="Ej. Voy a apuntar a conseguir mis primeros 50 clientes fijos" />
        </div>

      </div>
    </div>
  );
};

export default Paso14_DemandaInsatisfecha;
