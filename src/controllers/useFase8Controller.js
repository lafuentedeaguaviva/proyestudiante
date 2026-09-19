import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';
import { generarPasosPersonalizadoIA, evaluarClasificacionProcesosIA } from '../services/api';

export const useFase8Controller = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  
  // Game and UI state
  const [selectedTool, setSelectedTool] = useState('muro');
  const [draggedItem, setDraggedItem] = useState(null);
  const [showIAPrompt, setShowIAPrompt] = useState(false);
  const [promptIA, setPromptIA] = useState("");
  const [cargandoIA, setCargandoIA] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [resultadoVerificacion, setResultadoVerificacion] = useState({});
  const [mostrarDiagrama, setMostrarDiagrama] = useState(false);

  // Todo el estado se guardará en `operacion`
  const baseController = useFaseController({
    faseId: 8,
    totalPasos: 7,
    clavesDeGuardado: ['operacion'],
    estructuraJSON: true,
    defaultData: {
      pasosProduccion: [],
      cuadriculaLayout: Array(36).fill(null),
      diagramaVerificado: false
    }
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior } = baseController;



  const handleGenerarIA = async (e) => {
    e.preventDefault();
    if(!promptIA.trim()) return;
    
    setCargandoIA(true);
    try {
      const pasosGenerados = await generarPasosPersonalizadoIA(promptIA);
      if (pasosGenerados && Array.isArray(pasosGenerados)) {
        updateData({ pasosProduccion: pasosGenerados });
        setShowIAPrompt(false);
        setPromptIA("");
      }
    } catch(err) {
      console.error(err);
      alert("Error al generar los pasos con IA. Intenta de nuevo.");
    } finally {
      setCargandoIA(false);
    }
  };

  const handleVerificarDiagrama = async () => {
    if (!data.pasosProduccion || data.pasosProduccion.length === 0) {
      alert("No hay pasos para verificar.");
      return;
    }

    const unassigned = data.pasosProduccion.filter(p => !p.categoria);
    if (unassigned.length > 0) {
      alert("Aún tienes pasos sin asignar a una categoría.");
      return;
    }

    setVerificando(true);
    try {
      const resultado = await evaluarClasificacionProcesosIA(data.pasosProduccion);
      if (resultado && typeof resultado === 'object') {
        setResultadoVerificacion(resultado);
        if (resultado.score === 100) {
          updateData({ diagramaVerificado: true });
        } else {
          updateData({ diagramaVerificado: false });
        }
      }
    } catch(err) {
      console.error(err);
      alert("Error al verificar con la IA.");
    } finally {
      setVerificando(false);
    }
  };

  return {
    ...baseController,
    showSplash, setShowSplash,
    selectedTool, setSelectedTool,
    draggedItem, setDraggedItem,
    showIAPrompt, setShowIAPrompt,
    promptIA, setPromptIA,
    cargandoIA, setCargandoIA,
    verificando, setVerificando,
    resultadoVerificacion, setResultadoVerificacion,
    mostrarDiagrama, setMostrarDiagrama,
    globalData: data,
    setGlobalData: updateData,
    handleGenerarIA,
    handleVerificarDiagrama
  };
};
