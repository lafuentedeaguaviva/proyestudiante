import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';

export const useFase9Controller = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [showExpandModal, setShowExpandModal] = useState(false);
  const [modoVista, setModoVista] = useState('lista'); // 'lista' o 'arbol'

  const claves = ['organigrama', 'roles'];

  const baseController = useFaseController({
    faseId: 9,
    totalPasos: 2,
    clavesDeGuardado: claves,
    estructuraJSON: true // Guarda en 'estructura'
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior } = baseController;

  // Defaults needed by the UI
  const organigrama = data.organigrama || [{ id: 'ceo', nombre: 'Gerente General', tipo: 'lider', parentId: null }];
  const roles = data.roles || [{ 
    areaId: 'ceo', 
    nombreArea: 'Gerente General', 
    responsabilidades: ['Planificación Estratégica', 'Toma de Decisiones', 'Control General'] 
  }];

  const handleFinalizar = async () => {
    try {
      if (data.proyecto_id) {
        await Promise.race([
          FaseModel.actualizarProgreso(data.proyecto_id, 9, 'completado'),
          new Promise(r => setTimeout(r, 2000))
        ]);
      }
      navigate('/fase/10/intro');
    } catch (err) {
      console.error(err);
      navigate('/fase/10/intro');
    }
  };

  return {
    ...baseController,
    showSplash, setShowSplash,
    showExpandModal, setShowExpandModal,
    modoVista, setModoVista,
    handleFinalizar,
    organigrama, roles,
    data, updateData
  };
};
