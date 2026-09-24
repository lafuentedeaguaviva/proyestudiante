import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasoLayout from '../layouts/PasoLayout';
import { useFase11Controller } from '../controllers/useFase11Controller';
import { BookOpen, BarChart, CheckCircle, Gift, Heart, Play, Video } from 'lucide-react';
import YoutubePlayer from '../components/ui/YoutubePlayer';
import { NexusContext } from '../context/NexusContext';
import { obtenerTodoElContenidoProyecto, generarRedaccionMediaIA } from '../services/api';

const Fase11_DocumentoFinal = () => {
  const {  increaseNexus } = React.useContext(NexusContext) || { increaseNexus: () => {} };

  const {
    cargando, step, irAPaso, siguientePaso, pasoAnterior,
    globalData, setGlobalData,
    guardando, errorStr,
    handleFinalizar,
    setPendingSave, forceSave } = useFase11Controller();

  const data = globalData;
  const updateGlobalData = (newData) => {
    setGlobalData(newData);
    if (typeof setPendingSave === 'function') setPendingSave(true);
  };

  const [generandoIA, setGenerandoIA] = useState(false);
  const [nivelIA, setNivelIA] = useState('medio');
  const [todosData, setTodosData] = useState(null);

  useEffect(() => {
    const autoFill = async () => {
      if (!cargando && data) {
        let needsUpdate = false;
        const updates = {};
        
        if (!data.intro_problema || !data.intro_objetivos || !data.intro_estructura || !todosData) {
          try {
            const todos = await obtenerTodoElContenidoProyecto();
            setTodosData(todos);
            
            const safeString = (val) => {
              if (!val) return null;
              if (typeof val === 'string') {
                try {
                  const parsed = JSON.parse(val);
                  if (typeof parsed === 'string' && parsed === val) return val;
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
                  const oG = `${safeString(baseF.obj_verbo) || ''} ${safeString(baseF.obj_producto) || ''} para ${safeString(baseF.obj_publico) || ''} ${safeString(baseF.obj_ubicacion) || ''} ${safeString(baseF.obj_plazo) || ''}`.trim();
                  if (oG) {
                    const esp1 = baseF.obj_especifico_1 ? `- ${safeString(baseF.obj_especifico_1)}` : '';
                    const esp2 = baseF.obj_especifico_2 ? `\n- ${safeString(baseF.obj_especifico_2)}` : '';
                    const esp3 = baseF.obj_especifico_3 ? `\n- ${safeString(baseF.obj_especifico_3)}` : '';
                    const esp4 = baseF.obj_especifico_4 ? `\n- ${safeString(baseF.obj_especifico_4)}` : '';
                    updates.intro_objetivos = `Objetivo General:\n${oG}\n\nObjetivos Específicos:\n${esp1}${esp2}${esp3}${esp4}`;
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
      } else if (step === 3) {
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

  const handleCompletarTodoIA = async () => {
    const sobreescribir = window.confirm("¿Deseas sobreescribir TODO el documento con IA? (Acepta para regenerar todo, o Cancela para solo llenar los campos vacíos)");
    setGenerandoIA(true);
    try {
      const todos = await obtenerTodoElContenidoProyecto();
      const contexto = JSON.stringify(todos);
      let updates = {};
      
      const checkAndGen = async (field, promptName, extraInst = "Redacta de 1 a 2 párrafos concisos y directos en tiempo PASADO (evita futuro como 'se completará').") => {
        if (sobreescribir || !data[field] || String(data[field]).trim() === '' || String(data[field]).includes('completara')) {
          const res = await generarRedaccionMediaIA(contexto, promptName, extraInst, nivelIA);
          updates[field] = res;
        }
      };

      // Paso 2
      await checkAndGen('intro_contexto', 'Contexto general del problema u oportunidad de negocio');
      await checkAndGen('intro_problema', 'Problema o necesidad que resuelve el emprendimiento');
      if (!data.intro_objetivos || String(data.intro_objetivos).trim() === '') {
        updates.intro_objetivos = await generarRedaccionMediaIA(contexto, 'Objetivos general y específicos', "Genera un Objetivo General y 3 Específicos basados en el contexto.", nivelIA);
      }
      await checkAndGen('intro_estructura', 'Estructura o capítulos de los que consta el documento final');
      
      // Paso 4
      await checkAndGen('resultados_mercado', 'Resultados del estudio de mercado y segmentación de clientes');
      await checkAndGen('resultados_tecnico', 'Resultados del estudio técnico y productivo');
      await checkAndGen('resultados_financiero', 'Resultados del estudio financiero y rentabilidad');
      
      // Paso 6
      const parseObjetivosIA = (texto) => {
        let general = [];
        let especificos = [];
        
        if (texto) {
          const lines = texto.split('\n').filter(l => l.trim() !== '');
          let mode = 'general';
          for (const line of lines) {
             const lower = line.toLowerCase();
             if (lower.includes('objetivo general') && !lower.includes('específic')) { mode = 'general'; continue; }
             if (lower.includes('específic') || lower.includes('especific')) { mode = 'especificos'; continue; }
             
             const cleanLine = line.replace(/^[-\d.)]+\s*/, '').trim();
             if (!cleanLine) continue;

             if (mode === 'general') general.push(cleanLine);
             else especificos.push(cleanLine);
          }
        }

        // Fallback
        if (general.length === 0 && todos && (todos[7]?.obj_verbo || todos[6]?.obj_verbo)) {
          const baseF = todos[7]?.obj_verbo ? todos[7] : todos[6];
          general = [`${baseF.obj_verbo || ''} ${baseF.obj_producto || ''} para ${baseF.obj_publico || ''}`.trim()];
        }

        if (especificos.length === 0 && todos) {
          const baseF = todos[7]?.obj_especifico_1 ? todos[7] : todos[6];
          if (baseF) {
            if (baseF.obj_especifico_1) especificos.push(baseF.obj_especifico_1);
            if (baseF.obj_especifico_2) especificos.push(baseF.obj_especifico_2);
            if (baseF.obj_especifico_3) especificos.push(baseF.obj_especifico_3);
            if (baseF.obj_especifico_4) especificos.push(baseF.obj_especifico_4);
          }
        }

        return {
          general: general.length ? general.join(' ') : 'Objetivo General',
          especificos: especificos.length ? especificos : ['Objetivo Específico 1']
        };
      };

      const objs = parseObjetivosIA(updates.intro_objetivos || data.intro_objetivos);
      let concEspecificas = Array.isArray(data.conclusiones_especificas) ? [...data.conclusiones_especificas] : [];
      let especificasModificadas = false;
      
      for (let i = 0; i < objs.especificos.length; i++) {
        if (sobreescribir || !concEspecificas[i] || String(concEspecificas[i]).trim() === '' || String(concEspecificas[i]).includes('completara')) {
          concEspecificas[i] = await generarRedaccionMediaIA(
            contexto, 
            `Conclusión específica para el objetivo: ${objs.especificos[i]}`, 
            'Escribe una conclusión afirmativa en TIEMPO PASADO indicando cómo YA SE CUMPLIÓ este objetivo en 1 párrafo corto. NO uses futuro (ej. "se completará"). No uses etiquetas como "Objetivo:" o "Conclusión:".', 
            nivelIA
          );
          especificasModificadas = true;
        }
      }
      if (especificasModificadas) {
        updates.conclusiones_especificas = concEspecificas;
      }

      if (sobreescribir || !data.conclusion_general || String(data.conclusion_general).trim() === '' || String(data.conclusion_general).includes('completara')) {
        updates.conclusion_general = await generarRedaccionMediaIA(contexto, 'Conclusión general del proyecto de emprendimiento', 'Resume en un párrafo el éxito técnico, de mercado y financiero en TIEMPO PASADO, sin usar viñetas ni etiquetas ni hablar en futuro.', nivelIA);
      }
      await checkAndGen('recomendaciones', 'Recomendaciones futuras para la empresa o proyecto');
      
      // Paso 8 y 10
      await checkAndGen('agradecimientos', 'Agradecimientos institucionales y personales por el apoyo en el proyecto');
      await checkAndGen('dedicatoria', 'Dedicatoria personal emotiva a familia o amigos (corto)');

      if (Object.keys(updates).length > 0) {
        updateGlobalData(updates);
        // Force save immediately so AI results aren't lost if user navigates away
        setTimeout(() => { if (typeof forceSave === 'function') forceSave(); }, 100);
      } else {
        alert("¡Todos los campos del documento ya están llenos!");
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
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Video Documento Final</h2>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <YoutubePlayer videoKey="video_fase_11" title="Documento Final" fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
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
                value={data?.intro_contexto || ''}
                onChange={(e) => updateGlobalData({ intro_contexto: e.target.value })}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                placeholder="Ej: En los últimos años, el consumo de productos naturales ha experimentado un crecimiento..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">2. Problema o necesidad (¿Qué problema específico abordas?)</label>
              <textarea 
                value={data?.intro_problema || ''}
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
      
      case 3: 
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
      
      case 4: 
        const parseObjetivos = (texto) => {
          let general = [];
          let especificos = [];
          
          if (texto) {
            const lines = texto.split('\n').filter(l => l.trim() !== '');
            let mode = 'general';
            for (const line of lines) {
               const lower = line.toLowerCase();
               if (lower.includes('objetivo general') && !lower.includes('específic')) { mode = 'general'; continue; }
               if (lower.includes('específic') || lower.includes('especific')) { mode = 'especificos'; continue; }
               
               const cleanLine = line.replace(/^[-\d.)]+\s*/, '').trim();
               if (!cleanLine) continue;

               if (mode === 'general') general.push(cleanLine);
               else especificos.push(cleanLine);
            }
          }

          // Fallback to Phase 7 data if parsing fails
          if (general.length === 0 && todosData && (todosData[7]?.obj_verbo || todosData[6]?.obj_verbo)) {
            const baseF = todosData[7]?.obj_verbo ? todosData[7] : todosData[6];
            general = [`${baseF.obj_verbo || ''} ${baseF.obj_producto || ''} para ${baseF.obj_publico || ''}`.trim()];
          }

          if (especificos.length === 0 && todosData) {
            const baseF = todosData[7]?.obj_especifico_1 ? todosData[7] : todosData[6];
            if (baseF) {
              if (baseF.obj_especifico_1) especificos.push(baseF.obj_especifico_1);
              if (baseF.obj_especifico_2) especificos.push(baseF.obj_especifico_2);
              if (baseF.obj_especifico_3) especificos.push(baseF.obj_especifico_3);
              if (baseF.obj_especifico_4) especificos.push(baseF.obj_especifico_4);
            }
          }

          return {
            general: general.length ? general.join(' ') : 'Objetivo General',
            especificos: especificos.length ? especificos : ['Objetivo Específico 1', 'Objetivo Específico 2']
          };
        };

        const objs = parseObjetivos(data?.intro_objetivos);
        const concEspecificas = Array.isArray(data?.conclusiones_especificas) 
          ? data.conclusiones_especificas 
          : Array(objs.especificos.length).fill('');
        
        const updateConclEspecifica = (index, val) => {
          const nuevas = Array.isArray(concEspecificas) ? [...concEspecificas] : [];
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
      
      case 5: return (
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
                value={data?.agradecimientos || ''}
                onChange={(e) => updateGlobalData({ agradecimientos: e.target.value })}
                onBlur={() => { if (typeof forceSave === 'function') forceSave(); }}
                className="w-full h-64 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all resize-none"
                placeholder="Quiero expresar mi más sincero agradecimiento a..."
              />
            </div>
          </div>
        </div>
      );
      
      case 6: return (
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
                value={data?.dedicatoria || ''}
                onChange={(e) => updateGlobalData({ dedicatoria: e.target.value })}
                onBlur={() => { if (typeof forceSave === 'function') forceSave(); }}
                className="w-full h-64 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all resize-none"
                placeholder="Este proyecto está dedicado a..."
              />
            </div>
          </div>
        </div>
      );
      case 7: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto border-2 border-indigo-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-800">Resumen IA</h2>
              <p className="text-slate-500 font-medium">Revisa todo el contenido generado en un solo lugar.</p>
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
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">1. Introducción</h3>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {[
                  data?.intro_contexto,
                  data?.intro_problema,
                  data?.intro_objetivos ? data.intro_objetivos.replace(/Objetivo General:?/gi, 'El propósito principal de este proyecto es:').replace(/Objetivos Específicos:?/gi, 'Para alcanzar esta meta, se realizarán las siguientes acciones:') : null,
                  data?.intro_estructura
                ].filter(Boolean).join('\n\n') || 'Sin datos'}
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">2. Resultados</h3>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {[
                  data?.resultados_mercado,
                  data?.resultados_tecnico,
                  data?.resultados_financiero
                ].filter(Boolean).join('\n\n') || 'Sin datos'}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">3. Conclusiones</h3>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {[
                  ...(data?.conclusiones_especificas || []),
                  data?.conclusion_general
                ].filter(Boolean).join('\n\n') || 'Sin datos'}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">4. Recomendaciones</h3>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {data?.recomendaciones || 'Sin datos'}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">5. Agradecimientos</h3>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {data?.agradecimientos || 'Sin datos'}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 text-center italic">
              <h3 className="text-lg font-bold text-slate-800 mb-4 not-italic">6. Dedicatoria</h3>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {data?.dedicatoria || 'Sin datos'}
              </p>
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
      totalPasos={11}
      tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <BookOpen size={16} />, label: 'Intro' },
          { id: 3, icon: <BarChart size={16} />, label: 'Resultados' },
          { id: 4, icon: <CheckCircle size={16} />, label: 'Conclusiones' },
          { id: 5, icon: <Gift size={16} />, label: 'Agradecimientos' },
          { id: 6, icon: <Heart size={16} />, label: 'Dedicatoria' },
          { id: 7, icon: <BookOpen size={16} />, label: 'Resumen IA' }
        ]}
      onTabClick={(id) => {
        setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={() => step < 7 ? siguientePaso() : handleFinalizar()}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={
        step === 1 || step === 2 ? "La introducción es la puerta de entrada a tu proyecto. Debe explicar el qué y el para qué." : 
        step === 3 || step === 3 ? "Los resultados son la evidencia de tu trabajo. Sé objetivo, solo muestra los datos sin opinar." : 
        step === 5 || step === 6 ? "Las conclusiones responden a tus objetivos. Las recomendaciones guían el camino a futuro." : 
        step === 7 || step === 8 ? "Un buen líder reconoce a quienes lo ayudaron a llegar a la meta. Agradece a tu equipo, familia e instituciones." :
        step === 9 || step === 10 ? "La dedicatoria es algo muy personal y emotivo. ¿A quién le ofreces el esfuerzo de todos estos meses?" :
        "Revisa cómo ha quedado el documento, la IA ha sintetizado todo."
      }
      guardando={guardando}
    >
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }} className="relative">
        

        {getPasoContent()}
      </div>
    </PasoLayout>
  );
};

export default Fase11_DocumentoFinal;
