import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SplashScreen from '../components/ui/SplashScreen';
import PasoLayout from '../layouts/PasoLayout';
import { useFase12Controller } from '../controllers/useFase12Controller';
import { Heart, Target, Clock, Globe2 } from 'lucide-react';
import { NexusContext } from '../context/NexusContext';

const Fase12_ProyectoVida = () => {
  const {  increaseNexus } = React.useContext(NexusContext) || { increaseNexus: () => {} };

  const {
    cargando, step, irAPaso, siguientePaso, pasoAnterior,
    globalData, setGlobalData,
    guardando, errorStr,
    handleFinalizar
  , setPendingSave } = useFase12Controller();

  const data = globalData;
  const updateGlobalData = (newData) => {
    setGlobalData(newData);
    if (typeof setPendingSave === 'function') setPendingSave(true);
  };

  if (cargando) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const getPasoContent = () => {
    switch(step) {
      case 1: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-rose-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
              <Heart size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Alineación con tus valores y propósito</h2>
              <p className="text-slate-500 font-medium">¿Por qué este proyecto significa más que solo ganar dinero?</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">1. ¿Qué experiencia de vida te llevó a elegir este negocio?</label>
              <textarea 
                value={data.proposito_experiencia}
                onChange={(e) => updateGlobalData({ proposito_experiencia: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all resize-none"
                placeholder="Ej: Este proyecto nace de mi propia experiencia con..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">2. ¿Qué valor personal (honestidad, innovación, servicio, familia) se refleja en tu proyecto?</label>
              <textarea 
                value={data.proposito_valor}
                onChange={(e) => updateGlobalData({ proposito_valor: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all resize-none"
                placeholder="Ej: Considero que la honestidad es fundamental..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">3. Si no necesitaras dinero, ¿seguirías haciendo esto? ¿Por qué?</label>
              <textarea 
                value={data.proposito_seguir}
                onChange={(e) => updateGlobalData({ proposito_seguir: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all resize-none"
                placeholder="Ej: Sí, porque me apasiona crear..."
              />
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Target size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Metas personales y resultados financieros</h2>
              <p className="text-slate-500 font-medium">¿Cómo el dinero que genere el proyecto te permitirá cumplir metas concretas?</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">Piensa en números:</h3>
            <p className="text-slate-700 text-sm">
              Usa los resultados de tu Plan Financiero. ¿Qué harás con tus primeras ganancias? ¿Qué meta de vida se financia con este proyecto?
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-slate-500 font-bold border-b w-1/4">Plazo</th>
                  <th className="p-4 text-slate-500 font-bold border-b w-2/4">Meta personal</th>
                  <th className="p-4 text-slate-500 font-bold border-b w-1/4">¿Cómo se financia con el proyecto?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700">Corto (1-2 años)</td>
                  <td className="p-4">
                    <input value={data.metaCorto} onChange={e => updateGlobalData({metaCorto: e.target.value})} placeholder="Ej: Pagar mis deudas de estudio" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400" />
                  </td>
                  <td className="p-4">
                    <input value={data.financioCorto} onChange={e => updateGlobalData({financioCorto: e.target.value})} placeholder="Ej: Con el 30% de utilidades netas año 1" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400" />
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700">Mediano (3-5 años)</td>
                  <td className="p-4">
                    <input value={data.metaMediano} onChange={e => updateGlobalData({metaMediano: e.target.value})} placeholder="Ej: Viajar a Europa por 15 días" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400" />
                  </td>
                  <td className="p-4">
                    <input value={data.financioMediano} onChange={e => updateGlobalData({financioMediano: e.target.value})} placeholder="Ej: Excedente año 3 (10% de utilidad)" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400" />
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700">Largo (5-10 años)</td>
                  <td className="p-4">
                    <input value={data.metaLargo} onChange={e => updateGlobalData({metaLargo: e.target.value})} placeholder="Ej: Comprar mi primera vivienda" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400" />
                  </td>
                  <td className="p-4">
                    <input value={data.financioLargo} onChange={e => updateGlobalData({financioLargo: e.target.value})} placeholder="Ej: Ahorrando el 20% anual desde año 4" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
      case 3: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <Clock size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Plan de acción para el equilibrio vida-trabajo</h2>
              <p className="text-slate-500 font-medium">¿Cómo vas a evitar el agotamiento (burnout)?</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">1. ¿Cuántas horas reales piensas trabajar al día/semana?</label>
              <textarea 
                value={data.equilibrio_horas}
                onChange={(e) => updateGlobalData({ equilibrio_horas: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                placeholder="Ej: Trabajaré de lunes a viernes de 8am a 5pm..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">2. ¿Cómo vas a separar el tiempo de trabajo del tiempo personal?</label>
              <textarea 
                value={data.equilibrio_separacion}
                onChange={(e) => updateGlobalData({ equilibrio_separacion: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                placeholder="Ej: Los fines de semana serán 100% desconectados..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">3. ¿Qué harás para cuidar tu salud física y mental?</label>
              <textarea 
                value={data.equilibrio_salud}
                onChange={(e) => updateGlobalData({ equilibrio_salud: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                placeholder="Ej: Practicaré ejercicio 3 veces por semana..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">4. ¿Qué delegarás y a partir de cuándo?</label>
              <textarea 
                value={data.equilibrio_delegar}
                onChange={(e) => updateGlobalData({ equilibrio_delegar: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                placeholder="Ej: Delegaré la parte operativa en el año 2..."
              />
            </div>
          </div>
        </div>
      );
      case 4: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
              <Globe2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Contribución social y legado</h2>
              <p className="text-slate-500 font-medium">¿Qué impacto positivo tendrá tu proyecto en el entorno?</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">1. ¿Quiénes se benefician indirectamente con tu proyecto? (comunidad, medio ambiente)</label>
              <textarea 
                value={data.legado_beneficiarios}
                onChange={(e) => updateGlobalData({ legado_beneficiarios: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
                placeholder="Ej: Generaré empleos para madres de familia..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">2. ¿Qué problema social o ambiental ayuda a resolver tu negocio?</label>
              <textarea 
                value={data.legado_problema}
                onChange={(e) => updateGlobalData({ legado_problema: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
                placeholder="Ej: Utilizaré telas orgánicas reduciendo la huella de carbono..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">3. ¿Cómo te gustaría que recordaran tu empresa en el futuro?</label>
              <textarea 
                value={data.legado_futuro}
                onChange={(e) => updateGlobalData({ legado_futuro: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
                placeholder="Ej: Como una empresa líder que demuestra que es posible ser rentable y ético..."
              />
            </div>
          </div>
        </div>
      );
      default: return <div>Paso no definido</div>;
    }
  };

  return (
    <PasoLayout 
      faseTitle="Fase 12: Proyecto de Vida"
      pasoActual={step}
      totalPasos={4}
      tabs={[
        { id: 1, icon: <Heart size={16} />, label: 'Alineación' },
        { id: 2, icon: <Target size={16} />, label: 'Metas' },
        { id: 3, icon: <Clock size={16} />, label: 'Equilibrio' },
        { id: 4, icon: <Globe2 size={16} />, label: 'Legado' }
      ]}
      onTabClick={(id) => {
        setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={() => step < 4 ? siguientePaso() : handleFinalizar()}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={
        step === 1 ? "Conectar el negocio con tu historia personal le dará sentido incluso en los días difíciles." : 
        step === 2 ? "Aterriza los números financieros en beneficios reales para tu vida. ¿Qué vas a lograr con ese dinero?" : 
        step === 3 ? "Si te agotas, el negocio muere. Establece límites saludables desde ahora." : 
        "Las empresas que perduran son aquellas que aportan algo más al mundo además de dinero."
      }
      guardando={guardando}
    >
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>
          {getPasoContent()}
        </div>
    </PasoLayout>
  );
};

export default Fase12_ProyectoVida;
