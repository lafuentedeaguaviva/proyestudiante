import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SplashScreen from '../components/ui/SplashScreen';
import PasoLayout from '../layouts/PasoLayout';
import { useFase12Controller } from '../controllers/useFase12Controller';
import { Heart, Target, Clock, Globe2, BookOpen } from 'lucide-react';
import { NexusContext } from '../context/NexusContext';
import { obtenerTodoElContenidoProyecto, generarRedaccionMediaIA } from '../services/api';

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

  const [generandoIA, setGenerandoIA] = useState(false);

  const handleCompletarTodoIA = async () => {
    setGenerandoIA(true);
    try {
      const contexto = JSON.stringify(await obtenerTodoElContenidoProyecto());
      let updates = {};
      
      const checkAndGen = async (field, promptName, extraInst = "Redacta un párrafo corto y conciso.") => {
        if (!data[field] || String(data[field]).trim() === '') {
          const res = await generarRedaccionMediaIA(contexto, promptName, extraInst, 'medio');
          updates[field] = res;
        }
      };

      // Paso 1
      await checkAndGen('proposito_experiencia', 'Experiencia de vida que inspiró el emprendimiento', 'Responde de forma personal y en primera persona, brevemente.');
      await checkAndGen('proposito_valor', 'Valor personal principal que refleja el proyecto', 'Menciona un valor (ej. innovación, servicio) y explícalo brevemente.');
      await checkAndGen('proposito_seguir', 'Motivación más allá del dinero', 'Responde brevemente si seguirías haciendo esto sin cobrar y por qué.');

      // Paso 2
      await checkAndGen('metaCorto', 'Meta personal a corto plazo (1-2 años) que se quiere lograr con el emprendimiento');
      await checkAndGen('financioCorto', 'Forma de financiar la meta a corto plazo con los ingresos del proyecto');
      await checkAndGen('metaMediano', 'Meta personal a mediano plazo (3-5 años)');
      await checkAndGen('financioMediano', 'Forma de financiar la meta a mediano plazo con el proyecto');
      await checkAndGen('metaLargo', 'Meta personal a largo plazo (5-10 años)');
      await checkAndGen('financioLargo', 'Forma de financiar la meta a largo plazo con el proyecto');

      // Paso 3
      await checkAndGen('equilibrio_horas', 'Horas reales de trabajo a la semana/día en el negocio', 'Especifica un horario realista y saludable.');
      await checkAndGen('equilibrio_separacion', 'Estrategia para separar el tiempo de trabajo del personal', 'Ej. No usar el celular de trabajo los fines de semana.');
      await checkAndGen('equilibrio_salud', 'Acciones para cuidar la salud física y mental', 'Ej. Hacer ejercicio, meditar.');
      await checkAndGen('equilibrio_delegar', 'Plan de delegación de tareas operativas', 'Indica qué tareas se delegarán y cuándo.');

      // Paso 4
      await checkAndGen('legado_beneficiarios', 'Beneficiarios indirectos del proyecto');
      await checkAndGen('legado_problema', 'Problema social o ambiental que el negocio ayuda a mitigar');
      await checkAndGen('legado_futuro', 'Visión futura de cómo se quiere que la empresa sea recordada');

      // Resumen narrativo consolidado
      if (!data.resumen_ia_proyecto_vida || String(data.resumen_ia_proyecto_vida).trim() === '') {
        const promptResumen = "Redacta el Proyecto de Vida del emprendedor en un solo texto continuo, emotivo y profesional de 3 a 4 párrafos que integre su propósito, metas financieras, plan de equilibrio de vida y el legado que desea dejar.";
        updates.resumen_ia_proyecto_vida = await generarRedaccionMediaIA(contexto, promptResumen, "No dividas el texto con subtítulos, redáctalo como una sola narración fluida y en primera persona.", 'medio');
      }

      if (Object.keys(updates).length > 0) {
        updateGlobalData(updates);
      } else {
        alert("¡Todos los campos del Proyecto de Vida ya están llenos!");
      }
    } catch (e) {
      console.error(e);
      alert("Error al generar con IA");
    } finally {
      setGenerandoIA(false);
    }
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
      case 5: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-indigo-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-800">Resumen del Proyecto de Vida</h2>
              <p className="text-slate-500 font-medium">Revisa cómo se integra tu vida personal con el emprendimiento.</p>
            </div>
            <button 
              onClick={handleCompletarTodoIA}
              disabled={generandoIA}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
            >
              {generandoIA ? <span className="animate-spin text-xl">⏳</span> : '✨'}
              {generandoIA ? 'Generando...' : 'Completar Todo con IA'}
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
             <label className="block text-lg font-bold text-slate-800 mb-4">Proyecto de Vida (Narrativa Continua)</label>
             <p className="text-sm text-slate-500 mb-4">Este texto consolida tu propósito, metas, equilibrio y legado en una sola narrativa.</p>
             <textarea 
                value={data?.resumen_ia_proyecto_vida || ''}
                onChange={(e) => updateGlobalData({ resumen_ia_proyecto_vida: e.target.value })}
                className="w-full h-[400px] p-6 bg-white border-2 border-slate-200 rounded-xl text-slate-800 text-lg leading-relaxed focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all resize-y"
                placeholder="Presiona 'Completar Todo con IA' para generar una narrativa fluida que consolide tu proyecto de vida, o escríbela tú mismo..."
             />
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
      totalPasos={5}
      tabs={[
        { id: 1, icon: <Heart size={16} />, label: 'Alineación' },
        { id: 2, icon: <Target size={16} />, label: 'Metas' },
        { id: 3, icon: <Clock size={16} />, label: 'Equilibrio' },
        { id: 4, icon: <Globe2 size={16} />, label: 'Legado' },
        { id: 5, icon: <BookOpen size={16} />, label: 'Resumen IA' }
      ]}
      onTabClick={(id) => {
        setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={siguientePaso}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={
        step === 1 ? "Conectar el negocio con tu historia personal le dará sentido incluso en los días difíciles." : 
        step === 2 ? "Aterriza los números financieros en beneficios reales para tu vida. ¿Qué vas a lograr con ese dinero?" : 
        step === 3 ? "Si te agotas, el negocio muere. Establece límites saludables desde ahora." : 
        step === 4 ? "Las empresas que perduran son aquellas que aportan algo más al mundo además de dinero." :
        "Este es tu Proyecto de Vida. Asegúrate de que tu negocio trabaje para ti y no al revés."
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
