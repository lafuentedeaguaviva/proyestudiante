import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SidebarFases from '../components/ui/SidebarFases';
import SplashScreenMentor from '../components/ui/SplashScreenMentor';
import { Bot, Save, ArrowLeft, ArrowRight, Video, FileText, CheckCircle, Package, Users, BarChart } from 'lucide-react';
import SubMenuFases from '../components/ui/SubMenuFases';

import { useFase4Controller } from '../controllers/useFase4Controller';

import Paso3_VideoProductoServicio from '../components/modos/mentor/fases/CaminoA/Fase4/Paso3_VideoProductoServicio';
import Paso4_DisenoProducto from '../components/modos/mentor/fases/CaminoA/Fase4/Paso4_DisenoProducto';
import Paso5_VideoCaracteristicas from '../components/modos/mentor/fases/CaminoA/Fase4/Paso5_VideoCaracteristicas';
import Paso6_Caracteristicas from '../components/modos/mentor/fases/CaminoA/Fase4/Paso6_Caracteristicas';
import Paso8_VideoEmpaque from '../components/modos/mentor/fases/CaminoA/Fase4/Paso8_VideoEmpaque';
import Paso9_EmpaqueProducto from '../components/modos/mentor/fases/CaminoA/Fase4/Paso9_EmpaqueProducto';
import Paso10_PresentacionServicio from '../components/modos/mentor/fases/CaminoA/Fase4/Paso10_PresentacionServicio';
import Paso11_VideoDemandaPotencial from '../components/modos/mentor/fases/CaminoA/Fase4/Paso11_VideoDemandaPotencial';
import Paso12_DemandaPotencial from '../components/modos/mentor/fases/CaminoA/Fase4/Paso12_DemandaPotencial';
import Paso13_ResumenProductoIA from '../components/modos/mentor/fases/CaminoA/Fase4/Paso13_ResumenProductoIA';


