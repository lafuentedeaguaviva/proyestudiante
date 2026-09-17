import React, { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const Paso6_Caracteristicas = ({ setAyudanteText, globalData, updateGlobalData }) => {
  useEffect(() => {
    setAyudanteText("Detalla las características de tu oferta. Enumera las piezas, materiales o pasos que la componen.");
  }, [setAyudanteText]);

  const { tipoNegocio, caracteristicasProducto = [], caracteristicasServicio = [] } = globalData;

  const handleProdChange = (id, field, value) => {
    const updated = caracteristicasProducto.map(c => c.id === id ? { ...c, [field]: value } : c);
    updateGlobalData({ caracteristicasProducto: updated });
  };

  const handleServChange = (id, field, value) => {
    const updated = caracteristicasServicio.map(c => c.id === id ? { ...c, [field]: value } : c);
    updateGlobalData({ caracteristicasServicio: updated });
  };

  const addProd = () => {
    updateGlobalData({
      caracteristicasProducto: [...caracteristicasProducto, { id: Date.now(), nombre: '', material: '', uso: '', dimensiones: '', beneficio: '' }]
    });
  };

  const addServ = () => {
    updateGlobalData({
      caracteristicasServicio: [...caracteristicasServicio, { id: Date.now(), nombre: '', beneficio: '', cuandoComo: '' }]
    });
  };

  const removeProd = (id) => {
    updateGlobalData({ caracteristicasProducto: caracteristicasProducto.filter(c => c.id !== id) });
  };

  const removeServ = (id) => {
    updateGlobalData({ caracteristicasServicio: caracteristicasServicio.filter(c => c.id !== id) });
  };

  const inputStyle = {
    width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1',
    background: '#f8fafc', color: '#0f172a', fontSize: '0.9rem'
  };

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '1.5rem', textAlign: 'center' }}>
        Características Técnicas
      </h2>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <label style={{ display: 'block', color: '#475569', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
          Nombre y/o Descripción general de tu {tipoNegocio || 'Producto/Servicio'}
        </label>
        <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Escribe el nombre de lo que ofreces o descríbelo en una oración corta. (Ej: "Mochila térmica con calefacción solar"). Esto ayudará a la IA a entender tu proyecto.
        </p>
        <input 
          type="text" 
          value={globalData.nomProd || ''} 
          onChange={(e) => updateGlobalData({ nomProd: e.target.value })}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: '1rem' }}
          placeholder={`Describe tu ${tipoNegocio || 'idea'} aquí...`}
        />
      </div>

      {!tipoNegocio && (
        <div style={{ textAlign: 'center', color: '#f87171' }}>
          Por favor, vuelve al Paso 4 y selecciona si es Producto o Servicio.
        </div>
      )}

      {(tipoNegocio === 'Producto' || tipoNegocio === 'Ambos') && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Tabla de Características del Producto</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem' }}>Nombre / Pieza</th>
                  <th style={{ padding: '0.75rem' }}>Material / Ingredientes</th>
                  <th style={{ padding: '0.75rem' }}>Color / Dimensiones</th>
                  <th style={{ padding: '0.75rem' }}>Funcionalidad (Uso)</th>
                  <th style={{ padding: '0.75rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {caracteristicasProducto.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <td style={{ padding: '0.5rem' }}><input type="text" value={c.nombre} onChange={e => handleProdChange(c.id, 'nombre', e.target.value)} style={inputStyle} /></td>
                    <td style={{ padding: '0.5rem' }}><input type="text" value={c.material} onChange={e => handleProdChange(c.id, 'material', e.target.value)} style={inputStyle} /></td>
                    <td style={{ padding: '0.5rem' }}><input type="text" value={c.dimensiones} onChange={e => handleProdChange(c.id, 'dimensiones', e.target.value)} style={inputStyle} /></td>
                    <td style={{ padding: '0.5rem' }}><input type="text" value={c.uso} onChange={e => handleProdChange(c.id, 'uso', e.target.value)} style={inputStyle} /></td>
                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                      <button onClick={() => removeProd(c.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addProd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
            <Plus size={16} /> Añadir Característica
          </button>
        </div>
      )}

      {(tipoNegocio === 'Servicio' || tipoNegocio === 'Ambos') && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#c084fc', marginBottom: '1rem' }}>Tabla de Características del Servicio</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem' }}>Nombre del Servicio o Fase</th>
                  <th style={{ padding: '0.75rem' }}>¿Cuándo y cómo se realiza?</th>
                  <th style={{ padding: '0.75rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {caracteristicasServicio.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <td style={{ padding: '0.5rem' }}><input type="text" value={c.nombre} onChange={e => handleServChange(c.id, 'nombre', e.target.value)} style={inputStyle} /></td>
                    <td style={{ padding: '0.5rem' }}><input type="text" value={c.cuandoComo} onChange={e => handleServChange(c.id, 'cuandoComo', e.target.value)} style={inputStyle} /></td>
                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                      <button onClick={() => removeServ(c.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addServ} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem 1rem', background: '#8b5cf6', color: '#0f172a', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
            <Plus size={16} /> Añadir Servicio
          </button>
        </div>
      )}
    </div>
  );
};

export default Paso6_Caracteristicas;
