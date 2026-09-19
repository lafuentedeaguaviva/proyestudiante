import React, { useEffect } from 'react';
import { Calculator, Save } from 'lucide-react';

const Paso12_DemandaPotencial = ({ setAyudanteText, globalData, updateGlobalData, onComplete, guardando }) => {
  const calcularPotencial = (currData = globalData) => {
    const total = parseFloat(currData.mercadoTotal) || 0;
    const porcentajeProblema = parseFloat(currData.porcentajeProblema) || 0;
    const porcentajeCompra = parseFloat(currData.porcentajeCompra) || 0;
    
    // De los totales, cuántos tienen el problema y de ellos cuántos comprarían
    const conProblema = total * (porcentajeProblema / 100);
    const probablesCompradores = conProblema * (porcentajeCompra / 100);
    return Math.round(probablesCompradores);
  };

  useEffect(() => {
    setAyudanteText("Pensemos en números. ¿Aproximadamente cuántas personas hay en tu zona de alcance que cumplen con el perfil de tu cliente?");
    const pot = calcularPotencial();
    if (pot > 0) {
      updateGlobalData({
        demandaPotencial: pot,
        clientesPotenciales: pot,
        demanda_potencial: pot,
        calculoMensual: pot,
        produccionMensual: pot
      });
    }
  }, [setAyudanteText]);

  const handleChange = (e) => {
    const nextData = { ...globalData, [e.target.name]: e.target.value };
    const pot = calcularPotencial(nextData);

    updateGlobalData({
      ...nextData,
      demandaPotencial: pot,
      clientesPotenciales: pot,
      demanda_potencial: pot,
      calculoMensual: pot,
      produccionMensual: pot
    });
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
        Demanda potencial por mes
      </h2>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
        
        <div style={groupStyle}>
          <label style={labelStyle}>¿Cuántas personas aproximadamente conforman tu mercado total? (Ej. habitantes de un barrio)</label>
          <input type="number" name="mercadoTotal" value={globalData.mercadoTotal} onChange={handleChange} style={inputStyle} placeholder="Ej. 5000" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Del total anterior, ¿Qué porcentaje crees que tiene el problema/necesidad? (%)</label>
          <input type="number" name="porcentajeProblema" value={globalData.porcentajeProblema} onChange={handleChange} style={inputStyle} placeholder="Ej. 30" max="100" />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>De los que tienen la necesidad, ¿Qué porcentaje estaría dispuesto a pagarte? (%)</label>
          <input type="number" name="porcentajeCompra" value={globalData.porcentajeCompra} onChange={handleChange} style={inputStyle} placeholder="Ej. 10" max="100" />
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '1rem', border: '1px solid rgba(59, 130, 246, 0.5)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Calculator size={48} color="#60a5fa" />
          <div>
            <h3 style={{ color: '#60a5fa', margin: '0 0 0.5rem 0' }}>Clientes Potenciales</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>
              {calcularPotencial()} personas
            </p>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>Basado en tus estimaciones</p>
          </div>
        </div>

        {onComplete && (
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
        )}

      </div>
    </div>
  );
};

export default Paso12_DemandaPotencial;
