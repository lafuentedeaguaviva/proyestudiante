import React, { useEffect } from 'react';

const Paso10_PresentacionServicio = ({ setAyudanteText, globalData, updateGlobalData }) => {
  useEffect(() => {
    setAyudanteText("Los servicios no se tocan, se sienten. Detalla cómo va a percibir tu cliente la calidad del servicio.");
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
        Presentación del Servicio
      </h2>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
        
        <div style={groupStyle}>
          <label style={labelStyle}>¿Cómo percibirá el cliente tu servicio?</label>
          <input type="text" name="presentacionPercepcion" value={globalData.presentacionPercepcion} onChange={handleChange} style={inputStyle} placeholder="Ej. A través de un trato amable y un uniforme limpio" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿Qué elementos tangibles demuestran la calidad? (Herramientas, local)</label>
          <input type="text" name="presentacionTangibles" value={globalData.presentacionTangibles} onChange={handleChange} style={inputStyle} placeholder="Ej. Equipos modernos y bien cuidados" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿Qué documentación o entregable recibe el cliente?</label>
          <input type="text" name="presentacionDocumentacion" value={globalData.presentacionDocumentacion} onChange={handleChange} style={inputStyle} placeholder="Ej. Un reporte digital en PDF o certificado" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿Cómo generas confianza durante la prestación?</label>
          <input type="text" name="presentacionConfianza" value={globalData.presentacionConfianza} onChange={handleChange} style={inputStyle} placeholder="Ej. Explicando paso a paso el proceso" />
        </div>

      </div>
    </div>
  );
};

export default Paso10_PresentacionServicio;
