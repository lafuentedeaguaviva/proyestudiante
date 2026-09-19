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

  const [demandaPotencialFase4, setDemandaPotencialFase4] = useState(50);

  useEffect(() => {
    // Cargar dependencias de otras fases
    const fetchDependencies = async () => {
      if (!cargando) {
        try {
          const parseNumber = (val) => {
            if (!val) return 0;
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
              const numMatch = val.match(/\d+(\.\d+)?/);
              if (numMatch) return parseFloat(numMatch[0]);
            }
            return 0;
          };

          const buscarEnObjeto = (target) => {
            if (!target || typeof target !== 'object') return null;
            
            const m = parseNumber(target.mercadoTotal || target.mercado_total);
            const p1 = parseNumber(target.porcentajeProblema || target.porcentaje_problema);
            const p2 = parseNumber(target.porcentajeCompra || target.porcentaje_compra || target.porcentajeCompraria);
            if (m > 0 && p1 > 0 && p2 > 0) {
              return Math.round(m * (p1 / 100) * (p2 / 100));
            }

            const directKeys = ['demandaPotencial', 'clientesPotenciales', 'demanda_potencial', 'calculoMensual', 'cobertura', 'tamano_mercado', 'mercadoEstimado'];
            for (const k of directKeys) {
              const val = parseNumber(target[k]);
              if (val > 0) return Math.round(val);
            }

            for (const key of Object.keys(target)) {
              if (typeof target[key] === 'object' && target[key] !== null) {
                const sub = buscarEnObjeto(target[key]);
                if (sub > 0) return sub;
              }
            }
            return null;
          };

          let dPot = 0;

          // 1. Buscar en todas las fases obtenidas del proyecto
          try {
            const todos = await obtenerTodoElContenidoProyecto();
            dPot = buscarEnObjeto(todos);
          } catch (e) {}

          // 2. Buscar en Fase 4 directa por modelo si no se halló
          if (!dPot) {
            try {
              const f4 = await FaseModel.obtenerDatosFase(4);
              dPot = buscarEnObjeto(f4);
            } catch (e) {}
          }

          // 3. Buscar en LocalStorage datosFases
          if (!dPot) {
            try {
              const dbDataStr = localStorage.getItem('datosFases');
              if (dbDataStr) {
                const dbFases = JSON.parse(dbDataStr);
                dPot = buscarEnObjeto(dbFases);
              }
            } catch (e) {}
          }

          const finalPot = dPot > 0 ? dPot : 50;
          setDemandaPotencialFase4(finalPot);

          // Si produccionMensual es 100 (default genérico), 1, 0 o vacío, asignar el valor de la demanda estimada (ej. 50)
          if (!data.produccionMensual || data.produccionMensual === 100 || data.produccionMensual === 1 || data.produccionMensual === 0) {
            updateData({ produccionMensual: finalPot });
          }

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
          console.error("No se pudieron cargar dependencias de fases previas", e);
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
    demandaPotencialFase4,
    handleFinalizar,
    globalData: data,
    setGlobalData: updateData
  };
};
