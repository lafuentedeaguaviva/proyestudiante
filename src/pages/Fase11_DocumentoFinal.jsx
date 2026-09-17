import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasoLayout from '../layouts/PasoLayout';
import { useFase11Controller } from '../controllers/useFase11Controller';
import { BookOpen, BarChart, CheckCircle, Gift, Heart, Play } from 'lucide-react';
import { NexusContext } from '../context/NexusContext';
import { obtenerTodoElContenidoProyecto, generarRedaccionMediaIA } from '../services/api';

const Fase11_DocumentoFinal = () => {
  const {  increaseNexus } = React.useContext(NexusContext) || { increaseNexus: () => {} };

  const {
    cargando, step, irAPaso, siguientePaso, pasoAnterior,
    globalData, setGlobalData,
    guardando, errorStr,
    handleFinalizar
  , setPendingSave } = useFase11Controller();

  const data = globalData;
  const updateGlobalData = (newData) => {
    setGlobalData(newData);
    if (typeof setPendingSave === 'function') setPendingSave(true);
  };

  useEffect(() => {
    const autoFill = async () => {
      if (!cargando && data) {
        let needsUpdate = false;
        const updates = {};
        
        if (!data.intro_problema || !data.intro_objetivos || !data.intro_estructura) {
          try {
            const todos = await obtenerTodoElContenidoProyecto();
            
            const safeString = (val) => {
              if (!val) return null;
              if (typeof val === 'string') {
                try {
                  const parsed = JSON.parse(val);
                  return safeString(parsed);
                } catch (e) {
                  return val;
                }
              }
              if (Array.isArray(val)) {
                return val.map(v => safeString(v)).filter(Boolean).join(', ');
              }
              if (typeof val === 'object') {
                return val.text || val.texto || val.nombre || val.desc || val.descripcion || val.title || val.name || val.problema || val.segmento || '';
              }
              return String(val);
            };

            // Buscar problema en Fase 1, 2, 6, o 7
            if (!data.intro_problema) {
              const probRaw = todos[1]?.frase_problema || todos[1]?.dolor || todos[2]?.problema || todos[6]?.diag_p1 || todos[6]?.diag_p3 || todos[7]?.diag_p1 || todos[7]?.diag_p3;
              const probClean = safeString(probRaw);
              if (probClean) {
                updates.intro_problema = probClean;
                needsUpdate = true;
              }
            }
            
            // Buscar objetivos en Fase 6 o 7
            if (!data.intro_objetivos) {
              const fObj = todos[6]?.objGeneral ? todos[6] : (todos[7]?.objGeneral ? todos[7] : null);
              
              if (fObj) {
                const esp1 = fObj.obj_especifico_1 ? `- ${safeString(fObj.obj_especifico_1)}` : '';
                const esp2 = fObj.obj_especifico_2 ? `\n- ${safeString(fObj.obj_especifico_2)}` : '';
                updates.intro_objetivos = `Objetivo General:\n${safeString(fObj.objGeneral)}\n\nObjetivos Específicos:\n${esp1}${esp2}`;
                needsUpdate = true;
              } else {
                const baseF = todos[6]?.obj_verbo ? todos[6] : (todos[7]?.obj_verbo ? todos[7] : null);
                if (baseF) {
                  const oG = `${safeString(baseF.obj_verbo) || ''} ${safeString(baseF.obj_producto) || ''} para ${safeString(baseF.obj_publico) || ''} en ${safeString(baseF.obj_plazo) || ''}`.trim();
                  if (oG) {
                    const esp1 = baseF.obj_especifico_1 ? `- ${safeString(baseF.obj_especifico_1)}` : '';
                    const esp2 = baseF.obj_especifico_2 ? `\n- ${safeString(baseF.obj_especifico_2)}` : '';
                    const esp3 = baseF.obj_especifico_3 ? `\n- ${safeString(baseF.obj_especifico_3)}` : '';
                    updates.intro_objetivos = `Objetivo General:\n${oG}\n\nObjetivos Específicos:\n${esp1}${esp2}${esp3}`;
                    needsUpdate = true;
                  }
                }
              }
            }

            if (!data.intro_estructura) {
              updates.intro_estructura = "El trabajo está estructurado en 4 capítulos principales:\nCapítulo 1: Introducción.\nCapítulo 2: Planteamiento del Emprendimiento Productivo.\nCapítulo 3: Desarrollo del Emprendimiento Productivo.\nCapítulo 4: Conclusiones y Recomendaciones.";
              needsUpdate = true;
            }
          } catch(e) {
            console.error(e);
          }
        }
        
        if (needsUpdate) {
          updateGlobalData(updates);
        }
      }
    };
    autoFill();
  }, [cargando]);

  if (cargando) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const [generandoIA, setGenerandoIA] = useState(false);
  const [nivelIA, setNivelIA] = useState('medio');

  const handleCompletarSeccionIA = async () => {
    setGenerandoIA(true);
    try {
      const contexto = JSON.stringify(await obtenerTodoElContenidoProyecto());
      let updates = {};
      
      const checkAndGen = async (field, promptName) => {
        if (!data[field] || String(data[field]).trim() === '') {
          const res = await generarRedaccionMediaIA(contexto, promptName, "Redacta de 1 a 2 párrafos concisos y directos.", nivelIA);
          updates[field] = res;
        }
      };

      if (step === 2) {
        await checkAndGen('intro_contexto', 'Contexto general del problema u oportunidad de negocio');
        await checkAndGen('intro_problema', 'Problema o necesidad que resuelve el emprendimiento');
        if (!data.intro_objetivos || String(data.intro_objetivos).trim() === '') {
          updates.intro_objetivos = await generarRedaccionMediaIA(contexto, 'Objetivos general y específicos', "Genera un Objetivo General y 3 Específicos basados en el contexto.", nivelIA);
        }
        await checkAndGen('intro_estructura', 'Estructura o capítulos de los que consta el documento final');
      } else if (step === 4) {
        await checkAndGen('resultados_mercado', 'Resultados del estudio de mercado y segmentación de clientes');
        await checkAndGen('resultados_tecnico', 'Resultados del estudio técnico y productivo');
        await checkAndGen('resultados_financiero', 'Resultados del estudio financiero y rentabilidad');
      } else if (step === 6) {
        if (!data.conclusion_general || String(data.conclusion_general).trim() === '') {
          updates.conclusion_general = await generarRedaccionMediaIA(contexto, 'Conclusión general del proyecto de emprendimiento', 'Resume en un párrafo el éxito técnico, de mercado y financiero.', nivelIA);
        }
        await checkAndGen('recomendaciones', 'Recomendaciones futuras para la empresa o proyecto');
      } else if (step === 8) {
        await checkAndGen('agradecimientos', 'Agradecimientos institucionales y personales por el apoyo en el proyecto');
      } else if (step === 10) {
        await checkAndGen('dedicatoria', 'Dedicatoria personal emotiva a familia o amigos (corto)');
      }

      if (Object.keys(updates).length > 0) {
        updateGlobalData(updates);
      } else {
        alert("¡Todos los campos de esta sección ya están llenos!");
      }
    } catch (e) {
      console.error(e);
      alert("Error al generar con IA");
    } finally {
      setGenerandoIA(false);
    }
  };

  const getPasoContent = () => {
    switch(step) {
      case 1: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-slate-100">
          <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">Recurso: Cómo redactar la Introducción</h3>
          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80&w=1000" alt="Introducción" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <BookOpen size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">1. Introducción</h2>
              <p className="text-slate-500 font-medium">La introducción despierta el interés del lector y presenta el tema de forma ordenada.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">1. Contexto general (¿Por qué es importante el tema en la actualidad?)</label>
              <textarea 
                value={data.intro_contexto}
                onChange={(e) => updateGlobalData({ intro_contexto: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                placeholder="Ej: En los últimos años, el consumo de productos naturales ha experimentado un crecimiento..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">2. Problema o necesidad (¿Qué problema específico abordas?)</label>
              <textarea 
                value={data.intro_problema}
                onChange={(e) => updateGlobalData({ intro_problema: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                placeholder="Ej: A pesar de esta tendencia, los emprendedores enfrentan dificultades por falta de planificación..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">3. Objetivos (¿Qué te propusiste y qué vas a lograr?)</label>
              <textarea 
                value={data.intro_objetivos || ''}
                onChange={(e) => updateGlobalData({ intro_objetivos: e.target.value })}
                className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                placeholder="Ej: El objetivo general es desarrollar un plan de negocios técnica, económica y financieramente viable..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">4. Estructura del trabajo (¿De cuántos capítulos consta y qué contiene cada uno?)</label>
              <textarea 
                value={data.intro_estructura || ''}
                onChange={(e) => updateGlobalData({ intro_estructura: e.target.value })}
                className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                placeholder="Ej: El trabajo está estructurado en siete capítulos..."
              />
            </div>
          </div>
        </div>
      );
      case 3: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-slate-100">
          <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">Recurso: Presentando los Resultados</h3>
          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" alt="Resultados" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );
      case 4: 
        const autoCompletarResultados = () => {
          let mercado = data.resultados_mercado || '';
          let tecnico = data.resultados_tecnico || '';
          let financiero = data.resultados_financiero || '';

          const safeString = (val) => {
            if (!val) return null;
            if (typeof val === 'string') {
              try {
                const parsed = JSON.parse(val);
                return safeString(parsed);
              } catch (e) {
                return val;
              }
            }
            if (Array.isArray(val)) {
              return val.map(v => safeString(v)).filter(Boolean).join(', ');
            }
            if (typeof val === 'object') {
              return val.text || val.texto || val.nombre || val.desc || val.descripcion || val.title || val.name || val.problema || val.segmento || '';
            }
            return String(val);
          };

          if (!mercado) {
            const seg = safeString(data.segmento_cliente) || safeString(data.segmento) || 'el público objetivo definido';
            const prob = safeString(data.problema) || 'una necesidad insatisfecha en el mercado actual';
            
            mercado = `Según el estudio realizado, nuestro cliente ideal es ${seg}. ` +
            `Se ha validado que existe una demanda dispuesta a adquirir el producto/servicio a un precio estimado de $${data.precio_venta || data.precio || 'acorde al mercado'}. ` +
            `Las validaciones confirmaron que el principal problema a resolver es ${prob}.`;
          }

          if (!tecnico) {
            const numAreas = data.organigrama ? data.organigrama.filter(x => x.tipo === 'area').length : 'varias';
            const numPasos = data.pasosProduccion ? data.pasosProduccion.length : 'varias';
            tecnico = `El proyecto requiere un proceso operativo estructurado en ${numPasos} etapas clave. ` +
            `Para funcionar adecuadamente, la empresa contará con un organigrama de ${numAreas} áreas funcionales y un equipo base. ` +
            `La capacidad instalada permite cubrir la demanda inicial proyectada asegurando los estándares de calidad requeridos.`;
          }

          if (!financiero) {
            const inv = data.inversion_total || data.totalActivosFijos || data.totalInversion || '15,000';
            const van = data.van || data.van_proyecto || '4,500';
            const tir = data.tir || data.tir_proyecto || '25';
            const pe = data.punto_equilibrio_unidades || data.puntoEquilibrio || 'la cantidad mínima de';
            
            financiero = `La inversión inicial requerida para el arranque asciende a $${inv}. ` +
            `El análisis de rentabilidad indica un Valor Actual Neto (VAN) positivo de $${van} y una Tasa Interna de Retorno (TIR) del ${tir}%. ` +
            `El punto de equilibrio se alcanza al vender ${pe} unidades mensuales, confirmando que el modelo de negocio es financieramente viable y sostenible en el tiempo.`;
          }

          updateGlobalData({
            resultados_mercado: mercado,
            resultados_tecnico: tecnico,
            resultados_financiero: financiero
          });
        };

        return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <BarChart size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">2. Resultados</h2>
              <p className="text-slate-500 font-medium">Presenta de manera clara y objetiva lo que encontraste o calculaste.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">1. Resultados del estudio de mercado (Encuestas, frecuencias, preferencias)</label>
              <textarea 
                value={data.resultados_mercado || ''}
                onChange={(e) => updateGlobalData({ resultados_mercado: e.target.value })}
                className="w-full h-28 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                placeholder="Ej: Se encuestó a 150 personas. El 78% consume mermelada y están dispuestos a pagar $3.50..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">2. Resultados del estudio técnico (Capacidad de producción, volúmenes anuales)</label>
              <textarea 
                value={data.resultados_tecnico || ''}
                onChange={(e) => updateGlobalData({ resultados_tecnico: e.target.value })}
                className="w-full h-28 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                placeholder="Ej: La capacidad de producción estimada es de 300 unidades mensuales en el primer año..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">3. Resultados financieros (Inversión, costos, VAN, TIR, recuperación)</label>
              <textarea 
                value={data.resultados_financiero || ''}
                onChange={(e) => updateGlobalData({ resultados_financiero: e.target.value })}
                className="w-full h-28 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                placeholder="Ej: Inversión total de $8.450. El proyecto obtiene un VAN positivo de $4.280 y una TIR de 28.5%..."
              />
            </div>
          </div>
        </div>
      );
      case 5: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-slate-100">
          <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">Recurso: Cómo hacer Conclusiones</h3>
          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000" alt="Conclusiones" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );
      case 6: 
        const parseObjetivos = (texto) => {
          if (!texto) return { general: 'Objetivo General', especificos: ['Objetivo Específico 1', 'Objetivo Específico 2'] };
          const lines = texto.split('\n').filter(l => l.trim() !== '');
          const general = [];
          const especificos = [];
          let mode = 'general';
          for (const line of lines) {
             const lower = line.toLowerCase();
             if (lower.includes('objetivo general:')) { mode = 'general'; continue; }
             if (lower.includes('específicos:')) { mode = 'especificos'; continue; }
             
             const cleanLine = line.replace(/^-\s*/, '').trim();
             if (mode === 'general') general.push(cleanLine);
             else especificos.push(cleanLine);
          }
          return {
            general: general.length ? general.join(' ') : 'Objetivo General',
            especificos: especificos.length ? especificos : ['Objetivo Específico 1', 'Objetivo Específico 2']
          };
        };

        const objs = parseObjetivos(data.intro_objetivos);
        const concEspecificas = data.conclusiones_especificas || Array(objs.especificos.length).fill('');
        
        const updateConclEspecifica = (index, val) => {
          const nuevas = [...concEspecificas];
          nuevas[index] = val;
          updateGlobalData({ conclusiones_especificas: nuevas });
        };

        const autoCompletarConclusiones = () => {
          const nuevasEspecificas = objs.especificos.map((obj, i) => {
            if (concEspecificas[i]) return concEspecificas[i]; // No sobrescribir si ya escribió algo
            return `Tras el desarrollo del proyecto, se ha cumplido satisfactoriamente este objetivo mediante las actividades realizadas, obteniendo resultados positivos.`;
          });
          
          const nuevaGeneral = data.conclusion_general || `En conclusión, el proyecto demuestra viabilidad técnica y financiera, cumpliendo con el propósito de ${objs.general.toLowerCase()}. Se han validado las hipótesis principales y el modelo de negocio es sostenible.`;
          
          const nuevasRecom = data.recomendaciones || `- Mantener la estrategia actual y buscar nuevas alianzas estratégicas.\n- Monitorear los costos operativos mensualmente.\n- Iniciar operaciones con un volumen conservador y escalar progresivamente.`;

          updateGlobalData({
            conclusiones_especificas: nuevasEspecificas,
            conclusion_general: nuevaGeneral,
            recomendaciones: nuevasRecom
          });
        };

        return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">3. Conclusiones y Recomendaciones</h2>
              <p className="text-slate-500 font-medium">Extrae los aprendizajes clave y responde a cada uno de tus objetivos.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Conclusiones Específicas</h3>
              {objs.especificos.map((obj, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100">
                  <label className="block text-sm font-bold text-slate-600 mb-2 italic">Objetivo: {obj}</label>
                  <textarea 
                    value={concEspecificas[idx] || ''}
                    onChange={(e) => updateConclEspecifica(idx, e.target.value)}
                    className="w-full h-24 p-3 bg-white border-2 border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
                    placeholder="Escribe tu conclusión respondiendo a este objetivo específico..."
                  />
                </div>
              ))}
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-100">
              <h3 className="text-lg font-bold text-purple-900 mb-2">Conclusión General</h3>
              <label className="block text-sm font-bold text-purple-700 mb-2 italic">Objetivo General: {objs.general}</label>
              <textarea 
                value={data.conclusion_general || ''}
                onChange={(e) => updateGlobalData({ conclusion_general: e.target.value })}
                className="w-full h-28 p-3 bg-white border-2 border-purple-200 rounded-lg text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
                placeholder="Escribe la conclusión principal y más importante de tu proyecto respondiendo al objetivo general..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Recomendaciones (Sugerencias concretas, alianzas, futuros pasos)</label>
              <textarea 
                value={data.recomendaciones || ''}
                onChange={(e) => updateGlobalData({ recomendaciones: e.target.value })}
                className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
                placeholder="- Iniciar con una producción piloto de 200 frascos...&#10;- Establecer contratos de compra anticipada con proveedores...&#10;- Invertir en una estrategia de marketing digital..."
              />
            </div>
          </div>
        </div>
      );
      case 7: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-slate-100">
          <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">Recurso: Agradecimientos</h3>
          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000" alt="Agradecimientos" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-amber-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );
      case 8: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-amber-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <Gift size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">4. Agradecimientos</h2>
              <p className="text-slate-500 font-medium">Reconoce a las personas e instituciones que te apoyaron (económica, emocional, o técnicamente).</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Redacta tus agradecimientos</label>
              <textarea 
                value={data.agradecimientos}
                onChange={(e) => updateGlobalData({ agradecimientos: e.target.value })}
                className="w-full h-64 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all resize-none"
                placeholder="Quiero expresar mi más sincero agradecimiento a..."
              />
            </div>
          </div>
        </div>
      );
      case 9: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-slate-100">
          <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">Recurso: Dedicatoria</h3>
          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000" alt="Dedicatoria" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );
      case 10: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-rose-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
              <Heart size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">5. Dedicatoria</h2>
              <p className="text-slate-500 font-medium">Un espacio emotivo para dedicar tu trabajo a personas especiales.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Escribe aquí tu dedicatoria</label>
              <textarea 
                value={data.dedicatoria}
                onChange={(e) => updateGlobalData({ dedicatoria: e.target.value })}
                className="w-full h-64 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all resize-none text-center italic"
                placeholder="A mis padres por su apoyo incondicional..."
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
      faseTitle="Fase 11: Consolidación del Documento"
      pasoActual={step}
      totalPasos={10}
      tabs={[
        { id: 1, icon: <Play size={16} />, label: 'V. Intro' },
        { id: 2, icon: <BookOpen size={16} />, label: 'Intro' },
        { id: 3, icon: <Play size={16} />, label: 'V. Resultados' },
        { id: 4, icon: <BarChart size={16} />, label: 'Resultados' },
        { id: 5, icon: <Play size={16} />, label: 'V. Conclusiones' },
        { id: 6, icon: <CheckCircle size={16} />, label: 'Conclusiones' },
        { id: 7, icon: <Play size={16} />, label: 'V. Agradecimientos' },
        { id: 8, icon: <Gift size={16} />, label: 'Agradecimientos' },
        { id: 9, icon: <Play size={16} />, label: 'V. Dedicatoria' },
        { id: 10, icon: <Heart size={16} />, label: 'Dedicatoria' }
      ]}
      onTabClick={(id) => {
        setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={() => step < 10 ? siguientePaso() : handleFinalizar()}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={
        step === 1 || step === 2 ? "La introducción es la puerta de entrada a tu proyecto. Debe explicar el qué y el para qué." : 
        step === 3 || step === 4 ? "Los resultados son la evidencia de tu trabajo. Sé objetivo, solo muestra los datos sin opinar." : 
        step === 5 || step === 6 ? "Las conclusiones responden a tus objetivos. Las recomendaciones guían el camino a futuro." : 
        step === 7 || step === 8 ? "Un buen líder reconoce a quienes lo ayudaron a llegar a la meta. Agradece a tu equipo, familia e instituciones." :
        "La dedicatoria es algo muy personal y emotivo. ¿A quién le ofreces el esfuerzo de todos estos meses?"
      }
      guardando={guardando}
    >
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }} className="relative">
        
        {/* Botón flotante IA */}
        {[2, 4, 6, 8, 10].includes(step) && (
          <div className="absolute top-0 right-0 -mt-2 -mr-2 z-10 flex items-center gap-2">
            <select
              value={nivelIA}
              onChange={(e) => setNivelIA(e.target.value)}
              disabled={generandoIA}
              className="bg-white border-2 border-indigo-200 text-indigo-700 font-bold py-2 px-3 rounded-xl shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors"
              title="Selecciona el nivel de redacción de la IA"
            >
              <option value="basico">Nivel Básico</option>
              <option value="medio">Nivel Medio</option>
              <option value="avanzado">Nivel Académico</option>
            </select>
            <button 
              onClick={handleCompletarSeccionIA}
              disabled={generandoIA}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
              title="Generar la redacción para los campos vacíos de esta sección"
            >
              {generandoIA ? <span className="animate-spin text-xl">⏳</span> : '✨'}
              {generandoIA ? 'Redactando con IA...' : 'Llenar Vacíos'}
            </button>
          </div>
        )}

        {getPasoContent()}
      </div>
    </PasoLayout>
  );
};

export default Fase11_DocumentoFinal;
