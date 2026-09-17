import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../components/ui/SplashScreen';
import DetectiveLayout from '../layouts/DetectiveLayout';
import SubMenuFases from '../components/ui/SubMenuFases';
import { guardarContenidoFase, obtenerContenidoFaseCompleto } from '../services/api';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import { NexusContext } from '../context/NexusContext';

const Fase10_Indicadores = () => {
  const navigate = useNavigate();
  const { increaseNexus } = React.useContext(NexusContext) || { increaseNexus: () => {} };
  
  const [showSplash, setShowSplash] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorStr, setErrorStr] = useState(null);
  const [pendingSave, setPendingSave] = useState(false);
  
  const [data, setData] = useState({
    kpi1: '', meta1: '',
    kpi2: '', meta2: '',
    kpi3: '', meta3: ''
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const guardado = await obtenerContenidoFaseCompleto(10);
        if (guardado && guardado.indicadores) {
          setData(prev => ({ ...prev, ...guardado.indicadores }));
          if (!guardado.indicadores.paso_actual) {
            await guardarContenidoFase(10, 'paso_actual', 1).catch(e => console.error(e));
          }
        } else {
          await guardarContenidoFase(10, 'paso_actual', 1).catch(e => console.error(e));
        }
      } catch (error) {
        console.error("Error al cargar Fase 10:", error);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!pendingSave) return;
    const saveTimer = setTimeout(async () => {
      try {
        setGuardando(true);
        await guardarContenidoFase(10, 'indicadores', data);
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

  const getOrionDialog = () => {
    return "Fase 10: Indicadores. Lo que no se mide, no se mejora. Define al menos 3 métricas clave (KPIs) con las que evaluarás el éxito de tu empresa (Ej: Número de ventas, satisfacción del cliente, costos reducidos).";
  };

  const handleFinalizarFase = async () => {
    if (data.kpi1.length < 5 || data.meta1.length < 2) {
      increaseNexus(15, "Debes definir al menos el primer Indicador (KPI) de forma seria. ¿Cómo sabrás si tu negocio sobrevive?");
      return;
    }

    setGuardando(true);
    setErrorStr(null);
    try {
      await guardarContenidoFase(10, 'indicadores', data);
      await guardarContenidoFase(10, 'paso_actual', 1).catch(e => console.error(e));
      navigate('/fase/11/intro'); // Siguiente fase
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
        titulo="Indicadores (KPIs)"
        descripcion="Define las métricas de éxito. ¿Qué números mirarás todos los días para saber si estás ganando?"
        avatarSrc="/avatar_orion.png"
        onComenzar={() => setShowSplash(false)}
      />
    );
  }

  const sectionClass = "animate-fade-in p-8 bg-white rounded-3xl shadow-xl border-2 border-slate-100 mb-8";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2";
  const inputClass = "w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all";

  return (
    <DetectiveLayout faseTitle="Fase 10: Indicadores" orionText={getOrionDialog()}>
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>

      <SubMenuFases 
        tabs={[{ id: 1, icon: <BarChart3 size={18} />, label: 'Indicadores' }]}
        currentStep={1}
        onTabClick={() => {}}
        color="#8b5cf6"
      />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <BarChart3 size={40} color="#10b981" />
              <div>
                <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: 0 }}>Métricas de Éxito</h2>
                <p style={{ color: '#475569', margin: 0 }}>Define los KPIs (Key Performance Indicators) de tu proyecto.</p>
              </div>
            </div>

            <div className={sectionClass}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className={labelClass}>Indicador 1 (Obligatorio)</label>
                  <input value={data.kpi1} onChange={e => handleUpdate('kpi1', e.target.value)} placeholder="Ej: Ventas Mensuales" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Meta a alcanzar</label>
                  <input value={data.meta1} onChange={e => handleUpdate('meta1', e.target.value)} placeholder="Ej: 500 u/mes" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className={labelClass}>Indicador 2</label>
                  <input value={data.kpi2} onChange={e => handleUpdate('kpi2', e.target.value)} placeholder="Ej: Nivel de quejas de clientes" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Meta a alcanzar</label>
                  <input value={data.meta2} onChange={e => handleUpdate('meta2', e.target.value)} placeholder="Ej: < 5%" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Indicador 3</label>
                  <input value={data.kpi3} onChange={e => handleUpdate('kpi3', e.target.value)} placeholder="Ej: Tasa de recompra" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Meta a alcanzar</label>
                  <input value={data.meta3} onChange={e => handleUpdate('meta3', e.target.value)} placeholder="Ej: 30%" className={inputClass} />
                </div>
              </div>
            </div>

            {errorStr && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold flex items-center gap-2 border-2 border-red-200 shadow-sm">
                Error al guardar: {errorStr}
              </div>
            )}

            <div className="flex justify-end mt-8">
              <button 
                onClick={handleFinalizarFase} disabled={guardando}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-lg px-8 py-4 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50"
              >
                <CheckCircle2 size={24} /> {guardando ? 'Verificando...' : 'Guardar y avanzar a Justificación'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    
      </div>
</DetectiveLayout>
  );
};

export default Fase10_Indicadores;

