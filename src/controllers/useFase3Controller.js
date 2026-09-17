import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';

export const useFase3Controller = () => {
  const navigate = useNavigate();
  const [ayudanteText, setAyudanteText] = useState('Iniciando Fase 3...');

  const claves = ['publicoEdad', 'publicoGenero', 'publicoUbicacion', 'publicoEducacion', 'publicoSituacion', 'publicoHabitos', 'encuestasFase2'];

  const baseController = useFaseController({
    faseId: 3,
    totalPasos: 2,
    clavesDeGuardado: ['publico_objetivo'],
    estructuraJSON: true // Guarda todo dentro de 'publico_objetivo'
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior } = baseController;

  useEffect(() => {
    // Si ya cargó y no tenemos encuestas, intentamos traerlas de Fase 2
    const fetchEncuestas = async () => {
      if (!cargando && (!data.encuestasFase2 || data.encuestasFase2.length === 0)) {
        try {
          const f2 = await FaseModel.obtenerDatosFase(2);
          let valIdea = f2?.validacion_idea;
          if (typeof valIdea === 'string') {
            try { valIdea = JSON.parse(valIdea); } catch(e){}
          }
          const encuestas = valIdea?.encuestas || f2?.encuestas;
          console.log("Fase 2 obtenida:", f2, "Encuestas extraídas:", encuestas);
          if (encuestas && encuestas.length > 0) {
            updateData({ encuestasFase2: encuestas });
          }
        } catch (e) {
          console.error("No se pudieron cargar encuestas de Fase 2", e);
        }
      }
    };
    fetchEncuestas();
  }, [cargando]); // Solo depende de cargando, para no hacer loops infinitos

  const handleFinalizar = async () => {
    try {
      // Guardado forzoso de todos los campos bajo publico_objetivo
      await FaseModel.guardarDatos(3, 'publico_objetivo', data);
      await FaseModel.actualizarProgreso(4, 1);
      navigate('/fase/4/intro');
    } catch (err) {
      console.error(err);
      alert("Error al finalizar Fase 3.");
    }
  };

  return {
    ...baseController,
    ayudanteText, setAyudanteText,
    handleFinalizar,
    // Extraer propiedades para facilitar su uso en los subcomponentes
    globalData: data,
    setGlobalData: updateData
  };
};
