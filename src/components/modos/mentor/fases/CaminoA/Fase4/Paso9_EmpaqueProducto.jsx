import React, { useEffect } from 'react';

const Paso9_EmpaqueProducto = ({ setAyudanteText, globalData, updateGlobalData }) => {
  useEffect(() => {
    setAyudanteText("Detalla cómo entregarás el producto. Piensa en la caja, etiqueta, y la experiencia al abrirlo.");
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
        Empaque y Etiquetado (Producto)
      </h2>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
        
        <div style={groupStyle}>
          <label style={labelStyle}>¿Cómo vas a entregar el producto? (Envase, envoltura, caja)</label>
          <input type="text" name="empaqueEntrega" value={globalData.empaqueEntrega} onChange={handleChange} style={inputStyle} placeholder="Ej. En una caja de cartón kraft con logo sellado" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿Qué materiales usarás para el empaque y por qué?</label>
          <input type="text" name="empaqueMateriales" value={globalData.empaqueMateriales} onChange={handleChange} style={inputStyle} placeholder="Ej. Cartón reciclado, porque a mis clientes les importa la ecología" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿Qué hace que tu empaque sea visualmente atractivo?</label>
          <input type="text" name="empaqueAtractivo" value={globalData.empaqueAtractivo} onChange={handleChange} style={inputStyle} placeholder="Ej. Un diseño minimalista con colores pastel" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿Qué información incluirá la etiqueta?</label>
          <input type="text" name="empaqueInfo" value={globalData.empaqueInfo} onChange={handleChange} style={inputStyle} placeholder="Ej. Ingredientes, fecha de vencimiento, código QR" />
        </div>

      </div>
    </div>
  );
};

export default Paso9_EmpaqueProducto;
