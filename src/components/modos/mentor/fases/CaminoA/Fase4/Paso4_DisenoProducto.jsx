import React, { useEffect } from 'react';
import { Package, Wrench, Trash2, Plus } from 'lucide-react';

const Paso4_DisenoProducto = ({ setAyudanteText, onComplete, globalData, updateGlobalData }) => {
  useEffect(() => {
    setAyudanteText("¡Llegó el momento! ¿Qué vas a ofrecer? Puedes añadir múltiples productos o servicios. Dale un nombre corto y descríbelo en una oración.");
  }, [setAyudanteText]);

  const { listaProductos = [] } = globalData;

  // Derivar nomProd y tipoNegocio automáticamente
  useEffect(() => {
    const hasProd = listaProductos.some(p => p.tipo === 'Producto');
    const hasServ = listaProductos.some(p => p.tipo === 'Servicio');
    let tipo = '';
    if (hasProd && hasServ) tipo = 'Ambos';
    else if (hasProd) tipo = 'Producto';
    else if (hasServ) tipo = 'Servicio';

    const nomProdStr = listaProductos.map(p => `${p.nombre || 'Sin nombre'}: ${p.descripcion || 'Sin descripción'}`).join(' | ');

    if (globalData.tipoNegocio !== tipo || globalData.nomProd !== nomProdStr) {
      updateGlobalData({ tipoNegocio: tipo, nomProd: nomProdStr });
    }
  }, [listaProductos, globalData.tipoNegocio, globalData.nomProd, updateGlobalData]);

  const addElemento = (tipo) => {
    updateGlobalData({
      listaProductos: [...listaProductos, { id: Date.now(), tipo, nombre: '', descripcion: '' }]
    });
  };

  const removeElemento = (id) => {
    updateGlobalData({
      listaProductos: listaProductos.filter(p => p.id !== id)
    });
  };

  const handleChange = (id, field, value) => {
    const updated = listaProductos.map(p => p.id === id ? { ...p, [field]: value } : p);
    updateGlobalData({ listaProductos: updated });
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1',
    background: '#f8fafc', color: '#0f172a', marginTop: '0.25rem', fontSize: '1rem', marginBottom: '1rem'
  };

  const getBtnStyle = (color) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
    flex: 1, padding: '1.5rem', borderRadius: '1rem', border: `2px solid ${color}`,
    background: 'white', color: color, cursor: 'pointer', transition: 'all 0.2s',
    fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  });

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '1.5rem', textAlign: 'center' }}>
        Añade tus Soluciones
      </h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={getBtnStyle('#3b82f6')} onClick={() => addElemento('Producto')}>
          <Package size={32} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={20} /> AÑADIR PRODUCTO</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.8, color: '#64748b', fontWeight: 'normal' }}>Algo físico que puedes tocar.</span>
        </div>
        <div style={getBtnStyle('#8b5cf6')} onClick={() => addElemento('Servicio')}>
          <Wrench size={32} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={20} /> AÑADIR SERVICIO</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.8, color: '#64748b', fontWeight: 'normal' }}>Algo que haces por otros.</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {listaProductos.map((item, index) => (
          <div key={item.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', position: 'relative', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <button 
              onClick={() => removeElemento(item.id)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem' }}
              title="Eliminar"
            >
              <Trash2 size={20} />
            </button>
            <h3 style={{ color: item.tipo === 'Producto' ? '#3b82f6' : '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>
              {item.tipo === 'Producto' ? <Package size={24} /> : <Wrench size={24} />} 
              {item.tipo} {index + 1}
            </h3>
            
            <label style={{ display: 'block', color: '#475569', fontWeight: 'bold', fontSize: '0.95rem' }}>Nombre del {item.tipo}</label>
            <input 
              type="text" 
              value={item.nombre} 
              onChange={e => handleChange(item.id, 'nombre', e.target.value)} 
              style={inputStyle} 
              placeholder={`Ej: ${item.tipo === 'Producto' ? 'Mochila térmica con calefacción solar' : 'Clases de Matemáticas Online'}`}
            />

            <label style={{ display: 'block', color: '#475569', fontWeight: 'bold', fontSize: '0.95rem' }}>Descripción Corta</label>
            <input 
              type="text" 
              value={item.descripcion} 
              onChange={e => handleChange(item.id, 'descripcion', e.target.value)} 
              style={{...inputStyle, marginBottom: 0}} 
              placeholder="Escribe en una oración corta qué hace o para qué sirve"
            />
          </div>
        ))}
        {listaProductos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '1rem', border: '2px dashed #cbd5e1' }}>
            Aún no tienes productos ni servicios. <br/> Haz clic en los botones de arriba para empezar.
          </div>
        )}
      </div>
    </div>
  );
};

export default Paso4_DisenoProducto;
