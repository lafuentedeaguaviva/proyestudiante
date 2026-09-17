import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';

export const useFase6Controller = () => {
  const navigate = useNavigate();
  const [errorStr, setErrorStr] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Todo el estado se guardará en `distribucion`
  const baseController = useFaseController({
    faseId: 6,
    totalPasos: 10,
    clavesDeGuardado: ['distribucion'],
    estructuraJSON: true
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior } = baseController;

  const [isFinalizando, setIsFinalizando] = useState(false);

  const handleFinalizar = async () => {
    setIsFinalizando(true);
    try {
      await FaseModel.guardarDatos(6, 'distribucion', data);
      await FaseModel.actualizarProgreso(7, 1);
      setShowCompletionModal(true);
    } catch (err) {
      console.error(err);
      setErrorStr("Error al finalizar Fase 6.");
      alert("Error al guardar. Si subiste una foto muy pesada, elimínala y súbela de nuevo (ahora se comprimirá sola).");
    } finally {
      setIsFinalizando(false);
    }
  };

  return {
    ...baseController,
    errorStr, setErrorStr,
    showCompletionModal, setShowCompletionModal,
    handleFinalizar,
    isFinalizando,
    globalData: data,
    setGlobalData: updateData
  };
};
