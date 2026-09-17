import React, { useEffect } from 'react';
import { Package, Wrench, Layers } from 'lucide-react';

const Paso4_DisenoProducto = ({ setAyudanteText, onComplete, globalData, updateGlobalData }) => {
  useEffect(() => {
    setAyudanteText("¡Llegó el momento! ¿Qué vamos a crear? Define si es un Producto, un Servicio, o una mezcla de ambos, y explícanos de qué trata.");
  }, [setAyudanteText]);

  const handleChange = (e) => {
    updateGlobalData({ [e.target.name]: e.target.value });
  };

  const handleSelectTipo = (tipo) => {
    updateGlobalData({ tipoNegocio: tipo });
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1',
    background: '#f8fafc', color: '#0f172a', marginTop: '0.5rem', fontSize: '1rem'
  };

  const labelStyle = { display: 'block', color: '#475569', fontWeight: 'bold', marginBottom: '0.25rem' };
  const groupStyle = { marginBottom: '1.5rem' };

  const getOptionStyle = (tipo) => ({
    flex: 1, padding: '1.5rem', borderRadius: '1rem', border: globalData.tipoNegocio === tipo ? '2px solid #3b82f6' : '2px solid #475569',
    background: globalData.tipoNegocio === tipo ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.8)',
    color: globalData.tipoNegocio === tipo ? '#60a5fa' : '#94a3b8', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
  });

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '1.5rem', textAlign: 'center' }}>
        Elige y Describe tu Solución
      </h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={getOptionStyle('Producto')} onClick={() => handleSelectTipo('Producto')}>
          <Package size={40} />
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>PRODUCTO</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Algo físico que puedes tocar.</div>
        </div>
        <div style={getOptionStyle('Servicio')} onClick={() => handleSelectTipo('Servicio')}>
          <Wrench size={40} />
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>SERVICIO</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Algo que haces por otros (intangible).</div>
        </div>
        <div style={getOptionStyle('Ambos')} onClick={() => handleSelectTipo('Ambos')}>
          <Layers size={40} />
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>AMBOS</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Producto con un servicio asociado.</div>
        </div>
      </div>

      {globalData.tipoNegocio && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>¡Excelente elección!</h3>
          <p style={{ color: '#475569' }}>Has definido tu modelo principal como <strong>{globalData.tipoNegocio}</strong>. Ya puedes avanzar al siguiente paso.</p>
        </div>
      )}
    </div>
  );
};

export default Paso4_DisenoProducto;
