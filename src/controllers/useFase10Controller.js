import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';

export const useFase10Controller = () => {
  const navigate = useNavigate();
  const [errorStr, setErrorStr] = useState(null);
  
  const [toolboxCategory, setToolboxCategory] = useState('activoFijo');
  const [toolboxSubcategory, setToolboxSubcategory] = useState(null);
  const [rolesOrganigrama, setRolesOrganigrama] = useState([]);
  const [fase8Cargada, setFase8Cargada] = useState(true);
  const [presupuestoFase6, setPresupuestoFase6] = useState([]);

  // Todo el estado se guardará en `financiero`
  const baseController = useFaseController({
    faseId: 10,
    totalPasos: 18,
    clavesDeGuardado: ['financiero'],
    estructuraJSON: true
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior } = baseController;

  useEffect(() => {
    // Cargar dependencias de otras fases
    const fetchDependencies = async () => {
      if (!cargando) {
        try {
          // Fase 9: Organigrama (roles para sueldos)
          const f9 = await FaseModel.obtenerDatosFase(9);
          if (f9 && f9.roles && f9.roles.length > 0) {
            const cargos = f9.roles.map(r => `Sueldo: ${r.nombreArea || r.cargo}`);
            setRolesOrganigrama(cargos);
          }
          
          // Fase 6: Distribución (para verificar si cargó bien y traer presupuesto)
          const f6 = await FaseModel.obtenerDatosFase(6);
          if (!f6) {
            setFase8Cargada(false); // Omitimos si no hay fase previa importante
          } else if (f6.distribucion && f6.distribucion.presupuesto) {
            setPresupuestoFase6(f6.distribucion.presupuesto);
          }
        } catch (e) {
          console.error("No se pudieron cargar dependencias de Fase 9 o 6", e);
        }
      }
    };
    fetchDependencies();
  }, [cargando]);

  const handleFinalizar = async () => {
    try {
      await baseController.updateData({});
      await FaseModel.actualizarProgreso(11, 1);
      alert("¡Plan Financiero (Fase 10) Completado!");
      navigate('/fase/11/intro');
    } catch (err) {
      console.error(err);
      setErrorStr("Error al finalizar Fase 10.");
    }
  };

  return {
    ...baseController,
    errorStr, setErrorStr,
    toolboxCategory, setToolboxCategory,
    toolboxSubcategory, setToolboxSubcategory,
    rolesOrganigrama, fase8Cargada,
    presupuestoFase6,
    handleFinalizar,
    globalData: data,
    setGlobalData: updateData
  };
};
