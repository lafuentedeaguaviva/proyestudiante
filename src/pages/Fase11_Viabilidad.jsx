import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PasoLayout from '../layouts/PasoLayout';
import { guardarContenidoFase, obtenerContenidoFaseCompleto } from '../services/api';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Wrench, TrendingUp } from 'lucide-react';
import { NexusContext } from '../context/NexusContext';

const Fase11_Viabilidad = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { increaseNexus } = React.useContext(NexusContext) || { increaseNexus: () => {} };
  
  const pasoURL = parseInt(searchParams.get('paso')) || 1;
  const [step, setStep] = useState(pasoURL);
  
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [pendingSave, setPendingSave] = useState(false);

  const [data, setData] = useState({
    viabilidadTecnica: '',
    viabilidadComercial: '',
    viabilidadLegal: '',
    paso_actual: 1
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const guardado = await obtenerContenidoFaseCompleto(11);
        if (guardado && guardado.viabilidad) {
          setData(prev => ({ ...prev, ...guardado.viabilidad }));
          const savedStep = parseInt(guardado.viabilidad.paso_actual, 10);
          if (savedStep && !searchParams.get('paso')) {
            setSearchParams({ paso: savedStep });
            setStep(savedStep);
          }
        }
      } catch (error) {
        console.error("Error al cargar Fase 11:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!pendingSave) return;
    const saveTimer = setTimeout(async () => {
      try {
        setGuardando(true);
        await guardarContenidoFase(11, 'viabilidad', data);
      } catch (error) {
        console.error("Error guardando progreso:", error);
      } finally {
        setGuardando(false);
        setPendingSave(false);
      }
    }, 500);
    return () => clearTimeout(saveTimer);
  }, [data, pendingSave]);

  const updateGlobalData = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const irAPaso = async (nPaso) => {
    if (nPaso > 3) {
      if (data.viabilidadTecnica.length < 10 || data.viabilidadComercial.length < 10) {
        increaseNexus(25, "Tu análisis de viabilidad es un chiste. Si no puedes justificar que esto es realista, abandona ahora.");
      }
      await guardarContenidoFase(11, 'paso_actual', 1);
      navigate('/fase/12/intro');
      return;
    }
    setStep(nPaso);
    setSearchParams({ paso: nPaso });
    updateGlobalData({ paso_actual: nPaso });
  };

  if (cargando) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  const getPasoContent = () => {
    switch(step) {
      case 1: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <Wrench size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Viabilidad Técnica</h2>
              <p className="text-slate-500 font-medium">¿Se puede hacer? Evalúa tus recursos y capacidades reales.</p>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Justifica si tienes los conocimientos, materiales y recursos físicos para fabricar u operar tu producto/servicio.</label>
            <textarea 
              value={data.viabilidadTecnica} 
              onChange={e => updateGlobalData({viabilidadTecnica: e.target.value})} 
              placeholder="Ej: Contamos con la maquinaria necesaria, proveedores locales seguros, y el equipo tiene la experiencia técnica para desarrollarlo..." 
              className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 transition-colors resize-none min-h-[200px]"
            />
          </div>
        </div>
      );
      case 2: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Viabilidad Comercial</h2>
              <p className="text-slate-500 font-medium">¿Alguien lo pagará? Evalúa la demanda y el mercado real.</p>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Basado en tu competencia y público objetivo, justifica por qué te van a comprar.</label>
            <textarea 
              value={data.viabilidadComercial} 
              onChange={e => updateGlobalData({viabilidadComercial: e.target.value})} 
              placeholder="Ej: Existe demanda demostrada por el aumento de estudiantes buscando alternativas. Además, nuestro precio de $X es muy competitivo respecto a..." 
              className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors resize-none min-h-[200px]"
            />
          </div>
        </div>
      );
      case 3: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Viabilidad Legal y Ambiental</h2>
              <p className="text-slate-500 font-medium">¿Es legal? ¿Es sostenible? Evalúa el impacto normativo de tu negocio.</p>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Justifica cómo tu negocio cumple con los permisos legales necesarios y no daña el medio ambiente.</label>
            <textarea 
              value={data.viabilidadLegal} 
              onChange={e => updateGlobalData({viabilidadLegal: e.target.value})} 
              placeholder="Ej: Contamos con la licencia de funcionamiento del municipio. Además, nuestros empaques son 100% biodegradables..." 
              className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors resize-none min-h-[200px]"
            />
          </div>
        </div>
      );
      default: return <div>Paso no definido</div>;
    }
  };

  return (
    <PasoLayout 
      faseTitle="Fase 11: Viabilidad"
      pasoActual={step}
      totalPasos={3}
      tabs={[
        { id: 1, icon: <Wrench size={18} />, label: 'Viabilidad Técnica' },
        { id: 2, icon: <TrendingUp size={18} />, label: 'Viabilidad Comercial' },
        { id: 3, icon: <ShieldCheck size={18} />, label: 'Legal y Ambiental' }
      ]}
      onTabClick={(id) => {
        setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={() => irAPaso(step + 1)}
      onAnterior={step > 1 ? () => irAPaso(step - 1) : null}
      mentorText={step === 1 ? "La idea es buena, ¿pero tienes cómo construirla de verdad? Analiza fría y objetivamente tu capacidad técnica." : step === 2 ? "Ahora que sabemos tus costos e indicadores, demuéstrame que realmente hay un mercado que está dispuesto a pagar tu precio." : "Nadie quiere un negocio clausurado. Asegúrate de tener los permisos claros y de no dañar el planeta."}
      guardando={guardando}
    >
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>
          {getPasoContent()}
        </div>
    </PasoLayout>
  );
};

export default Fase11_Viabilidad;
