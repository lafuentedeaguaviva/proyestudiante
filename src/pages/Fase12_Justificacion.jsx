import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../components/ui/SplashScreen';
import DetectiveLayout from '../layouts/DetectiveLayout';
import SubMenuFases from '../components/ui/SubMenuFases';
import { guardarContenidoFase, obtenerContenidoFaseCompleto } from '../services/api';
import { FileText, CheckCircle2, MessageSquare, Layers } from 'lucide-react';
import { NexusContext } from '../context/NexusContext';

const Fase12_Justificacion = () => {
  const navigate = useNavigate();
  const { increaseNexus } = React.useContext(NexusContext) || { increaseNexus: () => {} };
  
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const [errorStr, setErrorStr] = useState(null);
  const [pendingSave, setPendingSave] = useState(false);
  
  const [data, setData] = useState({
    justEconomica: '',
    justSocial: '',
    justPersonal: '',
    parrafoFinal: '',
    paso_actual: 1
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const guardado = await obtenerContenidoFaseCompleto(12);
        if (guardado && guardado.justificacion) {
          setData(prev => ({ ...prev, ...guardado.justificacion }));
          if (guardado.justificacion.paso_actual) {
            setStep(parseInt(guardado.justificacion.paso_actual, 10) || 1);
          } else {
            await guardarContenidoFase(12, 'paso_actual', 1).catch(e => console.error(e));
          }
        }
      } catch (error) {
        console.error("Error al cargar Fase 11:", error);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!pendingSave) return;
    const saveTimer = setTimeout(async () => {
      try {
        setGuardando(true);
        await guardarContenidoFase(12, 'justificacion', data);
        setErrorStr(null);
      } catch (error) {
        setErrorStr(error.message);
      } finally {
        setGuardando(false);
        setPendingSave(false);
      }
    }, 500);
    return () => clearTimeout(saveTimer);
  }, [data, pendingSave]);

  const handleUpdate = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    setPendingSave(true);
  };

  const handleStepChange = (newStep) => {
    setStep(newStep);
    handleUpdate('paso_actual', newStep);
  };

  const getOrionDialog = () => {
    switch (step) {
      case 1: return "Fase 11: Justificación. Respóndete a ti mismo y al mundo: ¿Por qué existe tu empresa económica, social y personalmente?";
      case 2: return "Redacción Final. Junta todo lo que escribiste en un solo párrafo poderoso y formal que puedas presentar a inversionistas.";
      case 3: return "¡Justificación completada! Tienes un propósito claro.";
      default: return "";
    }
  };

  useEffect(() => {
    if (step === 2 && data.parrafoFinal === '') {
      // Auto-generar un borrador para ayudar al usuario
      const borrador = `El presente proyecto se justifica económicamente porque ${data.justEconomica.toLowerCase()}. A nivel social, busca ${data.justSocial.toLowerCase()}. Finalmente, desde una perspectiva personal, el equipo emprendedor se motiva por ${data.justPersonal.toLowerCase()}.`;
      setData(prev => ({ ...prev, parrafoFinal: borrador }));
    }
  }, [step]);

  const handleFinalizarFase = async () => {
    setGuardando(true);
    setErrorStr(null);
    try {
      await guardarContenidoFase(12, 'justificacion', data);
      await guardarContenidoFase(12, 'paso_actual', 1).catch(e => console.error(e));
      navigate('/fase/13'); // Siguiente fase (Objetivos)
    } catch (err) {
      setErrorStr(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (showSplash) {
    return (
      <SplashScreen 
        faseNumero="12"
        titulo="La Justificación"
        descripcion="Consolida el propósito de tu proyecto y redáctalo de forma profesional."
        avatarSrc="/avatar_orion.png"
        onComenzar={() => setShowSplash(false)}
      />
    );
  }

  const sectionClass = "animate-fade-in p-8 bg-white rounded-3xl shadow-xl border-2 border-slate-100 mb-8";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2";
  const inputClass = "w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none mb-6";

  return (
    <DetectiveLayout faseTitle="Fase 11: Justificación" orionText={getOrionDialog()}>
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>

      <SubMenuFases 
        tabs={[
          { id: 1, icon: <Layers size={18} />, label: 'Dimensiones' },
          { id: 2, icon: <FileText size={18} />, label: 'Párrafo Final' },
          { id: 3, icon: <CheckCircle2 size={18} />, label: 'Resumen' }
        ]}
        currentStep={step}
        onTabClick={(id) => handleStepChange(id)}
        color="#ec4899"
      />
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          
          {/* PASO 1: DIMENSIONES */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <MessageSquare size={40} color="#ec4899" />
                <div>
                  <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: 0 }}>Las Tres Dimensiones</h2>
                </div>
              </div>

              <div className={sectionClass}>
                <label className={labelClass}>Justificación Económica (¿Generará dinero o empleos?)</label>
                <textarea 
                  value={data.justEconomica} onChange={e => handleUpdate('justEconomica', e.target.value)} 
                  className={inputClass} style={{ minHeight: '100px' }} 
                />
                
                <label className={labelClass}>Justificación Social (¿Cómo ayuda a la comunidad o al ambiente?)</label>
                <textarea 
                  value={data.justSocial} onChange={e => handleUpdate('justSocial', e.target.value)} 
                  className={inputClass} style={{ minHeight: '100px' }} 
                />

                <label className={labelClass}>Justificación Personal (¿Por qué TÚ quieres hacer esto?)</label>
                <textarea 
                  value={data.justPersonal} onChange={e => handleUpdate('justPersonal', e.target.value)} 
                  className={inputClass} style={{ minHeight: '100px' }} 
                />
              </div>
            </motion.div>
          )}

          {/* PASO 2: PÃRRAFO FINAL */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <FileText size={40} color="#8b5cf6" />
                <div>
                  <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: 0 }}>El Párrafo Formal</h2>
                </div>
              </div>

              <div className={sectionClass}>
                <p className="text-slate-500 mb-6 leading-relaxed font-medium">
                  He generado un borrador usando tus respuestas anteriores. Ahora, <strong className="text-purple-600">edítalo, límpialo y dale un tono profesional</strong>. Este es el texto que leerán tus inversores o jurados.
                </p>
                <textarea 
                  value={data.parrafoFinal} onChange={e => handleUpdate('parrafoFinal', e.target.value)} 
                  className={inputClass} style={{ minHeight: '250px', fontSize: '1.1rem' }} 
                />
              </div>
            </motion.div>
          )}

          {/* PASO 3: RESUMEN */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <CheckCircle2 size={60} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
              <h2 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '1rem' }}>Fase 10 Completada</h2>
              <p style={{ color: '#475569', marginBottom: '2rem' }}>El porqué de tu empresa está justificado profesionalmente.</p>

              {errorStr && (
                <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                  Error al guardar: {errorStr}
                </div>
              )}

              <button 
                className="btn-primary" onClick={handleFinalizarFase} disabled={guardando}
                style={{ width: '100%', maxWidth: '300px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                <CheckCircle2 /> {guardando ? 'Guardando...' : 'Ir a Objetivos (Fase 11)'}
              </button>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Controles */}
        {step < 3 && (
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => handleStepChange(step - 1)} className="px-6 py-3 bg-white text-slate-500 font-bold border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-colors">Anterior</button>
            ) : <div></div>}
            
            <button 
              onClick={() => {
                if (step === 1 && (data.justEconomica.length < 10 || data.justSocial.length < 10 || data.justPersonal.length < 10)) {
                  increaseNexus(15, "Debes llenar las 3 dimensiones con fundamentos, no con evasivas."); return;
                }
                if (step === 2 && data.parrafoFinal.length < 50) {
                  increaseNexus(20, "Este párrafo formal es demasiado corto o lo borraste. Escríbelo bien."); return;
                }
                handleStepChange(step + 1);
              }} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-lg px-8 py-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Siguiente Paso
            </button>
          </div>
        )}
      </div>
    
      </div>
</DetectiveLayout>
  );
};

export default Fase12_Justificacion;

