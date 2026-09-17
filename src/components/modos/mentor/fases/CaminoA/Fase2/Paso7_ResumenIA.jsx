import React, { useState, useEffect } from 'react';
import { Bot, Save, Sparkles, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { generarResumenEncuestasIA } from '../../../../../../services/api';

const Paso7_ResumenIA = ({ setAyudanteText, onComplete, encuestasData = [], resumenIAData, setResumenIAData }) => {
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!resumenIAData) {
      setAyudanteText("¡Genial! Hemos analizado las encuestas. Ahora, déjame usar Inteligencia Artificial para extraer las conclusiones clave que usaremos más adelante en el modelo de negocios y plan financiero.");
    } else {
      setAyudanteText("Aquí está el resumen generado. Revisa que todo tenga sentido y luego guarda los resultados finales de la Fase 2.");
    }
  }, [resumenIAData]);

  const handleRegenerar = () => {
    if (resumenIAData) {
      setShowConfirm(true);
    } else {
      generarConIA();
    }
  };

  const generarConIA = async () => {
    if (encuestasData.length === 0) {
      setError("No hay datos de encuestas para analizar. Por favor, asegúrate de llenar algunas encuestas primero.");
      return;
    }
    setShowConfirm(false);
    setGenerando(true);
    setError('');
    try {
      const resumen = await generarResumenEncuestasIA(encuestasData);
      setResumenIAData(resumen);
    } catch (err) {
      console.error(err);
      setError("Hubo un error al generar el resumen con IA. Por favor, inténtalo de nuevo.");
    } finally {
      setGenerando(false);
    }
  };

  const handleSave = () => {
    setGuardando(true);
    setTimeout(() => {
      setGuardando(false);
      onComplete();
    }, 1500);
  };

  const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  };

  const titleStyle = {
    color: '#3b82f6',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
        <Sparkles color="#3b82f6" /> Análisis Estructural con IA
      </h2>

      {!resumenIAData && !generando && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '1rem', border: '1px dashed #93c5fd' }}>
          <Bot size={64} color="#3b82f6" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sintetiza tus Resultados</h3>
          <p style={{ color: '#475569', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            La Inteligencia Artificial analizará las <strong>{encuestasData.length} respuestas</strong> para redactar tu perfil de cliente, sugerencias de precio, canales de venta y dolores principales. Estos datos se guardarán y se autocompletarán en las siguientes fases.
          </p>
          <button 
            onClick={generarConIA}
            style={{ padding: '1rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}
          >
            <Sparkles size={20} /> Generar Perfil Completo
          </button>
          
          {error && (
            <div style={{ marginTop: '1.5rem', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}
        </div>
      )}

      {generando && (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div className="loader" style={{ width: '48px', height: '48px', border: '4px solid #bfdbfe', borderBottomColor: '#3b82f6', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
          <h3 style={{ color: '#3b82f6' }}>Analizando y redactando...</h3>
          <p style={{ color: '#64748b' }}>La IA está extrayendo los patrones clave de tus encuestas.</p>
        </div>
      )}

      {resumenIAData && !generando && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          
          <div style={cardStyle}>
            <div style={titleStyle}>👥 Perfil Demográfico</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>{resumenIAData.demografia}</p>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>🎯 Público Objetivo (Buyer Persona)</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>{resumenIAData.buyer_persona}</p>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>⚡ Público Objetivo (Resumido)</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6', fontWeight: 'bold', fontSize: '1.1rem' }}>{resumenIAData.publico_objetivo_resumido}</p>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>💰 Precio Sugerido</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>{resumenIAData.precio_sugerido}</p>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>🛒 Hábitos de Consumo</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>{resumenIAData.frecuencia}</p>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>🎓 Nivel de Educación</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>{resumenIAData.educacion}</p>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>⚠️ Dolores Principales</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>{resumenIAData.dolores}</p>
          </div>
          
          <div style={cardStyle}>
            <div style={titleStyle}>📱 Canales de Preferencia</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>{resumenIAData.canales}</p>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>✅ Decisión de Compra</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>{resumenIAData.decision}</p>
          </div>

          <div style={{ ...cardStyle, gridColumn: '1 / -1', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderColor: '#bfdbfe' }}>
            <div style={{ ...titleStyle, color: '#1e40af', fontSize: '1.25rem' }}><CheckCircle size={24} /> Conclusión de Viabilidad</div>
            <p style={{ color: '#1e3a8a', margin: 0, lineHeight: '1.6', fontSize: '1.1rem' }}>{resumenIAData.conclusion}</p>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button 
              onClick={handleRegenerar}
              style={{ padding: '1rem 2rem', background: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={20} /> Regenerar
            </button>
            <button 
              onClick={handleSave}
              disabled={guardando}
              style={{ padding: '1rem 3rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: guardando ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {guardando ? <span className="loader" style={{ width: '20px', height: '20px', border: '2px solid white', borderBottomColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span> : <Save size={20} />}
              {guardando ? 'Guardando...' : 'Finalizar y Guardar'}
            </button>
          </div>

        </motion.div>
      )}
      
      {/* Modal de Confirmación */}
      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <AlertCircle size={32} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a' }}>¿Estás seguro?</h3>
            <p style={{ color: '#475569', marginBottom: '2rem', lineHeight: '1.5' }}>
              Si vuelves a generar con IA, los datos anteriores del resumen se perderán y la IA creará uno completamente nuevo.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowConfirm(false)}
                style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                onClick={generarConIA}
                style={{ padding: '0.75rem 1.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Sí, Regenerar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Paso7_ResumenIA;
