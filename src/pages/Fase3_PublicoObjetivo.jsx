import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SidebarFases from '../components/ui/SidebarFases';
import SubMenuFases from '../components/ui/SubMenuFases';
import { Bot, ArrowLeft, ArrowRight, Video, Users } from 'lucide-react';

import { useFase3Controller } from '../controllers/useFase3Controller';

import Paso1_VideoPublico from '../components/modos/mentor/fases/CaminoA/Fase3/Paso1_VideoPublico';
import Paso2_PublicoObjetivo from '../components/modos/mentor/fases/CaminoA/Fase3/Paso2_PublicoObjetivo';

const Fase3_PublicoObjetivo = () => {
  const { 
    cargando, step, irAPaso,
    globalData, setGlobalData,
    ayudanteText, setAyudanteText,
    handleFinalizar, guardando
  , setPendingSave } = useFase3Controller();

  if (cargando) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const updateGlobalData = (newData) => {
    setGlobalData(newData);
    if (typeof setPendingSave === 'function') setPendingSave(true);
  };

  const handleNext = () => {
    if (step < 2) {
      irAPaso(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      irAPaso(step - 1);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <SidebarFases />

      <div style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
          
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(250, 204, 21, 0.4)', flexShrink: 0 }}>
                  <Bot size={40} color="#854d0e" />
                </div>
                <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '1rem', borderTopLeftRadius: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#ca8a04', fontSize: '1.1rem', fontWeight: 700 }}>El Mentor</h3>
                  <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6, color: '#334155' }}>{ayudanteText}</p>
                </div>
              </div>

              {/* Progress Bar & Tabs */}
              <SubMenuFases 
                tabs={[
                  { id: 1, icon: <Video size={18} />, label: 'Video' },
                  { id: 2, icon: <Users size={18} />, label: 'Público Objetivo' }
                ]}
                currentStep={step}
                onTabClick={async (id) => {
                  irAPaso(id);
                }}
                color="#3b82f6"
              />

              <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                {!cargando ? (
                  <AnimatePresence mode="wait">
                    {step === 1 && <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso1_VideoPublico setAyudanteText={setAyudanteText} onComplete={handleNext} /></motion.div>}
                    {step === 2 && <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Paso2_PublicoObjetivo setAyudanteText={setAyudanteText} onComplete={handleFinalizar} globalData={globalData} updateGlobalData={updateGlobalData} /></motion.div>}
                  </AnimatePresence>
                ) : (
                  <div style={{ padding: '4rem', textAlign: 'center', color: '#0f172a' }}>Cargando datos...</div>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button 
                  onClick={handlePrev}
                  disabled={step === 1 || cargando}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: step > 1 ? 'white' : '#e2e8f0', color: step > 1 ? '#334155' : '#94a3b8', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: step > 1 ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
                >
                  <ArrowLeft size={18} /> Anterior
                </button>

                {step < 2 ? (
                  <button 
                    onClick={handleNext}
                    disabled={cargando}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}
                  >
                    Siguiente <ArrowRight size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={handleFinalizar}
                    disabled={guardando || cargando}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)' }}
                  >
                    {guardando ? 'Guardando...' : 'Finalizar Fase'} <ArrowRight size={18} />
                  </button>
                )}
              </div>
        </div>
      </div>
    </div>
  );
};

export default Fase3_PublicoObjetivo;
