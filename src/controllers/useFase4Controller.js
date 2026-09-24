import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';
import { NexusContext } from '../context/NexusContext';

export const useFase4Controller = () => {
  const navigate = useNavigate();
  const { increaseNexus } = useContext(NexusContext) || { increaseNexus: () => {} };
  
  const [showSplash, setShowSplash] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ayudanteText, setAyudanteText] = useState('Iniciando Fase 4...');

  // Todo el estado se guardará en `diseno_producto`
  const baseController = useFaseController({
    faseId: 4,
    totalPasos: 7,
    clavesDeGuardado: ['diseno_producto'],
    estructuraJSON: true
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior } = baseController;

  const handleFinalizar = async () => {
    try {
      await FaseModel.guardarDatos(4, 'diseno_producto', data);
      await FaseModel.actualizarProgreso(5, 1);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error al finalizar Fase 4.");
    }
  };

  return {
    ...baseController,
    showSplash, setShowSplash,
    showSuccess, setShowSuccess,
    navigate,
    ayudanteText, setAyudanteText,
    handleFinalizar,
    globalData: data,
    setGlobalData: updateData
  };
};
