import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProyectoModel } from '../models/ProyectoModel';
import { FaseModel } from '../models/FaseModel';

/**
 * Controlador de la Fase 1 (Onboarding Cinematográfico).
 * Separa la lógica de base de datos de la UI.
 */
export const useFase1Controller = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); 
  const [dialogIndex, setDialogIndex] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [caminoElegido, setCaminoElegido] = useState(null);
  const [archivoAbierto, setArchivoAbierto] = useState(false);

  const handleAceptarCaso = async (camino) => {
    setCaminoElegido(camino);
    setGuardando(true);
    try {
      // 1. Crear el proyecto en la base de datos (vía Model)
      const entornoId = localStorage.getItem('temp_entorno_seleccionado') || '11111111-1111-1111-1111-111111111111';
      const nuevoProyecto = await ProyectoModel.createProyecto(entornoId, camino);
      
      // 2. Guardar IDs en localStorage para UI rápida
      localStorage.setItem('temp_proyecto_id', nuevoProyecto.id);
      localStorage.setItem('expediente_tipo', camino);

      // 3. Guardar la elección inicial de onboarding (vía Model)
      await FaseModel.guardarDatos(1, 'onboarding', {
        camino_seleccionado: camino,
        universo: 'kronos'
      });
      
      setGuardando(false);
      navigate('/fase/2/intro');
    } catch (error) {
      console.error(error);
      alert("Hubo un error de conexión con la Agencia. Intenta de nuevo.");
      setGuardando(false);
    }
  };

  return {
    step,
    setStep,
    dialogIndex,
    setDialogIndex,
    guardando,
    caminoElegido,
    archivoAbierto,
    setArchivoAbierto,
    handleAceptarCaso
  };
};
