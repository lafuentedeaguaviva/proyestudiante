import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';

export const useFase5Controller = () => {
  const navigate = useNavigate();
  const [errorStr, setErrorStr] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Todo el estado se guardará en `estrategia_marketing`
  const baseController = useFaseController({
    faseId: 5,
    totalPasos: 9, // Se eliminaron 2 pasos de Soluciones Actuales pero se agregó 1 de Resumen IA
    clavesDeGuardado: ['estrategia_marketing'],
    estructuraJSON: true
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior } = baseController;

  const handleFinalizar = async () => {
    try {
      await FaseModel.guardarDatos(5, 'estrategia_marketing', data);
      await FaseModel.actualizarProgreso(6, 1);
      setShowCompletionModal(true);
    } catch (err) {
      console.error(err);
      setErrorStr("Error al finalizar Fase 5.");
    }
  };

  return {
    ...baseController,
    errorStr, setErrorStr,
    showCompletionModal, setShowCompletionModal,
    handleFinalizar,
    globalData: data,
    setGlobalData: updateData
  };
};
