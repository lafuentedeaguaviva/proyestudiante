import React, { useEffect, useState } from 'react';
import { RefreshCcw, Save, Target, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { obtenerTodoElContenidoProyecto } from '../../../../../../services/api';

const Paso2_PublicoObjetivo = ({ setAyudanteText, onComplete, globalData, updateGlobalData }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    setAyudanteText("Describe a tu cliente ideal. Puedes usar los resultados de tu encuesta para autocompletar esta información de forma inteligente.");
  }, [setAyudanteText]);

  const handleChange = (e) => {
    updateGlobalData({ [e.target.name]: e.target.value });
  };

  const getMostFrequent = (arr) => {
    if (!arr || arr.length === 0) return '';
    const hashMap = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(hashMap).reduce((a, b) => hashMap[a] > hashMap[b] ? a : b);
  };

  const autoCompletar = async () => {
    setIsSearching(true);
    try {
      const todosLosDatos = await obtenerTodoElContenidoProyecto();
      
      let encuestasEncontradas = [];
      let resumenIA = null;

      // Búsqueda profunda en todo el JSON del proyecto
      const buscarDatos = (obj) => {
        if (!obj) return;
        if (typeof obj === 'object') {
          if (Array.isArray(obj)) {
            if (obj.length > 0 && obj[0].hasOwnProperty('edad')) {
              encuestasEncontradas = obj;
            }
            obj.forEach(buscarDatos);
          } else {
            for (let key in obj) {
              if (key === 'resumen_ia' && obj[key].buyer_persona) {
                resumenIA = obj[key];
              }
              if (key === 'encuestas' && Array.isArray(obj[key]) && obj[key].length > 0) {
                encuestasEncontradas = obj[key];
              }
              if (typeof obj[key] === 'string') {
                try {
                  const parsed = JSON.parse(obj[key]);
                  buscarDatos(parsed);
                } catch(e) {}
              } else {
                buscarDatos(obj[key]);
              }
            }
          }
        }
      };

      // Buscamos en todas las fases
      buscarDatos(todosLosDatos);

      if (encuestasEncontradas.length > 0 || resumenIA) {
        let actualizaciones = {};

        if (encuestasEncontradas.length > 0) {
          const edadFreq = getMostFrequent(encuestasEncontradas.map(e => e.edad).filter(Boolean));
          const genFreq = getMostFrequent(encuestasEncontradas.map(e => e.genero).filter(Boolean));
          const zonaFreq = getMostFrequent(encuestasEncontradas.map(e => e.zona).filter(Boolean));
          const estFreq = getMostFrequent(encuestasEncontradas.map(e => e.est).filter(Boolean));
          const ingFreq = getMostFrequent(encuestasEncontradas.map(e => e.ing).filter(Boolean));
          const frecFreq = getMostFrequent(encuestasEncontradas.map(e => e.frec).filter(Boolean));

          actualizaciones = {
            encuestasFase2: encuestasEncontradas,
            publicoEdad: edadFreq,
            publicoGenero: genFreq,
            publicoUbicacion: zonaFreq,
            publicoEducacion: estFreq,
            publicoSituacion: ingFreq ? `Ingresos: ${ingFreq}` : '',
            publicoHabitos: frecFreq ? `Frecuencia de consumo: ${frecFreq}` : ''
          };
        }

        if (resumenIA) {
          actualizaciones.publicoObjetivoIA = resumenIA.publico_objetivo_resumido || '';
          actualizaciones.publicoBuyerPersonaIA = resumenIA.buyer_persona || '';
        }

        updateGlobalData(actualizaciones);
        
        setModalData({ type: 'success', message: '¡Datos autocompletados exitosamente usando la Inteligencia Artificial y tus encuestas!' });
      } else {
        setModalData({ type: 'error', message: 'No se encontraron encuestas ni resumen de IA. Asegúrate de haber completado la Fase 2.' });
      }
    } catch (e) {
      console.error("Error buscando encuestas en BD", e);
      setModalData({ type: 'error', message: 'Hubo un error al buscar las encuestas en la base de datos.' });
    } finally {
      setIsSearching(false);
    }
  };

  const inputStyle = {
    padding: '0.85rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
    color: '#0f172a',
    width: '100%',
    outline: 'none',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
  };

  const labelStyle = {
    color: '#334155',
    fontWeight: '700',
    fontSize: '0.95rem',
    marginBottom: '0.4rem',
    display: 'block'
  };

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800' }}>
            <Target color="#3b82f6" size={32} /> Arquetipo de Cliente (Persona)
          </h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1.05rem' }}>Define los sectores clave de tu público objetivo para segmentar tu mercado.</p>
        </div>
        <motion.button 
          whileHover={!isSearching ? { scale: 1.03 } : {}}
          whileTap={!isSearching ? { scale: 0.97 } : {}}
          onClick={autoCompletar}
          disabled={isSearching}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1.25rem', 
            background: isSearching ? '#94a3b8' : '#3b82f6', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '0.5rem', 
            cursor: isSearching ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: isSearching ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => { if (!isSearching) e.currentTarget.style.background = '#2563eb' }}
          onMouseLeave={(e) => { if (!isSearching) e.currentTarget.style.background = '#3b82f6' }}
        >
          {isSearching ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />} 
          {isSearching ? 'Buscando...' : 'Auto-completar Datos'}
        </motion.button>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        alignItems: 'stretch'
      }}>
        
        {/* Sector Demográfico Básicos */}
        <div style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <label style={labelStyle}>1. Edad del segmento</label>
          <input 
            type="text" 
            name="publicoEdad" 
            value={globalData.publicoEdad || ''} 
            onChange={handleChange} 
            style={inputStyle}
            placeholder="Ej. 18-25 años" 
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

        <div style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <label style={labelStyle}>2. Identidad de Género</label>
          <input 
            type="text" 
            name="publicoGenero" 
            value={globalData.publicoGenero || ''} 
            onChange={handleChange} 
            style={inputStyle}
            placeholder="Ej. Femenino, Masculino, Indiferente" 
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

        {/* Sector Geográfico y Educativo */}
        <div style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <label style={labelStyle}>3. Ubicación o Residencia</label>
          <input 
            type="text" 
            name="publicoUbicacion" 
            value={globalData.publicoUbicacion || ''} 
            onChange={handleChange} 
            style={inputStyle}
            placeholder="Ej. Zona Sur, Estudiantes UMSA" 
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

        <div style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <label style={labelStyle}>4. Nivel de Formación</label>
          <input 
            type="text" 
            name="publicoEducacion" 
            value={globalData.publicoEducacion || ''} 
            onChange={handleChange} 
            style={inputStyle}
            placeholder="Ej. Universitario o Profesional" 
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

        {/* Sectores de Comportamiento y Economía (Más anchos) */}
        <div style={{...cardStyle, gridColumn: '1 / -1'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <label style={labelStyle}>5. Perfil Económico (Ingresos y Hábitos de Gasto)</label>
          <textarea 
            name="publicoSituacion" 
            value={globalData.publicoSituacion || ''} 
            onChange={handleChange} 
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            placeholder="¿Cuál es su nivel de ingresos promedio y qué tanto están dispuestos a gastar en tu tipo de producto/servicio?" 
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

        <div style={{...cardStyle, gridColumn: '1 / -1'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <label style={labelStyle}>6. Hábitos, Intereses y Puntos de Dolor</label>
          <textarea 
            name="publicoHabitos" 
            value={globalData.publicoHabitos || ''} 
            onChange={handleChange} 
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            placeholder="¿Qué redes sociales consumen? ¿Cuáles son sus pasatiempos? ¿Qué problemas urgentes buscan resolver?" 
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

        {/* Sectores de Inteligencia Artificial (Nuevos) */}
        <div style={{...cardStyle, gridColumn: '1 / -1', borderLeft: '4px solid #3b82f6'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <label style={{...labelStyle, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            7. Público Objetivo Resumido (Sugerencia de IA)
          </label>
          <input 
            type="text" 
            name="publicoObjetivoIA" 
            value={globalData.publicoObjetivoIA || ''} 
            onChange={handleChange} 
            style={inputStyle}
            placeholder="Ej. Jóvenes universitarios" 
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

        <div style={{...cardStyle, gridColumn: '1 / -1', borderLeft: '4px solid #3b82f6'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <label style={{...labelStyle, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            8. Buyer Persona Completo (Sugerencia de IA)
          </label>
          <textarea 
            name="publicoBuyerPersonaIA" 
            value={globalData.publicoBuyerPersonaIA || ''} 
            onChange={handleChange} 
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
            placeholder="Descripción detallada de tu cliente ideal según la IA..." 
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

      </div>

      {/* Modal Personalizado en lugar del alert */}
      {modalData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              {modalData.type === 'success' ? (
                <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
              ) : (
                <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '50%' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
              )}
            </div>
            <h2 style={{ color: modalData.type === 'success' ? '#16a34a' : '#ef4444', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>
              {modalData.type === 'success' ? '¡Éxito!' : 'Aviso'}
            </h2>
            <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '1.1rem' }}>{modalData.message}</p>
            <button 
              onClick={() => setModalData(null)}
              style={{ padding: '1rem 2rem', background: modalData.type === 'success' ? '#16a34a' : '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Paso2_PublicoObjetivo;

