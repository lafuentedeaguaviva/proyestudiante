import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';

export const useFase11Controller = () => {
  const navigate = useNavigate();
  const [errorStr, setErrorStr] = useState(null);

  // Todo el estado se guardará en `documento_final`
  const baseController = useFaseController({
    faseId: 11,
    totalPasos: 11,
    clavesDeGuardado: ['documento_final'],
    estructuraJSON: true
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior } = baseController;

  const handleFinalizar = async () => {
    try {
      await baseController.updateData({});
      await FaseModel.actualizarProgreso(12, 1);
      navigate('/fase/12/intro');
    } catch (err) {
      console.error(err);
      setErrorStr("Error al finalizar Fase 11.");
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
