import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { obtenerConfiguracionFase, generarIdeasDeepSeek, generarNombresDeepSeek, generarPitchDeepSeek, generarResumenFase1DeepSeek, guardarContenidoFase, obtenerContenidoFaseCompleto, actualizarTituloProyecto, obtenerMetadatosUsuario, actualizarMetadatosUsuario } from '../services/api';
import { supabase } from '../lib/supabaseClient';

export const useFase1Logic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pasoQuery = searchParams.get('paso');
  
  const [step, setStep] = useState(pasoQuery ? parseInt(pasoQuery) : 0);

  const handleSetStep = (newStep) => {
    setStep(newStep);
    setSearchParams({ paso: newStep }, { replace: true });
  };
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pasoQuery) {
      const p = parseInt(pasoQuery);
      if (p >= 0 && p <= 10 && p !== step) {
        setStep(p);
      }
    }
  }, [pasoQuery, step]);

  // Formularios
  const [area, setArea] = useState('');
  const [observaciones, setObservaciones] = useState([{ protagonista: '', contexto: '', dolor: '', tarea: '' }]);
  const [fricciones, setFricciones] = useState([{ solucionActual: '', friccion: '', solucionIdeal: '' }]);

  // Lluvia de Ideas
  const [ideasIA, setIdeasIA] = useState([]);
  const [ideasSeleccionadas, setIdeasSeleccionadas] = useState([]);
  const [generandoIA, setGenerandoIA] = useState(false);
  const [limiteGeneracion, setLimiteGeneracion] = useState({ count: 0, lastReset: Date.now() });
  const [maxLimiteIA, setMaxLimiteIA] = useState(10);

  // Matriz
  const [evaluaciones, setEvaluaciones] = useState({});
  const [ideaGanadora, setIdeaGanadora] = useState(null);

  // Nombres
  const [nombresSugeridos, setNombresSugeridos] = useState([]);
  const [nombreElegido, setNombreElegido] = useState('');
  
  // Pitch y Resumen
  const [pitchGenerado, setPitchGenerado] = useState('');
  const [generandoPitch, setGenerandoPitch] = useState(false);
  const [resumenGuardado, setResumenGuardado] = useState(null);
  const [generandoResumen, setGenerandoResumen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerConfiguracionFase('55555555-5555-5555-5555-555555555555', 1);
        setMentorData(data);
        
        // Recuperar datos guardados de la BD
        const contenidoGuardado = await obtenerContenidoFaseCompleto(1);
        
        // Cargar configuración global del límite
        const { data: limitConfig } = await supabase
          .from('prompts_ia')
          .select('prompt_texto')
          .eq('fase_id', 0)
          .eq('proposito', 'ia_limite_intentos')
          .single();
        if (limitConfig && limitConfig.prompt_texto) {
          setMaxLimiteIA(parseInt(limitConfig.prompt_texto, 10) || 10);
        }
        
        const safeParse = (data) => {
          if (typeof data === 'string') {
            try { return JSON.parse(data); } catch (e) { return data; }
          }
          return data;
        };
        
        if (contenidoGuardado.paso_actual) {
          // Si pasoQuery existe, tiene prioridad, sino usamos el guardado
          if (!pasoQuery) {
            const savedStep = parseInt(contenidoGuardado.paso_actual, 10);
            if (!isNaN(savedStep)) {
              handleSetStep(savedStep > 10 ? 10 : savedStep);
            }
          } else {
            // Sincroniza la DB si hay pasoQuery
            await guardarContenidoFase(1, 'paso_actual', parseInt(pasoQuery)).catch(e => console.error(e));
          }
        } else {
          // Aseguramos que la DB sepa que al menos llegamos a este paso de esta fase
          await guardarContenidoFase(1, 'paso_actual', pasoQuery ? parseInt(pasoQuery) : 0).catch(e => console.error(e));
        }
        
        const areaData = safeParse(contenidoGuardado.area_seleccionada);
        if (areaData) {
          setArea(areaData.nombre_area || '');
        }
        
        const problemasData = safeParse(contenidoGuardado.problemas_detectados);
        if (problemasData && Array.isArray(problemasData)) {
          const obs = problemasData.map(p => ({
            protagonista: p.protagonista || '',
            contexto: p.contexto || '',
            dolor: p.dolor || '',
            tarea: p.tarea || ''
          }));
          if (obs.length > 0) setObservaciones(obs);
          
          const friccs = problemasData.map(p => p.fricciones || { solucionActual: '', friccion: '', solucionIdeal: '' });
          if (friccs.length > 0) setFricciones(friccs);
        }
        
        const ideasGeneradasData = safeParse(contenidoGuardado.ideas_generadas);
        if (ideasGeneradasData) {
          setIdeasIA(ideasGeneradasData);
        }

        const ideasData = safeParse(contenidoGuardado.ideas_seleccionadas);
        if (ideasData && Array.isArray(ideasData)) {
          setIdeasSeleccionadas(ideasData);
          
          // Asegurar que las ideas seleccionadas también estén en la lista de ideas generadas 
          // para que puedan ser mostradas/editadas si regresan al paso anterior
          if (ideasGeneradasData && Array.isArray(ideasGeneradasData)) {
            const missingIdeas = ideasData.filter(idea => !ideasGeneradasData.includes(idea));
            if (missingIdeas.length > 0) {
              setIdeasIA([...ideasGeneradasData, ...missingIdeas]);
            }
          } else {
            setIdeasIA(ideasData);
          }
        }

        const limiteData = safeParse(contenidoGuardado.limite_generacion_ideas);
        if (limiteData) {
          setLimiteGeneracion(limiteData);
        }
        
        let evaluacionesData = safeParse(contenidoGuardado.evaluacion_ideas);
        if (!evaluacionesData && contenidoGuardado.evaluaciones) {
          evaluacionesData = safeParse(contenidoGuardado.evaluaciones);
        }
        if (evaluacionesData) {
          setEvaluaciones(evaluacionesData);
        }

        const ganadoraData = safeParse(contenidoGuardado.idea_ganadora);
        if (ganadoraData) {
          setIdeaGanadora(ganadoraData.idea);
          setNombreElegido(ganadoraData.nombre_elegido);
          setPitchGenerado(ganadoraData.pitch);
        }

        const resumenData = safeParse(contenidoGuardado.resumen_fase1);
        if (resumenData) {
          setResumenGuardado(resumenData);
        }

      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generarFraseProblema = (obs) => {
    return `Los ${obs.protagonista || '[Protagonista]'}, cuando ${obs.contexto || '[Contexto]'}, sufren por ${obs.dolor || '[Dolor]'}, ya que intentan ${obs.tarea || '[Tarea]'}.`;
  };

  const autoGuardar = async () => {
    try {
      if (step === 1 && area) {
        await guardarContenidoFase(1, 'area_seleccionada', { nombre_area: area });
      } else if (step === 3 || step === 5) {
        const datosCompletos = observaciones.map((obs, index) => ({
          id: index + 1,
          ...obs,
          frase_problema: generarFraseProblema(obs),
          fricciones: fricciones[index] || { solucionActual: '', friccion: '', solucionIdeal: '' }
        }));
        await guardarContenidoFase(1, 'problemas_detectados', datosCompletos);
      } else if (step === 7) {
        // Asegurar que las ideas editadas se guarden al avanzar
        await guardarContenidoFase(1, 'ideas_generadas', ideasIA);
        await guardarContenidoFase(1, 'ideas_seleccionadas', ideasSeleccionadas);
      }
    } catch (e) {
      console.error("Error en auto-guardado:", e);
    }
  };

  const handleSiguiente = async () => {
    try {
      await autoGuardar(); // Reutilizamos la lógica
      if (step === 6) {
        // Al entrar al paso 7, pre-popular las ideas con las soluciones ideales
        const solucionesIdeales = fricciones.map(f => f.solucionIdeal).filter(Boolean);
        setIdeasIA(solucionesIdeales);
        await guardarContenidoFase(1, 'ideas_generadas', solucionesIdeales);
      }
      // Guardar el paso actual al avanzar
      await guardarContenidoFase(1, 'paso_actual', step + 1);
    } catch (e) {
      console.error("Error al guardar datos de la fase:", e);
    }
    handleSetStep(step + 1);
  };

  const handleAnterior = async () => {
    if (step > 1) {
      await autoGuardar(); // Guardamos antes de retroceder
      const nuevoPaso = step - 1;
      handleSetStep(nuevoPaso);
      guardarContenidoFase(1, 'paso_actual', nuevoPaso).catch(e => console.error(e));
    }
  };

  const solicitarIdeasIA = async () => {
    // Verificación silenciosa del límite (10 veces, espera de 1 semana)
    const A_WEEK = 7 * 24 * 60 * 60 * 1000;
    let currentLimit = { ...limiteGeneracion };
    const now = Date.now();
    
    // Si ha pasado más de una semana, resetear el contador
    if (now - currentLimit.lastReset > A_WEEK) {
      currentLimit = { count: 0, lastReset: now };
    }
    
    if (currentLimit.count >= maxLimiteIA) {
      // Límite alcanzado, fallar silenciosamente sin decir nada
      return; 
    }
    
    // Incrementar el contador
    currentLimit.count += 1;
    setLimiteGeneracion(currentLimit);
    guardarContenidoFase(1, 'limite_generacion_ideas', currentLimit).catch(e => console.error(e));

    setGenerandoIA(true);
    try {
      const contextoData = {
        area: area,
        frase_problema: observaciones.map(obs => generarFraseProblema(obs)).join(' | '),
        solucionActual: fricciones.map(f => f?.solucionActual || '').filter(Boolean).join(' | '),
        friccion: fricciones.map(f => f?.friccion || '').filter(Boolean).join(' | '),
        solucionIdeal: fricciones.map(f => f?.solucionIdeal || '').filter(Boolean).join(' | ')
      };
      const nuevasIdeas = await generarIdeasDeepSeek(contextoData);
      
      // Tomamos las soluciones ideales reales del usuario y le sumamos las de la IA
      const solucionesIdeales = fricciones.map(f => f?.solucionIdeal).filter(Boolean);
      const nuevasIdeasUnicas = nuevasIdeas.filter(idea => !solucionesIdeales.includes(idea));
      const updatedIdeas = [...solucionesIdeales, ...nuevasIdeasUnicas];
      
      setIdeasIA(updatedIdeas);
      await guardarContenidoFase(1, 'ideas_generadas', updatedIdeas);
      
      // Limpiar ideasSeleccionadas que ya no existen en la nueva lista
      const nuevasSeleccionadas = ideasSeleccionadas.filter(idea => updatedIdeas.includes(idea));
      setIdeasSeleccionadas(nuevasSeleccionadas);
      await guardarContenidoFase(1, 'ideas_seleccionadas', nuevasSeleccionadas);
    } catch (e) {
      console.error(e);
    }
    setGenerandoIA(false);
  };

  const solicitarNombresIA = async (ganadora) => {
    try {
      const nombres = await generarNombresDeepSeek(ganadora);
      setNombresSugeridos(nombres);
    } catch (e) {
      console.error(e);
    }
  };

  const actualizarIdeasSeleccionadas = async (nuevasIdeas) => {
    setIdeasSeleccionadas(nuevasIdeas);
    try {
      await guardarContenidoFase(1, 'ideas_seleccionadas', nuevasIdeas);
    } catch (e) {
      console.error("Error guardando ideas seleccionadas:", e);
    }
  };

  const actualizarIdeasIA = async (nuevasIdeas) => {
    setIdeasIA(nuevasIdeas);
    try {
      await guardarContenidoFase(1, 'ideas_generadas', nuevasIdeas);
    } catch (e) {
      console.error("Error guardando ideas_generadas:", e);
    }
  };

  const actualizarEvaluaciones = async (nuevasEvaluaciones) => {
    setEvaluaciones(nuevasEvaluaciones);
    try {
      await guardarContenidoFase(1, 'evaluacion_ideas', nuevasEvaluaciones);
    } catch (e) {
      console.error("Error guardando evaluaciones:", e);
    }
  };

  const guardarIdeaGanadoraParcial = async (idea) => {
    setIdeaGanadora(idea);
    try {
      await guardarContenidoFase(1, 'idea_ganadora', { 
        idea: idea, 
        nombre_elegido: nombreElegido, 
        pitch: pitchGenerado 
      });
    } catch (e) {
      console.error("Error guardando idea ganadora:", e);
    }
  };

  const solicitarPitchIA = async (nombre) => {
    setGenerandoPitch(true);
    try {
      // Actualizar el título del proyecto inmediatamente
      const proyecto_id = localStorage.getItem('temp_proyecto_id');
      if (proyecto_id) {
        await actualizarTituloProyecto(nombre, proyecto_id).catch(err => console.error("Error guardando titulo:", err));
      }

      const contextoData = {
        protagonista: observaciones.map(o => o?.protagonista).filter(Boolean).join(' | '),
        contexto: observaciones.map(o => o?.contexto).filter(Boolean).join(' | '),
        dolor: observaciones.map(o => o?.dolor).filter(Boolean).join(' | '),
        tarea: observaciones.map(o => o?.tarea).filter(Boolean).join(' | '),
        friccion: fricciones.map(f => f?.friccion).filter(Boolean).join(' | '),
        ideaGanadora: ideaGanadora,
        nombreElegido: nombre
      };
      const pitch = await generarPitchDeepSeek(contextoData);
      setPitchGenerado(pitch);
      
      // Guardar inmediatamente la idea ganadora, el nombre y el pitch
      await guardarContenidoFase(1, 'idea_ganadora', { 
        idea: ideaGanadora, 
        nombre_elegido: nombre, 
        pitch: pitch 
      });
    } catch (e) {
      console.error("Error en solicitarPitchIA:", e);
    }
    setGenerandoPitch(false);
  };

  const guardarYFinalizar = async () => {
    try {
      await guardarContenidoFase(1, 'ideas_seleccionadas', ideasSeleccionadas);
      await guardarContenidoFase(1, 'idea_ganadora', { 
        idea: ideaGanadora, 
        nombre_elegido: nombreElegido, 
        pitch: pitchGenerado 
      });

      setGenerandoResumen(true);
      const contextoResumen = {
        dolor: observaciones.map(o => o?.dolor).filter(Boolean).join(' | '),
        protagonista: observaciones.map(o => o?.protagonista).filter(Boolean).join(' | '),
        ideaGanadora: ideaGanadora
      };
      const resumen = await generarResumenFase1DeepSeek(contextoResumen);
      await guardarContenidoFase(1, 'resumen_fase1', resumen);
      setResumenGuardado(resumen);
      setGenerandoResumen(false);
    } catch (e) {
      console.error("Error al guardar final:", e);
      setGenerandoResumen(false);
    }
  };

  const currentDialog = () => {
    if (!mentorData) return "";
    const { dialogos } = mentorData;
    switch(step) {
      case 1: return dialogos.paso1_area;
      case 2: return dialogos.recurso_observacion;
      case 3: return dialogos.paso2_observacion;
      case 4: return dialogos.recurso_fricciones;
      case 5: return dialogos.paso3_fricciones;
      case 6: return dialogos.recurso_ideacion;
      case 7: return dialogos.paso4_ideacion;
      case 8: return dialogos.recurso_evaluacion;
      case 9: return dialogos.paso5_batalla;
      case 10: return dialogos.paso6_ganador;
      default: return "";
    }
  };

  return {
    step,
    mentorData,
    loading,
    area, setArea,
    observaciones, setObservaciones,
    fricciones, setFricciones,
    ideasIA, setIdeasIA,
    ideasSeleccionadas, setIdeasSeleccionadas,
    generandoIA,
    evaluaciones, setEvaluaciones,
    ideaGanadora, setIdeaGanadora,
    nombresSugeridos, setNombresSugeridos,
    nombreElegido, setNombreElegido,
    pitchGenerado, setPitchGenerado,
    generandoPitch,
    resumenGuardado,
    generandoResumen,
    handleSetStep,
    handleSiguiente,
    handleAnterior,
    solicitarIdeasIA,
    solicitarNombresIA,
    solicitarPitchIA,
    actualizarIdeasSeleccionadas,
    actualizarIdeasIA,
    actualizarEvaluaciones,
    autoGuardar,
    guardarYFinalizar,
    currentDialog,
    generarFraseProblema,
    guardarIdeaGanadoraParcial
  };
};