const Fase4_DisenoProductoPage = () => {
  const { 
    cargando, step, irAPaso,
    showSplash, setShowSplash,
    showSuccess, setShowSuccess, navigate,
    globalData, setGlobalData,
    ayudanteText, setAyudanteText,
    handleFinalizar, guardando , setPendingSave } = useFase4Controller();

  if (cargando) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const updateGlobalData = (newData) => {
    setGlobalData(newData);
    if (typeof setPendingSave === 'function') setPendingSave(true);
  };

  const handleNext = () => {
    let nextStep = step + 1;
    if (globalData.tipoNegocio === 'Servicio' && step === 5) {
      nextStep = 7;
    }
    if (globalData.tipoNegocio === 'Producto' && step === 6) {
      nextStep = 8;
    }
    irAPaso(Math.min(nextStep, 10));
  };

  const handlePrev = () => {
    let prevStep = step - 1;
    if (globalData.tipoNegocio === 'Servicio' && step === 7) {
      prevStep = 5;
    }
    if (globalData.tipoNegocio === 'Producto' && step === 8) {
      prevStep = 6;
    }
    irAPaso(Math.max(prevStep, 1));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <SidebarFases />

      <div style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
          
          {/* Mentor Avatar Section */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '3rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(250, 204, 21, 0.4)', flexShrink: 0 }}>
              <Bot size={40} color="#854d0e" />
            </div>
            <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '1rem', borderTopLeftRadius: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#ca8a04', fontSize: '1.1rem', fontWeight: 700 }}>El Mentor</h3>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6, color: '#334155' }}>{ayudanteText}</p>
            </div>
          </div>

          <SubMenuFases 
            tabs={[
              { id: 1, icon: <Video size={18} />, label: 'Video Prod/Serv' },
              { id: 2, icon: <FileText size={18} />, label: 'Concepto' },
              { id: 3, icon: <Video size={18} />, label: 'Video Atributos' },
              { id: 4, icon: <CheckCircle size={18} />, label: 'Características' },
              { id: 5, icon: <Video size={18} />, label: 'Video Empaque' },
              { id: 6, icon: <Package size={18} />, label: 'Empaque' },
              { id: 7, icon: <Package size={18} />, label: 'Presentación' },
              { id: 8, icon: <Video size={18} />, label: 'Video Demanda' },
              { id: 9, icon: <Users size={18} />, label: 'Demanda Potencial' },
              { id: 10, icon: <Bot size={18} />, label: 'Resumen IA' }
            ].filter(t => {
              if (globalData.tipoNegocio === 'Servicio' && (t.id === 5 || t.id === 6)) return false;
              if (globalData.tipoNegocio === 'Producto' && t.id === 7) return false;
              return true;
            })}
            currentStep={step}
            onTabClick={async (id) => {
              irAPaso(id);
            }}
            color="#3b82f6"
          />

          {/* Progress Indicator */}
          <div style={{ marginBottom: '2rem', textAlign: 'center', color: '#64748b', fontWeight: 'bold' }}>
            Paso {step} de 10
          </div>

          {/* Renderizador de Pasos */}
          <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            {!cargando ? (
              <AnimatePresence mode="wait">
                {step === 1 && <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso3_VideoProductoServicio setAyudanteText={setAyudanteText} onComplete={handleNext} /></motion.div>}
                {step === 2 && <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso4_DisenoProducto setAyudanteText={setAyudanteText} onComplete={handleNext} globalData={globalData} updateGlobalData={updateGlobalData} /></motion.div>}
                {step === 3 && <motion.div key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso5_VideoCaracteristicas setAyudanteText={setAyudanteText} onComplete={handleNext} /></motion.div>}
                {step === 4 && <motion.div key="4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso6_Caracteristicas setAyudanteText={setAyudanteText} onComplete={handleNext} globalData={globalData} updateGlobalData={updateGlobalData} /></motion.div>}
                {step === 5 && <motion.div key="5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso8_VideoEmpaque setAyudanteText={setAyudanteText} onComplete={handleNext} /></motion.div>}
                {step === 6 && <motion.div key="6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso9_EmpaqueProducto setAyudanteText={setAyudanteText} onComplete={handleNext} globalData={globalData} updateGlobalData={updateGlobalData} /></motion.div>}
                {step === 7 && <motion.div key="7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso10_PresentacionServicio setAyudanteText={setAyudanteText} onComplete={handleNext} globalData={globalData} updateGlobalData={updateGlobalData} /></motion.div>}
                {step === 8 && <motion.div key="8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso11_VideoDemandaPotencial setAyudanteText={setAyudanteText} onComplete={handleNext} /></motion.div>}
                {step === 9 && <motion.div key="9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso12_DemandaPotencial setAyudanteText={setAyudanteText} onComplete={handleNext} globalData={globalData} updateGlobalData={updateGlobalData} guardando={guardando} /></motion.div>}
                {step === 10 && <motion.div key="10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso13_ResumenProductoIA setAyudanteText={setAyudanteText} onComplete={handleFinalizar} globalData={globalData} updateGlobalData={updateGlobalData} guardando={guardando} /></motion.div>}
              </AnimatePresence>
            ) : (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#0f172a' }}>Cargando datos...</div>
            )}
          </div>
          
          {/* Navegación Inferior */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button 
              onClick={handlePrev}
              disabled={step === 1 || cargando}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: step > 1 ? 'white' : '#e2e8f0', color: step > 1 ? '#334155' : '#94a3b8', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: step > 1 ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
            >
              <ArrowLeft size={18} /> Anterior
            </button>

            {step < 10 && (
              <button 
                onClick={handleNext}
                disabled={cargando}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Siguiente <ArrowRight size={18} />
              </button>
            )}
          </div>

          {/* Modal Personalizado de Éxito */}
          {showSuccess && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ background: '#dcfce7', padding: '1.25rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1.5rem' }}>
                  <CheckCircle size={48} color="#16a34a" />
                </div>
                <h2 style={{ color: '#16a34a', margin: '0 0 1rem 0', fontSize: '1.75rem', fontWeight: '800' }}>¡Fase 4 Completada!</h2>
                <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>Has diseñado con éxito tu producto o servicio. Prepárate para entrar a la Fase 5.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button 
                    onClick={() => {
                      setShowSuccess(false);
                      navigate('/fase/5/intro');
                    }}
                    style={{ padding: '1rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}
                  >
                    Continuar a Fase 5
                  </button>
                  <button 
                    onClick={() => {
                      setShowSuccess(false);
                      navigate('/dashboard');
                    }}
                    style={{ padding: '0.75rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '1rem' }}
                  >
                    Volver al Mapa
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Fase4_DisenoProductoPage;
