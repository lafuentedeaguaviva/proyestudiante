import React, { useEffect } from 'react';
import { Save, TrendingUp } from 'lucide-react';

const Paso16_EstimacionDemanda = ({ setAyudanteText, onComplete, globalData, updateGlobalData, guardando }) => {
  useEffect(() => {
    setAyudanteText("¡Último paso de la Fase 4! ¿Cuánto crees que vas a vender realmente considerando tu capacidad de producción o de tiempo?");
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
        Estimación de la Demanda (Ventas)
      </h2>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
        
        <div style={groupStyle}>
          <label style={labelStyle}>¿Cuántos productos/servicios crees que puedes vender o atender al mes? (Sé realista)</label>
          <input type="number" name="estimacionMes" value={globalData.estimacionMes} onChange={handleChange} style={inputStyle} placeholder="Ej. 100" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿Y cuánto sería eso a la semana?</label>
          <input type="number" name="estimacionSemana" value={globalData.estimacionSemana} onChange={handleChange} style={inputStyle} placeholder="Ej. 25" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>¿Cuánto de tu producto o servicio te comprará o consumirá 1 cliente promedio al mes?</label>
          <input type="text" name="estimacionCuanto" value={globalData.estimacionCuanto} onChange={handleChange} style={inputStyle} placeholder="Ej. Un cliente me comprará 2 postres al mes" />
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <button 
            onClick={onComplete}
            disabled={guardando}
            style={{ 
              padding: '1rem 3rem', background: guardando ? '#cbd5e1' : '#10b981', color: 'white', 
              border: 'none', borderRadius: '0.5rem', cursor: guardando ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
            }}
          >
            {guardando ? 'Guardando...' : <><Save size={20} /> Guardar Fase 4 y Continuar</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Paso16_EstimacionDemanda;
