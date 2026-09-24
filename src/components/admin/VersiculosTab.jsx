import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Book } from 'lucide-react';
import { obtenerPromptIA, guardarPromptIA } from '../../services/api';

const VersiculosTab = ({ setMessage }) => {
  const [versiculos, setVersiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarVersiculos();
  }, []);

  const cargarVersiculos = async () => {
    try {
      const data = await obtenerPromptIA(0, 'versiculos_biblicos');
      if (data && data.prompt_texto) {
        setVersiculos(JSON.parse(data.prompt_texto));
      } else {
        // Valores por defecto si está vacío
        setVersiculos([
          { texto: "Todo lo puedo en Cristo que me fortalece.", cita: "Filipenses 4:13" },
          { texto: "Porque yo sé muy bien los planes que tengo para ustedes...", cita: "Jeremías 29:11" }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error al cargar los versículos.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanVersiculos = versiculos.filter(v => v.texto.trim() !== '');
      await guardarPromptIA(0, 'versiculos_biblicos', JSON.stringify(cleanVersiculos));
      setVersiculos(cleanVersiculos);
      setMessage({ text: 'Versículos guardados exitosamente.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error al guardar los versículos.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    setVersiculos([...versiculos, { texto: "", cita: "" }]);
  };

  const handleRemove = (index) => {
    const nuevos = [...versiculos];
    nuevos.splice(index, 1);
    setVersiculos(nuevos);
  };

  const handleChange = (index, field, value) => {
    const nuevos = [...versiculos];
    nuevos[index][field] = value;
    setVersiculos(nuevos);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#94a3b8', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #3b82f6', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        <span>Cargando versículos...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#f8fafc', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Book size={20} color="#60a5fa" />
            </div>
            Versículos Bíblicos
          </h2>
          <p style={{ color: '#94a3b8', margin: '0.5rem 0 0 0' }}>
            Configura los versículos que aparecerán aleatoriamente en el Centro de Mando.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleAdd}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Plus size={18} /> Agregar Versículo
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'all 0.2s' }}
          >
            {saving ? <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {versiculos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', color: '#94a3b8' }}>
            No hay versículos configurados. Agrega uno nuevo.
          </div>
        ) : (
          versiculos.map((v, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
            >
              <div style={{ width: '30px', height: '30px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea 
                  value={v.texto}
                  onChange={e => handleChange(idx, 'texto', e.target.value)}
                  placeholder="Texto del versículo..."
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', color: 'white', minHeight: '80px', resize: 'vertical' }}
                />
                <input 
                  type="text"
                  value={v.cita}
                  onChange={e => handleChange(idx, 'cita', e.target.value)}
                  placeholder="Cita (ej. Salmo 23:1)"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem', color: 'white' }}
                />
              </div>
              <button 
                onClick={() => handleRemove(idx)}
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', width: '40px', height: '40px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default VersiculosTab;
