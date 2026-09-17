import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SplashScreenMentor from '../components/ui/SplashScreenMentor';
import SidebarFases from '../components/ui/SidebarFases';
import { Bot, Video, FileText, Database, Code, CheckCircle, PieChart, Sparkles } from 'lucide-react';
import { NexusContext } from '../context/NexusContext';

import Paso1_ValidacionVideo from '../components/modos/mentor/fases/CaminoA/Fase2/Paso1_ValidacionVideo';
import Paso2_PresentacionEncuesta from '../components/modos/mentor/fases/CaminoA/Fase2/Paso2_PresentacionEncuesta';
import Paso3_VideoMatriz from '../components/modos/mentor/fases/CaminoA/Fase2/Paso3_VideoMatriz';
import Paso4_Codificacion from '../components/modos/mentor/fases/CaminoA/Fase2/Paso4_Codificacion';
import Paso5_ExplicacionLlenado from '../components/modos/mentor/fases/CaminoA/Fase2/Paso5_ExplicacionLlenado';
import Paso6_Resultados from '../components/modos/mentor/fases/CaminoA/Fase2/Paso6_Resultados';
import Paso7_ResumenIA from '../components/modos/mentor/fases/CaminoA/Fase2/Paso7_ResumenIA';

import { useFase2ValidacionController } from '../controllers/useFase2ValidacionController';

const Fase2_ValidacionIdea = () => {
  const { 
    cargando, step, guardando, irAPaso,
    showSplash, setShowSplash,
    ayudanteText, setAyudanteText,
    encuestasData, setEncuestasData,
    resumenIAData, setResumenIAData,
    handleFinalizar,
    setPendingSave,
    showCompletionModal, setShowCompletionModal
  } = useFase2ValidacionController();

  const navigate = useNavigate();

  if (cargando) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const getOrionDialog = () => ayudanteText || "Procedamos con el protocolo de validación.";

  const tabs = [
    { id: 1, icon: <Video size={18} />, label: 'Validar' },
    { id: 2, icon: <FileText size={18} />, label: 'Encuesta' },
    { id: 3, icon: <Database size={18} />, label: 'Matriz' },
    { id: 4, icon: <Code size={18} />, label: 'Códigos' },
    { id: 5, icon: <CheckCircle size={18} />, label: 'Tabular' },
    { id: 6, icon: <PieChart size={18} />, label: 'Resultados' },
    { id: 7, icon: <Sparkles size={18} />, label: 'Resumen IA' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <SidebarFases />

      <div style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
        <div style={{ maxWidth: step >= 5 ? '1400px' : '800px', margin: '0 auto', paddingBottom: '4rem', transition: 'max-width 0.3s ease-in-out' }}>
          
          {/* Mentor Avatar Section */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '3rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(250, 204, 21, 0.4)' }}>
              <Bot size={40} color="#854d0e" />
            </div>
            <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '1rem', borderTopLeftRadius: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#ca8a04', fontSize: '1.1rem', fontWeight: 700 }}>El Mentor</h3>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6, color: '#334155' }}>{getOrionDialog()}</p>
            </div>
          </div>

          {/* Progress Bar & Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', background: 'white', padding: '0.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => irAPaso(t.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: step === t.id ? '#3b82f6' : 'transparent', color: step === t.id ? 'white' : '#64748b', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
              {t.icon} <span style={{ display: step === t.id ? 'inline' : 'none' }}>{t.label}</span>
            </button>
          ))}
        </div>

          {/* Pasos */}
          <div onBlur={() => setPendingSave(true)} style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Paso1_ValidacionVideo setAyudanteText={setAyudanteText} onComplete={() => irAPaso(2)} onSkip={() => irAPaso(5)} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Paso2_PresentacionEncuesta setAyudanteText={setAyudanteText} onComplete={() => irAPaso(3)} />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Paso3_VideoMatriz setAyudanteText={setAyudanteText} onComplete={() => irAPaso(4)} />
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Paso4_Codificacion setAyudanteText={setAyudanteText} onComplete={() => irAPaso(5)} />
                </motion.div>
              )}
              {step === 5 && (
                <motion.div key="5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Paso5_ExplicacionLlenado setAyudanteText={setAyudanteText} initialData={encuestasData} onComplete={async (datos) => {
                    setEncuestasData(datos);
                    irAPaso(6);
                  }} />
                </motion.div>
              )}
              {step === 6 && (
                <motion.div key="6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Paso6_Resultados setAyudanteText={setAyudanteText} encuestasData={encuestasData} onComplete={() => irAPaso(7)} />
                </motion.div>
              )}
              {step === 7 && (
                <motion.div key="7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Paso7_ResumenIA 
                    setAyudanteText={setAyudanteText} 
                    encuestasData={encuestasData} 
                    resumenIAData={resumenIAData} 
                    setResumenIAData={setResumenIAData} 
                    onComplete={handleFinalizar} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal de Fase Completada */}
      {showCompletionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%' }}>
                <CheckCircle size={48} color="#16a34a" />
              </div>
            </div>
            <h2 style={{ color: '#16a34a', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>¡Fase 2 Completada!</h2>
            <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '1.1rem' }}>Has terminado la validación. Prepárate para la Fase 3.</p>
            <button 
              onClick={() => {
                setShowCompletionModal(false);
                navigate('/fase/3/intro');
              }}
              style={{ padding: '1rem 2rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              Continuar a Fase 3
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Fase2_ValidacionIdea;
