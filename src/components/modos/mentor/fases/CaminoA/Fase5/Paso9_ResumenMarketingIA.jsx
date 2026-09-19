import React, { useState, useEffect } from 'react';
import { Bot, Save, Sparkles, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { generarResumenMarketingIA } from '../../../../../../services/api';

const Paso9_ResumenMarketingIA = ({ setAyudanteText, onComplete, globalData, updateGlobalData, guardando }) => {
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const resumenIAData = globalData.resumen_ia || null;

  useEffect(() => {
    if (!resumenIAData) {
      setAyudanteText("¡Excelente! Has completado todos los pasos de Marketing. Ahora, permite que mi Inteligencia Artificial analice tu estrategia y redacte un resumen ejecutivo que te servirá para tu Plan Final.");
    } else {
      setAyudanteText("Aquí está el resumen estratégico generado. Revisa que todo tenga sentido y haz clic en Finalizar para completar la Fase 5.");
    }
  }, [resumenIAData, setAyudanteText]);

  const handleRegenerar = () => {
    if (resumenIAData) {
      setShowConfirm(true);
    } else {
      generarConIA();
    }
  };

  const generarConIA = async () => {
    // Validar mínimamente que haya datos
    if (!globalData.ventajaFrase && (!globalData.competencia || globalData.competencia.length === 0)) {
      setError("No hay suficientes datos en esta fase para analizar. Completa los pasos anteriores.");
      return;
    }
    
    setShowConfirm(false);
    setGenerando(true);
    setError('');
    
    try {
      const resumen = await generarResumenMarketingIA(globalData);
      // Guardar el resumen en globalData
      updateGlobalData({ resumen_ia: resumen });
    } catch (err) {
      console.error(err);
      setError("Hubo un error al generar el resumen con IA. Por favor, inténtalo de nuevo.");
    } finally {
      setGenerando(false);
    }
  };

  const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  };

  const titleStyle = {
    color: '#ca8a04',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <div className="animate-fade-in p-2 md:p-6" style={{ color: '#0f172a', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: '#1e293b', fontWeight: '800' }}>
        <Sparkles color="#eab308" /> Resumen Estratégico con IA
      </h2>

      {!resumenIAData && !generando && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#fefce8', borderRadius: '1rem', border: '1px dashed #fde047' }}>
          <Bot size={64} color="#eab308" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#854d0e' }}>Sintetiza tu Estrategia de Marketing</h3>
          <p style={{ color: '#713f12', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            La Inteligencia Artificial cruzará los datos de tu <strong>Competencia, Ventaja, PESTEL y Promoción</strong> para redactar el resumen de tu Plan de Marketing. Este texto irá directo al documento final.
          </p>
          <button 
            onClick={generarConIA}
            style={{ padding: '1rem 2rem', background: '#eab308', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', boxShadow: '0 4px 6px -1px rgba(234, 179, 8, 0.3)' }}
          >
            <Sparkles size={20} /> Generar Resumen Ejecutivo
          </button>
          
          {error && (
            <div style={{ marginTop: '1.5rem', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}
        </div>
      )}

      {generando && (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div className="loader" style={{ width: '48px', height: '48px', border: '4px solid #fef08a', borderBottomColor: '#eab308', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
          <h3 style={{ color: '#ca8a04', fontSize: '1.25rem', fontWeight: 'bold' }}>Analizando y redactando...</h3>
          <p style={{ color: '#713f12' }}>La IA está estructurando tu estrategia competitiva.</p>
        </div>
      )}

      {resumenIAData && !generando && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          
          <div style={cardStyle}>
            <div style={titleStyle}>⚔️ Análisis de Competencia</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-line' }}>{resumenIAData.resumen_competencia}</p>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>🚀 Ventaja Competitiva</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-line' }}>{resumenIAData.resumen_ventaja}</p>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>🌍 Factores del Entorno (PESTEL)</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-line' }}>{resumenIAData.resumen_entorno}</p>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>📣 Estrategia de Promoción</div>
            <p style={{ color: '#475569', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-line' }}>{resumenIAData.resumen_promocion}</p>
          </div>

          <div style={{ ...cardStyle, gridColumn: '1 / -1', background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)', borderColor: '#fde047' }}>
            <div style={{ ...titleStyle, color: '#854d0e', fontSize: '1.25rem' }}><CheckCircle size={24} /> Recomendación Estratégica</div>
            <p style={{ color: '#713f12', margin: 0, lineHeight: '1.6', fontSize: '1.1rem', fontWeight: '500' }}>{resumenIAData.recomendacion_estrategica}</p>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button 
              onClick={handleRegenerar}
              style={{ padding: '1rem 2rem', background: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={20} /> Volver a generar
            </button>
            <button 
              onClick={onComplete}
              disabled={guardando}
              style={{ padding: '1rem 3rem', background: '#eab308', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: guardando ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(234, 179, 8, 0.3)' }}
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
              Si vuelves a generar con IA, los datos anteriores del resumen se perderán y la IA creará uno completamente nuevo basado en la versión actual de tus respuestas.
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

export default Paso9_ResumenMarketingIA;
