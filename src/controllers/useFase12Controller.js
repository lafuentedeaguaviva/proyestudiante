import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';

export const useFase12Controller = () => {
  const navigate = useNavigate();
  const [errorStr, setErrorStr] = useState(null);

  // Todo el estado se guardará en `proyecto_vida`
  const baseController = useFaseController({
    faseId: 12,
    totalPasos: 5,
    clavesDeGuardado: ['proyecto_vida'],
    estructuraJSON: true
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior } = baseController;

  const handleFinalizar = async () => {
    try {
      await baseController.updateData({});
      await FaseModel.actualizarProgreso(13, 1);
      navigate('/fase/13'); // En ruta es fase 13
    } catch (err) {
      console.error(err);
      setErrorStr("Error al finalizar Fase 12.");
    }
  };

  return {
    ...baseController,
    errorStr, setErrorStr,
    handleFinalizar,
    globalData: data,
    setGlobalData: updateData
  };
};
