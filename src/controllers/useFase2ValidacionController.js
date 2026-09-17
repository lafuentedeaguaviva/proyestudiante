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

  const { data, updateData, step, irAPaso, cargando, guardando } = baseController;

  const encuestasData = data.encuestas || [];
  const resumenIAData = data.resumen_ia || null;

  const setEncuestasData = async (nuevasEncuestas) => {
    updateData({ encuestas: nuevasEncuestas });
  };

  const setResumenIAData = async (nuevoResumen) => {
    updateData({ resumen_ia: nuevoResumen });
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
    handleFinalizar,
    showCompletionModal, setShowCompletionModal
  };
};
