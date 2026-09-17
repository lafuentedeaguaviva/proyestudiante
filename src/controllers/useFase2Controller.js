import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { obtenerRetoValidacion } from '../services/api';
import { ProyectoModel } from '../models/ProyectoModel';
import { NexusContext } from '../context/NexusContext';

export const useFase2Controller = () => {
  const navigate = useNavigate();
  const { increaseNexus } = useContext(NexusContext) || { increaseNexus: () => {} };
  
  const [showSplash, setShowSplash] = useState(true);
  const [errorStr, setErrorStr] = useState(null);
  
  const [retoDB, setRetoDB] = useState(null);
  const [mostrarReto, setMostrarReto] = useState(false);
  const [mostrarVideoPista, setMostrarVideoPista] = useState(false);
  const [sugerenciasIA, setSugerenciasIA] = useState([]);
  const [cargandoIA, setCargandoIA] = useState(false);

  // Inicializamos el controlador base
  const claves = ['area', 'otraArea', 'observaciones', 'ideas', 'matriz', 'tituloOficial'];
  
  const baseController = useFaseController({
    faseId: 2,
    totalPasos: 6,
    clavesDeGuardado: claves,
    estructuraJSON: false 
  });

  const { data, updateData, step, setStep, guardando } = baseController;

  // Defaults
  const area = data.area || '';
  const otraArea = data.otraArea || '';
  const observaciones = data.observaciones || [{ 
    quien: '', cuando: '', dolor: '', job: '', solucionActual: '', friccion: '', expectativa: '' 
  }];
  const ideas = data.ideas || [];
  const matriz = data.matriz || [
    { id: 0, puntajes: { costo: 0, tiempo: 0, gusto: 0, experiencia: 0, apoyo: 0, capacidad: 0 } },
    { id: 1, puntajes: { costo: 0, tiempo: 0, gusto: 0, experiencia: 0, apoyo: 0, capacidad: 0 } },
    { id: 2, puntajes: { costo: 0, tiempo: 0, gusto: 0, experiencia: 0, apoyo: 0, capacidad: 0 } }
  ];
  const tituloOficial = data.tituloOficial || '';

  useEffect(() => {
    const fetchReto = async () => {
      const data = await obtenerRetoValidacion(2);
      if (data) setRetoDB(data);
    };
    fetchReto();
  }, []);

  const handleSiguientePasoCustom = () => {
    if (step === 1 && !area) {
      increaseNexus(15, "Decisión evasiva. NEXUS gana influencia.");
      return;
    }
    if (step === 2 && observaciones.some(obs => obs.quien.length < 5 || obs.cuando.length < 5 || obs.dolor.length < 10 || obs.job.length < 10)) {
      increaseNexus(20, "Observación superficial. Identifica correctamente quién y cuándo.");
    }
    if (step === 3 && observaciones.some(obs => obs.solucionActual.length < 10 || obs.friccion.length < 10)) {
      increaseNexus(20, "Análisis de fricción débil. NEXUS se alimenta de tu pereza.");
    }
    if (step === 4 && ideas.length < 3) {
      increaseNexus(25, "Falta de creatividad detectada. Debes proponer 3 ideas. NEXUS avanza.");
      return; 
    }
    if (step === 4 && ideas.some(id => id.length < 5)) {
      increaseNexus(20, "Ideas muy cortas. Esfuérzate más.");
    }
    baseController.siguientePaso();
  };

  const handleMatrizChange = (ideaIndex, criterio, val) => {
    let num = parseInt(val);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > 5) num = 5;

    const newMatriz = [...matriz];
    newMatriz[ideaIndex].puntajes[criterio] = num;
    updateData({ matriz: newMatriz });
  };

  const calcularTotal = (ideaIndex) => {
    const p = matriz[ideaIndex].puntajes;
    return p.costo + p.tiempo + p.gusto + p.experiencia + p.apoyo + p.capacidad;
  };

  const ideaGanadoraIndex = () => {
    let maxScore = -1;
    let idx = 0;
    for (let i = 0; i < 3; i++) {
      const t = calcularTotal(i);
      if (t > maxScore) {
        maxScore = t;
        idx = i;
      }
    }
    return idx;
  };

  const handleFinalizar = async () => {
    if (!tituloOficial.trim() || tituloOficial.length < 5) {
      increaseNexus(10, "Tu título es irrelevante. NEXUS se fortalece.");
      setErrorStr("Debes darle un Título Oficial más descriptivo.");
      return;
    }
    setErrorStr(null);
    try {
      const areaFinal = area === 'Otra' ? otraArea : area;
      
      // Forzamos el guardado final
      await baseController.updateData({ area: areaFinal });
      await ProyectoModel.updateTitulo(localStorage.getItem('temp_proyecto_id'), tituloOficial);
      
      if (retoDB) {
        setMostrarReto(true);
      } else {
        alert("¡Fase 2 Completada! Pasando a la Fase 3.");
        navigate('/fase/3/intro');
      }
    } catch (err) {
      console.error(err);
      setErrorStr(err.message);
    }
  };

  const generarIdeasIA = () => {
    setCargandoIA(true);
    setSugerenciasIA([]);
    
    setTimeout(() => {
      const obs = observaciones[0]; 
      
      const p1 = obs.quien ? obs.quien.toLowerCase() : 'este sector';
      const p2 = obs.dolor ? obs.dolor.toLowerCase() : 'este problema';
      const p3 = obs.job ? obs.job.toLowerCase() : 'esta tarea';

      setSugerenciasIA([
        `Plataforma o App móvil especializada para ${p1} que automatice ${p3}.`,
        `Servicio externalizado (Outsourcing) para resolver ${p2} de forma rápida.`,
        `Sistema físico/hardware de bajo costo que elimina la necesidad de realizar ${p3} manualmente.`
      ]);
      setCargandoIA(false);
    }, 1500);
  };

  return {
    ...baseController,
    siguientePaso: handleSiguientePasoCustom,
    showSplash, setShowSplash,
    errorStr, setErrorStr,
    retoDB, mostrarReto, setMostrarReto,
    mostrarVideoPista, setMostrarVideoPista,
    sugerenciasIA, setSugerenciasIA,
    cargandoIA, generarIdeasIA,
    handleMatrizChange, calcularTotal, ideaGanadoraIndex, handleFinalizar,
    // Estado extraído para la vista
    area, otraArea, observaciones, ideas, matriz, tituloOficial, updateData
  };
};
