import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';
import { NexusContext } from '../context/NexusContext';

export const useFase2ValidacionController = () => {
  const navigate = useNavigate();
  const { increaseNexus } = useContext(NexusContext) || { increaseNexus: () => {} };
  
  const [showSplash, setShowSplash] = useState(true);
  const [ayudanteText, setAyudanteText] = useState('');

  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Inicializamos el controlador base
  // validacion_idea es un JSON que contendrá { encuestas: [...], resumen_ia: {...} }
  const baseController = useFaseController({
    faseId: 2,
    totalPasos: 7,
    clavesDeGuardado: ['validacion_idea'],
    estructuraJSON: true 
  });

  const { data, updateData, step, irAPaso, cargando, guardando, forceSave, setPendingSave } = baseController;

  const encuestasData = data.encuestas || [];
  const resumenIAData = data.resumen_ia || null;
  const metricasClaveData = data.metricas_clave || null;

  const setEncuestasData = async (nuevasEncuestas) => {
    updateData({ encuestas: nuevasEncuestas });
    setPendingSave(true);
  };

  const setResumenIAData = async (nuevoResumen, metricas = null) => {
    const payload = { resumen_ia: nuevoResumen };
    if (metricas) payload.metricas_clave = metricas;
    updateData(payload);
    // Activar guardado automático para que se guarde cuando React termine de actualizar el estado 'data'
    setPendingSave(true);
  };

  const handleFinalizar = async () => {
    try {
      // Fuerza el guardado si hay algo pendiente
      await baseController.updateData({});
      
      // Marca el paso inicial de la fase 3
      await FaseModel.actualizarProgreso(3, 1);
      
      setShowCompletionModal(true);
    } catch (err) {
      console.error(err);
      alert("Error al guardar fase.");
    }
  };

  return {
    ...baseController,
    showSplash, setShowSplash,
    ayudanteText, setAyudanteText,
    encuestasData, setEncuestasData,
    resumenIAData, setResumenIAData,
    metricasClaveData,
    handleFinalizar,
    showCompletionModal, setShowCompletionModal
  };
};
