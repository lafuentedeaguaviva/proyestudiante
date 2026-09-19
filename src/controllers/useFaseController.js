import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaseModel } from '../models/FaseModel';

/**
 * Controlador Base Universal para las fases.
 * Maneja la lógica de estado, carga, autoguardado y navegación, manteniendo la UI completamente tonta.
 */
export const useFaseController = ({
  faseId,
  totalPasos,
  clavesDeGuardado = [], // Array de strings, p. ej. ['financiero'] o campos individuales ['opcion_diagnostico', 'diag_p1']
  estructuraJSON = true, // Si es true, guarda todo 'data' en clavesDeGuardado[0]. Si es false, guarda cada key/value.
  defaultData = {}
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const pasoURL = parseInt(searchParams.get('paso')) || 1;
  const [step, setStep] = useState(pasoURL);

  useEffect(() => {
    const p = parseInt(searchParams.get('paso'));
    if (p && p !== step) {
      setStep(p);
    }
  }, [searchParams, step]);
  
  const [data, setData] = useState(defaultData);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  const saveTimerRef = useRef(null);

  // 1. Carga Inicial
  useEffect(() => {
    const loadData = async () => {
      setCargando(true);
      try {
        const guardado = await FaseModel.obtenerDatosFase(faseId);
        
        let loadedData = {};
        if (estructuraJSON && clavesDeGuardado.length > 0) {
          const mainKey = clavesDeGuardado[0];
          if (guardado && guardado[mainKey]) {
            if (typeof guardado[mainKey] === 'string') {
              try {
                loadedData = JSON.parse(guardado[mainKey]);
              } catch (e) {
                console.warn(`[useFaseController] No se pudo parsear JSON para ${mainKey}:`, e);
                loadedData = {};
              }
            } else if (typeof guardado[mainKey] === 'object' && guardado[mainKey] !== null) {
              loadedData = { ...guardado[mainKey] };
            }
          }
        } else {
          // Si no es JSON anidado, se asume que las claves se guardan planas
          loadedData = guardado || {};
        }

        // Recuperar el paso guardado
        const savedStep = parseInt(loadedData.paso_actual || guardado.paso_actual, 10);
        if (!isNaN(savedStep) && savedStep > 0 && !searchParams.get('paso')) {
          setStep(Math.min(savedStep, totalPasos));
          setSearchParams({ paso: Math.min(savedStep, totalPasos) });
        } else {
          // Registrar paso inicial
          FaseModel.actualizarProgreso(faseId, pasoURL).catch(console.error);
        }

        setData(prev => ({ ...prev, ...loadedData }));
      } catch (error) {
        console.error(`Error cargando Fase ${faseId}:`, error);
      } finally {
        setCargando(false);
      }
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faseId]);

  // 2. Sistema de Auto-Guardado (Debounce)
  useEffect(() => {
    if (!pendingSave) return;
    
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      setGuardando(true);
      try {
        if (estructuraJSON && clavesDeGuardado.length > 0) {
          await FaseModel.guardarDatos(faseId, clavesDeGuardado[0], data);
        } else {
          // Guardar cada campo independientemente
          for (const key of clavesDeGuardado) {
            if (data[key] !== undefined) {
              await FaseModel.guardarDatos(faseId, key, data[key]);
            }
          }
        }
      } catch (error) {
        console.error("Error en autoguardado:", error);
      } finally {
        setGuardando(false);
        setPendingSave(false);
      }
    }, 1500);

    return () => clearTimeout(saveTimerRef.current);
  }, [data, pendingSave, faseId, estructuraJSON, clavesDeGuardado]);

  // 3. Actualización de Datos (UI => Controller)
  const updateData = useCallback((newData) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const forceSave = useCallback(async () => {
    setGuardando(true);
    try {
      if (estructuraJSON && clavesDeGuardado.length > 0) {
        await FaseModel.guardarDatos(faseId, clavesDeGuardado[0], data);
      } else {
        for (const key of clavesDeGuardado) {
          if (data[key] !== undefined) {
            await FaseModel.guardarDatos(faseId, key, data[key]);
          }
        }
      }
    } catch (error) {
      console.error("Error en autoguardado:", error);
    } finally {
      setGuardando(false);
      setPendingSave(false);
    }
  }, [data, faseId, estructuraJSON, clavesDeGuardado]);

  // 4. Navegación
  const irAPaso = useCallback(async (nPaso) => {
    // Si intenta pasar más allá del último paso, significa que completa la fase
    if (nPaso > totalPasos) {
      try {
        // Forzar guardado sincrónico de todos los campos antes de salir
        if (estructuraJSON && clavesDeGuardado.length > 0) {
          await FaseModel.guardarDatos(faseId, clavesDeGuardado[0], data);
        } else {
          for (const key of clavesDeGuardado) {
            if (data[key] !== undefined) {
              await FaseModel.guardarDatos(faseId, key, data[key]);
            }
          }
        }
        
        // Desbloquear siguiente fase
        await FaseModel.actualizarProgreso(faseId + 1, 1);
        
        // Navegar a la carátula de la siguiente fase
        navigate(`/fase/${faseId + 1}/intro`);
      } catch (err) {
        console.error("Error al avanzar fase:", err);
        alert("Error crítico al avanzar: " + (err.message || err.toString()));
      }
      return;
    }
    
    setStep(nPaso);
    setSearchParams({ paso: nPaso });
    // Guardar paso actual
    FaseModel.actualizarProgreso(faseId, nPaso).catch(console.error);
  }, [faseId, totalPasos, pendingSave, estructuraJSON, clavesDeGuardado, data, navigate, setSearchParams]);

  const siguientePaso = () => irAPaso(step + 1);
  const pasoAnterior = () => {
    if (step > 1) irAPaso(step - 1);
  };

  return {
    data,
    step,
    cargando,
    guardando,
    updateData,
    irAPaso,
    siguientePaso,
    pasoAnterior,
    setPendingSave,
    forceSave
  };
};
