import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../components/ui/SplashScreen';
import DetectiveLayout from '../layouts/DetectiveLayout';
import SubMenuFases from '../components/ui/SubMenuFases';
import { guardarContenidoFase, obtenerContenidoFaseCompleto } from '../services/api';
import { Target, Compass, CheckCircle2 } from 'lucide-react';
import { NexusContext } from '../context/NexusContext';

const Fase13_MisionVision = () => {
  const navigate = useNavigate();
  const { increaseNexus } = React.useContext(NexusContext) || { increaseNexus: () => {} };
  
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const [errorStr, setErrorStr] = useState(null);
  const [pendingSave, setPendingSave] = useState(false);
  
  const [data, setData] = useState({
    objGeneral: '',
    objEspec1: '',
    objEspec2: '',
    objEspec3: '',
    mision: '',
    vision: '',
    paso_actual: 1
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const guardado = await obtenerContenidoFaseCompleto(13);
        if (guardado && guardado.mision_vision) {
          setData(prev => ({ ...prev, ...guardado.mision_vision }));
          if (guardado.mision_vision.paso_actual) {
            setStep(parseInt(guardado.mision_vision.paso_actual, 10) || 1);
          } else {
            await guardarContenidoFase(13, 'paso_actual', 1).catch(e => console.error(e));
          }
        }
      } catch (error) {
        console.error("Error al cargar Fase 12:", error);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!pendingSave) return;
    const saveTimer = setTimeout(async () => {
      try {
        setGuardando(true);
        await guardarContenidoFase(13, 'mision_vision', data);
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
      case 1: return "Fase 10: El Norte de la Agencia. Define tu Objetivo General (el gran logro) y 3 Objetivos Específicos (los escalones para llegar ahí).";
      case 2: return "Misión y Visión. Misión es lo que haces hoy, todos los días. Visión es en qué te vas a convertir en 5 años.";
      case 3: return "¡ADN Corporativo establecido! Todo el equipo sabe hacia dónde remar.";
      default: return "";
    }
  };

  const handleFinalizarFase = async () => {
    setGuardando(true);
    setErrorStr(null);
    try {
      await guardarContenidoFase(13, 'mision_vision', data);
      await guardarContenidoFase(14, 'paso_actual', 1).catch(e => console.error(e));
      navigate('/fase/14/intro'); // Siguiente fase (Pitch)
    } catch (err) {
      setErrorStr(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (showSplash) {
    return (
      <SplashScreen 
        faseNumero="11"
        titulo="Objetivos, Misión y Visión"
        descripcion="Establece el ADN de tu negocio. Si no sabes a dónde vas, cualquier camino te sirve... y NEXUS odia a los que divagan."
        avatarSrc="/avatar_orion.png"
        onComenzar={() => setShowSplash(false)}
      />
    );
  }

  const sectionClass = "animate-fade-in p-8 bg-white rounded-3xl shadow-xl border-2 border-slate-100 mb-8";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2";
  const inputClass = "w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none mb-6";

  return (
    <DetectiveLayout faseTitle="Fase 10: Objetivos y Misión" orionText={getOrionDialog()}>
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>

      <SubMenuFases 
        tabs={[
          { id: 1, icon: <Target size={18} />, label: 'Objetivos' },
          { id: 2, icon: <Compass size={18} />, label: 'Misión y Visión' },
          { id: 3, icon: <CheckCircle2 size={18} />, label: 'Resumen' }
        ]}
        currentStep={step}
        onTabClick={(id) => handleStepChange(id)}
        color="#f43f5e"
      />
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          
          {/* PASO 1: OBJETIVOS */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Target size={40} color="#f43f5e" />
                <div>
                  <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: 0 }}>Blancos y Objetivos</h2>
                </div>
              </div>

              <div className={sectionClass}>
                <label className={labelClass}>Objetivo General (Debe empezar con un verbo, ej: "Convertir", "Desarrollar")</label>
                <textarea 
                  value={data.objGeneral} onChange={e => handleUpdate('objGeneral', e.target.value)} 
                  className={inputClass} style={{ minHeight: '100px' }} 
                />
                
                <h3 className="text-xl font-bold text-rose-500 mt-6 mb-4">Objetivos Específicos</h3>
                <label className={labelClass}>Específico 1</label>
                <input value={data.objEspec1} onChange={e => handleUpdate('objEspec1', e.target.value)} className={inputClass} />
                <label className={labelClass}>Específico 2</label>
                <input value={data.objEspec2} onChange={e => handleUpdate('objEspec2', e.target.value)} className={inputClass} />
                <label className={labelClass}>Específico 3</label>
                <input value={data.objEspec3} onChange={e => handleUpdate('objEspec3', e.target.value)} className={inputClass} />
              </div>
            </motion.div>
          )}

          {/* PASO 2: MISIÓN Y VISIÓN */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Compass size={40} color="#0ea5e9" />
                <div>
                  <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: 0 }}>Misión y Visión</h2>
                </div>
              </div>

              <div className={sectionClass}>
                <label className={labelClass}>Misión (¿Qué haces HOY para tus clientes?)</label>
                <textarea 
                  value={data.mision} onChange={e => handleUpdate('mision', e.target.value)} 
                  placeholder="Ej: Proveer soluciones rápidas y de calidad a..."
                  className={inputClass} style={{ minHeight: '120px' }} 
                />
                
                <label className={labelClass}>Visión (¿A dónde quieres llegar en 5 años?)</label>
                <textarea 
                  value={data.vision} onChange={e => handleUpdate('vision', e.target.value)} 
                  placeholder="Ej: Ser la empresa líder a nivel nacional en..."
                  className={inputClass} style={{ minHeight: '120px' }} 
                />
              </div>
            </motion.div>
          )}

          {/* PASO 3: RESUMEN */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="animate-fade-in bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg mx-auto border-2 border-green-100">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={60} className="text-green-500" />
              </div>
              <h2 className="text-4xl font-black text-slate-800 mb-4">Fase 11 Completada</h2>
              <p className="text-lg text-slate-500 mb-8">La identidad corporativa ha sido forjada.</p>

              {errorStr && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold border border-red-200">
                  Error al guardar: {errorStr}
                </div>
              )}

              <button 
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1" 
                onClick={handleFinalizarFase} disabled={guardando}
              >
                <CheckCircle2 size={24} /> {guardando ? 'Guardando...' : 'Ir a la Batalla Final'}
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
                if (step === 1 && (data.objGeneral.length < 15 || data.objEspec1.length < 5)) {
                  increaseNexus(15, "Los objetivos son vagos. Un objetivo debe ser claro, medible y empezar con un verbo."); return;
                }
                if (step === 2 && (data.mision.length < 20 || data.vision.length < 20)) {
                  increaseNexus(20, "Misión o Visión mediocres. Necesitas fundamentar por qué existes y a dónde vas."); return;
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

export default Fase13_MisionVision;

